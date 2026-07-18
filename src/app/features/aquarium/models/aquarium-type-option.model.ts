import { AquariumType } from './aquarium-api.dto';

export type AquariumTypeOptionId = string;

export interface AquariumTypeOptionMapping {
  readonly type: AquariumType;
}
