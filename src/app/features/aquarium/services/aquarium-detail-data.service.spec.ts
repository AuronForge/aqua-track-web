import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AquariumListResponseDto } from '../models/aquarium-api.dto';
import {
  AquariumApplicationsPageDto,
  AquariumOverviewDto,
  MeasurementsPageDto,
  WaterParameterDto,
} from '../models/aquarium-operational-api.dto';
import { SystemValueApiDto } from '../models/system-value-api.dto';
import { AquariumApiService } from './aquarium-api.service';
import { AquariumDetailDataService } from './aquarium-detail-data.service';
import { SystemValuesApiService } from './system-values-api.service';

const displayPreferences = {
  displayPH: true,
  displayGH: false,
  displayKH: true,
  displayNitrate: true,
  displayNitrite: false,
  displayAmmonia: false,
  displayTemperature: true,
  displayTDS: false,
  displayCopper: false,
  displayPhosphate: false,
  displayIron: true,
  displayCO2: false,
  displayO2: false,
  displayCalcium: false,
  displaySilicates: false,
  displayDensitySalinity: false,
  displayMagnesium: false,
  displayIodine: false,
  displayMolybdenum: false,
  displayStrontium: false,
  displayPotassium: true,
};

const aquarium: AquariumListResponseDto = {
  id: 'aq-1',
  ownerId: 'user-1',
  name: 'Community Tank',
  description: null,
  type: 'COMMUNITY',
  waterType: 'FRESHWATER',
  volume: 75,
  volumeUnit: 'LITER',
  setupDate: '2024-01-15T00:00:00.000Z',
  displayPreferences,
  alertParameters: {},
  primaryPhotoUrl: 'https://example.com/aquarium.jpg',
  photosCount: 1,
  status: 'ACTIVE',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
};

const overview: AquariumOverviewDto = {
  health: { score: null, status: 'UNKNOWN' },
  latestMeasurements: [
    {
      parameter: 'ph',
      parameterName: 'pH',
      value: 7.2,
      unit: '',
      measuredAt: '2026-02-27T09:30:00.000Z',
      status: 'NORMAL',
      trend: 'STABLE',
    },
    {
      parameter: 'nitrate',
      parameterName: 'Nitrato',
      value: 16,
      unit: 'mg/L',
      measuredAt: '2026-02-27T09:30:00.000Z',
      status: 'ABOVE',
      trend: 'UP',
    },
  ],
};

const waterParameters: WaterParameterDto[] = [
  {
    id: 'wp-1',
    key: 'ph',
    name: 'pH',
    category: 'CHEMICAL',
    defaultUnit: '',
    applicableWaterTypes: ['FRESHWATER'],
    applicableAquariumTypes: ['COMMUNITY'],
    minRecommendedValue: 6.5,
    maxRecommendedValue: 7.5,
    isActive: true,
  },
  {
    id: 'wp-2',
    key: 'nitrate',
    name: 'Nitrato',
    category: 'CHEMICAL',
    defaultUnit: 'mg/L',
    applicableWaterTypes: ['FRESHWATER'],
    applicableAquariumTypes: ['COMMUNITY'],
    minRecommendedValue: 0,
    maxRecommendedValue: 20,
    isActive: true,
  },
];

const aquariumTypes: SystemValueApiDto[] = [
  {
    id: 'type-1',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'COMMUNITY',
    description: 'Community aquarium',
    displayValue: 'Community Tank',
  },
];

const measurementsPage: MeasurementsPageDto = {
  data: [
    {
      id: 'm-1',
      waterParameter: 'ph',
      parameterName: 'pH',
      value: 7.1,
      unit: '',
      measuredAt: '2026-08-10T12:00:00.000Z',
      status: 'NORMAL',
      trend: 'DOWN',
    },
  ],
  pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
};

const applicationsPage: AquariumApplicationsPageDto = {
  data: [
    {
      id: 'app-1',
      productName: 'Prime',
      productType: 'Condicionador',
      dose: 5,
      doseUnit: 'ml',
      appliedAt: '2026-08-10T12:00:00.000Z',
      notes: null,
    },
  ],
  pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
};

