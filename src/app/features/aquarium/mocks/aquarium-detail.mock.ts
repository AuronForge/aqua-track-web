/* istanbul ignore file */
import {
  AquariumDetailAquaticLife,
  AquariumDetailApplication,
  AquariumDetailMeasurement,
  AquariumDetailParameter,
} from '../models/aquarium-detail.model';

export interface AquariumDetailDemoData {
  readonly healthPercent: number | null;
  readonly parameters: readonly AquariumDetailParameter[];
  readonly measurements: readonly AquariumDetailMeasurement[];
  readonly applications: readonly AquariumDetailApplication[];
  readonly aquaticLife: readonly AquariumDetailAquaticLife[];
}

const PARAMETERS: readonly AquariumDetailParameter[] = [
  {
    key: 'ph',
    label: 'pH',
    shortLabel: 'pH',
    icon: 'science',
    value: 7.2,
    valueLabel: '7.2',
    unit: '',
    tone: 'primary',
  },
  {
    key: 'nitrite',
    label: 'NO2',
    shortLabel: 'NO2',
    icon: 'water_drop',
    value: 0,
    valueLabel: '0 mg/L',
    unit: 'mg/L',
    tone: 'error',
  },
  {
    key: 'nitrate',
    label: 'NO3',
    shortLabel: 'NO3',
    icon: 'water_drop',
    value: 16,
    valueLabel: '16 mg/L',
    unit: 'mg/L',
    tone: 'success',
  },
  {
    key: 'kh',
    label: 'KH',
    shortLabel: 'KH',
    icon: 'waves',
    value: 6,
    valueLabel: '6 dKH',
    unit: 'dKH',
    tone: 'information',
  },
  {
    key: 'gh',
    label: 'GH',
    shortLabel: 'GH',
    icon: 'waves',
    value: 8,
    valueLabel: '8 dGH',
    unit: 'dGH',
    tone: 'information',
  },
  {
    key: 'temperature',
    label: 'Temperatura',
    shortLabel: 'Temp',
    icon: 'device_thermostat',
    value: 24,
    valueLabel: '24 °C',
    unit: '°C',
    tone: 'warning',
  },
  {
    key: 'iron',
    label: 'Ferro',
    shortLabel: 'Fe',
    icon: 'water_drop',
    value: 0.5,
    valueLabel: '0.5 mg/L',
    unit: 'mg/L',
    tone: 'primary',
  },
  {
    key: 'potassium',
    label: 'Potássio',
    shortLabel: 'K',
    icon: 'water_drop',
    value: 12,
    valueLabel: '12 mg/L',
    unit: 'mg/L',
    tone: 'success',
  },
];

const MEASUREMENTS: readonly AquariumDetailMeasurement[] = [
  measurement('m-1', '2026-02-27T09:30:00', 'pH', 'pH', 7.2, '', 'stable'),
  measurement('m-2', '2026-02-27T09:30:00', 'nitrate', 'NO3', 16, 'mg/L', 'down'),
  measurement('m-3', '2026-02-27T09:30:00', 'temperature', 'Temp', 24, '°C', 'stable'),
  measurement('m-4', '2026-02-26T18:45:00', 'pH', 'pH', 7.2, '', 'up'),
  measurement('m-5', '2026-02-26T18:45:00', 'nitrate', 'NO3', 16, 'mg/L', 'stable'),
  measurement('m-6', '2026-02-26T18:45:00', 'kh', 'KH', 6, 'dKH', 'stable'),
  measurement('m-7', '2026-02-25T10:15:00', 'pH', 'pH', 7.2, '', 'up'),
  measurement('m-8', '2026-02-25T10:15:00', 'nitrate', 'NO3', 14, 'mg/L', 'down'),
  measurement('m-9', '2026-02-25T10:15:00', 'temperature', 'Temp', 24, '°C', 'down'),
  measurement('m-10', '2026-02-24T19:00:00', 'gh', 'GH', 8, 'dGH', 'stable'),
  measurement('m-11', '2026-02-24T19:00:00', 'nitrate', 'NO3', 15, 'mg/L', 'down'),
  measurement('m-12', '2026-02-23T08:20:00', 'pH', 'pH', 7.2, '', 'up'),
  measurement('m-13', '2026-02-23T08:20:00', 'nitrate', 'NO3', 16, 'mg/L', 'up'),
  measurement('m-14', '2026-02-23T08:20:00', 'iron', 'Fe', 0.5, 'mg/L', 'stable'),
];

