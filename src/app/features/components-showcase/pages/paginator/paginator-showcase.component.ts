import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { AqPaginationChange } from '../../../../shared/components/paginator/paginator-change.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import {
  AqTableCellDirective,
  AqTableColumn,
  AqTableComponent,
} from '../../../../shared/components/table';

interface ShowcaseMeasurement extends Record<string, unknown> {
  readonly id: string;
  readonly parameter: string;
  readonly value: string;
  readonly aquarium: string;
  readonly status: 'normal' | 'attention' | 'critical';
}

interface ShowcaseAquarium {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly volume: string;
}

@Component({
  selector: 'app-paginator-showcase',
  standalone: true,
  imports: [
    AqTableCellDirective,
    AqTableComponent,
    BadgeComponent,
    CodeBlockComponent,
    PaginatorComponent,
  ],
  templateUrl: './paginator-showcase.component.html',
  styleUrl: './paginator-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorShowcaseComponent {
  readonly basicPage = signal(1);
  readonly basicPageSize = signal(10);
  readonly tablePage = signal(1);
  readonly tablePageSize = signal(5);
  readonly cardsPage = signal(1);
  readonly cardsPageSize = signal(4);
  readonly listPage = signal(1);
  readonly listPageSize = signal(5);
  readonly lastEvent = signal<AqPaginationChange | null>(null);

  readonly columns: AqTableColumn<ShowcaseMeasurement>[] = [
    { key: 'parameter', header: 'Parametro', minWidth: '8rem' },
    { key: 'value', header: 'Valor', align: 'end', minWidth: '7rem' },
    { key: 'aquarium', header: 'Aquario', minWidth: '10rem', priority: 'secondary' },
    { key: 'status', header: 'Status', minWidth: '7rem' },
  ];

  readonly measurements: ShowcaseMeasurement[] = [
    { id: 'm-001', parameter: 'pH', value: '7.2', aquarium: 'Comunitario', status: 'normal' },
    { id: 'm-002', parameter: 'NO3', value: '16 mg/L', aquarium: 'Plantado', status: 'normal' },
    { id: 'm-003', parameter: 'KH', value: '6 dKH', aquarium: 'Recife', status: 'attention' },
    { id: 'm-004', parameter: 'Fe', value: '0.5 mg/L', aquarium: 'Plantado', status: 'critical' },
    { id: 'm-005', parameter: 'GH', value: '8 dGH', aquarium: 'Comunitario', status: 'normal' },
    { id: 'm-006', parameter: 'PO4', value: '0.3 mg/L', aquarium: 'Recife', status: 'attention' },
    { id: 'm-007', parameter: 'CO2', value: '22 mg/L', aquarium: 'Plantado', status: 'normal' },
    { id: 'm-008', parameter: 'Ca', value: '420 mg/L', aquarium: 'Recife', status: 'normal' },
    {
      id: 'm-009',
      parameter: 'NH3',
      value: '0.2 mg/L',
      aquarium: 'Quarentena',
      status: 'critical',
    },
    { id: 'm-010', parameter: 'Temp.', value: '26 C', aquarium: 'Comunitario', status: 'normal' },
    { id: 'm-011', parameter: 'Salin.', value: '35 ppt', aquarium: 'Recife', status: 'normal' },
    { id: 'm-012', parameter: 'NO2', value: '0 mg/L', aquarium: 'Comunitario', status: 'normal' },
  ];

  readonly aquariums: ShowcaseAquarium[] = [
    { id: 'a-001', name: 'Comunitario', type: 'Agua doce', volume: '120 L' },
    { id: 'a-002', name: 'Recife', type: 'Marinho', volume: '240 L' },
    { id: 'a-003', name: 'Plantado', type: 'High tech', volume: '90 L' },
    { id: 'a-004', name: 'Quarentena', type: 'Hospital', volume: '40 L' },
    { id: 'a-005', name: 'Camarões', type: 'Nano', volume: '30 L' },
    { id: 'a-006', name: 'Lago', type: 'Ornamental', volume: '800 L' },
    { id: 'a-007', name: 'Betta', type: 'Low tech', volume: '25 L' },
    { id: 'a-008', name: 'Tanganyika', type: 'Ciclideos', volume: '180 L' },
  ];

  readonly listItems = this.measurements.map((measurement) => ({
    id: measurement.id,
    name: `${measurement.parameter} em ${measurement.aquarium}`,
  }));

  readonly visibleMeasurements = computed(() =>
    this.paginate(this.measurements, this.tablePage(), this.tablePageSize()),
  );

  readonly visibleAquariums = computed(() =>
    this.paginate(this.aquariums, this.cardsPage(), this.cardsPageSize()),
  );

  readonly visibleListItems = computed(() =>
    this.paginate(this.listItems, this.listPage(), this.listPageSize()),
  );

  readonly codeTs = `readonly page = signal(1);
readonly pageSize = signal(10);
readonly totalItems = signal(117);

onPaginationChange(event: AqPaginationChange): void {
  this.page.set(event.page);
  this.pageSize.set(event.pageSize);
}`;

  readonly codeHtml = `<aq-paginator
  [page]="page()"
  [pageSize]="pageSize()"
  [totalItems]="totalItems()"
  [pageSizeOptions]="[10, 20, 50, 100]"
  (paginationChange)="onPaginationChange($event)"
/>`;

  onBasicPaginationChange(event: AqPaginationChange): void {
    this.basicPage.set(event.page);
    this.basicPageSize.set(event.pageSize);
    this.lastEvent.set(event);
  }

  onTablePaginationChange(event: AqPaginationChange): void {
    this.tablePage.set(event.page);
    this.tablePageSize.set(event.pageSize);
  }

  onCardsPaginationChange(event: AqPaginationChange): void {
    this.cardsPage.set(event.page);
    this.cardsPageSize.set(event.pageSize);
  }

  onListPaginationChange(event: AqPaginationChange): void {
    this.listPage.set(event.page);
    this.listPageSize.set(event.pageSize);
  }

  getStatusColor(status: ShowcaseMeasurement['status']): 'success' | 'warning' | 'error' {
    const colorByStatus = {
      normal: 'success',
      attention: 'warning',
      critical: 'error',
    } as const;

    return colorByStatus[status];
  }

  getStatusLabel(status: ShowcaseMeasurement['status']): string {
    return {
      normal: 'Normal',
      attention: 'Atencao',
      critical: 'Critico',
    }[status];
  }

  private paginate<T>(items: readonly T[], page: number, pageSize: number): readonly T[] {
    const start = (page - 1) * pageSize;

    return items.slice(start, start + pageSize);
  }
}
