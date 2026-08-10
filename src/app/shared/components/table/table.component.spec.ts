import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AqTableCellDirective } from './table-cell.directive';
import { AqTableComponent } from './table.component';
import { AqTableColumn, AqTableSort } from './table.models';

interface TestRow {
  id?: string;
  name: string;
  status: string;
}

@Component({
  standalone: true,
  imports: [AqTableCellDirective, AqTableComponent],
  template: `
    <aq-table
      [rows]="rows()"
      [columns]="columns"
      [caption]="caption"
      [emptyState]="emptyState"
      [sort]="sort()"
      density="comfortable"
      (sortChange)="sort.set($event)"
    >
      <ng-template aqTableCell="name" let-row>
        <strong class="custom-name">{{ row.name }}</strong>
      </ng-template>
    </aq-table>
  `,
})
class TableHostComponent {
  readonly rows = signal<TestRow[]>([
    { id: 'row-1', name: 'Primeiro', status: 'Normal' },
    { name: 'Sem id', status: 'Alerta' },
  ]);
  readonly sort = signal<AqTableSort | null>(null);
  readonly caption = 'Tabela de teste';
  readonly emptyState = {
    title: 'Nada por aqui',
    description: 'Cadastre um item para continuar.',
    icon: 'inbox',
  };
  readonly columns: readonly AqTableColumn<TestRow>[] = [
    { key: 'name', header: 'Nome', sortable: true, minWidth: '10rem', priority: 'primary' },
    { key: 'state', header: 'Status', property: 'status' },
    { key: 'missing', header: 'Ausente', sortable: true },
  ];
}

describe('AqTableComponent', () => {
  let fixture: ComponentFixture<TableHostComponent>;
  let host: TableHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders rows, fallback cells, custom cell templates, and metadata', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('caption')?.textContent).toContain('Tabela de teste');
    expect(element.querySelector('.aq-table--comfortable')).not.toBeNull();
    expect(element.querySelector('.custom-name')?.textContent).toContain('Primeiro');
    expect(element.textContent).toContain('Normal');
    expect(element.textContent).not.toContain('Nada por aqui');
    expect(element.querySelector('th')?.getAttribute('style')).toContain('min-width: 10rem');
    expect(element.querySelector('td')?.getAttribute('data-priority')).toBe('primary');
  });

  it('cycles sortable columns through asc, desc, and no sort', () => {
    const sortButton = fixture.nativeElement.querySelector('.aq-table__sort') as HTMLButtonElement;

    sortButton.click();
    fixture.detectChanges();
    expect(host.sort()).toEqual({ key: 'name', direction: 'asc' });
    expect(sortButton.textContent).toContain('keyboard_arrow_up');

    sortButton.click();
    fixture.detectChanges();
    expect(host.sort()).toEqual({ key: 'name', direction: 'desc' });
    expect(sortButton.textContent).toContain('keyboard_arrow_down');

    sortButton.click();
    fixture.detectChanges();
    expect(host.sort()).toBeNull();
    expect(sortButton.textContent).toContain('unfold_more');
  });

  it('does not emit sort changes for non-sortable columns', () => {
    const component = fixture.debugElement.children[0]
      .componentInstance as AqTableComponent<TestRow>;
    const currentSort = host.sort();

    component['nextSort']({ key: 'state', header: 'Status' });

    expect(host.sort()).toBe(currentSort);
  });

  it('renders the configured empty state when there are no rows', () => {
    host.rows.set([]);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.aq-table__empty')?.textContent).toContain('Nada por aqui');
    expect(element.querySelector('.aq-table__empty')?.textContent).toContain(
      'Cadastre um item para continuar.',
    );
    expect(element.querySelector('.aq-table__empty-icon')?.textContent).toContain('inbox');
  });
});
