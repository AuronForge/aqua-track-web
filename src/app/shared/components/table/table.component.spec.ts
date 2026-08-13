import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqTableCellDirective } from './table-cell.directive';
import { AqTableColumn, AqTableRow } from './table-column.model';
import { AqTableSort } from './table-sort.model';
import { AqTableComponent } from './table.component';

interface TestRow extends AqTableRow {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly status: string;
}

const ROWS: TestRow[] = [
  { id: 'row-1', name: 'pH', value: 7.2, status: 'Normal' },
  { id: 'row-2', name: 'NO3', value: 16, status: 'Normal' },
  { id: 'row-3', name: 'Temp', value: 24, status: 'Attention' },
];

const COLUMNS: AqTableColumn<TestRow>[] = [
  { key: 'name', header: 'Parameter', sortable: true },
  { key: 'value', header: 'Value', sortable: true, align: 'end' },
  { key: 'status', header: 'Status' },
];

@Component({
  standalone: true,
  imports: [AqTableCellDirective, AqTableComponent],
  template: `
    <aq-table
      [rows]="rows()"
      [columns]="columns()"
      [rowId]="rowId"
      caption="Water measurements"
      [captionHidden]="captionHidden()"
      [ariaLabel]="ariaLabel()"
      [sort]="sort()"
      [selectable]="selectable()"
      [selectionMode]="selectionMode()"
      [selectedRows]="selectedRows()"
      [rowClickable]="rowClickable()"
      [loading]="loading()"
      [skeletonRows]="skeletonRows()"
      [emptyState]="emptyState"
      [errorState]="errorState()"
      (sortChange)="onSortChange($event)"
      (rowClick)="onRowClick($event)"
      (selectionChange)="onSelectionChange($event)"
      (retry)="onRetry()"
    >
      <ng-template aqTableCell="status" let-value="value">
        <span class="custom-status">{{ value }}</span>
      </ng-template>

      <ng-template aqTableCell="value" let-row>
        <button type="button" class="inner-action" (click)="onInnerAction(row)">Action</button>
        <strong class="custom-value">{{ row.value }}</strong>
      </ng-template>
    </aq-table>
  `,
})
class TestHostComponent {
  readonly rows = signal<readonly TestRow[]>(ROWS);
  readonly columns = signal<readonly AqTableColumn<TestRow>[]>(COLUMNS);
  readonly sort = signal<AqTableSort | null>(null);
  readonly selectable = signal(false);
  readonly selectionMode = signal<'single' | 'multiple'>('multiple');
  readonly selectedRows = signal<readonly TestRow[]>([]);
  readonly rowClickable = signal(false);
  readonly loading = signal(false);
  readonly skeletonRows = signal(5);
  readonly captionHidden = signal(true);
  readonly ariaLabel = signal('');
  readonly errorState = signal<{
    title: string;
    description?: string;
    actionLabel?: string;
  } | null>(null);
  readonly emptyState = { title: 'No rows', description: 'Try another filter.' };
  readonly rowId = 'id';

  lastSort: AqTableSort | null = null;
  lastClickedRow: TestRow | null = null;
  lastSelection: readonly TestRow[] = [];
  retryCount = 0;
  innerActionCount = 0;

  onSortChange(sort: AqTableSort | null): void {
    this.lastSort = sort;
    this.sort.set(sort);
  }

  onRowClick(row: TestRow): void {
    this.lastClickedRow = row;
  }

  onSelectionChange(rows: readonly TestRow[]): void {
    this.lastSelection = rows;
    this.selectedRows.set(rows);
  }

  onRetry(): void {
    this.retryCount += 1;
  }

  onInnerAction(): void {
    this.innerActionCount += 1;
  }
}

