import { DashboardApiDto } from '../models';

const PH_PARAM = {
  key: 'ph',
  name: 'pH',
  unit: 'PH' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 0.2, unit: 'PH' as const, direction: 'UP' as const },
  status: 'NORMAL' as const,
  minRecommendedValue: 6.5,
  maxRecommendedValue: 7.5,
  series: [],
};

const TEMPERATURE_PARAM = {
  key: 'temperature',
  name: 'Temperatura',
  unit: 'CELSIUS' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 0, unit: 'CELSIUS' as const, direction: 'STABLE' as const },
  status: 'NORMAL' as const,
  minRecommendedValue: 22,
  maxRecommendedValue: 28,
  series: [],
};

const NITRITE_PARAM = {
  key: 'nitrite',
  name: 'NO2 (Nitrite)',
  unit: 'PPM' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 0.1, unit: 'PPM' as const, direction: 'DOWN' as const },
  status: 'ATTENTION' as const,
  minRecommendedValue: 0,
  maxRecommendedValue: 0.25,
  series: [],
};

const NITRATE_PARAM = {
  key: 'nitrate',
  name: 'NO3 (Nitrate)',
  unit: 'PPM' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 4, unit: 'PPM' as const, direction: 'DOWN' as const },
  status: 'NORMAL' as const,
  minRecommendedValue: 0,
  maxRecommendedValue: 40,
  series: [],
};

const AMMONIA_PARAM = {
  key: 'ammonia',
  name: 'Amônia',
  unit: 'PPM' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 0.05, unit: 'PPM' as const, direction: 'DOWN' as const },
  status: 'CRITICAL' as const,
  minRecommendedValue: 0,
  maxRecommendedValue: 0.02,
  series: [],
};

const KH_PARAM = {
  key: 'kh',
  name: 'KH (Carbonate Hardness)',
  unit: 'DKH' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 0, unit: 'DKH' as const, direction: 'STABLE' as const },
  status: 'NORMAL' as const,
  minRecommendedValue: 4,
  maxRecommendedValue: 8,
  series: [],
};

const GH_PARAM = {
  key: 'gh',
  name: 'GH (General Hardness)',
  unit: 'DGH' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 0, unit: 'DGH' as const, direction: 'STABLE' as const },
  status: 'NORMAL' as const,
  minRecommendedValue: 4,
  maxRecommendedValue: 12,
  series: [],
};

const TDS_PARAM = {
  key: 'tds',
  name: 'TDS',
  unit: 'PPM' as const,
  periodLabel: 'Últimos 7 dias',
  variation: { value: 0, unit: 'PPM' as const, direction: 'STABLE' as const },
  status: 'NORMAL' as const,
  minRecommendedValue: 0,
  maxRecommendedValue: 150,
  series: [],
};

export const MOCK_RECENT_APPLICATIONS = [
  {
    id: 'app-1',
    aquariumName: 'Aquário Comunitário',
    productName: 'Dennerle S7 Vital',
    amount: 1,
    unit: 'ml',
    appliedAt: '2026-06-30T10:00:00.000Z',
    notes: null,
  },
  {
    id: 'app-2',
    aquariumName: 'Paisagismo Plantado',
    productName: 'Seachem Flourish',
    amount: 2,
    unit: 'ml',
    appliedAt: '2026-06-30T08:00:00.000Z',
    notes: null,
  },
  {
    id: 'app-3',
    aquariumName: 'Aquário de Recife',
    productName: 'Seachem Reef Complete',
    amount: 10,
    unit: 'ml',
    appliedAt: '2026-06-29T12:00:00.000Z',
    notes: null,
  },
];

