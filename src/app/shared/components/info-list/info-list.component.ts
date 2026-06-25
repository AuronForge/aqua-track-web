import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { InfoListItemComponent } from '../info-list-item/info-list-item.component';
import { PaginatorChange } from '../paginator/paginator-change.model';
import { PaginatorComponent } from '../paginator/paginator.component';
import { InfoListEmptyState } from './info-list-empty-state.model';
import { InfoListItemData } from './info-list-item-data.model';
import { InfoListPageChange } from './info-list-page-change.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-info-list',
  standalone: true,
  imports: [InfoListItemComponent, PaginatorComponent],
  templateUrl: './info-list.component.html',
  styleUrl: './info-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.aria-busy]': 'loading() || null',
  },
})
export class InfoListComponent {
  readonly items = input.required<InfoListItemData[]>();
  readonly paginated = input<boolean>(true);
  readonly pageIndex = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 20]);
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly emptyState = input<InfoListEmptyState>({ title: 'Nenhum item encontrado' });
  readonly clickable = input<boolean>(false);

  readonly pageChange = output<InfoListPageChange>();
  readonly itemClick = output<InfoListItemData>();

  protected readonly totalItems = computed(() => this.items().length);

  protected readonly isEmpty = computed(() => !this.loading() && this.totalItems() === 0);

  protected readonly showPaginator = computed(
    () => this.paginated() && this.totalItems() > this.pageSize(),
  );

  protected readonly visibleItems = computed(() => {
    if (!this.paginated()) return this.items();
    const start = this.pageIndex() * this.pageSize();
    return this.items().slice(start, start + this.pageSize());
  });

  protected readonly hostClass = computed(() =>
    [
      'info-list',
      this.disabled() ? 'info-list--disabled' : '',
      this.loading() ? 'info-list--loading' : '',
      this.isEmpty() ? 'info-list--empty' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected onItemClick(item: InfoListItemData): void {
    this.itemClick.emit(item);
  }

  protected onPaginatorChange(event: PaginatorChange): void {
    this.pageChange.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  }
}
