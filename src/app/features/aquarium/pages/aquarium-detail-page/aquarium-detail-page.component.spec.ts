import { Location } from '@angular/common';
import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { ModalService } from '../../../../shared/services/modal.service';
import {
  AquariumDetailApplication,
  AquariumDetailMeasurement,
  AquariumDetailViewModel,
} from '../../models/aquarium-detail.model';
import { AquariumDetailDataService } from '../../services/aquarium-detail-data.service';
import { AquariumDetailPageComponent } from './aquarium-detail-page.component';

const pagination = { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 };

const detail: AquariumDetailViewModel = {
  id: 'aq-1',
  name: 'Community Tank',
  typeLabel: 'Aquário comunitário',
  waterTypeLabel: 'Água doce',
  volumeLabel: '75L',
  setupDateLabel: '15 de jan. de 2024',
  statusLabel: 'Ativo',
  statusColor: 'success',
  heroImageUrl: null,
  heroAlt: 'Foto do aquário Community Tank',
  summary: {
    capacityLabel: 'Capacidade total: 75 litros',
    setupDateLabel: '15 de jan. de 2024',
    healthPercent: null,
    healthScoreLabel: 'Sem dados',
    healthStatus: 'unknown',
    healthStatusLabel: 'Sem dados',
    healthStatusColor: 'tertiary',
  },
  waterParameters: [
    { id: 'wp-1', key: 'ph', name: 'pH', category: 'CHEMICAL', defaultUnit: '' },
    { id: 'wp-2', key: 'nitrate', name: 'Nitrato', category: 'CHEMICAL', defaultUnit: 'mg/L' },
  ],
  parameters: [
    {
      key: 'ph',
      label: 'pH',
      shortLabel: 'pH',
      icon: 'science',
      value: 7.2,
      valueLabel: '7.2',
      unit: '',
      tone: 'primary',
      measuredAt: '2026-08-10T12:00:00.000Z',
      statusLabel: 'Normal',
      statusColor: 'success',
      trend: 'stable',
      trendIcon: 'trending_flat',
      trendLabel: 'Estável',
    },
    {
      key: 'nitrate',
      label: 'Nitrato',
      shortLabel: 'NO3',
      icon: 'water_drop',
      value: 16,
      valueLabel: '16 mg/L',
      unit: 'mg/L',
      tone: 'warning',
      measuredAt: '2026-08-10T12:00:00.000Z',
      statusLabel: 'Acima',
      statusColor: 'warning',
      trend: 'up',
      trendIcon: 'trending_up',
      trendLabel: 'Aumentando',
    },
  ],
  measurements: [],
  measurementsPagination: pagination,
  applications: [],
  applicationsPagination: pagination,
  aquaticLife: [],
};

const measurements: readonly AquariumDetailMeasurement[] = [
  {
    id: 'm-1',
    measuredAt: '2026-08-10T12:00:00.000Z',
    dateLabel: '10 de ago. de 2026',
    timeLabel: '09:00',
    parameterKey: 'ph',
    parameterLabel: 'pH',
    value: 7.2,
    unit: '',
    valueLabel: '7.2',
    statusLabel: 'Normal',
    statusColor: 'success',
    trend: 'stable',
    trendIcon: 'trending_flat',
    trendLabel: 'Estável',
  },
];

const applications: readonly AquariumDetailApplication[] = [
  {
    id: 'app-1',
    appliedAt: '2026-08-10T12:00:00.000Z',
    dateLabel: '10 de ago. de 2026',
    productName: 'Prime',
    productType: 'Condicionador',
    doseLabel: '5 ml',
    notes: '',
  },
];

const aquaticLife = [
  {
    id: 'life-1',
    name: 'Neon',
    scientificName: 'Paracheirodon innesi',
    typeLabel: 'Peixe',
    quantityLabel: '8 unidades',
    notes: '',
  },
  {
    id: 'life-2',
    name: 'Anubia',
    scientificName: 'Anubias barteri',
    typeLabel: 'Planta',
    quantityLabel: '2 unidades',
    notes: '',
  },
  {
    id: 'life-3',
    name: 'Camarão',
    scientificName: 'Neocaridina davidi',
    typeLabel: 'Invertebrado',
    quantityLabel: '12 unidades',
    notes: '',
  },
];

const buildLanguageServiceMock = () => ({
  selectedLanguage: signal<'pt'>('pt'),
  translation: computed(() => TRANSLATIONS.pt),
  setLanguage: jest.fn(),
});

