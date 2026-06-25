import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { InfoListEmptyState } from '../../../../shared/components/info-list/info-list-empty-state.model';
import { InfoListItemData } from '../../../../shared/components/info-list/info-list-item-data.model';
import { InfoListPageChange } from '../../../../shared/components/info-list/info-list-page-change.model';
import { InfoListComponent } from '../../../../shared/components/info-list/info-list.component';

@Component({
  selector: 'app-info-list-showcase',
  standalone: true,
  imports: [CodeBlockComponent, InfoListComponent],
  templateUrl: './info-list-showcase.component.html',
  styleUrl: './info-list-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoListShowcaseComponent {
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);
  readonly lastClickedItem = signal<InfoListItemData | null>(null);

  readonly emptyStateExample: InfoListEmptyState = {
    title: 'Nenhum item encontrado',
    description: 'Adicione itens para vê-los aqui.',
  };

  readonly allItems: InfoListItemData[] = [
    {
      title: 'pH',
      subtitle: 'Aquário Comunitário',
      value: '7.2',
      metadata: '09:30',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'Nitrato (NO3)',
      subtitle: 'Paisagismo Plantado',
      value: '25 ppm',
      metadata: '09:15',
      badge: { label: 'Alto', status: 'danger' },
    },
    {
      title: 'Alcalinidade',
      subtitle: 'Aquário de Recife',
      value: '9.5 dKH',
      metadata: '18:45',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'Amônia',
      subtitle: 'Nano Aquário de Camarões',
      value: '0.5 ppm',
      metadata: '17:20',
      badge: { label: 'Crítico', status: 'danger' },
    },
    {
      title: 'Temperatura',
      subtitle: 'Aquário Principal',
      value: '26°C',
      metadata: '08:00',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'Salinidade',
      subtitle: 'Aquário de Recife',
      value: '35 ppt',
      metadata: '12:00',
      badge: { label: 'Atenção', status: 'attention' },
    },
    {
      title: 'Oxigênio Dissolvido',
      subtitle: 'Lago Ornamental',
      value: '8.1 mg/L',
      metadata: '14:30',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'Fosfato',
      subtitle: 'Paisagismo Plantado',
      value: '0.3 ppm',
      metadata: '11:45',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'Dureza (GH)',
      subtitle: 'Nano Aquário de Camarões',
      value: '8 dH',
      metadata: '16:00',
      badge: { label: 'Atenção', status: 'attention' },
    },
    {
      title: 'Nitrito (NO2)',
      subtitle: 'Aquário Comunitário',
      value: '0.0 ppm',
      metadata: '10:15',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'CO2',
      subtitle: 'Paisagismo Plantado',
      value: '22 ppm',
      metadata: '09:00',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'Cálcio',
      subtitle: 'Aquário de Recife',
      value: '420 ppm',
      metadata: '13:30',
      badge: { label: 'Atenção', status: 'attention' },
    },
  ];

  readonly badgeVariantItems: InfoListItemData[] = [
    {
      title: 'Normal',
      subtitle: 'Status de exemplo',
      value: '7.0',
      metadata: '08:00',
      badge: { label: 'Normal', status: 'normal' },
    },
    {
      title: 'Atenção',
      subtitle: 'Status de exemplo',
      value: '25 ppm',
      metadata: '09:00',
      badge: { label: 'Atenção', status: 'attention' },
    },
    {
      title: 'Crítico',
      subtitle: 'Status de exemplo',
      value: '0.5 ppm',
      metadata: '10:00',
      badge: { label: 'Crítico', status: 'danger' },
    },
    {
      title: 'Neutro',
      subtitle: 'Status de exemplo',
      value: '—',
      metadata: '11:00',
      badge: { label: 'Neutro', status: 'neutral' },
    },
  ];

  readonly recentItems: InfoListItemData[] = this.allItems.slice(0, 4);

  readonly codeTs = `import { InfoListComponent } from '../../shared/components/info-list/info-list.component';
import { InfoListItemData } from '../../shared/components/info-list/info-list-item-data.model';
import { InfoListPageChange } from '../../shared/components/info-list/info-list-page-change.model';

readonly pageIndex = signal(0);
readonly pageSize = signal(5);

readonly items: InfoListItemData[] = [
  {
    title: 'pH',
    subtitle: 'Aquário Comunitário',
    value: '7.2',
    metadata: '09:30',
    badge: { label: 'Normal', status: 'normal' },
  },
];

onPageChange(event: InfoListPageChange): void {
  this.pageIndex.set(event.pageIndex);
  this.pageSize.set(event.pageSize);
}`;

  readonly codeHtml = `<aq-info-list
  [items]="items"
  [pageIndex]="pageIndex()"
  [pageSize]="pageSize()"
  [pageSizeOptions]="[5, 10, 20]"
  [clickable]="true"
  (pageChange)="onPageChange($event)"
  (itemClick)="onItemClick($event)"
/>`;

  onPageChange(event: InfoListPageChange): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  onItemClick(item: InfoListItemData): void {
    this.lastClickedItem.set(item);
  }
}
