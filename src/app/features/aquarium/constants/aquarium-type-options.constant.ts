import { CardSelectionOption } from '../../../shared/components/card-selection';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';
import { AquariumWaterType } from '../models/aquarium-api.dto';
import { SystemValueApiDto } from '../models/system-value-api.dto';
import {
  AquariumTypeOptionId,
  AquariumTypeOptionMapping,
} from '../models/aquarium-type-option.model';

export const AQUARIUM_TYPE_MAPPINGS: Record<string, AquariumTypeOptionMapping> = {
  BREEDING: { type: 'BREEDING' },
  COMMUNITY: { type: 'COMMUNITY' },
  COMMUNITY_TANK: { type: 'COMMUNITY' },
  HOSPITAL: { type: 'HOSPITAL' },
  OTHER: { type: 'OTHER' },
  PLANTED: { type: 'PLANTED' },
  SPECIES_ONLY: { type: 'SPECIES_ONLY' },
};

const AQUARIUM_TYPE_LABELS: Record<string, (t: TranslationDictionary) => string> = {
  BREEDING: (t) => t.aquariumCreateTypeBreeding,
  CRABS: (t) => t.aquariumCreateTypeCrabs,
  COMMUNITY: (t) => t.aquariumCreateTypeCommunity,
  COMMUNITY_TANK: (t) => t.aquariumCreateTypeCommunityTank,
  HOSPITAL: (t) => t.aquariumCreateTypeHospital,
  LAKE: (t) => t.aquariumCreateTypeLake,
  OTHER: (t) => t.aquariumCreateTypeOther,
  PALUDARIUM: (t) => t.aquariumCreateTypePaludarium,
  PLANTED: (t) => t.aquariumCreateTypePlanted,
  PLANTED_TANK: (t) => t.aquariumCreateTypePlantedTank,
  REEF: (t) => t.aquariumCreateTypeReef,
  REEF_TANK: (t) => t.aquariumCreateTypeReefTank,
  SHRIMP: (t) => t.aquariumCreateTypeShrimpTank,
  SHRIMP_TANK: (t) => t.aquariumCreateTypeShrimpTank,
  SPECIES_ONLY: (t) => t.aquariumCreateTypeSpeciesOnly,
  TURTLE: (t) => t.aquariumCreateTypeTurtleTank,
  TURTLE_TANK: (t) => t.aquariumCreateTypeTurtleTank,
};

const ALLOWED_AQUARIUM_TYPES_BY_WATER_TYPE: Record<AquariumWaterType, readonly string[]> = {
  FRESHWATER: [
    'BREEDING',
    'COMMUNITY',
    'COMMUNITY_TANK',
    'HOSPITAL',
    'LAKE',
    'PLANTED',
    'PLANTED_TANK',
    'SHRIMP',
    'SHRIMP_TANK',
    'SPECIES_ONLY',
    'TURTLE',
    'TURTLE_TANK',
    'PALUDARIUM',
  ],
  SALTWATER: [
    'BREEDING',
    'COMMUNITY',
    'COMMUNITY_TANK',
    'HOSPITAL',
    'SPECIES_ONLY',
    'REEF',
    'REEF_TANK',
  ],
  BRACKISH: ['BREEDING', 'HOSPITAL', 'CRABS', 'SPECIES_ONLY'],
};

function iconNameForAquariumType(value: string): string {
  switch (value) {
    case 'BREEDING':
    case 'SHRIMP':
    case 'SHRIMP_TANK':
      return 'bubble_chart';
    case 'LAKE':
    case 'COMMUNITY':
    case 'COMMUNITY_TANK':
      return 'water';
    case 'HOSPITAL':
      return 'healing';
    case 'CRABS':
      return 'adb';
    case 'PLANTED':
    case 'PLANTED_TANK':
      return 'local_florist';
    case 'PALUDARIUM':
      return 'terrain';
    case 'REEF':
    case 'REEF_TANK':
      return 'waves';
    case 'SPECIES_ONLY':
    case 'TURTLE':
    case 'TURTLE_TANK':
      return 'pets';
    case 'OTHER':
      return 'category';
    default:
      return 'deployed_code';
  }
}

export function isAquariumTypeAllowedForWaterType(
  aquariumType: string,
  waterType: AquariumWaterType | null,
): boolean {
  if (!waterType) {
    return false;
  }

  return ALLOWED_AQUARIUM_TYPES_BY_WATER_TYPE[waterType].includes(aquariumType);
}

export function mapAquariumTypeOptions(
  values: readonly SystemValueApiDto[],
  t: TranslationDictionary,
  waterType: AquariumWaterType | null,
): CardSelectionOption<AquariumTypeOptionId>[] {
  return values.map((value) => ({
    value: value.systemValue,
    title: AQUARIUM_TYPE_LABELS[value.systemValue]?.(t) ?? value.displayValue,
    description: value.description ?? '',
    iconName: iconNameForAquariumType(value.systemValue),
    disabled: !isAquariumTypeAllowedForWaterType(value.systemValue, waterType),
  }));
}
