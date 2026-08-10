import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChildren,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { AqTableCellDirective } from './table-cell.directive';
import { AqTableColumn, AqTableEmptyState, AqTableSort } from './table.models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AqTableComponent<T extends object = Record<string, unknown>> {
  readonly rows = input<readonly T[]>([]);
  readonly columns = input.required<readonly AqTableColumn<T>[]>();
  readonly rowId = input<keyof T & string>('id' as keyof T & string);
  readonly caption = input('Tabela');
  readonly emptyState = input<AqTableEmptyState | null>(null);
  readonly sort = input<AqTableSort | null>(null);
  readonly density = input<'default' | 'comfortable'>('default');
  readonly sortChange = output<AqTableSort | null>();

  private readonly cellTemplates = contentChildren(AqTableCellDirective<T>);

  protected readonly hostClass = computed(() => `aq-table aq-table--${this.density()}`);

  protected templateFor(columnKey: string): TemplateRef<{ $implicit: T }> | null {
    return (
      this.cellTemplates().find((template) => template.key() === columnKey)?.templateRef ?? null
    );
  }

  protected rowKey(row: T, index: number): string | number {
    const value = (row as Record<string, unknown>)[this.rowId()];
    return typeof value === 'string' || typeof value === 'number' ? value : index;
  }

  protected cellValue(row: T, column: AqTableColumn<T>): unknown {
    const key = column.property ?? column.key;
    return (row as Record<string, unknown>)[key];
  }

  protected nextSort(column: AqTableColumn<T>): void {
    if (!column.sortable) {
      return;
    }

    const current = this.sort();

    if (current?.key !== column.key) {
      this.sortChange.emit({ key: column.key, direction: 'asc' });
      return;
    }

    if (current.direction === 'asc') {
      this.sortChange.emit({ key: column.key, direction: 'desc' });
      return;
    }

    this.sortChange.emit(null);
  }

  protected sortIcon(column: AqTableColumn<T>): string {
    const current = this.sort();

    if (current?.key !== column.key) {
      return 'unfold_more';
    }

    return current.direction === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }
}
