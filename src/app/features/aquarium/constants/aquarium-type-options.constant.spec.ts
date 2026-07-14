import {
  AQUARIUM_TYPE_MAPPINGS,
  isAquariumTypeAllowedForWaterType,
  mapAquariumTypeOptions,
} from './aquarium-type-options.constant';
import { SystemValueApiDto } from '../models/system-value-api.dto';
import { TRANSLATIONS } from '../../../shared/constants/translations.constant';

describe('aquarium-type-options.constant', () => {
  it('maps supported aquarium system values to card selection options', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'BREEDING',
        description: 'Breeding aquarium.',
        displayValue: 'Breeding',
      },
      {
        id: '2',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'COMMUNITY',
        description: null,
        displayValue: 'Community',
      },
      {
        id: '3',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'COMMUNITY_TANK',
        description: 'Community aquarium.',
        displayValue: 'Community Tank',
      },
      {
        id: '4',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'CRABS',
        description: 'Crabs aquarium.',
        displayValue: 'Crabs',
      },
      {
        id: '5',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'HOSPITAL',
        description: 'Hospital aquarium.',
        displayValue: 'Hospital',
      },
      {
        id: '6',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'LAKE',
        description: 'Lake aquarium.',
        displayValue: 'Lake',
      },
      {
        id: '7',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'PALUDARIUM',
        description: 'Paludarium aquarium.',
        displayValue: 'Paludarium',
      },
      {
        id: '8',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'PLANTED',
        description: 'Planted aquarium.',
        displayValue: 'Planted',
      },
      {
        id: '9',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'PLANTED_TANK',
        description: 'Planted tank aquarium.',
        displayValue: 'Planted Tank',
      },
      {
        id: '10',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'REEF_TANK',
        description: 'Reef tank aquarium.',
        displayValue: 'Reef Tank',
      },
      {
        id: '11',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'SHRIMP_TANK',
        description: 'Shrimp tank aquarium.',
        displayValue: 'Shrimp Tank',
      },
      {
        id: '12',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'TURTLE_TANK',
        description: 'Turtle tank aquarium.',
        displayValue: 'Turtle Tank',
      },
      {
        id: '13',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'SPECIES_ONLY',
        description: 'Species only aquarium.',
        displayValue: 'Species Only',
      },
      {
        id: '14',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'OTHER',
        description: 'Other aquarium type.',
        displayValue: 'Other',
      },
    ];

    expect(mapAquariumTypeOptions(values, TRANSLATIONS.en, 'FRESHWATER')).toEqual([
      {
        value: 'BREEDING',
        title: 'Breeding',
        description: 'Breeding aquarium.',
        iconName: 'bubble_chart',
        disabled: false,
      },
      {
        value: 'COMMUNITY',
        title: 'Community',
        description: '',
        iconName: 'water',
        disabled: false,
      },
      {
        value: 'COMMUNITY_TANK',
        title: 'Community Tank',
        description: 'Community aquarium.',
        iconName: 'water',
        disabled: false,
      },
      {
        value: 'CRABS',
        title: 'Crabs',
        description: 'Crabs aquarium.',
        iconName: 'adb',
        disabled: true,
      },
      {
        value: 'HOSPITAL',
        title: 'Hospital',
        description: 'Hospital aquarium.',
        iconName: 'healing',
        disabled: false,
      },
      {
        value: 'LAKE',
        title: 'Lake',
        description: 'Lake aquarium.',
        iconName: 'water',
        disabled: false,
      },
      {
        value: 'PALUDARIUM',
        title: 'Paludarium',
        description: 'Paludarium aquarium.',
        iconName: 'terrain',
        disabled: false,
      },
      {
        value: 'PLANTED',
        title: 'Planted',
        description: 'Planted aquarium.',
        iconName: 'local_florist',
        disabled: false,
      },
      {
        value: 'PLANTED_TANK',
        title: 'Planted Tank',
        description: 'Planted tank aquarium.',
        iconName: 'local_florist',
        disabled: false,
      },
      {
        value: 'REEF_TANK',
        title: 'Reef Tank',
        description: 'Reef tank aquarium.',
        iconName: 'waves',
        disabled: true,
      },
      {
        value: 'SHRIMP_TANK',
        title: 'Shrimp Tank',
        description: 'Shrimp tank aquarium.',
        iconName: 'bubble_chart',
        disabled: false,
      },
      {
        value: 'TURTLE_TANK',
        title: 'Turtle Tank',
        description: 'Turtle tank aquarium.',
        iconName: 'pets',
        disabled: false,
      },
      {
        value: 'SPECIES_ONLY',
        title: 'Species Only',
        description: 'Species only aquarium.',
        iconName: 'pets',
        disabled: false,
      },
      {
        value: 'OTHER',
        title: 'Other',
        description: 'Other aquarium type.',
        iconName: 'category',
        disabled: true,
      },
    ]);
  });

  it('keeps unsupported system values visible with a fallback icon', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'UNSUPPORTED',
        description: 'Unsupported aquarium.',
        displayValue: 'Unsupported',
      },
    ];

    expect(mapAquariumTypeOptions(values, TRANSLATIONS.en, 'FRESHWATER')).toEqual([
      {
        value: 'UNSUPPORTED',
        title: 'Unsupported',
        description: 'Unsupported aquarium.',
        iconName: 'deployed_code',
        disabled: true,
      },
    ]);
  });

  it('returns aquarium types disabled until a water type is selected', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'COMMUNITY_TANK',
        description: 'Community aquarium.',
        displayValue: 'Community Tank',
      },
    ];

    expect(mapAquariumTypeOptions(values, TRANSLATIONS.en, null)).toEqual([
      {
        value: 'COMMUNITY_TANK',
        title: 'Community Tank',
        description: 'Community aquarium.',
        iconName: 'water',
        disabled: true,
      },
    ]);
  });

  it('disables incompatible aquarium types for the selected water type', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'COMMUNITY_TANK',
        description: 'Community aquarium.',
        displayValue: 'Community Tank',
      },
      {
        id: '2',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'REEF_TANK',
        description: 'Reef tank aquarium.',
        displayValue: 'Reef Tank',
      },
      {
        id: '3',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'CRABS',
        description: 'Crabs aquarium.',
        displayValue: 'Crabs',
      },
    ];

    expect(mapAquariumTypeOptions(values, TRANSLATIONS.pt, 'SALTWATER')).toEqual([
      expect.objectContaining({ value: 'COMMUNITY_TANK', disabled: false }),
      expect.objectContaining({ value: 'REEF_TANK', disabled: false }),
      expect.objectContaining({ value: 'CRABS', disabled: true }),
    ]);
    expect(mapAquariumTypeOptions(values, TRANSLATIONS.pt, 'BRACKISH')).toEqual([
      expect.objectContaining({ value: 'COMMUNITY_TANK', disabled: true }),
      expect.objectContaining({ value: 'REEF_TANK', disabled: true }),
      expect.objectContaining({ value: 'CRABS', disabled: false }),
    ]);
  });

  it('checks water type compatibility for aquarium types', () => {
    expect(isAquariumTypeAllowedForWaterType('PALUDARIUM', 'FRESHWATER')).toBe(true);
    expect(isAquariumTypeAllowedForWaterType('REEF_TANK', 'FRESHWATER')).toBe(false);
    expect(isAquariumTypeAllowedForWaterType('CRABS', 'BRACKISH')).toBe(true);
    expect(isAquariumTypeAllowedForWaterType('COMMUNITY_TANK', 'BRACKISH')).toBe(false);
    expect(isAquariumTypeAllowedForWaterType('COMMUNITY_TANK', null)).toBe(false);
  });

  it('keeps localized labels when the water type allows the option', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'PLANTED_TANK',
        description: 'Aquario voltado ao cultivo de plantas aquaticas.',
        displayValue: 'Planted Tank',
      },
      {
        id: '2',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'TURTLE_TANK',
        description: 'Aquario configurado para tartarugas aquaticas.',
        displayValue: 'Turtle Tank',
      },
    ];

    expect(mapAquariumTypeOptions(values, TRANSLATIONS.pt, 'FRESHWATER')).toEqual([
      expect.objectContaining({
        value: 'PLANTED_TANK',
        title: TRANSLATIONS.pt.aquariumCreateTypePlantedTank,
        disabled: false,
      }),
      expect.objectContaining({
        value: 'TURTLE_TANK',
        title: TRANSLATIONS.pt.aquariumCreateTypeTurtleTank,
        disabled: false,
      }),
    ]);
  });

  it('maps brackish-only aquarium types with dedicated icons', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'CRABS',
        description: 'Crabs aquarium.',
        displayValue: 'Crabs',
      },
    ];

    expect(mapAquariumTypeOptions(values, TRANSLATIONS.en, 'BRACKISH')).toEqual([
      {
        value: 'CRABS',
        title: 'Crabs',
        description: 'Crabs aquarium.',
        iconName: 'adb',
        disabled: false,
      },
    ]);
  });

  it('contains payload mappings for supported aquarium system values', () => {
    expect(AQUARIUM_TYPE_MAPPINGS.BREEDING).toEqual({ type: 'BREEDING' });
    expect(AQUARIUM_TYPE_MAPPINGS.COMMUNITY).toEqual({ type: 'COMMUNITY' });
    expect(AQUARIUM_TYPE_MAPPINGS.COMMUNITY_TANK).toEqual({ type: 'COMMUNITY' });
    expect(AQUARIUM_TYPE_MAPPINGS.HOSPITAL).toEqual({ type: 'HOSPITAL' });
    expect(AQUARIUM_TYPE_MAPPINGS.OTHER).toEqual({ type: 'OTHER' });
    expect(AQUARIUM_TYPE_MAPPINGS.PLANTED).toEqual({ type: 'PLANTED' });
    expect(AQUARIUM_TYPE_MAPPINGS.SPECIES_ONLY).toEqual({ type: 'SPECIES_ONLY' });
  });
});
