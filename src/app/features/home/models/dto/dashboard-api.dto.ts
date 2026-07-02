export type AquariumHealthStatus = 'STABLE' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN';
export type WaterParameterStatus = 'NORMAL' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN';
export type VariationDirection = 'UP' | 'DOWN' | 'STABLE' | 'UNKNOWN';
export type MeasurementUnit =
  | 'PH'
  | 'CELSIUS'
  | 'PPM'
  | 'MG_L'
  | 'DKH'
  | 'DGH'
  | 'SPECIFIC_GRAVITY'
  | 'NONE'
  | string;
export type VolumeUnit = 'LITER' | 'GALLON';
export type AquariumType = 'COMMUNITY' | 'PLANTED' | 'REEF' | 'SHRIMP' | 'SPECIES_ONLY' | string;
export type WaterType = 'FRESHWATER' | 'SALTWATER' | 'BRACKISH' | string;

export interface AquariumSummaryValueDto {
  value: number;
  unit: MeasurementUnit;
  measuredAt: string;
}

export interface AquariumSummaryDto {
  ph?: AquariumSummaryValueDto;
  temperature?: AquariumSummaryValueDto;
}

export interface WaterParameterVariationDto {
  value: number;
  unit: MeasurementUnit;
  direction: VariationDirection;
}

export interface WaterParameterSeriesDto {
  date: string;
  value: number;
}

export interface WaterParameterDto {
  key: string;
  name: string;
  unit: MeasurementUnit;
  isDisplayed: boolean;
  periodLabel: string;
  variation: WaterParameterVariationDto;
  status: WaterParameterStatus;
  minRecommendedValue: number | null;
  maxRecommendedValue: number | null;
  series: WaterParameterSeriesDto[];
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
  waterParameters: WaterParameterDto[];
}

export interface RecentMeasurementDto {
  id: string;
  waterParameterName: string;
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
  aquariumName: string;
  productName: string;
  amount: number;
  unit: string;
  appliedAt: string;
  notes: string | null;
}

export interface DashboardApiDto {
  aquariums: DashboardAquariumDto[];
  recentMeasurements: RecentMeasurementDto[];
  recentApplications: RecentApplicationDto[];
}
