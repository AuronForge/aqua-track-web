import { AquariumWaterType } from './aquarium-api.dto';
import { AquariumTypeOptionId } from './aquarium-type-option.model';
import { AquariumDisplayParameterKey } from '../constants/aquarium-display-parameter-options.constant';

export interface AquariumAlertParameterFormValue {
  readonly enabled: boolean;
  readonly minimumValue: string;
  readonly maximumValue: string;
  readonly targetValue: string;
}

export interface AquariumAlertChannelsFormValue {
  readonly dashboard: boolean;
  readonly email: boolean;
}

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
  readonly alertChannels: AquariumAlertChannelsFormValue;
  readonly alertParameters: Record<AquariumDisplayParameterKey, AquariumAlertParameterFormValue>;
  readonly description: string;
}
