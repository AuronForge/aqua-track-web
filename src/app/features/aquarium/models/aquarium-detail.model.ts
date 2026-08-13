import { BadgeColor } from '../../../shared/components/badge/badge-color.type';

export type AquariumDetailTabId = 'overview' | 'measurements' | 'applications' | 'aquatic-life';
export type AquariumDetailLoadStatus = 'loading' | 'ready' | 'invalid-id' | 'not-found' | 'error';
export type AquariumMeasurementTrend = 'up' | 'down' | 'stable' | 'unknown';
export type AquariumHealthStatus = 'stable' | 'attention' | 'critical' | 'unknown';
export type AquariumResourceStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface AquariumPaginationViewModel {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

export interface AquariumWaterParameter {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly category: string;
  readonly defaultUnit: string;
}

export interface AquariumDetailParameter {
  readonly key: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly icon: string;
  readonly value: number | null;
  readonly valueLabel: string;
  readonly unit: string;
  readonly tone: 'primary' | 'success' | 'warning' | 'error' | 'information' | 'tertiary';
  readonly measuredAt?: string;
  readonly statusLabel?: string;
  readonly statusColor?: BadgeColor;
  readonly trend?: AquariumMeasurementTrend;
  readonly trendIcon?: string;
  readonly trendLabel?: string;
}

export interface AquariumDetailSummary {
  readonly capacityLabel: string;
  readonly setupDateLabel: string;
  readonly healthPercent: number | null;
  readonly healthScoreLabel: string;
  readonly healthStatus: AquariumHealthStatus;
  readonly healthStatusLabel: string;
  readonly healthStatusColor: BadgeColor;
}

export interface AquariumDetailMeasurement extends Record<string, unknown> {
  readonly id: string;
  readonly measuredAt: string;
  readonly dateLabel: string;
  readonly timeLabel: string;
  readonly parameterKey: string;
  readonly parameterLabel: string;
  readonly value: number;
  readonly unit: string;
  readonly valueLabel: string;
  readonly statusLabel: string;
  readonly statusColor: BadgeColor;
  readonly trend: AquariumMeasurementTrend;
  readonly trendIcon: string;
  readonly trendLabel: string;
}

export interface AquariumDetailApplication extends Record<string, unknown> {
  readonly id: string;
  readonly appliedAt: string;
  readonly dateLabel: string;
  readonly productName: string;
  readonly productType: string;
  readonly doseLabel: string;
  readonly notes: string;
}

export interface AquariumDetailAquaticLife extends Record<string, unknown> {
  readonly id: string;
  readonly name: string;
  readonly scientificName: string;
  readonly typeLabel: string;
  readonly introducedAt: string | null;
  readonly introducedAtLabel: string;
  readonly quantity: number;
  readonly quantityLabel: string;
  readonly notes: string;
}

export interface AquariumDetailViewModel {
  readonly id: string;
  readonly name: string;
  readonly typeLabel: string;
  readonly waterTypeLabel: string;
  readonly volumeLabel: string;
  readonly setupDateLabel: string;
  readonly statusLabel: string;
  readonly statusColor: BadgeColor;
  readonly heroImageUrl: string | null;
  readonly heroAlt: string;
  readonly summary: AquariumDetailSummary;
  readonly waterParameters: readonly AquariumWaterParameter[];
  readonly parameters: readonly AquariumDetailParameter[];
  readonly measurements: readonly AquariumDetailMeasurement[];
  readonly measurementsPagination: AquariumPaginationViewModel;
  readonly applications: readonly AquariumDetailApplication[];
  readonly applicationsPagination: AquariumPaginationViewModel;
  readonly aquaticLife: readonly AquariumDetailAquaticLife[];
  readonly aquaticLifePagination: AquariumPaginationViewModel;
}

export interface NewAquariumMeasurementPayload {
  readonly parameterKey: string;
  readonly value: number;
  readonly date: string;
  readonly time: string;
  readonly notes: string | null;
}
