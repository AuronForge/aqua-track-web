import { AquariumWaterType } from './aquarium-api.dto';

export type AquariumListStatus = 'STABLE' | 'ATTENTION' | 'CRITICAL' | 'UNKNOWN';

export type AquariumInstallTimeUnit = 'MONTH' | 'YEAR';

export type AquariumParameterKey = 'ph' | 'temperature' | 'nitrate';

export interface AquariumListItemModel {
  readonly id: string;
  readonly name: string;
  readonly typeLabelKey:
    | 'waterTypeFreshwater'
    | 'waterTypeSaltwater'
    | 'aquariumCreateTypePlanted'
    | 'aquariumCreateTypeCommunityTank';
  readonly waterType: AquariumWaterType;
  readonly volumeLiters: number;
  readonly installedAmount: number;
  readonly installedUnit: AquariumInstallTimeUnit;
  readonly status: AquariumListStatus;
  readonly recentParameters: readonly AquariumRecentParameterModel[];
}

export interface AquariumRecentParameterModel {
  readonly key: AquariumParameterKey;
  readonly value: number;
}