async function createFixture({
  aquariumId = 'aq-1',
  tab = null,
  detailResult = of(detail),
}: {
  aquariumId?: string;
  tab?: string | null;
  detailResult?: Observable<AquariumDetailViewModel | null>;
} = {}): Promise<{
  fixture: ComponentFixture<AquariumDetailPageComponent>;
  detailService: {
    getAquariumDetail: jest.Mock;
    getAquariumOverview: jest.Mock;
    listAquariumMeasurements: jest.Mock;
    createAquariumMeasurement: jest.Mock;
    listAquariumApplications: jest.Mock;
  };
  modalService: { open: jest.Mock };
  feedbackMessageService: { showInformation: jest.Mock; showSuccess: jest.Mock };
  pageTitleService: { set: jest.Mock; setToolbarContent: jest.Mock };
  paramMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  router: Router;
}> {
  const paramMap = new BehaviorSubject(convertToParamMap({ uuid: aquariumId }));
  const queryParamMap = new BehaviorSubject(convertToParamMap(tab ? { tab } : {}));
  const detailService = {
    getAquariumDetail: jest.fn(() => detailResult),
    getAquariumOverview: jest.fn(() =>
      of({
        summary: {
          ...detail.summary,
          healthPercent: 92,
          healthScoreLabel: '92%',
          healthStatus: 'stable',
          healthStatusLabel: 'Estável',
          healthStatusColor: 'success',
        },
        parameters: detail.parameters,
      }),
    ),
    listAquariumMeasurements: jest.fn(() =>
      of({
        measurements,
        pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
      }),
    ),
    createAquariumMeasurement: jest.fn(() => of(void 0)),
    listAquariumApplications: jest.fn(() =>
      of({
        applications,
        pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
      }),
    ),
  };
  const modalService = { open: jest.fn() };
  const feedbackMessageService = {
    showInformation: jest.fn(),
    showSuccess: jest.fn(),
  };
  const pageTitleService = { set: jest.fn(), setToolbarContent: jest.fn() };

  await TestBed.configureTestingModule({
    imports: [AquariumDetailPageComponent],
    providers: [
      provideRouter([]),
      { provide: PageTitleService, useValue: pageTitleService },
      { provide: LanguageService, useValue: buildLanguageServiceMock() },
      { provide: AquariumDetailDataService, useValue: detailService },
      { provide: ModalService, useValue: modalService },
      { provide: FeedbackMessageService, useValue: feedbackMessageService },
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: paramMap.asObservable(),
          queryParamMap: queryParamMap.asObservable(),
          snapshot: { paramMap: paramMap.value },
        },
      },
    ],
  }).compileComponents();

  const router = TestBed.inject(Router);
  jest.spyOn(router, 'navigate').mockResolvedValue(true);
  const fixture = TestBed.createComponent(AquariumDetailPageComponent);
  fixture.detectChanges();

  return {
    fixture,
    detailService,
    modalService,
    feedbackMessageService,
    pageTitleService,
    paramMap,
    router,
  };
}