const APPLICATIONS: readonly AquariumDetailApplication[] = [
  application(
    'a-1',
    '2026-02-26T08:00:00',
    'Prime',
    'Condicionador de água',
    5,
    'ml',
    'Troca semanal de água',
  ),
  application('a-2', '2026-02-24T08:00:00', 'Flourish', 'Fertilizante', 3, 'ml', 'Macronutrientes'),
  application(
    'a-3',
    '2026-02-22T08:00:00',
    'Stability',
    'Bactérias',
    5,
    'ml',
    'Bactérias benéficas',
  ),
  application(
    'a-4',
    '2026-02-19T08:00:00',
    'Prime',
    'Condicionador de água',
    5,
    'ml',
    'Troca semanal de água',
  ),
  application('a-5', '2026-02-17T08:00:00', 'Excel', 'Fonte de carbono', 4, 'ml', 'Dosagem diária'),
];

const AQUATIC_LIFE: readonly AquariumDetailAquaticLife[] = [
  aquaticLife('al-1', 'Neon tetra', 'Paracheirodon innesi', 'Peixe', 12, 'Cardume ativo'),
  aquaticLife('al-2', 'Corydora panda', 'Corydoras panda', 'Peixe', 6, 'Fundo do aquário'),
  aquaticLife(
    'al-3',
    'Anubias nana',
    'Anubias barteri var. nana',
    'Planta',
    4,
    'Fixada em troncos',
  ),
  aquaticLife(
    'al-4',
    'Camarão amano',
    'Caridina multidentata',
    'Invertebrado',
    1,
    'Equipe de limpeza',
  ),
];

export const DEFAULT_AQUARIUM_DETAIL_DEMO_DATA: AquariumDetailDemoData = {
  healthPercent: 92,
  parameters: PARAMETERS,
  measurements: MEASUREMENTS,
  applications: APPLICATIONS,
  aquaticLife: AQUATIC_LIFE,
};

function measurement(
  id: string,
  measuredAt: string,
  parameterKey: string,
  parameterLabel: string,
  value: number,
  unit: string,
  trend: AquariumDetailMeasurement['trend'],
): AquariumDetailMeasurement {
  const measuredDate = new Date(measuredAt);
  const dateLabel = measuredDate.toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeLabel = measuredDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const trendMeta = mapTrend(trend);

  return {
    id,
    measuredAt,
    dateLabel,
    timeLabel,
    parameterKey,
    parameterLabel,
    value,
    unit,
    valueLabel: unit ? `${formatNumber(value)} ${unit}` : formatNumber(value),
    statusLabel: 'Normal',
    statusColor: 'success',
    trend,
    trendIcon: trendMeta.icon,
    trendLabel: trendMeta.label,
  };
}

function application(
  id: string,
  appliedAt: string,
  productName: string,
  productType: string,
  amount: number,
  unit: string,
  notes: string,
): AquariumDetailApplication {
  return {
    id,
    appliedAt,
    dateLabel: new Date(appliedAt).toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    productName,
    productType,
    doseLabel: `${formatNumber(amount)} ${unit}`,
    notes,
  };
}

function aquaticLife(
  id: string,
  name: string,
  scientificName: string,
  typeLabel: string,
  quantity: number,
  notes: string,
): AquariumDetailAquaticLife {
  const introducedAt = '2026-02-01T00:00:00.000Z';

  return {
    id,
    name,
    scientificName,
    typeLabel,
    introducedAt,
    introducedAtLabel: new Date(introducedAt).toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    quantity,
    quantityLabel: `${quantity} ${quantity === 1 ? 'indivíduo' : 'indivíduos'}`,
    notes,
  };
}

function mapTrend(trend: AquariumDetailMeasurement['trend']): { icon: string; label: string } {
  const map: Record<AquariumDetailMeasurement['trend'], { icon: string; label: string }> = {
    up: { icon: 'trending_up', label: 'Aumentando' },
    down: { icon: 'trending_down', label: 'Diminuindo' },
    stable: { icon: 'trending_flat', label: 'Estável' },
    unknown: { icon: 'remove', label: 'Sem dados suficientes' },
  };

  return map[trend];
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
