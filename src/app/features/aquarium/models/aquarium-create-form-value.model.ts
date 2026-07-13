import { AquariumTypeOptionId } from './aquarium-type-option.model';

export interface AquariumCreateFormValue {
  readonly name: string;
  readonly aquariumType: AquariumTypeOptionId | null;
  readonly setupDate: string;
  readonly lengthCm: string;
  readonly widthCm: string;
  readonly heightCm: string;
  readonly description: string;
}
