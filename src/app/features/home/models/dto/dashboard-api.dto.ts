export type AquariumHealthStatus = 'STABLE' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN';
export type WaterParameterStatus = 'NORMAL' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN';
export type VariationDirection = 'UP' | 'DOWN' | 'STABLE' | 'UNKNOWN';
export type MeasurementUnit = 'PH' | 'CELSIUS' | 'PPM' | 'MG_L' | 'DKH' | 'DGH' | 'NONE' | string;
export type VolumeUnit = 'LITER' | 'GALLON';
export type AquariumType = 'COMMUNITY' | 'PLANTED' | 'REEF' | 'SHRIMP' | string;
export type WaterType = 'FRESHWATER' | 'SALTWATER' | 'BRACKISH' | string;

export interface AquariumSummaryDto {
  ph?: number;
  temperature?: number;
}

export interface DashboardAquariumDto {
  id: string;
  name: string;
  type: AquariumType;
  waterType: WaterType;
  volume: number;
  volumeUnit: VolumeUnit;
  healthStatus: AquariumHealthStatus;
  summary: AquariumSummaryDto;
}

export interface WaterParameterVariationDto {
  value: number;
  unit: MeasurementUnit;
  direction: VariationDirection;
}

export interface WaterParameterDto {
  key: string;
  name: string;
  unit: MeasurementUnit;
  periodLabel: string;
  variation: WaterParameterVariationDto;
  status: WaterParameterStatus;
  minRecommendedValue: number | null;
  maxRecommendedValue: number | null;
  series: unknown[];
}

export interface RecentMeasurementDto {
  id: string;
  parameterName: string;
  parameterKey: string;
  aquariumId: string;
  aquariumName: string;
  value: number;
  unit: MeasurementUnit;
  status: WaterParameterStatus;
  measuredAt: string;
}

export interface RecentApplicationDto {
  id: string;
  productName: string;
  aquariumId: string;
  aquariumName: string;
  dosage: number;
  dosageUnit: string;
  appliedAt: string;
}

export interface DashboardSummaryDto {
  totalAquariums: number;
  stableAquariums: number;
  attentionAquariums: number;
  criticalAquariums: number;
  unknownAquariums: number;
  periodDays: number;
}

export interface DashboardApiDto {
  aquariums: DashboardAquariumDto[];
  selectedAquarium: { id: string; name: string } | null;
  waterParameters: WaterParameterDto[];
  recentMeasurements: RecentMeasurementDto[];
  recentApplications: RecentApplicationDto[];
  summary: DashboardSummaryDto;
}
