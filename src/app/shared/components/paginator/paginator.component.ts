import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SelectFormfieldOption } from '../formfields/select-formfield/select-formfield-option.model';
import { SelectFormfieldComponent } from '../formfields/select-formfield/select-formfield.component';
import { PaginatorChange } from './paginator-change.model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-paginator',
  standalone: true,
  imports: [ReactiveFormsModule, SelectFormfieldComponent],
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

  protected readonly pageSizeControl = new FormControl<string>('', { nonNullable: true });

  protected readonly hostClass = computed(() =>
    ['paginator', this.disabled() ? 'paginator--disabled' : ''].filter(Boolean).join(' '),
  );

  protected readonly pageSizeSelectOptions = computed<SelectFormfieldOption[]>(() =>
    this.pageSizeOptions().map((size) => ({ id: String(size), title: String(size) })),
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

  constructor() {
    effect(() => {
      const nextPageSize = String(this.pageSize());

      if (this.pageSizeControl.value !== nextPageSize) {
        this.pageSizeControl.setValue(nextPageSize, { emitEvent: false });
      }
    });

    effect(() => {
      if (this.disabled()) {
        this.pageSizeControl.disable({ emitEvent: false });
      } else {
        this.pageSizeControl.enable({ emitEvent: false });
      }
    });
  }

  protected onPrevious(): void {
    if (!this.hasPreviousPage()) return;
    this.pageChange.emit({ pageIndex: this.pageIndex() - 1, pageSize: this.pageSize() });
  }

  protected onNext(): void {
    if (!this.hasNextPage()) return;
    this.pageChange.emit({ pageIndex: this.pageIndex() + 1, pageSize: this.pageSize() });
  }

  protected onSizeChange(event: { option: SelectFormfieldOption }): void {
    this.pageChange.emit({ pageIndex: 0, pageSize: Number(event.option.id) });
  }
}
