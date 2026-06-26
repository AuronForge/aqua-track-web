import { TestBed } from '@angular/core/testing';

import { HomeDashboardMapper } from './home-dashboard.mapper';
import {
  MOCK_DASHBOARD_EMPTY_AQUARIUMS,
  MOCK_DASHBOARD_FULL,
  MOCK_DASHBOARD_SINGLE_UNKNOWN,
} from '../mocks/home-dashboard.mock';
import { DashboardAquariumDto, WaterParameterDto } from '../models';

describe('HomeDashboardMapper', () => {
  let mapper: HomeDashboardMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    mapper = TestBed.inject(HomeDashboardMapper);
  });

  it('should be created', () => {
    expect(mapper).toBeTruthy();
  });

  describe('mapDashboardDtoToViewModel', () => {
    it('maps the full DTO to a ViewModel', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);

      expect(vm.aquariumCards.length).toBe(4);
      expect(vm.waterParameters.length).toBe(MOCK_DASHBOARD_FULL.waterParameters.length);
      expect(vm.recentMeasurements.length).toBe(4);
      expect(vm.recentApplications.length).toBe(3);
    });

    it('uses selectedAquarium from the DTO when present', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      expect(vm.selectedAquariumId).toBe('aq-1');
    });

    it('falls back to the first aquarium when selectedAquarium is null', () => {
      const dto = { ...MOCK_DASHBOARD_FULL, selectedAquarium: null };
      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.selectedAquariumId).toBe('aq-1');
    });

    it('returns null as selectedAquariumId when there are no aquariums', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_EMPTY_AQUARIUMS);
      expect(vm.selectedAquariumId).toBeNull();
    });

    it('initializes every aquarium card as unselected', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      vm.aquariumCards.forEach((card) => expect(card.selected).toBe(false));
    });
  });

  describe('health status mapping', () => {
    const cases: {
      healthStatus: DashboardAquariumDto['healthStatus'];
      expectedStatus: string;
      expectedLabel: string;
    }[] = [
      { healthStatus: 'STABLE', expectedStatus: 'stable', expectedLabel: 'Est' },
      { healthStatus: 'ATTENTION', expectedStatus: 'attention', expectedLabel: 'Aten' },
      { healthStatus: 'CRITICAL', expectedStatus: 'critical', expectedLabel: 'Cr' },
      { healthStatus: 'UNKNOWN', expectedStatus: 'unknown', expectedLabel: 'Desconhecido' },
    ];

    cases.forEach(({ healthStatus, expectedStatus, expectedLabel }) => {
      it(`maps ${healthStatus}`, () => {
        const dto = {
          ...MOCK_DASHBOARD_FULL,
          aquariums: [{ ...MOCK_DASHBOARD_FULL.aquariums[0], healthStatus }],
        };

        const vm = mapper.mapDashboardDtoToViewModel(dto);
        expect(vm.aquariumCards[0].status).toBe(expectedStatus);
        expect(vm.aquariumCards[0].statusLabel).toContain(expectedLabel);
      });
    });

    it('falls back to unknown for an unmapped aquarium health status', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        aquariums: [
          {
            ...MOCK_DASHBOARD_FULL.aquariums[0],
            healthStatus: 'BROKEN' as never,
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.aquariumCards[0].status).toBe('unknown');
      expect(vm.aquariumCards[0].statusLabel).toBe('Desconhecido');
    });
  });

  describe('aquarium subtitle', () => {
    it('maps freshwater liters correctly', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      expect(vm.aquariumCards[0].subtitle).toContain('75L');
    });

    it('maps saltwater liters correctly', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const reefCard = vm.aquariumCards.find((c) => c.id === 'aq-3');
      expect(reefCard?.subtitle).toContain('200L');
    });

    it('maps brackish gallons using dedicated labels', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        aquariums: [
          {
            ...MOCK_DASHBOARD_FULL.aquariums[0],
            waterType: 'BRACKISH',
            volume: 30,
            volumeUnit: 'GALLON',
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.aquariumCards[0].subtitle).toContain('Salobra');
      expect(vm.aquariumCards[0].subtitle).toContain('30gal');
    });

    it('falls back to raw water type and unit when they are unknown', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        aquariums: [
          {
            ...MOCK_DASHBOARD_FULL.aquariums[0],
            waterType: 'CUSTOM_WATER' as never,
            volume: 12,
            volumeUnit: 'BUCKET' as never,
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.aquariumCards[0].subtitle).toContain('CUSTOM_WATER');
      expect(vm.aquariumCards[0].subtitle).toContain('12BUCKET');
    });
  });

  describe('aquarium metrics', () => {
    it('maps pH and temperature from summary to metrics', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const card = vm.aquariumCards[0];

      expect(card.metrics).toContainEqual({ label: expect.stringContaining('pH'), value: '7.2' });
      expect(card.metrics).toContainEqual({ label: 'Temp', value: expect.stringContaining('24') });
    });

    it('returns empty metrics when summary is empty', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_SINGLE_UNKNOWN);
      expect(vm.aquariumCards[0].metrics).toHaveLength(0);
    });
  });

  describe('water parameter variation', () => {
    it('maps UP direction with a plus prefix', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const phParam = vm.waterParameters.find((p) => p.key === 'ph');

      expect(phParam?.variation.displayValue).toBe('+0.2');
      expect(phParam?.variation.direction).toBe('up');
    });

    it('maps DOWN direction with a minus prefix', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const nitriteParam = vm.waterParameters.find((p) => p.key === 'nitrite');

      expect(nitriteParam?.variation.displayValue).toBe('-0.1ppm');
      expect(nitriteParam?.variation.direction).toBe('down');
    });

    it('maps STABLE direction with no sign', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const tempParam = vm.waterParameters.find((p) => p.key === 'temperature');

      expect(tempParam?.variation.displayValue).toContain('0');
      expect(tempParam?.variation.direction).toBe('stable');
    });

    it('maps UNKNOWN direction with no sign and unknown direction output', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const orpParam = vm.waterParameters.find((p) => p.key === 'orp');

      expect(orpParam?.variation.displayValue).toBe('0');
      expect(orpParam?.variation.direction).toBe('unknown');
    });

    it('falls back to unknown direction and empty suffix for unmapped variation data', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        waterParameters: [
          {
            ...MOCK_DASHBOARD_FULL.waterParameters[0],
            variation: { value: 3, unit: 'PSI' as never, direction: 'SIDEWAYS' as never },
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.waterParameters[0].variation).toEqual({
        displayValue: '3',
        direction: 'unknown',
      });
    });

    it('sets hasChartData to false when series is empty', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      vm.waterParameters.forEach((p) => expect(p.hasChartData).toBe(false));
    });

    it('sets hasChartData to true when series has data', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        waterParameters: [
          {
            ...MOCK_DASHBOARD_FULL.waterParameters[0],
            series: [{ x: 1, y: 7.2 }],
          } as WaterParameterDto,
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.waterParameters[0].hasChartData).toBe(true);
    });
  });

  describe('measurement badge mapping', () => {
    it('maps NORMAL to a normal badge', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const measurement = vm.recentMeasurements.find((r) => r.id === 'm-1');

      expect(measurement?.badge).toEqual({ label: 'Normal', status: 'normal' });
    });

    it('maps ATTENTION to an attention badge', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const measurement = vm.recentMeasurements.find((r) => r.id === 'm-2');

      expect(measurement?.badge).toEqual({ label: 'Alto', status: 'attention' });
    });

    it('maps CRITICAL to a danger badge', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const measurement = vm.recentMeasurements.find((r) => r.id === 'm-4');

      expect(measurement?.badge).toEqual({
        label: expect.stringContaining('Cr'),
        status: 'danger',
      });
    });

    it('maps UNKNOWN to a null badge', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        recentMeasurements: [
          { ...MOCK_DASHBOARD_FULL.recentMeasurements[0], status: 'UNKNOWN' as const },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.recentMeasurements[0].badge).toBeNull();
    });

    it('falls back to null badge for an unmapped measurement status', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        recentMeasurements: [
          {
            ...MOCK_DASHBOARD_FULL.recentMeasurements[0],
            status: 'MYSTERY' as never,
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.recentMeasurements[0].badge).toBeNull();
    });
  });

  describe('recent measurement mapping', () => {
    it('omits the unit separator when the suffix is empty', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        recentMeasurements: [
          {
            ...MOCK_DASHBOARD_FULL.recentMeasurements[0],
            unit: 'NONE' as never,
            value: 42,
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.recentMeasurements[0].value).toBe('42');
    });

    it('falls back to an empty unit suffix for unmapped units', () => {
      const dto = {
        ...MOCK_DASHBOARD_FULL,
        recentMeasurements: [
          {
            ...MOCK_DASHBOARD_FULL.recentMeasurements[0],
            unit: 'PSI' as never,
            value: 9,
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      expect(vm.recentMeasurements[0].value).toBe('9');
    });
  });

  describe('recent application mapping', () => {
    it('maps dosage and unit to the value string', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      expect(vm.recentApplications[0].value).toBe('5 ml');
    });

    it('keeps recent application badges as null', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      vm.recentApplications.forEach((application) => expect(application.badge).toBeNull());
    });
  });
});
