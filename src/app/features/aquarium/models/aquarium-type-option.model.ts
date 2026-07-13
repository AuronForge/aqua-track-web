import { AquariumType, AquariumWaterType } from './aquarium-api.dto';

export type AquariumTypeOptionId = 'freshwater' | 'planted' | 'saltwater' | 'shrimp' | 'turtle';

export interface AquariumTypeOptionMapping {
  readonly type: AquariumType;
  readonly waterType: AquariumWaterType;
}
