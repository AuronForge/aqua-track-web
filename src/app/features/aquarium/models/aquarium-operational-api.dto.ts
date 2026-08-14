export type HealthStatusDto = 'STABLE' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN';
export type MeasurementStatusDto = 'BELOW' | 'NORMAL' | 'ABOVE' | 'UNKNOWN';
export type MeasurementTrendDto = 'UP' | 'DOWN' | 'STABLE' | 'UNKNOWN';

export interface LatestMeasurementDto {
  readonly parameter: string;
  readonly parameterName: string;
  readonly value: number;
  readonly unit: string;
  readonly measuredAt: string;
  readonly status: MeasurementStatusDto;
  readonly trend: MeasurementTrendDto;
}

export interface AquariumOverviewDto {
  readonly health: {
    readonly score: number | null;
    readonly status: HealthStatusDto;
  };
  readonly latestMeasurements: readonly LatestMeasurementDto[];
}

export interface WaterParameterDto {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly category: string;
  readonly defaultUnit: string;
  readonly applicableWaterTypes: readonly string[];
  readonly applicableAquariumTypes: readonly string[];
  readonly minRecommendedValue: number | null;
  readonly maxRecommendedValue: number | null;
  readonly isActive: boolean;
}

export interface MeasurementDto {
  readonly id: string;
  readonly waterParameter: string;
  readonly parameterName?: string;
  readonly value: number;
  readonly unit: string;
  readonly measuredAt: string;
  readonly notes?: string | null;
  readonly status?: MeasurementStatusDto;
  readonly trend?: MeasurementTrendDto;
}

export interface AquariumApplicationDto {
  readonly id: string;
  readonly productId?: string | null;
  readonly productName: string;
  readonly productType: string;
  readonly dose: number;
  readonly doseUnit: string;
  readonly appliedAt: string;
  readonly notes?: string | null;
}

export interface ApiPaginationDto {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
}

export interface MeasurementsPageDto {
  readonly data: readonly MeasurementDto[];
  readonly pagination: ApiPaginationDto;
}

export interface AquariumApplicationsPageDto {
  readonly data: readonly AquariumApplicationDto[];
  readonly pagination: ApiPaginationDto;
}

export interface MeasurementQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly parameter?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly sort?: 'measuredAt' | 'parameter' | 'value';
  readonly direction?: 'asc' | 'desc';
}

export interface ApplicationQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly product?: string;
  readonly type?: string;
  readonly sort?: 'appliedAt' | 'productName' | 'productType' | 'amount';
  readonly direction?: 'asc' | 'desc';
}

export interface CreateMeasurementRequestDto {
  readonly waterParameter: string;
  readonly value: number;
  readonly unit?: string;
  readonly measuredAt?: string;
  readonly notes?: string | null;
}

export interface CreateAquariumApplicationRequestDto {
  readonly productId?: string;
  readonly productName: string;
  readonly productType: string;
  readonly dose: number;
  readonly doseUnit: string;
  readonly appliedAt?: string;
  readonly notes?: string | null;
}
