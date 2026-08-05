import { TRANSLATIONS } from '../../../shared/constants/translations.constant';
import { SystemValueApiDto } from '../models/system-value-api.dto';
import { mapAquariumTypeFilterOptions } from './aquarium-type-filter-options.mapper';

describe('mapAquariumTypeFilterOptions', () => {
  it('should add the all-types option as the first item with a null id', () => {
    const options = mapAquariumTypeFilterOptions([], TRANSLATIONS.pt);

    expect(options[0]).toEqual({
      id: null,
      title: TRANSLATIONS.pt.homeAquariumFiltersTypePlaceholder,
    });
  });

  it('should map systemValue as the option id and preserve the description', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'REEF_TANK',
        description: 'Corais e invertebrados.',
        displayValue: 'Reef Tank',
      },
    ];

    const options = mapAquariumTypeFilterOptions(values, TRANSLATIONS.pt);

    expect(options[1]).toEqual({
      id: 'REEF_TANK',
      title: TRANSLATIONS.pt.aquariumCreateTypeReefTank,
      subtitle: 'Corais e invertebrados.',
    });
  });

  it('should prefer the central translation and fallback to displayValue or systemValue', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'COMMUNITY_TANK',
        description: null,
        displayValue: 'Community Tank',
      },
      {
        id: '2',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'LEGACY_TYPE',
        description: null,
        displayValue: 'Legacy Display',
      },
      {
        id: '3',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'RAW_ONLY',
        description: null,
        displayValue: '   ',
      },
    ];

    const options = mapAquariumTypeFilterOptions(values, TRANSLATIONS.pt);

    expect(options[1]?.title).toBe(TRANSLATIONS.pt.aquariumCreateTypeCommunityTank);
    expect(options[2]?.title).toBe('Legacy Display');
    expect(options[3]?.title).toBe('RAW_ONLY');
  });

  it('should discard invalid entries, duplicates, and values from other catalogs', () => {
    const values: SystemValueApiDto[] = [
      {
        id: '1',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'OTHER',
        description: null,
        displayValue: 'Other',
      },
      {
        id: '2',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: 'OTHER',
        description: 'Duplicado',
        displayValue: 'Other Duplicate',
      },
      {
        id: '3',
        rootSystemValue: 'WATER_TYPE',
        systemValue: 'FRESHWATER',
        description: null,
        displayValue: 'Freshwater',
      },
      {
        id: '4',
        rootSystemValue: 'AQUARIUM_TYPE',
        systemValue: '   ',
        description: null,
        displayValue: 'Broken',
      },
    ];

    const options = mapAquariumTypeFilterOptions(values, TRANSLATIONS.pt);

    expect(options).toHaveLength(2);
    expect(options[1]?.id).toBe('OTHER');
    expect(options[1]?.title).toBe(TRANSLATIONS.pt.aquariumCreateTypeOther);
  });
});
