import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AquariumListResponseDto } from '../models/aquarium-api.dto';
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

const aquariumTypes: SystemValueApiDto[] = [
  {
    id: 'type-1',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'COMMUNITY',
    description: 'Community aquarium',
    displayValue: 'Community Tank',
  },
];

describe('AquariumDetailDataService', () => {
  function setup(aquariums: AquariumListResponseDto[] = [aquarium]) {
    const aquariumApiService = {
      listAquariums: jest.fn(() => of(aquariums)),
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

  it('maps an aquarium from the existing list endpoint into the detail view model', (done) => {
    const { service, aquariumApiService, systemValuesApiService } = setup();

    service.getAquariumDetail('aq-1').subscribe((detail) => {
      expect(aquariumApiService.listAquariums).toHaveBeenCalled();
      expect(systemValuesApiService.listAquariumTypes).toHaveBeenCalled();
      expect(detail?.name).toBe('Community Tank');
      expect(detail?.typeLabel).toBe('Comunitário');
      expect(detail?.waterTypeLabel).toBe('Água doce');
      expect(detail?.volumeLabel).toBe('75L');
      expect(detail?.setupDateLabel).toBe('15 de jan. de 2024');
      expect(detail?.summary.capacityLabel).toBe('Capacidade total: 75 litros');
      expect(detail?.statusLabel).toBe('Estável');
      expect(detail?.statusColor).toBe('success');
      expect(detail?.heroImageUrl).toBe('https://example.com/aquarium.jpg');
      expect(detail?.parameters.map((parameter) => parameter.key)).toEqual([
        'ph',
        'nitrate',
        'kh',
        'temperature',
        'iron',
        'potassium',
      ]);
      expect(detail?.measurements.length).toBeGreaterThan(0);
      expect(detail?.applications.length).toBeGreaterThan(0);
      done();
    });
  });

  it('returns null when the aquarium id is not present in the API list', (done) => {
    const { service } = setup();

    service.getAquariumDetail('missing').subscribe((detail) => {
      expect(detail).toBeNull();
      done();
    });
  });

  it('falls back to generated labels and supports inactive gallon aquariums', (done) => {
    const { service } = setup([
      {
        ...aquarium,
        id: 'aq-2',
        type: 'SPECIES_ONLY',
        waterType: 'BRACKISH',
        volume: 20,
        volumeUnit: 'GALLON',
        setupDate: 'invalid',
        status: 'INACTIVE',
        primaryPhotoUrl: null,
        displayPreferences: {
          ...displayPreferences,
          displayPH: false,
          displayNitrate: false,
          displayKH: false,
          displayTemperature: false,
          displayIron: false,
          displayPotassium: false,
        },
        alertParameters: {
          potassium: {
            minimumValue: 5,
            maximumValue: 20,
            targetValue: 12,
          },
        },
      },
    ]);

    service.getAquariumDetail('aq-2').subscribe((detail) => {
      expect(detail?.typeLabel).toBe('Espécies específicas');
      expect(detail?.waterTypeLabel).toBe('Água salobra');
      expect(detail?.volumeLabel).toBe('20gal');
      expect(detail?.setupDateLabel).toBe('Data indisponível');
      expect(detail?.statusColor).toBe('warning');
      expect(detail?.heroImageUrl).toBeNull();
      expect(detail?.parameters.map((parameter) => parameter.key)).toEqual(['potassium']);
      done();
    });
  });

  it('keeps all demo parameters when no display or alert preference is enabled', (done) => {
    const { service } = setup([
      {
        ...aquarium,
        id: 'aq-3',
        displayPreferences: Object.fromEntries(
          Object.keys(displayPreferences).map((key) => [key, false]),
        ) as typeof displayPreferences,
        alertParameters: {},
      },
    ]);

    service.getAquariumDetail('aq-3').subscribe((detail) => {
      expect(detail?.parameters.length).toBeGreaterThan(6);
      expect(detail?.parameters.map((parameter) => parameter.key)).toContain('nitrite');
      done();
    });
  });

  it('falls back to raw API enum values and preserves decimal volumes', (done) => {
    const { service } = setup([
      {
        ...aquarium,
        id: 'aq-4',
        waterType: 'POND' as AquariumListResponseDto['waterType'],
        volume: 20.5,
        status: 'ARCHIVED',
      },
    ]);

    service.getAquariumDetail('aq-4').subscribe((detail) => {
      expect(detail?.waterTypeLabel).toBe('POND');
      expect(detail?.volumeLabel).toBe('20.5L');
      expect(detail?.statusLabel).toBe('Arquivado');
      expect(detail?.statusColor).toBe('tertiary');
      done();
    });
  });

  it('uses system value display labels and singular liter capacity labels', (done) => {
    const { service } = setup([
      {
        ...aquarium,
        id: 'aq-5',
        type: 'CUSTOM_TYPE',
        volume: 1,
        displayPreferences: {
          ...displayPreferences,
          displayPH: true,
        },
        alertParameters: {
          nitrate: false,
        },
      },
    ]);

    systemValuesApiServiceMock(service, [
      ...aquariumTypes,
      {
        id: 'type-2',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'CUSTOM_TYPE',
        description: 'Custom aquarium',
        displayValue: 'Tipo personalizado',
      },
    ]);

    service.getAquariumDetail('aq-5').subscribe((detail) => {
      expect(detail?.typeLabel).toBe('Tipo personalizado');
      expect(detail?.summary.capacityLabel).toBe('Capacidade total: 1 litro');
      expect(detail?.parameters.map((parameter) => parameter.key)).toContain('ph');
      done();
    });
  });

  it('falls back to raw aquarium type and all parameters when enabled keys do not match', (done) => {
    const { service } = setup([
      {
        ...aquarium,
        id: 'aq-6',
        type: 'EXPERIMENTAL',
        volume: 1,
        volumeUnit: 'GALLON',
        displayPreferences: Object.fromEntries(
          Object.keys(displayPreferences).map((key) => [key, false]),
        ) as typeof displayPreferences,
        alertParameters: {
          unknownParameter: {
            minimumValue: 1,
            maximumValue: 2,
            targetValue: 1.5,
          },
        },
      },
    ]);

    service.getAquariumDetail('aq-6').subscribe((detail) => {
      expect(detail?.typeLabel).toBe('EXPERIMENTAL');
      expect(detail?.summary.capacityLabel).toBe('Capacidade total: 1 galão');
      expect(detail?.parameters.length).toBeGreaterThan(6);
      done();
    });
  });
});

function systemValuesApiServiceMock(
  service: AquariumDetailDataService,
  values: SystemValueApiDto[],
): void {
  const api = TestBed.inject(SystemValuesApiService) as unknown as {
    listAquariumTypes: jest.Mock;
  };

  api.listAquariumTypes.mockReturnValue(of(values));
  expect(service).toBeTruthy();
}
