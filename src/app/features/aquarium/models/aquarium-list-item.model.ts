import { AquariumType, AquariumWaterType } from './aquarium-api.dto';

export type AquariumListStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type AquariumListInstallTimeUnit = 'MONTH' | 'YEAR';

export type AquariumParameterKey = 'ph' | 'temperature' | 'nitrate';

export interface AquariumListItemModel {
  readonly id: string;
  readonly name: string;
  readonly aquariumType: AquariumType;
  readonly waterType: AquariumWaterType;
  readonly subtitle: string;
  readonly volumeLiters: number;
  readonly installedAmount: number;
  readonly installedUnit: AquariumListInstallTimeUnit;
  readonly status: AquariumListStatus;
  readonly recentParameters: readonly AquariumRecentParameterModel[];
}

export interface AquariumRecentParameterModel {
  readonly key: AquariumParameterKey;
  readonly value: number;
}
