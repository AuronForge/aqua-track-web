import { DEFAULT_AQUARIUM_DISPLAY_PREFERENCES } from '../constants/aquarium-display-preferences.constant';
import { AQUARIUM_TYPE_MAPPINGS } from '../constants/aquarium-type-options.constant';
import { CreateAquariumPayload } from '../models/aquarium-api.dto';
import { AquariumCreateFormValue } from '../models/aquarium-create-form-value.model';
import { calculateAquariumVolumeLiters } from '../utils/aquarium-volume.util';
import { dateOnlyToIso } from '../utils/date-only-to-iso.util';

export function mapAquariumCreateFormToPayload(
  value: AquariumCreateFormValue,
): CreateAquariumPayload {
  if (!value.aquariumType) {
    throw new Error('Aquarium type is required to build the payload.');
  }

  const volume = calculateAquariumVolumeLiters(value.lengthCm, value.widthCm, value.heightCm);

  if (volume === null) {
    throw new Error('Aquarium dimensions must produce a valid volume.');
  }

  const mapping = AQUARIUM_TYPE_MAPPINGS[value.aquariumType];
  const description = value.description.trim();

  return {
    name: value.name.trim(),
    description: description || null,
    type: mapping.type,
    waterType: mapping.waterType,
    volume,
    volumeUnit: 'LITER',
    setupDate: dateOnlyToIso(value.setupDate),
    displayPreferences: { ...DEFAULT_AQUARIUM_DISPLAY_PREFERENCES },
  };
}
