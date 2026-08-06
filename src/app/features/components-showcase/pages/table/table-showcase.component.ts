import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { DropdownMenuComponent } from '../../../../shared/components/dropdown-menu/dropdown-menu.component';
import { DropdownMenuItem } from '../../../../shared/components/dropdown-menu/dropdown-menu-item.model';
import {
  AqTableColumn,
  AqTableComponent,
  AqTableSort,
  AqTableCellDirective,
} from '../../../../shared/components/table';

interface MeasurementRow extends Record<string, unknown> {
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly parameter: string;
  readonly value: string;
  readonly unit: string;
  readonly status: 'normal' | 'attention' | 'critical';
  readonly trend: 'up' | 'down' | 'stable' | 'unknown';
  readonly aquarium: string;
  readonly source: string;
}

@Component({
  selector: 'app-table-showcase',
  standalone: true,
  imports: [
    AqTableCellDirective,
    AqTableComponent,
    BadgeComponent,
    CodeBlockComponent,
    DropdownMenuComponent,
  ],
  templateUrl: './table-showcase.component.html',
  styleUrl: './table-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableShowcaseComponent {
  readonly sort = signal<AqTableSort | null>({ key: 'date', direction: 'desc' });
  readonly selectedRows = signal<readonly MeasurementRow[]>([]);
  readonly clickedRow = signal<MeasurementRow | null>(null);
  readonly lastAction = signal<string>('');
  readonly rowLabel = (row: MeasurementRow): string => `Abrir medicao de ${row.parameter}`;

  readonly actionItems: DropdownMenuItem[] = [
    { id: 'view', label: 'Visualizar', icon: 'visibility' },
    { id: 'edit', label: 'Editar', icon: 'edit' },
    { id: 'delete', label: 'Excluir', icon: 'delete', isDestructive: true },
  ];

  readonly columns: AqTableColumn<MeasurementRow>[] = [
    { key: 'date', header: 'Data e horario', sortable: true, minWidth: '10rem' },
    { key: 'parameter', header: 'Parametro', sortable: true, minWidth: '8rem' },
    { key: 'value', header: 'Valor', sortable: true, align: 'end', minWidth: '7rem' },
    { key: 'status', header: 'Status', minWidth: '7rem' },
    { key: 'trend', header: 'Tendencia', align: 'center', minWidth: '7rem', priority: 'secondary' },
  ];

  readonly actionColumns: AqTableColumn<MeasurementRow>[] = [
    ...this.columns,
    { key: 'actions', header: 'Acoes', align: 'end', width: '6rem' },
  ];

  readonly wideColumns: AqTableColumn<MeasurementRow>[] = [
    ...this.columns,
    {
      key: 'aquarium',
      header: 'Aquario',
      sortable: true,
      priority: 'secondary',
      minWidth: '11rem',
    },
    { key: 'source', header: 'Origem', priority: 'optional', minWidth: '10rem' },
    { key: 'id', header: 'ID tecnico', priority: 'optional', minWidth: '10rem' },
  ];

  readonly measurements: MeasurementRow[] = [
    {
      id: 'm-001',
      date: 'Feb 27, 2026',
      time: '09:30',
      parameter: 'pH',
      value: '7.2',
      unit: '',
      status: 'normal',
      trend: 'stable',
      aquarium: 'Community Tank',
      source: 'Manual',
    },
    {
      id: 'm-002',
      date: 'Feb 27, 2026',
      time: '09:30',
      parameter: 'NO3',
      value: '16',
      unit: 'mg/L',
      status: 'normal',
      trend: 'down',
      aquarium: 'Community Tank',
      source: 'API',
    },
    {
      id: 'm-003',
      date: 'Feb 27, 2026',
      time: '09:30',
      parameter: 'Temp',
      value: '24',
      unit: 'deg C',
      status: 'normal',
      trend: 'stable',
      aquarium: 'Community Tank',
      source: 'Sensor',
    },
    {
      id: 'm-004',
      date: 'Feb 26, 2026',
      time: '18:45',
      parameter: 'KH',
      value: '6',
      unit: 'dKH',
      status: 'attention',
      trend: 'up',
      aquarium: 'Community Tank',
      source: 'Manual',
    },
    {
      id: 'm-005',
      date: 'Feb 25, 2026',
      time: '10:15',
      parameter: 'GH',
      value: '8',
      unit: 'dGH',
      status: 'normal',
      trend: 'stable',
      aquarium: 'Community Tank',
      source: 'Manual',
    },
    {
      id: 'm-006',
      date: 'Feb 23, 2026',
      time: '08:20',
      parameter: 'Fe',
      value: '0.5',
      unit: 'mg/L',
      status: 'critical',
      trend: 'unknown',
      aquarium: 'Community Tank',
      source: 'Manual',
    },
  ];

  readonly codeTs = `readonly columns: AqTableColumn<MeasurementRow>[] = [
  { key: 'date', header: 'Data e horario', sortable: true },
  { key: 'parameter', header: 'Parametro', sortable: true },
  { key: 'value', header: 'Valor', align: 'end' },
  { key: 'status', header: 'Status' },
];

readonly sort = signal<AqTableSort | null>(null);
readonly selectedRows = signal<readonly MeasurementRow[]>([]);

onSortChange(sort: AqTableSort | null): void {
  this.sort.set(sort);
}`;

  readonly codeHtml = `<aq-table
  [rows]="measurements"
  [columns]="columns"
  rowId="id"
  caption="Historico de medicoes"
  [sort]="sort()"
  [selectable]="true"
  [selectedRows]="selectedRows()"
  (sortChange)="sort.set($event)"
  (selectionChange)="selectedRows.set($event)"
>
  <ng-template aqTableCell="date" let-row>
    <strong>{{ row.date }}</strong>
    <span>{{ row.time }}</span>
  </ng-template>
</aq-table>`;

  onSortChange(sort: AqTableSort | null): void {
    this.sort.set(sort);
  }

  onSelectionChange(rows: readonly MeasurementRow[]): void {
    this.selectedRows.set(rows);
  }

  onRowClick(row: MeasurementRow): void {
    this.clickedRow.set(row);
  }

  onAction(row: MeasurementRow, item: DropdownMenuItem): void {
    this.lastAction.set(`${item.label}: ${row.parameter}`);
  }

  getStatusLabel(status: MeasurementRow['status']): string {
    return {
      normal: 'Normal',
      attention: 'Atencao',
      critical: 'Critico',
    }[status];
  }

  getStatusColor(status: MeasurementRow['status']): 'success' | 'warning' | 'error' {
    const colorByStatus = {
      normal: 'success',
      attention: 'warning',
      critical: 'error',
    } as const;

    return colorByStatus[status];
  }

  getTrendIcon(trend: MeasurementRow['trend']): string {
    return {
      up: 'trending_up',
      down: 'trending_down',
      stable: 'trending_flat',
      unknown: 'remove',
    }[trend];
  }

  getTrendLabel(trend: MeasurementRow['trend']): string {
    return {
      up: 'Tendencia de aumento',
      down: 'Tendencia de reducao',
      stable: 'Tendencia estavel',
      unknown: 'Tendencia indisponivel',
    }[trend];
  }
}