describe('AqTableComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getHost(): HTMLElement {
    return element.querySelector('aq-table')!;
  }

  function getHeaders(): HTMLElement[] {
    return Array.from(element.querySelectorAll('thead th'));
  }

  function getRows(): HTMLElement[] {
    return Array.from(element.querySelectorAll('tbody tr'));
  }

  function getSortButton(label: string): HTMLButtonElement {
    return Array.from(element.querySelectorAll<HTMLButtonElement>('.table__sort-button')).find(
      (button) => button.textContent?.includes(label),
    )!;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(getHost()).toBeTruthy();
  });

  it('should render semantic table structure with caption', () => {
    expect(element.querySelector('table')).toBeTruthy();
    expect(element.querySelector('thead')).toBeTruthy();
    expect(element.querySelector('tbody')).toBeTruthy();
    expect(element.querySelector('caption')?.textContent?.trim()).toBe('Water measurements');
  });

  it('should allow visible caption and aria-label', () => {
    fixture.componentInstance.captionHidden.set(false);
    fixture.componentInstance.ariaLabel.set('Measurements table');
    fixture.detectChanges();

    expect(element.querySelector('caption')?.classList).not.toContain('table__visually-hidden');
    expect(element.querySelector('table')?.getAttribute('aria-label')).toBe('Measurements table');
  });

  it('should render configured headers', () => {
    expect(getHeaders().map((header) => header.textContent?.trim())).toEqual([
      'Parameter unfold_more',
      'Value unfold_more',
      'Status',
    ]);
  });

  it('should render one row per record', () => {
    expect(getRows().length).toBe(ROWS.length);
  });

  it('should render data in the configured columns', () => {
    const firstRowCells = Array.from(getRows()[0].querySelectorAll('td'));

    expect(firstRowCells[0].textContent?.trim()).toBe('pH');
    expect(firstRowCells[1].textContent).toContain('7.2');
    expect(firstRowCells[2].textContent?.trim()).toBe('Normal');
  });

  it('should resolve cell values from property and value callbacks', () => {
    fixture.componentInstance.columns.set([
      { key: 'label', header: 'Label', property: 'name' },
      { key: 'double', header: 'Double', value: (row) => row.value * 2 },
    ]);
    fixture.detectChanges();

    const firstRowCells = Array.from(getRows()[0].querySelectorAll('td'));

    expect(firstRowCells[0].textContent?.trim()).toBe('pH');
    expect(firstRowCells[1].textContent?.trim()).toBe('14.4');
  });

  it('should render dash for empty values', () => {
    fixture.componentInstance.columns.set([{ key: 'missing', header: 'Missing' }]);
    fixture.detectChanges();

    expect(getRows()[0].querySelector('td')?.textContent?.trim()).toBe('—');
  });

  it('should not render hidden columns', () => {
    fixture.componentInstance.columns.set([
      { key: 'name', header: 'Parameter' },
      { key: 'status', header: 'Status', hidden: true },
    ]);
    fixture.detectChanges();

    expect(getHeaders().map((header) => header.textContent?.trim())).toEqual(['Parameter']);
  });

  it('should render custom cell templates', () => {
    expect(element.querySelector('.custom-status')?.textContent?.trim()).toBe('Normal');
    expect(element.querySelector('.custom-value')?.textContent?.trim()).toBe('7.2');
  });

  it('should emit ascending sort when a sortable header is clicked', () => {
    getSortButton('Parameter').click();

    expect(fixture.componentInstance.lastSort).toEqual({ key: 'name', direction: 'asc' });
  });

  it('should cycle sort from ascending to descending and then clear', () => {
    getSortButton('Parameter').click();
    fixture.detectChanges();
    getSortButton('Parameter').click();
    fixture.detectChanges();

    expect(fixture.componentInstance.lastSort).toEqual({ key: 'name', direction: 'desc' });

    getSortButton('Parameter').click();

    expect(fixture.componentInstance.lastSort).toBeNull();
  });

  it('should expose aria-sort for sortable columns', () => {
    fixture.componentInstance.sort.set({ key: 'name', direction: 'asc' });
    fixture.detectChanges();

    expect(getHeaders()[0].getAttribute('aria-sort')).toBe('ascending');
    expect(getHeaders()[1].getAttribute('aria-sort')).toBe('none');
    expect(getHeaders()[2].getAttribute('aria-sort')).toBeNull();
  });

  it('should keep non-sortable headers inert', () => {
    getHeaders()[2].click();

    expect(fixture.componentInstance.lastSort).toBeNull();
  });

  it('should activate row click with mouse when rowClickable=true', () => {
    fixture.componentInstance.rowClickable.set(true);
    fixture.detectChanges();

    getRows()[0].click();

    expect(fixture.componentInstance.lastClickedRow).toEqual(ROWS[0]);
  });

  it('should activate row click with Enter when rowClickable=true', () => {
    fixture.componentInstance.rowClickable.set(true);
    fixture.detectChanges();

    getRows()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(fixture.componentInstance.lastClickedRow).toEqual(ROWS[1]);
  });

  it('should activate row click with Space when rowClickable=true', () => {
    fixture.componentInstance.rowClickable.set(true);
    fixture.detectChanges();

    getRows()[2].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(fixture.componentInstance.lastClickedRow).toEqual(ROWS[2]);
  });

  it('should ignore unrelated row key presses', () => {
    fixture.componentInstance.rowClickable.set(true);
    fixture.detectChanges();

    getRows()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(fixture.componentInstance.lastClickedRow).toBeNull();
  });

  it('should not emit rowClick from an internal action', () => {
    fixture.componentInstance.rowClickable.set(true);
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.inner-action')?.click();

    expect(fixture.componentInstance.innerActionCount).toBe(1);
    expect(fixture.componentInstance.lastClickedRow).toBeNull();
  });

  it('should render selection checkboxes when selectable=true', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.detectChanges();

    expect(element.querySelectorAll('.table__checkbox').length).toBe(ROWS.length + 1);
  });

  it('should emit selected rows when a row checkbox changes', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.detectChanges();

    const checkbox = element.querySelectorAll<HTMLInputElement>('.table__checkbox')[1];
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(fixture.componentInstance.lastSelection).toEqual([ROWS[0]]);
  });

  it('should emit all visible rows when header checkbox is selected', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.detectChanges();

    const checkbox = element.querySelector<HTMLInputElement>('.table__checkbox')!;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(fixture.componentInstance.lastSelection).toEqual(ROWS);
  });

  it('should remove a row from multiple selection when unchecked', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.componentInstance.selectedRows.set([ROWS[0], ROWS[1]]);
    fixture.detectChanges();

    const checkbox = element.querySelectorAll<HTMLInputElement>('.table__checkbox')[1];
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(fixture.componentInstance.lastSelection).toEqual([ROWS[1]]);
  });

  it('should not duplicate a selected row when checked again', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.componentInstance.selectedRows.set([ROWS[0]]);
    fixture.detectChanges();

    const checkbox = element.querySelectorAll<HTMLInputElement>('.table__checkbox')[1];
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(fixture.componentInstance.lastSelection).toEqual([ROWS[0]]);
  });

  it('should clear visible rows when header checkbox is unchecked', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.componentInstance.selectedRows.set(ROWS);
    fixture.detectChanges();

    const checkbox = element.querySelector<HTMLInputElement>('.table__checkbox')!;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(fixture.componentInstance.lastSelection).toEqual([]);
  });

  it('should emit only one row in single selection mode', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.componentInstance.selectionMode.set('single');
    fixture.detectChanges();

    const checkbox = element.querySelectorAll<HTMLInputElement>('.table__checkbox')[0];
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(fixture.componentInstance.lastSelection).toEqual([ROWS[0]]);
  });

  it('should emit empty selection when single selection is unchecked', () => {
    fixture.componentInstance.selectable.set(true);
    fixture.componentInstance.selectionMode.set('single');
    fixture.componentInstance.selectedRows.set([ROWS[0]]);
    fixture.detectChanges();

    const checkbox = element.querySelectorAll<HTMLInputElement>('.table__checkbox')[0];
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

    expect(fixture.componentInstance.lastSelection).toEqual([]);
  });

  it('should show empty state when there are no rows', () => {
    fixture.componentInstance.rows.set([]);
    fixture.detectChanges();

    expect(element.querySelector('.table__state-title')?.textContent?.trim()).toBe('No rows');
    expect(element.querySelector('.table__state-description')?.textContent?.trim()).toBe(
      'Try another filter.',
    );
  });

  it('should show loading state and aria-busy', () => {
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    expect(getHost().getAttribute('aria-busy')).toBe('true');
    expect(element.querySelector('.table__skeleton')).toBeTruthy();
  });

  it('should render at least one skeleton row when skeletonRows is zero', () => {
    fixture.componentInstance.loading.set(true);
    fixture.componentInstance.skeletonRows.set(0);
    fixture.detectChanges();

    expect(getRows().length).toBe(1);
  });

  it('should show error state and emit retry', () => {
    fixture.componentInstance.errorState.set({
      title: 'Failed',
      description: 'Try again',
      actionLabel: 'Retry',
    });
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.table__state-action')?.click();

    expect(element.querySelector('.table__state-title')?.textContent?.trim()).toBe('Failed');
    expect(fixture.componentInstance.retryCount).toBe(1);
  });

  it('should apply responsive priority classes to cells', () => {
    fixture.componentInstance.columns.set([
      { key: 'name', header: 'Parameter', priority: 'primary' },
      { key: 'value', header: 'Value', priority: 'secondary' },
      { key: 'status', header: 'Status', priority: 'optional' },
    ]);
    fixture.detectChanges();

    expect(element.querySelector('.table__cell--priority-primary')).toBeTruthy();
    expect(element.querySelector('.table__cell--priority-secondary')).toBeTruthy();
    expect(element.querySelector('.table__cell--priority-optional')).toBeTruthy();
  });
});