export const MOCK_DASHBOARD_FULL: DashboardApiDto = {
  recentApplications: MOCK_RECENT_APPLICATIONS,
  recentMeasurements: [
    {
      id: 'm-ph-1',
      waterParameterName: 'pH',
      parameterKey: 'ph',
      aquariumId: 'aq-1',
      aquariumName: 'Aquário Comunitário',
      value: 7.2,
      unit: 'PH',
      status: 'NORMAL',
      measuredAt: '2024-02-28T09:30:00Z',
    },
    {
      id: 'm-temp-1',
      waterParameterName: 'Temperatura',
      parameterKey: 'temperature',
      aquariumId: 'aq-1',
      aquariumName: 'Aquário Comunitário',
      value: 24,
      unit: 'CELSIUS',
      status: 'NORMAL',
      measuredAt: '2024-02-28T09:28:00Z',
    },
    {
      id: 'm-no3-1',
      waterParameterName: 'NO3 (Nitrate)',
      parameterKey: 'nitrate',
      aquariumId: 'aq-1',
      aquariumName: 'Aquário Comunitário',
      value: 10,
      unit: 'PPM',
      status: 'NORMAL',
      measuredAt: '2024-02-28T09:20:00Z',
    },
    {
      id: 'm-aq2-1',
      waterParameterName: 'pH',
      parameterKey: 'ph',
      aquariumId: 'aq-2',
      aquariumName: 'Paisagismo Plantado',
      value: 6.8,
      unit: 'PH',
      status: 'NORMAL',
      measuredAt: '2024-02-28T09:10:00Z',
    },
    {
      id: 'm-aq2-2',
      waterParameterName: 'NO3 (Nitrate)',
      parameterKey: 'nitrate',
      aquariumId: 'aq-2',
      aquariumName: 'Paisagismo Plantado',
      value: 25,
      unit: 'PPM',
      status: 'ATTENTION',
      measuredAt: '2024-02-28T09:15:00Z',
    },
  ],
  aquariums: [
    {
      id: 'aq-1',
      name: 'Aquário Comunitário',
      type: 'COMMUNITY',
      waterType: 'FRESHWATER',
      volume: 75,
      volumeUnit: 'LITER',
      healthStatus: 'STABLE',
      summary: {
        ph: { value: 7.2, unit: 'PH', measuredAt: '2024-02-28T09:30:00Z' },
        temperature: { value: 24, unit: 'CELSIUS', measuredAt: '2024-02-28T09:28:00Z' },
      },
      waterParameters: [
        PH_PARAM,
        TEMPERATURE_PARAM,
        NITRITE_PARAM,
        NITRATE_PARAM,
        AMMONIA_PARAM,
        KH_PARAM,
        GH_PARAM,
        TDS_PARAM,
      ],
    },
    {
      id: 'aq-2',
      name: 'Paisagismo Plantado',
      type: 'PLANTED',
      waterType: 'FRESHWATER',
      volume: 120,
      volumeUnit: 'LITER',
      healthStatus: 'ATTENTION',
      summary: {
        ph: { value: 6.8, unit: 'PH', measuredAt: '2024-02-28T09:10:00Z' },
        temperature: { value: 26, unit: 'CELSIUS', measuredAt: '2024-02-28T09:05:00Z' },
      },
      waterParameters: [PH_PARAM, TEMPERATURE_PARAM, NITRATE_PARAM],
    },
    {
      id: 'aq-3',
      name: 'Aquário de Recife',
      type: 'REEF',
      waterType: 'SALTWATER',
      volume: 200,
      volumeUnit: 'LITER',
      healthStatus: 'STABLE',
      summary: {
        ph: { value: 8.2, unit: 'PH', measuredAt: '2024-02-28T18:40:00Z' },
        temperature: { value: 25, unit: 'CELSIUS', measuredAt: '2024-02-28T18:35:00Z' },
      },
      waterParameters: [PH_PARAM, TEMPERATURE_PARAM, KH_PARAM],
    },
    {
      id: 'aq-4',
      name: 'Nano Aquário de Camarões',
      type: 'SHRIMP',
      waterType: 'FRESHWATER',
      volume: 25,
      volumeUnit: 'LITER',
      healthStatus: 'CRITICAL',
      summary: {
        ph: { value: 6.2, unit: 'PH', measuredAt: '2024-02-28T17:15:00Z' },
        temperature: { value: 23, unit: 'CELSIUS', measuredAt: '2024-02-28T17:00:00Z' },
      },
      waterParameters: [PH_PARAM, TEMPERATURE_PARAM, AMMONIA_PARAM, NITRITE_PARAM],
    },
  ],
};

export const MOCK_DASHBOARD_EMPTY_AQUARIUMS: DashboardApiDto = {
  aquariums: [],
  recentMeasurements: [],
  recentApplications: [],
};

export const MOCK_DASHBOARD_SINGLE_UNKNOWN: DashboardApiDto = {
  aquariums: [
    {
      id: 'aq-1',
      name: 'Main Tank',
      type: 'COMMUNITY',
      waterType: 'FRESHWATER',
      volume: 200,
      volumeUnit: 'LITER',
      healthStatus: 'UNKNOWN',
      summary: {},
      waterParameters: [],
    },
  ],
  recentMeasurements: [],
  recentApplications: [],
};

export const MOCK_DASHBOARD_EMPTY_LISTS: DashboardApiDto = {
  ...MOCK_DASHBOARD_FULL,
  recentMeasurements: [],
  recentApplications: [],
};
