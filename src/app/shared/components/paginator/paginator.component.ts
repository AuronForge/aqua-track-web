import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SelectFormfieldOption } from '../formfields/select-formfield/select-formfield-option.model';
import { SelectFormfieldComponent } from '../formfields/select-formfield/select-formfield.component';
import {
  AqPaginationChange,
  AqPaginatorLabels,
  AqPaginationState,
  PaginatorChange,
} from './paginator-change.model';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20] as const;

const DEFAULT_LABELS: AqPaginatorLabels = {
  pageSize: 'Itens por pagina:',
  page: 'Pagina',
  of: 'de',
  noPages: 'Nenhuma pagina',
  items: 'itens',
  loading: 'Carregando paginacao',
  firstPage: 'Ir para a primeira pagina',
  previousPage: 'Ir para a pagina anterior',
  nextPage: 'Ir para a proxima pagina',
  lastPage: 'Ir para a ultima pagina',
};

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-paginator',
  standalone: true,
  imports: [ReactiveFormsModule, SelectFormfieldComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClass()',
  },
})
export class PaginatorComponent {
  readonly page = input<number | null>(null);
  readonly pageIndex = input<number>(0);
  readonly pageSize = input<number>(DEFAULT_PAGE_SIZE);
  readonly pageSizeOptions = input<readonly number[]>(DEFAULT_PAGE_SIZE_OPTIONS);
  readonly totalItems = input.required<number>();
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly showFirstLastButtons = input<boolean>(true);
  readonly showPageSizeSelector = input<boolean>(true);
  readonly pageSizeLabel = input<string>(DEFAULT_LABELS.pageSize);
  readonly ariaLabel = input<string>('Paginacao dos resultados');
  readonly labels = input<Partial<AqPaginatorLabels>>({});

  readonly paginationChange = output<AqPaginationChange>();
  readonly pageChange = output<PaginatorChange>();

  protected readonly pageSizeControl = new FormControl<string>('', { nonNullable: true });

  protected readonly resolvedLabels = computed<AqPaginatorLabels>(() => ({
    ...DEFAULT_LABELS,
    ...this.labels(),
    pageSize: this.pageSizeLabel(),
  }));

  protected readonly normalizedTotalItems = computed(() =>
    Math.max(0, Math.floor(this.totalItems())),
  );

  protected readonly normalizedPageSize = computed(() => {
    const pageSize = Math.floor(this.pageSize());

    return pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  });

  protected readonly pageSizeSelectOptions = computed<SelectFormfieldOption[]>(() =>
    this.normalizedPageSizeOptions().map((size) => ({ id: String(size), title: String(size) })),
  );

  protected readonly normalizedPageSizeOptions = computed(() => {
    const options = this.pageSizeOptions().filter((size) => Number.isFinite(size) && size > 0);
    const uniqueOptions = Array.from(
      new Set([...options.map((size) => Math.floor(size)), this.normalizedPageSize()]),
    );

    return uniqueOptions.sort((left, right) => left - right);
  });

  protected readonly totalPages = computed(() => {
    const totalItems = this.normalizedTotalItems();

    return totalItems === 0 ? 0 : Math.ceil(totalItems / this.normalizedPageSize());
  });

  protected readonly currentPage = computed(() => {
    const requestedPage = this.page() ?? this.pageIndex() + 1;

    return this.normalizePage(requestedPage);
  });

  protected readonly state = computed<AqPaginationState>(() => ({
    page: this.currentPage(),
    pageSize: this.normalizedPageSize(),
    totalItems: this.normalizedTotalItems(),
    totalPages: this.totalPages(),
  }));

  protected readonly hostClass = computed(() =>
    [
      'paginator',
      this.disabled() ? 'paginator--disabled' : '',
      this.loading() ? 'paginator--loading' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly interactionsDisabled = computed(() => this.disabled() || this.loading());

  protected readonly hasPreviousPage = computed(
    () => this.totalPages() > 1 && this.currentPage() > 1,
  );

  protected readonly hasNextPage = computed(
    () => this.totalPages() > 1 && this.currentPage() < this.totalPages(),
  );

  protected readonly pageStart = computed(() =>
    this.normalizedTotalItems() === 0
      ? 0
      : (this.currentPage() - 1) * this.normalizedPageSize() + 1,
  );

  protected readonly pageEnd = computed(() =>
    Math.min(this.currentPage() * this.normalizedPageSize(), this.normalizedTotalItems()),
  );

  protected readonly pageSummary = computed(() =>
    this.totalPages() === 0
      ? this.resolvedLabels().noPages
      : `${this.resolvedLabels().page} ${this.currentPage()} ${this.resolvedLabels().of} ${this.totalPages()}`,
  );

  protected readonly rangeSummary = computed(() =>
    this.normalizedTotalItems() === 0
      ? `0 ${this.resolvedLabels().of} 0 ${this.resolvedLabels().items}`
      : `${this.pageStart()}-${this.pageEnd()} ${this.resolvedLabels().of} ${this.normalizedTotalItems()} ${this.resolvedLabels().items}`,
  );

  constructor() {
    effect(() => {
      const nextPageSize = String(this.normalizedPageSize());

      if (this.pageSizeControl.value !== nextPageSize) {
        this.pageSizeControl.setValue(nextPageSize, { emitEvent: false });
      }
    });

    effect(() => {
      if (this.interactionsDisabled()) {
        this.pageSizeControl.disable({ emitEvent: false });
      } else {
        this.pageSizeControl.enable({ emitEvent: false });
      }
    });
  }

  protected onFirst(): void {
    this.emitPageChange(1);
  }

  protected onPrevious(): void {
    this.emitPageChange(this.currentPage() - 1);
  }

  protected onNext(): void {
    this.emitPageChange(this.currentPage() + 1);
  }

  protected onLast(): void {
    this.emitPageChange(this.totalPages());
  }

  protected onSizeChange(event: { option: SelectFormfieldOption }): void {
    if (this.interactionsDisabled()) {
      return;
    }

    const pageSize = Number(event.option.id);

    if (!Number.isFinite(pageSize) || pageSize <= 0 || pageSize === this.normalizedPageSize()) {
      return;
    }

    this.emitChange({ page: 1, pageSize: Math.floor(pageSize) });
  }

  private emitPageChange(page: number): void {
    if (this.interactionsDisabled()) {
      return;
    }

    const normalizedPage = this.normalizePage(page);

    if (
      this.totalPages() === 0 ||
      normalizedPage === this.currentPage() ||
      normalizedPage < 1 ||
      normalizedPage > this.totalPages()
    ) {
      return;
    }

    this.emitChange({ page: normalizedPage, pageSize: this.normalizedPageSize() });
  }

  private emitChange(change: AqPaginationChange): void {
    this.paginationChange.emit(change);
    this.pageChange.emit({ pageIndex: change.page - 1, pageSize: change.pageSize });
  }

  private normalizePage(page: number): number {
    const totalPages = this.totalPages();

    if (totalPages === 0) {
      return 0;
    }

    if (!Number.isFinite(page)) {
      return 1;
    }

    return Math.min(Math.max(1, Math.floor(page)), totalPages);
  }
}
