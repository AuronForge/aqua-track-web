import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChildren,
  input,
  output,
} from '@angular/core';
import { NgStyle, NgTemplateOutlet } from '@angular/common';

import { AqTableCellContext } from './table-cell-context.model';
import { AqTableCellDirective } from './table-cell.directive';
import { AqTableColumn, AqTableRow } from './table-column.model';
import { AqTableDensity } from './table-density.type';
import { AqTableSelectionMode } from './table-selection-mode.type';
import { AqTableSort } from './table-sort.model';
import { AqTableState } from './table-state.model';

type AqTableRowId = string | number;
type AqTableRowIdResolver<T extends AqTableRow> =
  | keyof T
  | ((row: T, index: number) => AqTableRowId);

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-table',
  standalone: true,
  imports: [NgStyle, NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-busy]': 'loading() || null',
  },
})
export class AqTableComponent<T extends AqTableRow = AqTableRow> {
  readonly rows = input.required<readonly T[]>();
  readonly columns = input.required<readonly AqTableColumn<T>[]>();
  readonly rowId = input<AqTableRowIdResolver<T> | null>(null);
  readonly caption = input<string>('');
  readonly captionHidden = input<boolean>(true);
  readonly ariaLabel = input<string>('');
  readonly loading = input<boolean>(false);
  readonly loadingLabel = input<string>('Carregando dados da tabela');
  readonly skeletonRows = input<number>(5);
  readonly emptyState = input<AqTableState>({
    title: 'Nenhum registro encontrado',
  });
  readonly errorState = input<AqTableState | null>(null);
  readonly sort = input<AqTableSort | null>(null);
  readonly selectable = input<boolean>(false);
  readonly selectionMode = input<AqTableSelectionMode>('multiple');
  readonly selectedRows = input<readonly T[]>([]);
  readonly rowClickable = input<boolean>(false);
  readonly rowAriaLabel = input<((row: T, index: number) => string) | null>(null);
  readonly density = input<AqTableDensity>('comfortable');
  readonly stickyHeader = input<boolean>(false);
  readonly showHeader = input<boolean>(true);

  readonly sortChange = output<AqTableSort | null>();
  readonly rowClick = output<T>();
  readonly selectionChange = output<readonly T[]>();
  readonly retry = output<void>();

  private readonly cellTemplates = contentChildren<AqTableCellDirective<T>>(AqTableCellDirective);

  protected readonly visibleColumns = computed(() =>
    this.columns().filter((column) => !column.hidden),
  );

  protected readonly renderedColumns = computed(() => [
    ...(this.selectable() ? ['__selection'] : []),
    ...this.visibleColumns().map((column) => column.key),
  ]);

  protected readonly templateByKey = computed(() => {
    const templates = new Map<string, TemplateRef<AqTableCellContext<T>>>();

    for (const cellTemplate of this.cellTemplates()) {
      templates.set(cellTemplate.key(), cellTemplate.templateRef);
    }

    return templates;
  });

  protected readonly selectedIds = computed(
    () => new Set(this.selectedRows().map((row, index) => this.resolveRowId(row, index))),
  );

  protected readonly selectableRows = computed(() => this.rows());

  protected readonly selectedVisibleRows = computed(() =>
    this.selectableRows().filter((row, index) => this.isSelected(row, index)),
  );

  protected readonly allVisibleSelected = computed(
    () =>
      this.selectableRows().length > 0 &&
      this.selectedVisibleRows().length === this.selectableRows().length,
  );

  protected readonly partiallySelected = computed(
    () => this.selectedVisibleRows().length > 0 && !this.allVisibleSelected(),
  );

  protected readonly isEmpty = computed(
    () => !this.loading() && !this.errorState() && this.rows().length === 0,
  );

  protected readonly skeletonIndexes = computed(() =>
    Array.from({ length: Math.max(this.skeletonRows(), 1) }, (_, index) => index),
  );

