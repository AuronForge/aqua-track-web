import { DEFAULT_AQUARIUM_DISPLAY_PREFERENCES } from '../constants/aquarium-display-preferences.constant';
import { AquariumTypeOptionId } from '../models/aquarium-type-option.model';
import { mapAquariumCreateFormToPayload } from './aquarium-create.mapper';

describe('mapAquariumCreateFormToPayload', () => {
  const buildFormValue = (aquariumType: AquariumTypeOptionId = 'freshwater') => ({
    name: '  Comunitario 60L  ',
    aquariumType,
    setupDate: '2026-07-09',
    lengthCm: '60',
    widthCm: '40',
    heightCm: '30',
    description: '  Plantado com neons  ',
  });

  it('maps trimmed form values to the API payload without raw dimensions or photo', () => {
    const payload = mapAquariumCreateFormToPayload(buildFormValue());

    expect(payload).toEqual({
      name: 'Comunitario 60L',
      description: 'Plantado com neons',
      type: 'COMMUNITY',
      waterType: 'FRESHWATER',
      volume: 72,
      volumeUnit: 'LITER',
      setupDate: '2026-07-09T00:00:00.000Z',
      displayPreferences: DEFAULT_AQUARIUM_DISPLAY_PREFERENCES,
    });
    expect(payload).not.toHaveProperty('lengthCm');
    expect(payload).not.toHaveProperty('widthCm');
    expect(payload).not.toHaveProperty('heightCm');
    expect(payload).not.toHaveProperty('photo');
  });

  it.each([
    ['freshwater', 'COMMUNITY', 'FRESHWATER'],
    ['planted', 'PLANTED', 'FRESHWATER'],
    ['saltwater', 'COMMUNITY', 'SALTWATER'],
    ['shrimp', 'BREEDING', 'FRESHWATER'],
    ['turtle', 'SPECIES_ONLY', 'FRESHWATER'],
  ] as const)('maps %s to type %s and waterType %s', (option, type, waterType) => {
    expect(mapAquariumCreateFormToPayload(buildFormValue(option))).toMatchObject({
      type,
      waterType,
    });
  });

  it('sends null description when notes are blank', () => {
    expect(
      mapAquariumCreateFormToPayload({
        ...buildFormValue(),
        description: '   ',
      }).description,
    ).toBeNull();
  });

  it('throws when required mapped values are missing or invalid', () => {
    expect(() =>
      mapAquariumCreateFormToPayload({ ...buildFormValue(), aquariumType: null }),
    ).toThrow('Aquarium type is required');
    expect(() => mapAquariumCreateFormToPayload({ ...buildFormValue(), widthCm: '0' })).toThrow(
      'Aquarium dimensions must produce a valid volume',
    );
  });
});
