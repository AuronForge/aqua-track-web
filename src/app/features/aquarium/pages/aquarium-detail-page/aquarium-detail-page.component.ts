import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, Observable, debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FilterBarComponent } from '../../../../shared/components/filter-bar';
import {
  DatepickerRangeDirective,
  DatepickerRangeValue,
} from '../../../../shared/components/formfields/datepicker-formfield/datepicker-range.directive';
import { DatepickerFormfieldComponent } from '../../../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';
import { SearchFormfieldComponent } from '../../../../shared/components/formfields/search-formfield/search-formfield.component';
import { PaginatorChange } from '../../../../shared/components/paginator/paginator-change.model';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { SelectFormfieldOption } from '../../../../shared/components/formfields/select-formfield/select-formfield-option.model';
import { SelectFormfieldComponent } from '../../../../shared/components/formfields/select-formfield/select-formfield.component';
import {
  AqTableCellDirective,
  AqTableColumn,
  AqTableComponent,
  AqTableSort,
} from '../../../../shared/components/table';
import { TabComponent, TabsComponent } from '../../../../shared/components/tabs';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AddMeasurementModalComponent } from '../../components/add-measurement-modal/add-measurement-modal.component';
import { AquariumAquaticLifeQuery } from '../../models/aquarium-api.dto';
import { ApplicationQuery, MeasurementQuery } from '../../models/aquarium-operational-api.dto';
import {
  AquariumDetailAquaticLife,
  AquariumDetailApplication,
  AquariumDetailLoadStatus,
  AquariumDetailMeasurement,
  AquariumResourceStatus,
  AquariumDetailTabId,
  AquariumDetailViewModel,
  NewAquariumMeasurementPayload,
} from '../../models/aquarium-detail.model';
import { AquariumDetailDataService } from '../../services/aquarium-detail-data.service';

const TAB_IDS: readonly AquariumDetailTabId[] = [
  'overview',
  'measurements',
  'applications',
  'aquatic-life',
];

type DateFilterValue = string | DatepickerRangeValue;