describe('AquariumDetailDataService', () => {
  function setup(aquariumResponse: AquariumListResponseDto = aquarium) {
    const aquariumApiService = {
      getAquarium: jest.fn(() => of(aquariumResponse)),
      getAquariumOverview: jest.fn(() => of(overview)),
      listWaterParametersByAquarium: jest.fn(() => of(waterParameters)),
      listAquariumMeasurements: jest.fn(() => of(measurementsPage)),
      createAquariumMeasurement: jest.fn(() => of(void 0)),
      listAquariumApplications: jest.fn(() => of(applicationsPage)),
    };
    const systemValuesApiService = {
      listAquariumTypes: jest.fn(() => of(aquariumTypes)),
    };

    TestBed.configureTestingModule({
      providers: [
        AquariumDetailDataService,
        { provide: AquariumApiService, useValue: aquariumApiService },
        { provide: SystemValuesApiService, useValue: systemValuesApiService },
      ],
    });

    return {
      service: TestBed.inject(AquariumDetailDataService),
      aquariumApiService,
      systemValuesApiService,
    };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('maps cadastral detail, overview, and water parameter catalog into the view model', (done) => {
    const { service, aquariumApiService, systemValuesApiService } = setup();

    service.getAquariumDetail('aq-1').subscribe((detail) => {
      expect(aquariumApiService.getAquarium).toHaveBeenCalledWith('aq-1');
      expect(aquariumApiService.getAquariumOverview).toHaveBeenCalledWith('aq-1');
      expect(aquariumApiService.listWaterParametersByAquarium).toHaveBeenCalledWith('aq-1');
      expect(systemValuesApiService.listAquariumTypes).toHaveBeenCalled();
      expect(detail?.name).toBe('Community Tank');
      expect(detail?.typeLabel).toBe('Comunitário');
      expect(detail?.waterTypeLabel).toBe('Água doce');
      expect(detail?.volumeLabel).toBe('75L');
      expect(detail?.setupDateLabel).toBe('15 de jan. de 2024');
      expect(detail?.summary.capacityLabel).toBe('Capacidade total: 75 litros');
      expect(detail?.summary.healthScoreLabel).toBe('Sem dados');
      expect(detail?.summary.healthStatusLabel).toBe('Sem dados');
      expect(detail?.parameters.map((parameter) => parameter.key)).toEqual(['ph', 'nitrate']);
      expect(detail?.parameters[1]).toEqual(
        expect.objectContaining({
          valueLabel: '16 mg/L',
          statusLabel: 'Acima',
          trend: 'up',
        }),
      );
      expect(detail?.waterParameters.map((parameter) => parameter.key)).toEqual(['ph', 'nitrate']);
      expect(detail?.measurementsPagination.totalItems).toBe(0);
      expect(detail?.applicationsPagination.totalItems).toBe(0);
      done();
    });
  });

  it('returns null when a related aquarium resource responds with 404', (done) => {
    const { service } = setup();
    const aquariumApiService = TestBed.inject(AquariumApiService) as unknown as {
      getAquarium: jest.Mock;
    };
    aquariumApiService.getAquarium.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );

    service.getAquariumDetail('missing').subscribe((detail) => {
      expect(detail).toBeNull();
      done();
    });
  });

  it('rethrows non-404 errors from related aquarium resources', (done) => {
    const { service } = setup();
    const aquariumApiService = TestBed.inject(AquariumApiService) as unknown as {
      getAquarium: jest.Mock;
    };
    const error = new HttpErrorResponse({ status: 500 });
    aquariumApiService.getAquarium.mockReturnValue(throwError(() => error));

    service.getAquariumDetail('aq-1').subscribe({
      error: (receivedError) => {
        expect(receivedError).toBe(error);
        done();
      },
    });
  });

  it('maps cadastral fallbacks for unknown type, unavailable dates, and gallon volumes', (done) => {
    const { service } = setup({
      ...aquarium,
      type: 'CUSTOM_TYPE',
      waterType: 'SALTWATER',
      volume: 1,
      volumeUnit: 'GALLON',
      setupDate: null,
      primaryPhotoUrl: null,
      status: 'ARCHIVED',
    });
    const systemValuesApiService = TestBed.inject(SystemValuesApiService) as unknown as {
      listAquariumTypes: jest.Mock;
    };
    systemValuesApiService.listAquariumTypes.mockReturnValue(
      of([
        {
          id: 'type-custom',
          rootSystemValue: 'AQUARIUM_TYPE',
          systemValue: 'CUSTOM_TYPE',
          description: 'Custom',
          displayValue: 'Custom label',
        },
      ]),
    );

    service.getAquariumDetail('aq-1').subscribe((detail) => {
      expect(detail?.typeLabel).toBe('Custom label');
      expect(detail?.waterTypeLabel).toBe('Água salgada');
      expect(detail?.volumeLabel).toBe('1gal');
      expect(detail?.summary.capacityLabel).toBe('Capacidade total: 1 galão');
      expect(detail?.setupDateLabel).toBe('Data indisponível');
      expect(detail?.statusLabel).toBe('Arquivado');
      expect(detail?.heroImageUrl).toBeNull();
      done();
    });
  });

  it('maps overview health statuses and score without inventing values', (done) => {
    const { service } = setup();
    const api = TestBed.inject(AquariumApiService) as unknown as {
      getAquariumOverview: jest.Mock;
    };
    api.getAquariumOverview.mockReturnValue(
      of({
        health: { score: 92, status: 'CRITICAL' },
        latestMeasurements: [],
      } satisfies AquariumOverviewDto),
    );

    service.getAquariumOverview('aq-1').subscribe((result) => {
      expect(result.summary.healthPercent).toBe(92);
      expect(result.summary.healthScoreLabel).toBe('92%');
      expect(result.summary.healthStatusLabel).toBe('Crítico');
      expect(result.summary.healthStatusColor).toBe('error');
      expect(result.parameters).toEqual([]);
      done();
    });
  });

  it('localizes known parameter names and enum-like units from overview measurements', (done) => {
    const { service } = setup();
    const api = TestBed.inject(AquariumApiService) as unknown as {
      getAquariumOverview: jest.Mock;
    };
    api.getAquariumOverview.mockReturnValue(
      of({
        health: { score: 80, status: 'STABLE' },
        latestMeasurements: [
          {
            parameter: 'magnesium',
            parameterName: 'Magnesium',
            value: 1340.1,
            unit: 'MG_L',
            measuredAt: '2026-08-10T12:00:00.000Z',
            status: 'NORMAL',
            trend: 'STABLE',
          },
          {
            parameter: 'temperature',
            parameterName: 'Temp',
            value: 25.9,
            unit: 'CELSIUS',
            measuredAt: '2026-08-10T12:00:00.000Z',
            status: 'NORMAL',
            trend: 'STABLE',
          },
          {
            parameter: 'density_salinity',
            parameterName: 'Density / Salinity',
            value: 1.1,
            unit: 'SPECIFIC_GRAVITY',
            measuredAt: '2026-08-10T12:00:00.000Z',
            status: 'NORMAL',
            trend: 'STABLE',
          },
          {
            parameter: 'ph',
            parameterName: 'pH',
            value: 8.3,
            unit: 'PH',
            measuredAt: '2026-08-10T12:00:00.000Z',
            status: 'NORMAL',
            trend: 'STABLE',
          },
        ],
      } satisfies AquariumOverviewDto),
    );

    service.getAquariumOverview('aq-1').subscribe((result) => {
      expect(result.parameters).toEqual([
        expect.objectContaining({
          label: 'Magnésio',
          shortLabel: 'Mg',
          valueLabel: '1340.1 mg/L',
          unit: 'mg/L',
        }),
        expect.objectContaining({
          label: 'Temperatura',
          shortLabel: 'Temp',
          valueLabel: '25.9 °C',
          unit: '°C',
        }),
        expect.objectContaining({
          label: 'Densidade / Salinidade',
          shortLabel: 'Densidade',
          valueLabel: '1.1 ppm',
          unit: 'ppm',
        }),
        expect.objectContaining({
          label: 'pH',
          shortLabel: 'pH',
          valueLabel: '8.3',
          unit: '',
        }),
      ]);
      done();
    });
  });

  it.each([
    ['STABLE', 'Estável', 'success'],
    ['ATTENTION', 'Atenção', 'warning'],
    ['CRITICAL', 'Crítico', 'error'],
    ['UNKNOWN', 'Sem dados', 'tertiary'],
  ] as const)('maps overview health status %s', (status, label, color, done) => {
    const { service } = setup();
    const api = TestBed.inject(AquariumApiService) as unknown as {
      getAquariumOverview: jest.Mock;
    };
    api.getAquariumOverview.mockReturnValue(
      of({
        health: { score: 80, status },
        latestMeasurements: [],
      } satisfies AquariumOverviewDto),
    );

    service.getAquariumOverview('aq-1').subscribe((result) => {
      expect(result.summary.healthStatusLabel).toBe(label);
      expect(result.summary.healthStatusColor).toBe(color);
      done();
    });
  });

  it('maps paginated measurements and delegates the query to the aquarium endpoint', (done) => {
    const { service, aquariumApiService } = setup();
    const query = { page: 1, pageSize: 10, parameter: 'ph' as const };

    service
      .listAquariumMeasurements('aq-1', query, [{ ...waterParameters[0] }])
      .subscribe((page) => {
        expect(aquariumApiService.listAquariumMeasurements).toHaveBeenCalledWith('aq-1', query);
        expect(page.pagination.totalItems).toBe(1);
        expect(page.measurements[0]).toEqual(
          expect.objectContaining({
            parameterKey: 'ph',
            valueLabel: '7.1',
            statusLabel: 'Normal',
            trend: 'down',
          }),
        );
        done();
      });
  });

  it('delegates measurement creation using the definitive request body', (done) => {
    const { service, aquariumApiService } = setup();
    const payload = {
      waterParameter: 'ph',
      value: 7.2,
      measuredAt: '2026-08-10T12:00:00.000Z',
      notes: null,
    };

    service.createAquariumMeasurement('aq-1', payload).subscribe(() => {
      expect(aquariumApiService.createAquariumMeasurement).toHaveBeenCalledWith('aq-1', payload);
      done();
    });
  });

  it('maps measurement fallbacks for catalog labels, raw labels, invalid dates, status, and trend', (done) => {
    const { service, aquariumApiService } = setup();
    aquariumApiService.listAquariumMeasurements.mockReturnValue(
      of({
        data: [
          {
            id: 'm-2',
            waterParameter: 'nitrate',
            value: 16.5,
            unit: 'mg/L',
            measuredAt: 'not-a-date',
            status: 'BELOW',
            trend: 'UNKNOWN',
          },
          {
            id: 'm-3',
            waterParameter: 'custom',
            value: 1,
            unit: '',
            measuredAt: '2026-08-10T12:00:00.000Z',
          },
        ],
        pagination: { page: 1, pageSize: 10, totalItems: 2, totalPages: 1 },
      } satisfies MeasurementsPageDto),
    );

    service.listAquariumMeasurements('aq-1', {}, [{ ...waterParameters[1] }]).subscribe((page) => {
      expect(page.measurements[0]).toEqual(
        expect.objectContaining({
          dateLabel: 'Data indisponível',
          timeLabel: '--:--',
          parameterLabel: 'Nitrato',
          valueLabel: '16.5 mg/L',
          statusLabel: 'Abaixo',
          trendLabel: 'Sem dados suficientes',
        }),
      );
      expect(page.measurements[1]).toEqual(
        expect.objectContaining({
          parameterLabel: 'custom',
          statusLabel: 'Sem classificação',
          trend: 'unknown',
        }),
      );
      done();
    });
  });

  it('maps paginated applications and delegates the query to the aquarium endpoint', (done) => {
    const { service, aquariumApiService } = setup();
    const query = { page: 1, pageSize: 10, product: 'prime' };

    service.listAquariumApplications('aq-1', query).subscribe((page) => {
      expect(aquariumApiService.listAquariumApplications).toHaveBeenCalledWith('aq-1', query);
      expect(page.pagination.totalItems).toBe(1);
      expect(page.applications[0]).toEqual(
        expect.objectContaining({
          productName: 'Prime',
          productType: 'Condicionador',
          doseLabel: '5 ml',
        }),
      );
      done();
    });
  });
});
