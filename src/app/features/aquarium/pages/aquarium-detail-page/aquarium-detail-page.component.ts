import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, startWith } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { DatepickerFormfieldComponent } from '../../../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';
import { SearchFormfieldComponent } from '../../../../shared/components/formfields/search-formfield/search-formfield.component';
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
import {
  AquariumDetailAquaticLife,
  AquariumDetailApplication,
  AquariumDetailLoadStatus,
  AquariumDetailMeasurement,
  AquariumDetailParameter,
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

const todayInputDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

@Component({
  selector: 'app-aquarium-detail-page',
  standalone: true,
  imports: [
    AqTableCellDirective,
    AqTableComponent,
    BadgeComponent,
    ButtonComponent,
    DatepickerFormfieldComponent,
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
export class AquariumDetailPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageTitleService = inject(PageTitleService);
  private readonly modalService = inject(ModalService);
  private readonly feedbackMessageService = inject(FeedbackMessageService);
  private readonly aquariumDetailDataService = inject(AquariumDetailDataService);

  protected readonly status = signal<AquariumDetailLoadStatus>('loading');
  protected readonly detail = signal<AquariumDetailViewModel | null>(null);
  protected readonly activeTabId = signal<AquariumDetailTabId>('overview');
  protected readonly measurementSort = signal<AqTableSort | null>(null);
  private readonly toolbarContentTemplate = viewChild<TemplateRef<unknown>>('toolbarContent');

  protected readonly filtersForm = new FormGroup({
    date: new FormControl('', { nonNullable: true }),
    parameter: new FormControl<string[]>([], { nonNullable: true }),
    status: new FormControl<string[]>([], { nonNullable: true }),
  });
  private readonly filtersValue = toSignal(
    this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.getRawValue())),
    { initialValue: this.filtersForm.getRawValue() },
  );
  protected readonly hasMeasurementFilters = computed(() => {
    const filters = this.filtersValue();

    return Boolean(filters.date || filters.parameter?.length || filters.status?.length);
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
    date: new FormControl(todayInputDate(), { nonNullable: true }),
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
    { key: 'status', header: 'Status', sortable: true, minWidth: '8rem', priority: 'secondary' },
    { key: 'trend', header: 'Tendência', minWidth: '8rem', priority: 'secondary' },
  ];
  protected readonly applicationColumns: readonly AqTableColumn<AquariumDetailApplication>[] = [
    { key: 'date', header: 'Data', minWidth: '11rem', priority: 'primary' },
    { key: 'productName', header: 'Produto', property: 'productName', minWidth: '11rem' },
    { key: 'productType', header: 'Tipo', property: 'productType', minWidth: '12rem' },
    { key: 'doseLabel', header: 'Dose', property: 'doseLabel', minWidth: '8rem' },
    {
      key: 'notes',
      header: 'Observações',
      property: 'notes',
      minWidth: '14rem',
      priority: 'secondary',
    },
  ];
  protected readonly aquaticLifeColumns: readonly AqTableColumn<AquariumDetailAquaticLife>[] = [
    { key: 'name', header: 'Nome', property: 'name', minWidth: '12rem', priority: 'primary' },
    {
      key: 'scientificName',
      header: 'Nome científico',
      property: 'scientificName',
      minWidth: '14rem',
    },
    { key: 'typeLabel', header: 'Tipo', property: 'typeLabel', minWidth: '10rem' },
    {
      key: 'quantityLabel',
      header: 'Quantidade',
      property: 'quantityLabel',
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
    (this.detail()?.parameters ?? []).map((parameter) => ({
      id: parameter.key,
      title: parameter.shortLabel,
      subtitle: parameter.label,
      icon: parameter.icon,
    })),
  );
  protected readonly statusOptions = computed<SelectFormfieldOption[]>(() => {
    const measurements = this.detail()?.measurements ?? [];
    const labels = Array.from(new Set(measurements.map((measurement) => measurement.statusLabel)));

    return labels.map((label) => ({
      id: label,
      title: label,
      icon: 'verified',
    }));
  });
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
    const detail = this.detail();
    const filters = this.filtersValue();

    if (!detail) {
      return [];
    }

    const filtered = detail.measurements.filter((measurement) => {
      const matchesDate = filters.date ? measurement.measuredAt.startsWith(filters.date) : true;
      const matchesParameter = filters.parameter?.length
        ? filters.parameter.includes(measurement.parameterKey)
        : true;
      const matchesStatus = filters.status?.length
        ? filters.status.includes(measurement.statusLabel)
        : true;

      return matchesDate && matchesParameter && matchesStatus;
    });

    return this.sortMeasurements(filtered, this.measurementSort());
  });

  protected readonly applicationsCaption = computed(() => {
    const count = this.filteredApplications().length;
    return count === 1 ? '1 aplicação registrada' : `${count} aplicações registradas`;
  });
  protected readonly aquaticLifeCaption = computed(() => {
    const count = this.filteredAquaticLife().length;
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
    const detail = this.detail();
    const filters = this.applicationFiltersValue();

    if (!detail) {
      return [];
    }

    const productName = this.normalizeFilterText(filters.productName);

    return detail.applications.filter((application) => {
      const matchesDate = filters.date ? application.appliedAt.startsWith(filters.date) : true;
      const matchesProductName = productName
        ? this.normalizeFilterText(application.productName).includes(productName)
        : true;
      const matchesType = filters.type ? application.productType === filters.type : true;

      return matchesDate && matchesProductName && matchesType;
    });
  });
  protected readonly recentApplications = computed(
    () => this.detail()?.applications.slice(0, 5) ?? [],
  );
  protected readonly recentParameters = computed(() => {
    const detail = this.detail();

    if (!detail) {
      return [];
    }

    const parametersByKey = new Map(
      detail.parameters.map((parameter) => [parameter.key, parameter] as const),
    );
    const recentKeys = Array.from(
      new Set(
        [...detail.measurements]
          .sort((left, right) => right.measuredAt.localeCompare(left.measuredAt))
          .map((measurement) => measurement.parameterKey.toLocaleLowerCase('en-US')),
      ),
    ).slice(0, 6);

    return recentKeys
      .map((key) => parametersByKey.get(key))
      .filter((parameter): parameter is AquariumDetailParameter => Boolean(parameter));
  });
  protected readonly parameterAlerts = computed(() => {
    const detail = this.detail();

    if (!detail) {
      return [];
    }

    const latestMeasurementsByParameter = new Map<string, AquariumDetailMeasurement>();

    [...detail.measurements]
      .sort((left, right) => right.measuredAt.localeCompare(left.measuredAt))
      .forEach((measurement) => {
        const key = measurement.parameterKey.toLocaleLowerCase('en-US');

        if (!latestMeasurementsByParameter.has(key)) {
          latestMeasurementsByParameter.set(key, measurement);
        }
      });

    return Array.from(latestMeasurementsByParameter.values()).filter(
      (measurement) => measurement.statusColor !== 'success',
    );
  });
  protected readonly filteredMeasurementsCaption = computed(() => {
    const count = this.filteredMeasurements().length;
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

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.loadAquarium(params.get('uuid'));
    });
  }

  ngAfterViewInit(): void {
    this.pageTitleService.setToolbarContent(this.toolbarContentTemplate() ?? null);
  }

  ngOnDestroy(): void {
    this.pageTitleService.setToolbarContent(null);
  }

  protected onTabChange(tabId: string): void {
    if (!this.isTabId(tabId)) {
      return;
    }

    this.activeTabId.set(tabId);
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
      status: [],
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
        parameters: detail.parameters,
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
  }

  private readonly addMeasurement = (payload: NewAquariumMeasurementPayload): Observable<void> => {
    const detail = this.detail();

    if (!detail) {
      return of(void 0);
    }

    const parameter = detail.parameters.find((item) => item.key === payload.parameterKey);

    if (!parameter) {
      return of(void 0);
    }

    const measuredAt = `${payload.date}T${payload.time}:00`;
    const measurement = this.buildMeasurement(parameter, payload.value, measuredAt);
    const updatedParameters = detail.parameters.map((item) =>
      item.key === parameter.key
        ? {
            ...item,
            value: payload.value,
            valueLabel: this.formatValue(payload.value, item.unit),
          }
        : item,
    );

    this.detail.set({
      ...detail,
      parameters: updatedParameters,
      measurements: [measurement, ...detail.measurements],
    });
    this.feedbackMessageService.showSuccess('Medição adicionada com sucesso.', {
      hasIcon: true,
      horizontalPosition: 'top',
      verticalPosition: 'end',
    });

    return of(void 0);
  };

  private loadAquarium(aquariumId: string | null): void {
    if (!aquariumId || !this.isValidAquariumId(aquariumId)) {
      this.detail.set(null);
      this.status.set('invalid-id');
      return;
    }

    this.status.set('loading');
    this.detail.set(null);

    this.aquariumDetailDataService
      .getAquariumDetail(aquariumId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.detail.set(detail);
          this.status.set(detail ? 'ready' : 'not-found');
        },
        error: () => {
          this.detail.set(null);
          this.status.set('error');
        },
      });
  }

  private buildMeasurement(
    parameter: AquariumDetailParameter,
    value: number,
    measuredAt: string,
  ): AquariumDetailMeasurement {
    const measuredDate = new Date(measuredAt);

    return {
      id: `local-${Date.now()}`,
      measuredAt,
      dateLabel: measuredDate.toLocaleDateString('pt-BR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      timeLabel: measuredDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      parameterKey: parameter.key,
      parameterLabel: parameter.shortLabel,
      value,
      unit: parameter.unit,
      valueLabel: this.formatValue(value, parameter.unit),
      statusLabel: 'Normal',
      statusColor: 'success',
      trend: 'unknown',
      trendIcon: 'remove',
      trendLabel: 'Sem dados suficientes',
    };
  }

  private formatValue(value: number, unit: string): string {
    const formatted = Number.isInteger(value) ? String(value) : value.toFixed(1);

    if (!unit) {
      return formatted;
    }

    return unit === '°C' ? `${formatted} ${unit}` : `${formatted} ${unit}`;
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

  private sortMeasurements(
    measurements: readonly AquariumDetailMeasurement[],
    sort: AqTableSort | null,
  ): readonly AquariumDetailMeasurement[] {
    if (!sort) {
      return measurements;
    }

    const direction = sort.direction === 'asc' ? 1 : -1;

    return [...measurements].sort((left, right) => {
      const leftValue = this.getMeasurementSortValue(left, sort.key);
      const rightValue = this.getMeasurementSortValue(right, sort.key);

      return leftValue.localeCompare(rightValue, 'pt-BR', { numeric: true }) * direction;
    });
  }

  private getMeasurementSortValue(measurement: AquariumDetailMeasurement, key: string): string {
    const values: Record<string, string> = {
      date: measurement.measuredAt,
      parameter: measurement.parameterLabel,
      value: String(measurement.value),
      status: measurement.statusLabel,
    };

    return values[key] ?? '';
  }

  private isTabId(value: string | null): value is AquariumDetailTabId {
    return TAB_IDS.includes(value as AquariumDetailTabId);
  }

  private isValidAquariumId(value: string): boolean {
    return /^[a-zA-Z0-9_-]{2,80}$/.test(value);
  }
}