@Component({
  selector: 'app-aquarium-detail-page',
  standalone: true,
  imports: [
    AqTableCellDirective,
    AqTableComponent,
    BadgeComponent,
    ButtonComponent,
    DatepickerRangeDirective,
    DatepickerFormfieldComponent,
    FilterBarComponent,
    PaginatorComponent,
    ReactiveFormsModule,
    RouterLink,
    SearchFormfieldComponent,
    SelectFormfieldComponent,
    TabComponent,
    TabsComponent,
  ],
  templateUrl: './aquarium-detail-page.component.html',
  styleUrl: './aquarium-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageTitleService = inject(PageTitleService);
  private readonly feedbackMessageService = inject(FeedbackMessageService);
  private readonly modalService = inject(ModalService);
  private readonly aquariumDetailDataService = inject(AquariumDetailDataService);

  protected readonly status = signal<AquariumDetailLoadStatus>('loading');
  protected readonly overviewStatus = signal<AquariumResourceStatus>('idle');
  protected readonly measurementsStatus = signal<AquariumResourceStatus>('idle');
  protected readonly applicationsStatus = signal<AquariumResourceStatus>('idle');
  protected readonly aquaticLifeStatus = signal<AquariumResourceStatus>('idle');
  protected readonly detail = signal<AquariumDetailViewModel | null>(null);
  protected readonly activeTabId = signal<AquariumDetailTabId>('overview');
  protected readonly measurementSort = signal<AqTableSort | null>(null);
  protected readonly applicationSort = signal<AqTableSort | null>(null);
  protected readonly aquaticLifeSort = signal<AqTableSort | null>(null);
  protected readonly measurementsPageIndex = signal(0);
  protected readonly measurementsPageSize = signal(10);
  protected readonly applicationsPageIndex = signal(0);
  protected readonly applicationsPageSize = signal(10);
  protected readonly aquaticLifePageIndex = signal(0);
  protected readonly aquaticLifePageSize = signal(10);
  private readonly loadedMeasurements = signal(false);
  private readonly loadedApplications = signal(false);
  private readonly loadedAquaticLife = signal(false);

  protected readonly filtersForm = new FormGroup({
    date: new FormControl<DateFilterValue>('', { nonNullable: true }),
    parameter: new FormControl<string[]>([], { nonNullable: true }),
  });
  private readonly filtersValue = toSignal(
    this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.getRawValue())),
    { initialValue: this.filtersForm.getRawValue() },
  );
  protected readonly hasMeasurementFilters = computed(() => {
    const filters = this.filtersValue();

    return Boolean(filters.date || filters.parameter?.length);
  });
  protected readonly aquaticLifeFiltersForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    scientificName: new FormControl('', { nonNullable: true }),
    type: new FormControl<string | null>(null),
  });
  private readonly aquaticLifeFiltersValue = toSignal(
    this.aquaticLifeFiltersForm.valueChanges.pipe(
      startWith(this.aquaticLifeFiltersForm.getRawValue()),
    ),
    { initialValue: this.aquaticLifeFiltersForm.getRawValue() },
  );
  protected readonly hasAquaticLifeFilters = computed(() => {
    const filters = this.aquaticLifeFiltersValue();

    return Boolean(filters.name || filters.scientificName || filters.type);
  });
  protected readonly applicationFiltersForm = new FormGroup({
    date: new FormControl<DateFilterValue>('', { nonNullable: true }),
    productName: new FormControl('', { nonNullable: true }),
    type: new FormControl<string | null>(null),
  });
  private readonly applicationFiltersValue = toSignal(
    this.applicationFiltersForm.valueChanges.pipe(
      startWith(this.applicationFiltersForm.getRawValue()),
    ),
    { initialValue: this.applicationFiltersForm.getRawValue() },
  );
  protected readonly hasApplicationFilters = computed(() => {
    const filters = this.applicationFiltersValue();

    return Boolean(filters.date || filters.productName || filters.type);
  });

  protected readonly measurementColumns: readonly AqTableColumn<AquariumDetailMeasurement>[] = [
    { key: 'date', header: 'Data e hora', sortable: true, minWidth: '12rem', priority: 'primary' },
    {
      key: 'parameter',
      header: 'Parâmetro',
      sortable: true,
      minWidth: '10rem',
      priority: 'primary',
    },
    { key: 'value', header: 'Valor', sortable: true, minWidth: '8rem', priority: 'primary' },
    { key: 'trend', header: 'Tendência', minWidth: '8rem', priority: 'secondary' },
  ];
  protected readonly applicationColumns: readonly AqTableColumn<AquariumDetailApplication>[] = [
    { key: 'date', header: 'Data', sortable: true, minWidth: '11rem', priority: 'primary' },
    {
      key: 'productName',
      header: 'Produto',
      property: 'productName',
      sortable: true,
      minWidth: '11rem',
    },
    {
      key: 'productType',
      header: 'Tipo',
      property: 'productType',
      sortable: true,
      minWidth: '12rem',
    },
    {
      key: 'doseLabel',
      header: 'Dose',
      property: 'doseLabel',
      sortable: true,
      minWidth: '8rem',
    },
    {
      key: 'notes',
      header: 'Observações',
      property: 'notes',
      minWidth: '14rem',
      priority: 'secondary',
    },
  ];
  protected readonly aquaticLifeColumns: readonly AqTableColumn<AquariumDetailAquaticLife>[] = [
    {
      key: 'name',
      header: 'Nome',
      property: 'name',
      sortable: true,
      minWidth: '12rem',
      priority: 'primary',
    },
    {
      key: 'scientificName',
      header: 'Nome científico',
      property: 'scientificName',
      minWidth: '14rem',
    },
    {
      key: 'typeLabel',
      header: 'Tipo',
      property: 'typeLabel',
      sortable: true,
      minWidth: '10rem',
    },
    {
      key: 'introducedAt',
      header: 'Introdução',
      sortable: true,
      minWidth: '11rem',
    },
    {
      key: 'quantityLabel',
      header: 'Quantidade',
      property: 'quantityLabel',
      sortable: true,
      minWidth: '10rem',
      priority: 'primary',
    },
    {
      key: 'notes',
      header: 'Observações',
      property: 'notes',
      minWidth: '14rem',
      priority: 'secondary',
    },
  ];

  protected readonly parameterOptions = computed<SelectFormfieldOption[]>(() =>
    (this.detail()?.waterParameters ?? []).map((parameter) => ({
      id: parameter.key,
      title: parameter.name,
      subtitle: parameter.defaultUnit ? `Unidade: ${parameter.defaultUnit}` : undefined,
      icon: 'science',
    })),
  );
  protected readonly aquaticLifeTypeOptions = computed<SelectFormfieldOption[]>(() => {
    const types = Array.from(
      new Set((this.detail()?.aquaticLife ?? []).map((life) => life.typeLabel)),
    );

    return types.map((type) => ({
      id: type,
      title: type,
      icon: this.getAquaticLifeTypeIcon(type),
    }));
  });
  protected readonly applicationTypeOptions = computed<SelectFormfieldOption[]>(() => {
    const types = Array.from(
      new Set((this.detail()?.applications ?? []).map((application) => application.productType)),
    );

    return types.map((type) => ({
      id: type,
      title: type,
      icon: 'category',
    }));
  });

  protected readonly filteredMeasurements = computed(() => {
    return this.detail()?.measurements ?? [];
  });

  protected readonly applicationsCaption = computed(() => {
    const count = this.detail()?.applicationsPagination.totalItems ?? 0;
    return count === 1 ? '1 aplicação registrada' : `${count} aplicações registradas`;
  });
  protected readonly aquaticLifeCaption = computed(() => {
    const count = this.detail()?.aquaticLifePagination.totalItems ?? 0;
    return count === 1 ? '1 item registrado' : `${count} itens registrados`;
  });
  protected readonly filteredAquaticLife = computed(() => {
    const detail = this.detail();
    const filters = this.aquaticLifeFiltersValue();

    if (!detail) {
      return [];
    }

    const name = this.normalizeFilterText(filters.name);
    const scientificName = this.normalizeFilterText(filters.scientificName);

    return detail.aquaticLife.filter((life) => {
      const matchesName = name ? this.normalizeFilterText(life.name).includes(name) : true;
      const matchesScientificName = scientificName
        ? this.normalizeFilterText(life.scientificName).includes(scientificName)
        : true;
      const matchesType = filters.type ? life.typeLabel === filters.type : true;

      return matchesName && matchesScientificName && matchesType;
    });
  });
  protected readonly filteredApplications = computed(() => {
    return this.detail()?.applications ?? [];
  });
  protected readonly recentApplications = computed(
    () => this.detail()?.applications.slice(0, 5) ?? [],
  );
  protected readonly recentParameters = computed(() => this.detail()?.parameters ?? []);
  protected readonly parameterAlerts = computed(() => {
    const detail = this.detail();

    if (!detail) {
      return [];
    }

    return detail.parameters.filter(
      (parameter) => parameter.statusColor === 'warning' || parameter.statusColor === 'error',
    );
  });
  protected readonly filteredMeasurementsCaption = computed(() => {
    const count = this.detail()?.measurementsPagination.totalItems ?? 0;
    return count === 1 ? '1 medição exibida' : `${count} medições exibidas`;
  });

  constructor() {
    this.pageTitleService.set('');
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams) => {
      const tab = queryParams.get('tab');

      if (this.isTabId(tab)) {
        this.activeTabId.set(tab);
      }
    });

    this.route.paramMap
      .pipe(
        map((params) => params.get('uuid')),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((aquariumId) => {
        this.loadAquarium(aquariumId);
      });

    this.filtersForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.loadedMeasurements()) {
          return;
        }

        this.measurementsPageIndex.set(0);
        this.loadMeasurements();
      });

    this.applicationFiltersForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.loadedApplications()) {
          return;
        }

        this.applicationsPageIndex.set(0);
        this.loadApplications();
      });
  }

  protected onTabChange(tabId: string): void {
    if (!this.isTabId(tabId)) {
      return;
    }

    this.activeTabId.set(tabId);
    this.ensureTabData(tabId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected retry(): void {
    this.loadAquarium(this.route.snapshot.paramMap.get('uuid'));
  }

  protected onBack(event: MouseEvent): void {
    event.preventDefault();
    this.location.back();
  }

  protected clearMeasurementFilters(): void {
    this.filtersForm.reset({
      date: '',
      parameter: [],
    });
  }

  protected clearAquaticLifeFilters(): void {
    this.aquaticLifeFiltersForm.reset({
      name: '',
      scientificName: '',
      type: null,
    });
  }

  protected clearApplicationFilters(): void {
    this.applicationFiltersForm.reset({
      date: '',
      productName: '',
      type: null,
    });
  }

  protected openAddMeasurementModal(): void {
    const detail = this.detail();

    if (!detail) {
      return;
    }

    this.modalService.open({
      size: 'medium',
      closeOnBackdropClick: false,
      closeOnEscape: true,
      contentComponent: AddMeasurementModalComponent,
      contentComponentInputs: {
        parameters: detail.waterParameters,
        submitMeasurement: this.addMeasurement,
      },
    });
  }

  protected notifyEditUnavailable(): void {
    this.feedbackMessageService.showInformation(
      'O fluxo de edição do aquário ainda não está disponível.',
      {
        hasIcon: true,
        horizontalPosition: 'top',
        verticalPosition: 'end',
      },
    );
  }

  protected notifyAquaticLifeCreateUnavailable(): void {
    this.feedbackMessageService.showInformation(
      'O cadastro de animais e plantas ainda não está disponível.',
      {
        hasIcon: true,
        horizontalPosition: 'top',
        verticalPosition: 'end',
      },
    );
  }

  protected onMeasurementSortChange(sort: AqTableSort | null): void {
    this.measurementSort.set(sort);
    this.measurementsPageIndex.set(0);
    this.loadMeasurements();
  }

  protected onApplicationSortChange(sort: AqTableSort | null): void {
    this.applicationSort.set(sort);
    this.applicationsPageIndex.set(0);
    this.loadApplications();
  }

  protected onAquaticLifeSortChange(sort: AqTableSort | null): void {
    this.aquaticLifeSort.set(sort);
    this.aquaticLifePageIndex.set(0);
    this.loadAquaticLife();
  }

  protected onMeasurementsPageChange(change: PaginatorChange): void {
    this.measurementsPageIndex.set(change.pageIndex);
    this.measurementsPageSize.set(change.pageSize);
    this.loadMeasurements();
  }

  protected onApplicationsPageChange(change: PaginatorChange): void {
    this.applicationsPageIndex.set(change.pageIndex);
    this.applicationsPageSize.set(change.pageSize);
    this.loadApplications();
  }

  protected onAquaticLifePageChange(change: PaginatorChange): void {
    this.aquaticLifePageIndex.set(change.pageIndex);
    this.aquaticLifePageSize.set(change.pageSize);
    this.loadAquaticLife();
  }

  private readonly addMeasurement = (payload: NewAquariumMeasurementPayload): Observable<void> => {
    const detail = this.detail();

    if (!detail) {
      return EMPTY;
    }

    return this.aquariumDetailDataService
      .createAquariumMeasurement(detail.id, {
        waterParameter: payload.parameterKey,
        value: payload.value,
        measuredAt: this.combineDateAndTime(payload.date, payload.time),
        notes: payload.notes,
      })
      .pipe(
        tap(() => {
          this.feedbackMessageService.showSuccess('Medição adicionada com sucesso.', {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
          this.refreshOverview();

          if (this.loadedMeasurements()) {
            this.loadMeasurements();
          }
        }),
      );
  };

  private loadAquarium(aquariumId: string | null): void {
    if (!aquariumId || !this.isValidAquariumId(aquariumId)) {
      this.detail.set(null);
      this.status.set('invalid-id');
      return;
    }

    this.status.set('loading');
    this.overviewStatus.set('loading');
    this.measurementsStatus.set('idle');
    this.applicationsStatus.set('idle');
    this.aquaticLifeStatus.set('idle');
    this.loadedMeasurements.set(false);
    this.loadedApplications.set(false);
    this.loadedAquaticLife.set(false);
    this.detail.set(null);

    this.aquariumDetailDataService
      .getAquariumDetail(aquariumId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.detail.set(detail);
          this.status.set(detail ? 'ready' : 'not-found');
          this.overviewStatus.set(detail ? 'ready' : 'idle');

          if (detail) {
            this.ensureTabData(this.activeTabId());

            if (this.activeTabId() !== 'applications') {
              this.loadRecentApplications();
            }
          }
        },
        error: () => {
          this.detail.set(null);
          this.status.set('error');
          this.overviewStatus.set('error');
        },
      });
  }

  private ensureTabData(tabId: AquariumDetailTabId): void {
    if (tabId === 'measurements' && !this.loadedMeasurements()) {
      this.loadMeasurements();
    }

    if (tabId === 'applications' && !this.loadedApplications()) {
      this.loadApplications();
    }

    if (tabId === 'aquatic-life' && !this.loadedAquaticLife()) {
      this.loadAquaticLife();
    }
  }

  private loadAquaticLife(): void {
    const detail = this.detail();

    if (!detail) {
      return;
    }

    this.loadedAquaticLife.set(true);
    this.aquaticLifeStatus.set('loading');
    this.aquariumDetailDataService
      .listAquariumAquaticLife(detail.id, this.buildAquaticLifeQuery())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ aquaticLife, pagination }) => {
          this.detail.update((current) =>
            current ? { ...current, aquaticLife, aquaticLifePagination: pagination } : current,
          );
          this.aquaticLifeStatus.set('ready');
        },
        error: () => {
          this.loadedAquaticLife.set(false);
          this.aquaticLifeStatus.set('error');
        },
      });
  }

  private refreshOverview(): void {
    const detail = this.detail();

    if (!detail) {
      return;
    }

    this.overviewStatus.set('loading');
    this.aquariumDetailDataService
      .getAquariumOverview(detail.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (overview) => {
          this.detail.update((current) =>
            current
              ? {
                  ...current,
                  summary: {
                    ...current.summary,
                    healthPercent: overview.summary.healthPercent,
                    healthScoreLabel: overview.summary.healthScoreLabel,
                    healthStatus: overview.summary.healthStatus,
                    healthStatusLabel: overview.summary.healthStatusLabel,
                    healthStatusColor: overview.summary.healthStatusColor,
                  },
                  parameters: overview.parameters,
                }
              : current,
          );
          this.overviewStatus.set('ready');
        },
        error: () => {
          this.overviewStatus.set('error');
        },
      });
  }

  private loadMeasurements(): void {
    const detail = this.detail();

    if (!detail) {
      return;
    }

    this.measurementsStatus.set('loading');
    this.loadedMeasurements.set(true);
    this.aquariumDetailDataService
      .listAquariumMeasurements(detail.id, this.buildMeasurementQuery(), detail.waterParameters)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ measurements, pagination }) => {
          this.detail.update((current) =>
            current ? { ...current, measurements, measurementsPagination: pagination } : current,
          );
          this.measurementsStatus.set('ready');
        },
        error: () => {
          this.measurementsStatus.set('error');
        },
      });
  }

  private loadRecentApplications(): void {
    const detail = this.detail();

    if (!detail) {
      return;
    }

    this.aquariumDetailDataService
      .listAquariumApplications(detail.id, {
        page: 1,
        pageSize: 5,
        sort: 'appliedAt',
        direction: 'desc',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ applications, pagination }) => {
          this.detail.update((current) =>
            current ? { ...current, applications, applicationsPagination: pagination } : current,
          );
        },
        error: () => {
          // Aplicações recentes não devem bloquear o carregamento cadastral do aquário.
        },
      });
  }

  private loadApplications(): void {
    const detail = this.detail();

    if (!detail) {
      return;
    }

    this.applicationsStatus.set('loading');
    this.loadedApplications.set(true);
    this.aquariumDetailDataService
      .listAquariumApplications(detail.id, this.buildApplicationQuery())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ applications, pagination }) => {
          this.detail.update((current) =>
            current ? { ...current, applications, applicationsPagination: pagination } : current,
          );
          this.applicationsStatus.set('ready');
        },
        error: () => {
          this.applicationsStatus.set('error');
        },
      });
  }

  private buildMeasurementQuery(): MeasurementQuery {
    const filters = this.filtersForm.getRawValue();
    const dateRange = this.toDateQuery(filters.date);
    const sort = this.measurementSort();

    return {
      page: this.measurementsPageIndex() + 1,
      pageSize: this.measurementsPageSize(),
      parameter: filters.parameter[0],
      ...dateRange,
      sort: this.mapMeasurementSortKey(sort?.key),
      direction: sort?.direction ?? 'desc',
    };
  }

  private buildApplicationQuery(): ApplicationQuery {
    const filters = this.applicationFiltersForm.getRawValue();
    const dateRange = this.toDateQuery(filters.date);
    const sort = this.applicationSort();

    return {
      page: this.applicationsPageIndex() + 1,
      pageSize: this.applicationsPageSize(),
      product: filters.productName || undefined,
      type: filters.type || undefined,
      ...dateRange,
      sort: this.mapApplicationSortKey(sort?.key),
      direction: sort?.direction ?? 'desc',
    };
  }

  private buildAquaticLifeQuery(): AquariumAquaticLifeQuery {
    const sort = this.aquaticLifeSort();

    return {
      page: this.aquaticLifePageIndex() + 1,
      pageSize: this.aquaticLifePageSize(),
      sort: this.mapAquaticLifeSortKey(sort?.key),
      direction: sort?.direction ?? 'desc',
    };
  }

  private toDateQuery(filter: DateFilterValue | null | undefined): {
    startDate?: string;
    endDate?: string;
  } {
    if (!filter) {
      return {};
    }

    if (typeof filter === 'string') {
      return {
        startDate: this.startOfLocalDayIso(filter),
        endDate: this.endOfLocalDayIso(filter),
      };
    }

    return {
      startDate: this.startOfLocalDayIso(filter.start),
      endDate: this.endOfLocalDayIso(filter.end),
    };
  }

  private combineDateAndTime(date: string, time: string): string {
    return new Date(`${date}T${time}:00`).toISOString();
  }

  private startOfLocalDayIso(date: string): string {
    return new Date(`${date}T00:00:00.000`).toISOString();
  }

  private endOfLocalDayIso(date: string): string {
    return new Date(`${date}T23:59:59.999`).toISOString();
  }

  private mapMeasurementSortKey(key: string | undefined): MeasurementQuery['sort'] {
    const map: Record<string, MeasurementQuery['sort']> = {
      date: 'measuredAt',
      parameter: 'parameter',
      value: 'value',
    };

    return key ? map[key] : 'measuredAt';
  }

  private mapApplicationSortKey(key: string | undefined): ApplicationQuery['sort'] {
    const map: Record<string, ApplicationQuery['sort']> = {
      date: 'appliedAt',
      productName: 'productName',
      productType: 'productType',
      doseLabel: 'amount',
    };

    return key ? map[key] : 'appliedAt';
  }

  private mapAquaticLifeSortKey(key: string | undefined): AquariumAquaticLifeQuery['sort'] {
    const map: Record<string, AquariumAquaticLifeQuery['sort']> = {
      name: 'commonName',
      typeLabel: 'category',
      introducedAt: 'introducedAt',
      quantityLabel: 'quantity',
    };

    return key ? map[key] : 'appliedAt';
  }

  private normalizeFilterText(value: string | null | undefined): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase('pt-BR');
  }

  private getAquaticLifeTypeIcon(type: string): string {
    const normalizedType = this.normalizeFilterText(type);

    if (normalizedType.includes('planta')) {
      return 'local_florist';
    }

    if (normalizedType.includes('invertebrado')) {
      return 'pets';
    }

    return 'set_meal';
  }

  private isTabId(value: string | null): value is AquariumDetailTabId {
    return TAB_IDS.includes(value as AquariumDetailTabId);
  }

  private isValidAquariumId(value: string): boolean {
    return /^[a-zA-Z0-9_-]{2,80}$/.test(value);
  }
}
