import { CardSelectionOption } from '../../../shared/components/card-selection';
import {
  AquariumTypeOptionId,
  AquariumTypeOptionMapping,
} from '../models/aquarium-type-option.model';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';

export const AQUARIUM_TYPE_MAPPINGS: Record<AquariumTypeOptionId, AquariumTypeOptionMapping> = {
  freshwater: { type: 'COMMUNITY', waterType: 'FRESHWATER' },
  planted: { type: 'PLANTED', waterType: 'FRESHWATER' },
  saltwater: { type: 'COMMUNITY', waterType: 'SALTWATER' },
  shrimp: { type: 'BREEDING', waterType: 'FRESHWATER' },
  turtle: { type: 'SPECIES_ONLY', waterType: 'FRESHWATER' },
};

export function buildAquariumTypeOptions(
  t: TranslationDictionary,
): CardSelectionOption<AquariumTypeOptionId>[] {
  return [
    {
      value: 'freshwater',
      title: t.aquariumCreateTypeFreshwater,
      description: t.aquariumCreateTypeFreshwaterDescription,
      iconName: 'water_drop',
    },
    {
      value: 'planted',
      title: t.aquariumCreateTypePlanted,
      description: t.aquariumCreateTypePlantedDescription,
      iconName: 'psychiatry',
    },
    {
      value: 'saltwater',
      title: t.aquariumCreateTypeSaltwater,
      description: t.aquariumCreateTypeSaltwaterDescription,
      iconName: 'waves',
    },
    {
      value: 'shrimp',
      title: t.aquariumCreateTypeShrimp,
      description: t.aquariumCreateTypeShrimpDescription,
      iconName: 'bubble_chart',
    },
    {
      value: 'turtle',
      title: t.aquariumCreateTypeTurtle,
      description: t.aquariumCreateTypeTurtleDescription,
      iconName: 'pets',
    },
  ];
}
