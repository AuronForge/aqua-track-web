import { computed, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { DEFAULT_AQUARIUM_DETAIL_DEMO_DATA } from '../../mocks/aquarium-detail.mock';
import {
  AquariumDetailApplication,
  AquariumDetailAquaticLife,
  AquariumDetailMeasurement,
} from '../../models/aquarium-detail.model';
import { AquariumDetailDataService } from '../../services/aquarium-detail-data.service';
import { AquariumDetailPageComponent } from './aquarium-detail-page.component';

const detail = {
  id: 'aq-1',
  name: 'Community Tank',
  typeLabel: 'Aquário comunitário',
  waterTypeLabel: 'Água doce',
  volumeLabel: '75L',
  setupDateLabel: '15 de jan. de 2024',
  statusLabel: 'Estável',
  statusColor: 'success' as const,
  heroImageUrl: null,
  heroAlt: 'Foto do aquário Community Tank',
  summary: {
    capacityLabel: 'Capacidade total: 75 litros',
    setupDateLabel: '15 de jan. de 2024',
    healthPercent: 92,
  },
  parameters: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.parameters,
  measurements: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.measurements,
  applications: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.applications,
  aquaticLife: DEFAULT_AQUARIUM_DETAIL_DEMO_DATA.aquaticLife,
};

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
  detailResult?: Observable<typeof detail | null>;
} = {}): Promise<{
  fixture: ComponentFixture<AquariumDetailPageComponent>;
  detailService: { getAquariumDetail: jest.Mock };
  modalService: { open: jest.Mock };
  feedbackMessageService: { showInformation: jest.Mock; showSuccess: jest.Mock };
  pageTitleService: { set: jest.Mock; setToolbarContent: jest.Mock };
  router: Router;
}> {
  const paramMap = new BehaviorSubject(convertToParamMap({ uuid: aquariumId }));
  const queryParamMap = new BehaviorSubject(convertToParamMap(tab ? { tab } : {}));
  const detailService = { getAquariumDetail: jest.fn(() => detailResult) };
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
    router,
  };
}

