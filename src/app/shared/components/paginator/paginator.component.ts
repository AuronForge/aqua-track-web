import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { InputSelectChangeEvent } from '../select/input-select-change-event.model';
import { InputSelectOption } from '../select/input-select-option.model';
import { InputSelectComponent } from '../select/input-select.component';
import { PaginatorChange } from './paginator-change.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-paginator',
  standalone: true,
  imports: [InputSelectComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
})
export class PaginatorComponent {
  readonly pageIndex = input<number>(0);
  readonly pageSize = input<number>(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 20]);
  readonly totalItems = input.required<number>();
  readonly disabled = input<boolean>(false);

  readonly pageChange = output<PaginatorChange>();

  protected readonly hostClass = computed(() =>
    ['paginator', this.disabled() ? 'paginator--disabled' : ''].filter(Boolean).join(' '),
  );

  protected readonly pageSizeSelectOptions = computed<InputSelectOption[]>(() =>
    this.pageSizeOptions().map((size) => ({ id: String(size), title: String(size) })),
  );

  protected readonly selectedSizeOption = computed<InputSelectOption | null>(
    () => this.pageSizeSelectOptions().find((o) => o.id === String(this.pageSize())) ?? null,
  );

  protected readonly hasPreviousPage = computed(() => this.pageIndex() > 0);

  protected readonly hasNextPage = computed(
    () => (this.pageIndex() + 1) * this.pageSize() < this.totalItems(),
  );

  protected readonly pageStart = computed(() =>
    this.totalItems() === 0 ? 0 : this.pageIndex() * this.pageSize() + 1,
  );

  protected readonly pageEnd = computed(() =>
    Math.min((this.pageIndex() + 1) * this.pageSize(), this.totalItems()),
  );

  protected onPrevious(): void {
    if (!this.hasPreviousPage()) return;
    this.pageChange.emit({ pageIndex: this.pageIndex() - 1, pageSize: this.pageSize() });
  }

  protected onNext(): void {
    if (!this.hasNextPage()) return;
    this.pageChange.emit({ pageIndex: this.pageIndex() + 1, pageSize: this.pageSize() });
  }

  protected onSizeChange(event: InputSelectChangeEvent): void {
    this.pageChange.emit({ pageIndex: 0, pageSize: Number(event.option.id) });
  }
}