  protected readonly hostClass = computed(() =>
    [
      'table',
      `table--${this.density()}`,
      this.rowClickable() ? 'table--clickable' : '',
      this.stickyHeader() ? 'table--sticky-header' : '',
      this.isEmpty() ? 'table--empty' : '',
      this.loading() ? 'table--loading' : '',
      this.errorState() ? 'table--error' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected getColumnClass(column: AqTableColumn<T>): string {
    return [
      'table__cell',
      `table__cell--${column.align ?? 'start'}`,
      `table__cell--priority-${column.priority ?? 'primary'}`,
    ].join(' ');
  }

  protected getColumnStyle(column: AqTableColumn<T>): Record<string, string> {
    return {
      ...(column.width ? { width: column.width } : {}),
      ...(column.minWidth ? { 'min-width': column.minWidth } : {}),
    };
  }

  protected getCellTemplate(column: AqTableColumn<T>): TemplateRef<AqTableCellContext<T>> | null {
    return this.templateByKey().get(column.key) ?? null;
  }

  protected getCellContext(row: T, column: AqTableColumn<T>, index: number): AqTableCellContext<T> {
    return {
      $implicit: row,
      row,
      column,
      value: this.getCellValue(row, column),
      index,
    };
  }

  protected getCellValue(row: T, column: AqTableColumn<T>): unknown {
    if (column.value) return column.value(row);
    if (column.property) return row[column.property];
    return row[column.key];
  }

  protected getDisplayValue(row: T, column: AqTableColumn<T>): string {
    const value = this.getCellValue(row, column);

    if (value === null || value === undefined || value === '') return '—';
    return String(value);
  }

  protected getAriaSort(column: AqTableColumn<T>): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) return null;
    const activeSort = this.sort();

    if (activeSort?.key !== column.key) return 'none';
    return activeSort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected getSortIcon(column: AqTableColumn<T>): string {
    const activeSort = this.sort();

    if (activeSort?.key !== column.key) return 'unfold_more';
    return activeSort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  protected getSortLabel(column: AqTableColumn<T>): string {
    const activeSort = this.sort();

    if (activeSort?.key !== column.key) return `Ordenar por ${column.header}`;
    if (activeSort.direction === 'asc') return `Ordenar ${column.header} em ordem decrescente`;
    return `Remover ordenação de ${column.header}`;
  }

  protected onSort(column: AqTableColumn<T>): void {
    if (!column.sortable) return;

    const activeSort = this.sort();

    if (activeSort?.key !== column.key) {
      this.sortChange.emit({ key: column.key, direction: 'asc' });
      return;
    }

    if (activeSort.direction === 'asc') {
      this.sortChange.emit({ key: column.key, direction: 'desc' });
      return;
    }

    this.sortChange.emit(null);
  }

  protected onRowClick(row: T, event: MouseEvent): void {
    if (
      !this.rowClickable() ||
      this.didStartFromInteractiveElement(event.target, event.currentTarget)
    ) {
      return;
    }

    this.rowClick.emit(row);
  }

  protected onRowKeydown(row: T, event: KeyboardEvent): void {
    if (
      !this.rowClickable() ||
      this.didStartFromInteractiveElement(event.target, event.currentTarget)
    ) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    this.rowClick.emit(row);
  }

  protected getRowTabIndex(): number | null {
    return this.rowClickable() ? 0 : null;
  }

  protected getRowRole(): string | null {
    return this.rowClickable() ? 'button' : null;
  }

  protected getRowAriaLabel(row: T, index: number): string | null {
    if (!this.rowClickable()) return null;
    return this.rowAriaLabel()?.(row, index) ?? `Abrir linha ${index + 1}`;
  }

  protected isSelected(row: T, index: number): boolean {
    return this.selectedIds().has(this.resolveRowId(row, index));
  }

  protected onSelectionToggle(row: T, index: number, checked: boolean): void {
    const nextSelection =
      this.selectionMode() === 'single'
        ? checked
          ? [row]
          : []
        : this.buildMultipleSelection(row, index, checked);

    this.selectionChange.emit(nextSelection);
  }

  protected onToggleAll(checked: boolean): void {
    if (this.selectionMode() !== 'multiple') return;

    const visibleRows = this.selectableRows();

    if (checked) {
      const current = [...this.selectedRows()];
      const currentIds = new Set(current.map((row, index) => this.resolveRowId(row, index)));

      for (const [index, row] of visibleRows.entries()) {
        const id = this.resolveRowId(row, index);
        if (!currentIds.has(id)) current.push(row);
      }

      this.selectionChange.emit(current);
      return;
    }

    const visibleIds = new Set(visibleRows.map((row, index) => this.resolveRowId(row, index)));
    this.selectionChange.emit(
      this.selectedRows().filter((row, index) => !visibleIds.has(this.resolveRowId(row, index))),
    );
  }

  protected onRetry(): void {
    this.retry.emit();
  }

  protected trackRow(index: number, row: T): AqTableRowId {
    return this.resolveRowId(row, index);
  }

  protected trackColumn(_: number, column: AqTableColumn<T>): string {
    return column.key;
  }

  private buildMultipleSelection(row: T, index: number, checked: boolean): readonly T[] {
    const id = this.resolveRowId(row, index);

    if (checked) {
      return this.isSelected(row, index) ? this.selectedRows() : [...this.selectedRows(), row];
    }

    return this.selectedRows().filter(
      (selectedRow, selectedIndex) => this.resolveRowId(selectedRow, selectedIndex) !== id,
    );
  }

  private resolveRowId(row: T, index: number): AqTableRowId {
    const rowId = this.rowId();

    if (typeof rowId === 'function') return rowId(row, index);
    if (rowId) {
      const value = row[rowId];
      if (typeof value === 'string' || typeof value === 'number') return value;
    }

    return index;
  }

  private didStartFromInteractiveElement(
    target: EventTarget | null,
    currentTarget: EventTarget | null,
  ): boolean {
    if (!(target instanceof Element)) return false;

    const interactiveElement = target.closest(INTERACTIVE_SELECTOR);
    return Boolean(interactiveElement && interactiveElement !== currentTarget);
  }
}
