import { AquariumWaterType } from './aquarium-api.dto';
import { AquariumTypeOptionId } from './aquarium-type-option.model';
import { AquariumDisplayParameterKey } from '../constants/aquarium-display-parameter-options.constant';

export interface AquariumCreateFormValue {
  readonly name: string;
  readonly aquariumType: AquariumTypeOptionId | null;
  readonly waterType: AquariumWaterType | null;
  readonly setupDate: string;
  readonly usePhysicalDimensions: boolean;
  readonly lengthCm: string;
  readonly widthCm: string;
  readonly heightCm: string;
  readonly volume: string;
  readonly displayParameters: readonly AquariumDisplayParameterKey[];
  readonly description: string;
}
