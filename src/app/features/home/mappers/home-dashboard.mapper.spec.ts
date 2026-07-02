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
      expect(vm.recentMeasurements.length).toBe(MOCK_DASHBOARD_FULL.recentMeasurements.length);
      expect(vm.recentApplications.length).toBe(MOCK_DASHBOARD_FULL.recentApplications.length);
    });

    it('maps waterParameters per aquarium', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const aq1Params = vm.waterParametersByAquariumId['aq-1'];
      expect(aq1Params?.length).toBe(MOCK_DASHBOARD_FULL.aquariums[0].waterParameters.length);
    });

    it('uses the first aquarium as selectedAquariumId', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
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
            volumeUnit: 'GALLON' as const,
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
      expect(card.metrics).toContainEqual({
        label: 'Temperatura',
        value: expect.stringContaining('24.0'),
      });
    });

    it('shows dash placeholders when summary is empty', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_SINGLE_UNKNOWN);
      const card = vm.aquariumCards[0];
      expect(card.metrics).toHaveLength(2);
      expect(card.metrics).toContainEqual({ label: expect.stringContaining('pH'), value: '-' });
      expect(card.metrics).toContainEqual({ label: 'Temperatura', value: '- °C' });
    });
  });

  describe('water parameter variation', () => {
    it('maps UP direction with a plus prefix', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const aq1Params = vm.waterParametersByAquariumId['aq-1'];
      const phParam = aq1Params?.find((p) => p.key === 'ph');

      expect(phParam?.variation.displayValue).toBe('+0.2 pH');
      expect(phParam?.variation.direction).toBe('up');
    });

    it('maps DOWN direction with a minus prefix', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const aq1Params = vm.waterParametersByAquariumId['aq-1'];
      const nitriteParam = aq1Params?.find((p) => p.key === 'nitrite');

      expect(nitriteParam?.variation.displayValue).toBe('-0.10 ppm');
      expect(nitriteParam?.variation.direction).toBe('down');
    });

    it('maps STABLE direction with no sign', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const aq1Params = vm.waterParametersByAquariumId['aq-1'];
      const tempParam = aq1Params?.find((p) => p.key === 'temperature');

      expect(tempParam?.variation.displayValue).toContain('0');
      expect(tempParam?.variation.direction).toBe('stable');
    });

    it('maps UNKNOWN direction with no sign and unknown direction output', () => {
      const dto: typeof MOCK_DASHBOARD_FULL = {
        ...MOCK_DASHBOARD_FULL,
        aquariums: [
          {
            ...MOCK_DASHBOARD_FULL.aquariums[0],
            waterParameters: [
              {
                ...MOCK_DASHBOARD_FULL.aquariums[0].waterParameters[0],
                variation: { value: 0, unit: 'NONE' as const, direction: 'UNKNOWN' as const },
              },
            ],
          },
        ],
      };
      const vm = mapper.mapDashboardDtoToViewModel(dto);
      const params = vm.waterParametersByAquariumId['aq-1'];

      expect(params?.[0].variation.displayValue).toBe('0.00');
      expect(params?.[0].variation.direction).toBe('unknown');
    });

    it('falls back to unknown direction and empty suffix for unmapped variation data', () => {
      const dto: typeof MOCK_DASHBOARD_FULL = {
        ...MOCK_DASHBOARD_FULL,
        aquariums: [
          {
            ...MOCK_DASHBOARD_FULL.aquariums[0],
            waterParameters: [
              {
                ...MOCK_DASHBOARD_FULL.aquariums[0].waterParameters[0],
                variation: { value: 3, unit: 'PSI' as never, direction: 'SIDEWAYS' as never },
              },
            ],
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      const params = vm.waterParametersByAquariumId['aq-1'];
      expect(params?.[0].variation).toEqual({
        displayValue: '3.00',
        direction: 'unknown',
        icon: '',
        iconClass: '',
      });
    });

    it('sets hasChartData to false when series is empty', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const aq1Params = vm.waterParametersByAquariumId['aq-1'] ?? [];
      aq1Params.forEach((p) => expect(p.hasChartData).toBe(false));
    });

    it('sets hasChartData to true when series has data', () => {
      const dto: typeof MOCK_DASHBOARD_FULL = {
        ...MOCK_DASHBOARD_FULL,
        aquariums: [
          {
            ...MOCK_DASHBOARD_FULL.aquariums[0],
            waterParameters: [
              {
                ...MOCK_DASHBOARD_FULL.aquariums[0].waterParameters[0],
                series: [{ date: '2024-02-28', value: 7.2 }],
              } as WaterParameterDto,
            ],
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      const params = vm.waterParametersByAquariumId['aq-1'];
      expect(params?.[0].hasChartData).toBe(true);
    });

    it('uses periodLabel directly from the DTO', () => {
      const vm = mapper.mapDashboardDtoToViewModel(MOCK_DASHBOARD_FULL);
      const aq1Params = vm.waterParametersByAquariumId['aq-1'];
      expect(aq1Params?.[0].periodLabel).toBe('Últimos 7 dias');
    });
  });

  describe('display preferences', () => {
    it('excludes parameters where isDisplayed is false', () => {
      const dto: typeof MOCK_DASHBOARD_FULL = {
        ...MOCK_DASHBOARD_FULL,
        aquariums: [
          {
            ...MOCK_DASHBOARD_FULL.aquariums[0],
            waterParameters: [
              { ...MOCK_DASHBOARD_FULL.aquariums[0].waterParameters[0], isDisplayed: true },
              { ...MOCK_DASHBOARD_FULL.aquariums[0].waterParameters[1], isDisplayed: false },
            ],
          },
        ],
      };

      const vm = mapper.mapDashboardDtoToViewModel(dto);
      const params = vm.waterParametersByAquariumId['aq-1'];

      expect(params).toHaveLength(1);
      expect(params?.[0].key).toBe(dto.aquariums[0].waterParameters[0].key);
    });
  });
});