describe('AquariumDetailPageComponent', () => {
  afterEach(() => {
    jest.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('loads cadastral detail, overview values, and recent parameter cards', async () => {
    const { fixture, detailService, pageTitleService } = await createFixture();

    expect(detailService.getAquariumDetail).toHaveBeenCalledWith('aq-1');
    expect(fixture.nativeElement.textContent).toContain('Community Tank');
    expect(fixture.nativeElement.textContent).toContain('Ativo');
    expect(fixture.nativeElement.textContent).toContain('Saúde do aquário');
    expect(fixture.nativeElement.textContent).toContain('Sem dados');
    expect((fixture.nativeElement.textContent.match(/Sem dados/g) ?? []).length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Nitrato');
    expect(fixture.nativeElement.textContent).toContain('16 mg/L');
    expect(fixture.nativeElement.textContent).toContain('Prime');
    expect(detailService.listAquariumApplications).toHaveBeenCalledWith(
      'aq-1',
      expect.objectContaining({ page: 1, pageSize: 5, sort: 'appliedAt', direction: 'desc' }),
    );
    expect(pageTitleService.set).toHaveBeenCalledWith('');
    expect(pageTitleService.setToolbarContent).not.toHaveBeenCalled();
    expect(
      Array.from(
        fixture.nativeElement.querySelectorAll('.aquarium-detail-page__actions [aqButton]'),
      ).map((button) => (button as HTMLElement).textContent?.trim().replace(/\s+/g, ' ')),
    ).toEqual(['add Nova Medição', 'add Nova Aplicação', 'add Adicionar espécie', 'edit Editar']);
  });

  it('shows only warning or error parameters in the operational health alert list', async () => {
    const detailWithUnknownParameter = {
      ...detail,
      parameters: [
        ...detail.parameters,
        {
          key: 'magnesium',
          label: 'Magnésio',
          shortLabel: 'Mg',
          icon: 'science',
          value: 1340.1,
          valueLabel: '1340.1 mg/L',
          unit: 'mg/L',
          tone: 'primary',
          measuredAt: '2026-08-10T12:00:00.000Z',
          statusLabel: 'Sem classificação',
          statusColor: 'tertiary',
          trend: 'unknown',
          trendIcon: 'remove',
          trendLabel: 'Sem dados suficientes',
        },
      ],
    } satisfies AquariumDetailViewModel;
    const { fixture } = await createFixture({ detailResult: of(detailWithUnknownParameter) });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      parameterAlerts: () => readonly { readonly key: string }[];
    };

    expect(component.parameterAlerts().map((parameter) => parameter.key)).toEqual(['nitrate']);
    expect(fixture.nativeElement.textContent).toContain('Acima');
    expect(fixture.nativeElement.textContent).not.toContain('Sem classificação');
  });

  it('does not reload detail when the route emits the same uuid again', async () => {
    const { detailService, paramMap } = await createFixture();

    paramMap.next(convertToParamMap({ uuid: 'aq-1' }));
    paramMap.next(convertToParamMap({ uuid: 'aq-2' }));

    expect(detailService.getAquariumDetail).toHaveBeenCalledTimes(2);
    expect(detailService.getAquariumDetail).toHaveBeenNthCalledWith(1, 'aq-1');
    expect(detailService.getAquariumDetail).toHaveBeenNthCalledWith(2, 'aq-2');
  });

  it('renders invalid uuid, not found, and error states', async () => {
    const invalid = await createFixture({ aquariumId: '!' });
    expect(invalid.fixture.nativeElement.textContent).toContain('UUID inválido');

    TestBed.resetTestingModule();
    const missing = await createFixture({ detailResult: of(null) });
    expect(missing.fixture.nativeElement.textContent).toContain('Aquário não encontrado');

    TestBed.resetTestingModule();
    const failed = await createFixture({ detailResult: throwError(() => new Error('boom')) });
    expect(failed.fixture.nativeElement.textContent).toContain('Não foi possível carregar');
  });

  it('lazy loads measurements with API page starting at 1 when the tab opens', async () => {
    const { fixture, detailService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      onTabChange: (tab: string) => void;
    };

    component.onTabChange('measurements');
    fixture.detectChanges();

    expect(detailService.listAquariumMeasurements).toHaveBeenCalledWith(
      'aq-1',
      expect.objectContaining({ page: 1, pageSize: 10, sort: 'measuredAt', direction: 'desc' }),
      detail.waterParameters,
    );
    expect(fixture.nativeElement.textContent).toContain('7.2');
  });

  it('reloads measurements server-side when filters, sort, and pagination change', async () => {
    jest.useFakeTimers();
    const { fixture, detailService } = await createFixture({ tab: 'measurements' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      filtersForm: AquariumDetailPageComponent['filtersForm'];
      onMeasurementSortChange: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
      onMeasurementsPageChange: (change: { pageIndex: number; pageSize: number }) => void;
    };

    component.filtersForm.setValue({
      date: '2026-08-10',
      parameter: ['ph'],
    });
    jest.advanceTimersByTime(300);
    component.onMeasurementSortChange({ key: 'value', direction: 'asc' });
    component.onMeasurementsPageChange({ pageIndex: 1, pageSize: 20 });

    expect(detailService.listAquariumMeasurements).toHaveBeenLastCalledWith(
      'aq-1',
      expect.objectContaining({
        page: 2,
        pageSize: 20,
        parameter: 'ph',
        sort: 'value',
        direction: 'asc',
        startDate: expect.any(String),
        endDate: expect.any(String),
      }),
      detail.waterParameters,
    );
    fixture.detectChanges();
  });

  it('lazy loads applications and sends filter/sort/pagination to the API', async () => {
    jest.useFakeTimers();
    const { fixture, detailService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      applicationFiltersForm: AquariumDetailPageComponent['applicationFiltersForm'];
      onTabChange: (tab: string) => void;
      onApplicationSortChange: (sort: { key: string; direction: 'asc' | 'desc' }) => void;
      onApplicationsPageChange: (change: { pageIndex: number; pageSize: number }) => void;
    };

    component.onTabChange('applications');
    component.applicationFiltersForm.setValue({
      date: { start: '2026-08-01', end: '2026-08-10' },
      productName: 'prime',
      type: 'Condicionador',
    });
    jest.advanceTimersByTime(300);
    component.onApplicationSortChange({ key: 'productName', direction: 'asc' });
    component.onApplicationsPageChange({ pageIndex: 1, pageSize: 20 });
    fixture.detectChanges();

    expect(detailService.listAquariumApplications).toHaveBeenLastCalledWith(
      'aq-1',
      expect.objectContaining({
        page: 2,
        pageSize: 20,
        product: 'prime',
        type: 'Condicionador',
        sort: 'productName',
        direction: 'asc',
      }),
    );
    expect(fixture.nativeElement.textContent).toContain('Prime');
  });

  it('opens the measurement modal with water parameter catalog and refreshes after creation', async () => {
    const { fixture, modalService, detailService, feedbackMessageService } = await createFixture({
      tab: 'measurements',
    });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      openAddMeasurementModal: () => void;
    };

    component.openAddMeasurementModal();
    const config = modalService.open.mock.calls[0][0];
    const submitMeasurement = config.contentComponentInputs.submitMeasurement as (payload: {
      parameterKey: string;
      value: number;
      date: string;
      time: string;
      notes: string | null;
    }) => Observable<void>;

    submitMeasurement({
      parameterKey: 'ph',
      value: 7.3,
      date: '2026-08-10',
      time: '12:30',
      notes: null,
    }).subscribe();

    expect(config.contentComponentInputs.parameters).toBe(detail.waterParameters);
    expect(detailService.createAquariumMeasurement).toHaveBeenCalledWith(
      'aq-1',
      expect.objectContaining({
        waterParameter: 'ph',
        value: 7.3,
        measuredAt: expect.any(String),
        notes: null,
      }),
    );
    expect(detailService.getAquariumOverview).toHaveBeenCalledWith('aq-1');
    expect(detailService.listAquariumMeasurements).toHaveBeenCalled();
    expect(feedbackMessageService.showSuccess).toHaveBeenCalled();
  });

  it('uses browser history for back link', async () => {
    const { fixture, pageTitleService } = await createFixture();
    const location = TestBed.inject(Location);
    const backSpy = jest.spyOn(location, 'back');
    const event = new MouseEvent('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      onBack: (event: MouseEvent) => void;
    };

    component.onBack(event);
    fixture.destroy();

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(backSpy).toHaveBeenCalled();
    expect(pageTitleService.setToolbarContent).not.toHaveBeenCalled();
  });

  it('keeps server-backed tabs isolated when resources fail or no detail is loaded', async () => {
    const { fixture, detailService, feedbackMessageService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      applicationsStatus: ReturnType<typeof signal>;
      measurementsStatus: ReturnType<typeof signal>;
      notifyEditUnavailable: () => void;
      notifyAquaticLifeCreateUnavailable: () => void;
      onTabChange: (tab: string) => void;
      openAddMeasurementModal: () => void;
      retry: () => void;
      detail: ReturnType<typeof signal>;
      addMeasurement: (payload: {
        parameterKey: string;
        value: number;
        date: string;
        time: string;
        notes: string | null;
      }) => Observable<void>;
      loadMeasurements: () => void;
      loadApplications: () => void;
    };

    detailService.listAquariumMeasurements.mockReturnValueOnce(
      throwError(() => new Error('measurements failed')),
    );
    detailService.listAquariumApplications.mockReturnValueOnce(
      throwError(() => new Error('applications failed')),
    );

    component.onTabChange('invalid');
    component.onTabChange('measurements');
    component.onTabChange('applications');
    component.notifyEditUnavailable();
    component.notifyAquaticLifeCreateUnavailable();

    expect(component.measurementsStatus()).toBe('error');
    expect(component.applicationsStatus()).toBe('error');
    expect(feedbackMessageService.showInformation).toHaveBeenCalledTimes(2);

    component.retry();
    expect(detailService.getAquariumDetail).toHaveBeenCalledTimes(2);

    component.detail.set(null);
    component.openAddMeasurementModal();
    component.loadMeasurements();
    component.loadApplications();
    component
      .addMeasurement({
        parameterKey: 'ph',
        value: 7.2,
        date: '2026-08-10',
        time: '12:00',
        notes: null,
      })
      .subscribe();

    expect(detailService.createAquariumMeasurement).not.toHaveBeenCalled();
  });

  it('computes local aquatic-life filters and icon options without affecting API-backed lists', async () => {
    const detailWithLife = { ...detail, aquaticLife };
    const { fixture } = await createFixture({ detailResult: of(detailWithLife) });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      aquaticLifeFiltersForm: AquariumDetailPageComponent['aquaticLifeFiltersForm'];
      clearAquaticLifeFilters: () => void;
      clearApplicationFilters: () => void;
      clearMeasurementFilters: () => void;
      aquaticLifeTypeOptions: () => readonly { readonly id: string; readonly icon: string }[];
      filteredAquaticLife: () => readonly typeof aquaticLife;
      hasAquaticLifeFilters: () => boolean;
      hasApplicationFilters: () => boolean;
      hasMeasurementFilters: () => boolean;
    };

    expect(component.aquaticLifeTypeOptions()).toEqual([
      expect.objectContaining({ id: 'Peixe', icon: 'set_meal' }),
      expect.objectContaining({ id: 'Planta', icon: 'local_florist' }),
      expect.objectContaining({ id: 'Invertebrado', icon: 'pets' }),
    ]);

    component.aquaticLifeFiltersForm.setValue({
      name: 'anubia',
      scientificName: 'barteri',
      type: 'Planta',
    });

    expect(component.hasAquaticLifeFilters()).toBe(true);
    expect(component.filteredAquaticLife().map((life) => life.id)).toEqual(['life-2']);

    component.clearAquaticLifeFilters();
    component.clearApplicationFilters();
    component.clearMeasurementFilters();

    expect(component.hasAquaticLifeFilters()).toBe(false);
    expect(component.hasApplicationFilters()).toBe(false);
    expect(component.hasMeasurementFilters()).toBe(false);
  });

  it('keeps computed collections empty and ignores filter reloads when no tab data is loaded', async () => {
    jest.useFakeTimers();
    const { fixture, detailService } = await createFixture({ aquariumId: '!' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      applicationFiltersForm: AquariumDetailPageComponent['applicationFiltersForm'];
      filtersForm: AquariumDetailPageComponent['filtersForm'];
      applicationsCaption: () => string;
      applicationTypeOptions: () => readonly unknown[];
      filteredApplications: () => readonly unknown[];
      filteredAquaticLife: () => readonly unknown[];
      filteredMeasurements: () => readonly unknown[];
      filteredMeasurementsCaption: () => string;
      parameterAlerts: () => readonly unknown[];
      parameterOptions: () => readonly unknown[];
      recentApplications: () => readonly unknown[];
      recentParameters: () => readonly unknown[];
      refreshOverview: () => void;
    };

    expect(component.parameterOptions()).toEqual([]);
    expect(component.filteredMeasurements()).toEqual([]);
    expect(component.filteredApplications()).toEqual([]);
    expect(component.filteredAquaticLife()).toEqual([]);
    expect(component.recentApplications()).toEqual([]);
    expect(component.recentParameters()).toEqual([]);
    expect(component.parameterAlerts()).toEqual([]);
    expect(component.filteredMeasurementsCaption()).toBe('0 medições exibidas');
    expect(component.applicationsCaption()).toBe('0 aplicações registradas');
    expect(component.applicationTypeOptions()).toEqual([]);

    component.filtersForm.setValue({ date: '2026-08-10', parameter: ['ph'] });
    component.applicationFiltersForm.setValue({
      date: '2026-08-10',
      productName: 'prime',
      type: 'Condicionador',
    });
    jest.advanceTimersByTime(300);
    component.refreshOverview();

    expect(detailService.listAquariumMeasurements).not.toHaveBeenCalled();
    expect(detailService.listAquariumApplications).not.toHaveBeenCalled();
    expect(detailService.getAquariumOverview).not.toHaveBeenCalled();
  });

  it('marks overview refresh as error when the overview endpoint fails', async () => {
    const { fixture, detailService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      overviewStatus: ReturnType<typeof signal>;
      refreshOverview: () => void;
    };
    detailService.getAquariumOverview.mockReturnValueOnce(throwError(() => new Error('boom')));

    component.refreshOverview();

    expect(component.overviewStatus()).toBe('error');
  });
});