describe('AquariumDetailPageComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('loads the aquarium detail from the uuid route parameter', async () => {
    const { fixture, detailService, pageTitleService } = await createFixture();

    expect(detailService.getAquariumDetail).toHaveBeenCalledWith('aq-1');
    expect(fixture.nativeElement.textContent).toContain('Community Tank');
    expect(pageTitleService.set).toHaveBeenCalledWith('');
    expect(pageTitleService.setToolbarContent).toHaveBeenCalledWith(expect.anything());
    expect(fixture.nativeElement.textContent).not.toContain('Nova Aplicação');
    expect(
      fixture.nativeElement.querySelector('.aquarium-detail-page__actions')?.textContent,
    ).not.toContain('Adicionar espécie');
    expect(fixture.nativeElement.textContent).toContain('Aplicações Recentes');
    expect(fixture.nativeElement.textContent).toContain('Prime');
    expect(fixture.nativeElement.textContent).toContain('Parâmetros Recentes');
    expect(fixture.nativeElement.textContent).toContain('Vida aquática');
    expect(fixture.nativeElement.textContent).not.toContain('Capacidade total');
  });

  it('uses the tab query parameter when it is valid', async () => {
    const { fixture } = await createFixture({ tab: 'aquatic-life' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      activeTabId: () => string;
    };

    expect(component.activeTabId()).toBe('aquatic-life');
    expect(fixture.nativeElement.textContent).toContain('Neon tetra');
    expect(fixture.nativeElement.textContent).toContain('4 itens registrados');
    expect(fixture.nativeElement.textContent).not.toContain('Adicionar espécie');
  });

  it('filters aquatic life by name, scientific name, and type', async () => {
    const { fixture } = await createFixture({ tab: 'aquatic-life' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      aquaticLifeFiltersForm: AquariumDetailPageComponent['aquaticLifeFiltersForm'];
      filteredAquaticLife: () => AquariumDetailAquaticLife[];
    };

    component.aquaticLifeFiltersForm.setValue({
      name: 'anubias',
      scientificName: 'barteri',
      type: 'Planta',
    });
    fixture.detectChanges();

    expect(component.filteredAquaticLife()).toEqual([
      expect.objectContaining({ name: 'Anubias nana', typeLabel: 'Planta' }),
    ]);
    expect(fixture.nativeElement.textContent).toContain('1 item registrado');
    expect(fixture.nativeElement.textContent).not.toContain('Neon tetra');
  });

  it('clears all aquatic life filters', async () => {
    const { fixture } = await createFixture({ tab: 'aquatic-life' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      aquaticLifeFiltersForm: AquariumDetailPageComponent['aquaticLifeFiltersForm'];
      filteredAquaticLife: () => AquariumDetailAquaticLife[];
      hasAquaticLifeFilters: () => boolean;
      clearAquaticLifeFilters: () => void;
    };

    component.aquaticLifeFiltersForm.setValue({
      name: 'anubias',
      scientificName: 'barteri',
      type: 'Planta',
    });
    fixture.detectChanges();

    expect(component.hasAquaticLifeFilters()).toBe(true);
    expect(component.filteredAquaticLife()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Limpar filtros');

    component.clearAquaticLifeFilters();
    fixture.detectChanges();

    expect(component.aquaticLifeFiltersForm.getRawValue()).toEqual({
      name: '',
      scientificName: '',
      type: null,
    });
    expect(component.hasAquaticLifeFilters()).toBe(false);
    expect(component.filteredAquaticLife()).toHaveLength(detail.aquaticLife.length);
  });

  it('does not duplicate the register application action in the applications tab', async () => {
    const { fixture } = await createFixture({ tab: 'applications' });

    expect(fixture.nativeElement.textContent).toContain('0 aplicações registradas');
    expect(fixture.nativeElement.textContent).not.toContain('Registrar aplicação');
  });

  it('initializes only the application date filter with the current date', async () => {
    const { fixture } = await createFixture({ tab: 'applications' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      filtersForm: AquariumDetailPageComponent['filtersForm'];
      applicationFiltersForm: AquariumDetailPageComponent['applicationFiltersForm'];
    };
    const today = new Date();
    const currentDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');

    expect(component.filtersForm.controls.date.value).toBe('');
    expect(component.applicationFiltersForm.controls.date.value).toBe(currentDate);
  });

  it('filters applications by date, product name, and type', async () => {
    const { fixture } = await createFixture({ tab: 'applications' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      applicationFiltersForm: AquariumDetailPageComponent['applicationFiltersForm'];
      filteredApplications: () => AquariumDetailApplication[];
    };

    component.applicationFiltersForm.setValue({
      date: '2026-02-24',
      productName: 'flourish',
      type: 'Fertilizante',
    });
    fixture.detectChanges();

    expect(component.filteredApplications()).toEqual([
      expect.objectContaining({ productName: 'Flourish', productType: 'Fertilizante' }),
    ]);
    expect(fixture.nativeElement.textContent).toContain('1 aplicação registrada');
    expect(fixture.nativeElement.textContent).not.toContain('Prime');
  });

  it('clears all application filters', async () => {
    const { fixture } = await createFixture({ tab: 'applications' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      applicationFiltersForm: AquariumDetailPageComponent['applicationFiltersForm'];
      filteredApplications: () => AquariumDetailApplication[];
      hasApplicationFilters: () => boolean;
      clearApplicationFilters: () => void;
    };

    component.applicationFiltersForm.setValue({
      date: '2026-02-24',
      productName: 'flourish',
      type: 'Fertilizante',
    });
    fixture.detectChanges();

    expect(component.hasApplicationFilters()).toBe(true);
    expect(component.filteredApplications()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Limpar filtros');

    component.clearApplicationFilters();
    fixture.detectChanges();

    expect(component.applicationFiltersForm.getRawValue()).toEqual({
      date: '',
      productName: '',
      type: null,
    });
    expect(component.hasApplicationFilters()).toBe(false);
    expect(component.filteredApplications()).toHaveLength(detail.applications.length);
  });

  it('updates the query parameter when changing tabs', async () => {
    const { fixture, router } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      onTabChange: (tab: string) => void;
    };

    component.onTabChange('measurements');

    expect(router.navigate).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { tab: 'measurements' },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('ignores invalid tab changes', async () => {
    const { fixture, router } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      activeTabId: () => string;
      onTabChange: (tab: string) => void;
    };

    component.onTabChange('unknown');

    expect(component.activeTabId()).toBe('overview');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('uses the browser history for the back link', async () => {
    const { fixture } = await createFixture();
    const location = TestBed.inject(Location);
    const backSpy = jest.spyOn(location, 'back');
    const event = new MouseEvent('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      onBack: (event: MouseEvent) => void;
    };

    component.onBack(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(backSpy).toHaveBeenCalled();
  });

  it('clears toolbar actions when destroyed', async () => {
    const { fixture, pageTitleService } = await createFixture();

    fixture.destroy();

    expect(pageTitleService.setToolbarContent).toHaveBeenLastCalledWith(null);
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

  it('filters measurements by parameter and date', async () => {
    const { fixture } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      filtersForm: AquariumDetailPageComponent['filtersForm'];
      filteredMeasurements: () => { parameterKey: string; measuredAt: string }[];
    };

    component.filtersForm.setValue({
      date: '2026-02-27',
      parameter: ['nitrate'],
      status: ['Normal'],
    });
    fixture.detectChanges();

    expect(component.filteredMeasurements()).toEqual([
      expect.objectContaining({ parameterKey: 'nitrate', measuredAt: '2026-02-27T09:30:00' }),
    ]);
  });

  it('clears all measurement filters', async () => {
    const { fixture } = await createFixture({ tab: 'measurements' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      filtersForm: AquariumDetailPageComponent['filtersForm'];
      filteredMeasurements: () => AquariumDetailMeasurement[];
      hasMeasurementFilters: () => boolean;
      clearMeasurementFilters: () => void;
    };

    component.filtersForm.setValue({
      date: '2026-02-27',
      parameter: ['nitrate'],
      status: ['Normal'],
    });
    fixture.detectChanges();

    expect(component.hasMeasurementFilters()).toBe(true);
    expect(component.filteredMeasurements()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Limpar filtros');

    component.clearMeasurementFilters();
    fixture.detectChanges();

    expect(component.filtersForm.getRawValue()).toEqual({
      date: '',
      parameter: [],
      status: [],
    });
    expect(component.hasMeasurementFilters()).toBe(false);
    expect(component.filteredMeasurements()).toHaveLength(detail.measurements.length);
  });

  it('does not duplicate the add measurement action in the measurements tab', async () => {
    const { fixture } = await createFixture({ tab: 'measurements' });

    expect(fixture.nativeElement.textContent).toContain('medições exibidas');
    expect(fixture.nativeElement.textContent).not.toContain('Nova Medição');
  });

  it('shows only the six most recently measured parameters in the overview', async () => {
    const { fixture } = await createFixture();

    expect(
      fixture.nativeElement.querySelectorAll('.aquarium-detail-page__parameter-card'),
    ).toHaveLength(6);
  });

  it('shows the healthy alert summary when all recent measurements are normal', async () => {
    const { fixture } = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Alerta de Parâmetros');
    expect(text).toContain('Nenhum alerta');
    expect(text).not.toContain('Todos os parâmetros medidos estão dentro do padrão definido.');
  });

  it('shows parameters outside the defined pattern in the alert summary', async () => {
    const alertDetail = {
      ...detail,
      measurements: detail.measurements.map((measurement) =>
        measurement.id === 'm-1'
          ? {
              ...measurement,
              value: 8.2,
              valueLabel: '8.2',
              statusLabel: 'Alto',
              statusColor: 'warning' as const,
            }
          : measurement,
      ),
    };
    const { fixture } = await createFixture({ detailResult: of(alertDetail) });
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('1 parâmetro em alerta');
    expect(text).toContain('pH');
    expect(text).toContain('8.2');
    expect(text).toContain('Alto');
  });

  it('returns no filtered measurements before a detail is loaded', async () => {
    const { fixture } = await createFixture({ aquariumId: '!' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      filteredMeasurements: () => AquariumDetailMeasurement[];
      filteredAquaticLife: () => AquariumDetailAquaticLife[];
      filteredApplications: () => AquariumDetailApplication[];
      recentApplications: () => AquariumDetailApplication[];
      recentParameters: () => unknown[];
      parameterAlerts: () => AquariumDetailMeasurement[];
      addMeasurement: (payload: {
        parameterKey: string;
        value: number;
        date: string;
        time: string;
        notes: string | null;
      }) => unknown;
    };

    expect(component.filteredMeasurements()).toEqual([]);
    expect(component.filteredAquaticLife()).toEqual([]);
    expect(component.filteredApplications()).toEqual([]);
    expect(component.recentApplications()).toEqual([]);
    expect(component.recentParameters()).toEqual([]);
    expect(component.parameterAlerts()).toEqual([]);
    expect(
      component.addMeasurement({
        parameterKey: 'ph',
        value: 7.2,
        date: '2026-08-10',
        time: '11:35',
        notes: null,
      }),
    ).toBeTruthy();
  });

  it('sorts measurements through the table sort state', async () => {
    const { fixture } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      filtersForm: AquariumDetailPageComponent['filtersForm'];
      filteredMeasurements: () => AquariumDetailMeasurement[];
      onMeasurementSortChange: (sort: { key: string; direction: 'asc' | 'desc' } | null) => void;
    };

    component.filtersForm.patchValue({ date: '' });
    component.onMeasurementSortChange({ key: 'value', direction: 'asc' });
    expect(component.filteredMeasurements()[0]?.valueLabel).toBe('0.5 mg/L');

    component.onMeasurementSortChange({ key: 'date', direction: 'desc' });
    expect(component.filteredMeasurements()[0]?.measuredAt).toBe('2026-02-27T09:30:00');

    component.onMeasurementSortChange({ key: 'unknown', direction: 'asc' });
    expect(component.filteredMeasurements().length).toBe(detail.measurements.length);

    component.onMeasurementSortChange(null);
    expect(component.filteredMeasurements()[0]?.id).toBe('m-1');
  });

  it('opens the add measurement modal and appends submitted measurements', async () => {
    const { fixture, modalService, feedbackMessageService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      openAddMeasurementModal: () => void;
      detail: () => typeof detail;
    };

    component.openAddMeasurementModal();
    const submitMeasurement = modalService.open.mock.calls[0][0].contentComponentInputs
      .submitMeasurement as (payload: {
      parameterKey: string;
      value: number;
      date: string;
      time: string;
      notes: string | null;
    }) => unknown;

    submitMeasurement({
      parameterKey: 'ph',
      value: 7.4,
      date: '2026-08-06',
      time: '18:57',
      notes: null,
    });

    expect(modalService.open).toHaveBeenCalled();
    expect(component.detail().measurements[0]).toEqual(
      expect.objectContaining({ parameterKey: 'ph', valueLabel: '7.4' }),
    );
    expect(feedbackMessageService.showSuccess).toHaveBeenCalled();
  });

  it('does not open the add measurement modal without a loaded detail', async () => {
    const { fixture, modalService } = await createFixture({ aquariumId: '!' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      openAddMeasurementModal: () => void;
    };

    component.openAddMeasurementModal();

    expect(modalService.open).not.toHaveBeenCalled();
  });

  it('ignores submitted measurements without a matching parameter', async () => {
    const { fixture, modalService, feedbackMessageService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      openAddMeasurementModal: () => void;
      detail: () => typeof detail;
    };

    component.openAddMeasurementModal();
    const submitMeasurement = modalService.open.mock.calls[0][0].contentComponentInputs
      .submitMeasurement as (payload: {
      parameterKey: string;
      value: number;
      date: string;
      time: string;
      notes: string | null;
    }) => unknown;
    const initialMeasurementsCount = component.detail().measurements.length;

    submitMeasurement({
      parameterKey: 'unknown',
      value: 1,
      date: '2026-08-06',
      time: '18:57',
      notes: null,
    });

    expect(component.detail().measurements.length).toBe(initialMeasurementsCount);
    expect(feedbackMessageService.showSuccess).not.toHaveBeenCalled();
  });

  it('formats submitted measurements with units and exposes unavailable edit feedback', async () => {
    const { fixture, modalService, feedbackMessageService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      notifyEditUnavailable: () => void;
      openAddMeasurementModal: () => void;
      detail: () => typeof detail;
    };

    component.notifyEditUnavailable();
    component.openAddMeasurementModal();

    const submitMeasurement = modalService.open.mock.calls[0][0].contentComponentInputs
      .submitMeasurement as (payload: {
      parameterKey: string;
      value: number;
      date: string;
      time: string;
      notes: string | null;
    }) => unknown;

    submitMeasurement({
      parameterKey: 'temperature',
      value: 24.5,
      date: '2026-08-06',
      time: '18:57',
      notes: 'Kit novo',
    });

    expect(feedbackMessageService.showInformation).toHaveBeenCalled();
    expect(component.detail().measurements[0]).toEqual(
      expect.objectContaining({
        parameterKey: 'temperature',
        valueLabel: '24.5 °C',
      }),
    );
  });

  it('exposes unavailable feedback for adding aquatic life', async () => {
    const { fixture, feedbackMessageService } = await createFixture({ tab: 'aquatic-life' });
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      notifyAquaticLifeCreateUnavailable: () => void;
    };

    component.notifyAquaticLifeCreateUnavailable();

    expect(feedbackMessageService.showInformation).toHaveBeenCalledWith(
      'O cadastro de animais e plantas ainda não está disponível.',
      {
        hasIcon: true,
        horizontalPosition: 'top',
        verticalPosition: 'end',
      },
    );
  });

  it('retries the current aquarium route', async () => {
    const { fixture, detailService } = await createFixture();
    const component = fixture.componentInstance as AquariumDetailPageComponent & {
      retry: () => void;
    };

    component.retry();

    expect(detailService.getAquariumDetail).toHaveBeenCalledTimes(2);
    expect(detailService.getAquariumDetail).toHaveBeenLastCalledWith('aq-1');
  });
});
