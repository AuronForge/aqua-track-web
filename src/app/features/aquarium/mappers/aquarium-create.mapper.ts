import {
  ALL_DISPLAY_PARAMETER_KEYS,
  mapDisplayParameterSelectionToPreferences,
} from '../constants/aquarium-display-parameter-options.constant';
import { AQUARIUM_TYPE_MAPPINGS } from '../constants/aquarium-type-options.constant';
import { CreateAquariumPayload } from '../models/aquarium-api.dto';
import { AquariumCreateFormValue } from '../models/aquarium-create-form-value.model';
import { calculateAquariumVolumeLiters, parseLocalizedNumber } from '../utils/aquarium-volume.util';
import { dateOnlyToIso } from '../utils/date-only-to-iso.util';

function mapAlertParameters(
  value: AquariumCreateFormValue,
): CreateAquariumPayload['alertParameters'] {
  return Object.fromEntries(
    ALL_DISPLAY_PARAMETER_KEYS.map((key) => {
      const parameter = value.alertParameters[key];

      if (!parameter.enabled) {
        return [key, false];
      }

      const minimumValue = parseLocalizedNumber(parameter.minimumValue);
      const maximumValue = parseLocalizedNumber(parameter.maximumValue);
      const targetValue = parseLocalizedNumber(parameter.targetValue);

      if (minimumValue === null || maximumValue === null || targetValue === null) {
        throw new Error(`Alert parameter "${key}" must contain valid numeric thresholds.`);
      }

      return [
        key,
        {
          minimumValue,
          maximumValue,
          targetValue,
        },
      ];
    }),
  );
}

export function mapAquariumCreateFormToPayload(
  value: AquariumCreateFormValue,
): CreateAquariumPayload {
  if (!value.aquariumType) {
    throw new Error('Aquarium type is required to build the payload.');
  }

  if (!value.waterType) {
    throw new Error('Water type is required to build the payload.');
  }

  const volume = value.usePhysicalDimensions
    ? calculateAquariumVolumeLiters(value.lengthCm, value.widthCm, value.heightCm)
    : parseLocalizedNumber(value.volume);

  if (volume === null) {
    throw new Error(
      value.usePhysicalDimensions
        ? 'Aquarium dimensions must produce a valid volume.'
        : 'Aquarium volume must be a valid positive number.',
    );
  }

  if (volume <= 0) {
    throw new Error('Aquarium volume must be a valid positive number.');
  }

  const mapping = AQUARIUM_TYPE_MAPPINGS[value.aquariumType];
  const description = value.description.trim();

  return {
    name: value.name.trim(),
    description: description || null,
    type: mapping?.type ?? value.aquariumType,
    waterType: value.waterType,
    volume,
    volumeUnit: 'LITER',
    setupDate: dateOnlyToIso(value.setupDate),
    displayPreferences: mapDisplayParameterSelectionToPreferences(value.displayParameters),
    alertParameters: mapAlertParameters(value),
  };
}
