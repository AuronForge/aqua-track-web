import { CardSelectionOption } from '../../../shared/components/card-selection';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';
import { AquariumWaterType } from '../models/aquarium-api.dto';
import { SystemValueApiDto } from '../models/system-value-api.dto';

const WATER_TYPE_DESCRIPTIONS: Record<AquariumWaterType, (t: TranslationDictionary) => string> = {
  FRESHWATER: (t) => t.aquariumCreateWaterTypeFreshwaterDescription,
  SALTWATER: (t) => t.aquariumCreateWaterTypeSaltwaterDescription,
  BRACKISH: (t) => t.aquariumCreateWaterTypeBrackishDescription,
};

const WATER_TYPE_LABELS: Record<AquariumWaterType, (t: TranslationDictionary) => string> = {
  FRESHWATER: (t) => t.waterTypeFreshwater,
  SALTWATER: (t) => t.waterTypeSaltwater,
  BRACKISH: (t) => t.waterTypeBrackish,
};

function isAquariumWaterType(value: string): value is AquariumWaterType {
  return value === 'FRESHWATER' || value === 'SALTWATER' || value === 'BRACKISH';
}

function iconNameForWaterType(value: AquariumWaterType): string {
  switch (value) {
    case 'FRESHWATER':
      return 'water_drop';
    case 'SALTWATER':
      return 'waves';
    case 'BRACKISH':
      return 'tsunami';
  }
}

export function mapAquariumWaterTypeOptions(
  values: readonly SystemValueApiDto[],
  t: TranslationDictionary,
): CardSelectionOption<AquariumWaterType>[] {
  return values.flatMap((value) => {
    if (!isAquariumWaterType(value.systemValue)) {
      return [];
    }

    const waterType = value.systemValue;

    return [
      {
        value: waterType,
        title: WATER_TYPE_LABELS[waterType](t),
        description: WATER_TYPE_DESCRIPTIONS[waterType](t),
        iconName: iconNameForWaterType(waterType),
      },
    ];
  });
}
