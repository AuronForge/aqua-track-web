import { AquariumTypeOptionId } from '../models/aquarium-type-option.model';
import { mapAquariumCreateFormToPayload } from './aquarium-create.mapper';
import {
  ALL_DISPLAY_PARAMETER_KEYS,
  DEFAULT_DISPLAY_PARAMETER_KEYS,
} from '../constants/aquarium-display-parameter-options.constant';

describe('mapAquariumCreateFormToPayload', () => {
  const buildFormValue = (aquariumType: AquariumTypeOptionId = 'COMMUNITY_TANK') => ({
    name: '  Comunitario 60L  ',
    aquariumType,
    waterType: 'FRESHWATER' as const,
    setupDate: '2026-07-09',
    usePhysicalDimensions: true,
    lengthCm: '60',
    widthCm: '40',
    heightCm: '30',
    volume: '',
    displayParameters: DEFAULT_DISPLAY_PARAMETER_KEYS,
    alertChannels: {
      dashboard: true,
      email: false,
    },
    alertParameters: Object.fromEntries(
      ALL_DISPLAY_PARAMETER_KEYS.map((key) => [
        key,
        {
          enabled: key === 'displayPH',
          minimumValue: key === 'displayPH' ? '6.6' : '',
          maximumValue: key === 'displayPH' ? '7.2' : '',
          targetValue: key === 'displayPH' ? '7.0' : '',
        },
      ]),
    ),
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
      displayPreferences: expect.objectContaining({
        displayPH: true,
        displayTemperature: true,
        displayPotassium: true,
      }),
      alertParameters: {
        displayPH: {
          minimumValue: 6.6,
          maximumValue: 7.2,
          targetValue: 7,
        },
        displayGH: false,
        displayKH: false,
        displayNitrate: false,
        displayNitrite: false,
        displayAmmonia: false,
        displayTemperature: false,
        displayTDS: false,
        displayCopper: false,
        displayPhosphate: false,
        displayIron: false,
        displayCO2: false,
        displayO2: false,
        displayCalcium: false,
        displaySilicates: false,
        displayDensitySalinity: false,
        displayMagnesium: false,
        displayIodine: false,
        displayMolybdenum: false,
        displayStrontium: false,
        displayPotassium: false,
      },
    });
    expect(payload).not.toHaveProperty('lengthCm');
    expect(payload).not.toHaveProperty('widthCm');
    expect(payload).not.toHaveProperty('heightCm');
    expect(payload).not.toHaveProperty('photo');
  });

  it.each([
    ['COMMUNITY_TANK', 'COMMUNITY'],
    ['PLANTED', 'PLANTED'],
    ['BREEDING', 'BREEDING'],
    ['SPECIES_ONLY', 'SPECIES_ONLY'],
    ['HOSPITAL', 'HOSPITAL'],
    ['OTHER', 'OTHER'],
  ] as const)('maps %s to type %s', (option, type) => {
    expect(mapAquariumCreateFormToPayload(buildFormValue(option))).toMatchObject({
      type,
      waterType: 'FRESHWATER',
    });
  });

  it.each([
    ['FRESHWATER', 'FRESHWATER'],
    ['SALTWATER', 'SALTWATER'],
    ['BRACKISH', 'BRACKISH'],
  ] as const)('uses the selected water type %s', (waterType, expectedWaterType) => {
    expect(mapAquariumCreateFormToPayload({ ...buildFormValue(), waterType })).toMatchObject({
      waterType: expectedWaterType,
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

  it('throws when required values are missing or invalid', () => {
    expect(() =>
      mapAquariumCreateFormToPayload({ ...buildFormValue(), aquariumType: null }),
    ).toThrow('Aquarium type is required');
    expect(() => mapAquariumCreateFormToPayload({ ...buildFormValue(), waterType: null })).toThrow(
      'Water type is required',
    );
    expect(() => mapAquariumCreateFormToPayload({ ...buildFormValue(), widthCm: '0' })).toThrow(
      'Aquarium dimensions must produce a valid volume',
    );
    expect(() =>
      mapAquariumCreateFormToPayload({
        ...buildFormValue(),
        usePhysicalDimensions: false,
        lengthCm: '',
        widthCm: '',
        heightCm: '',
        volume: '0',
      }),
    ).toThrow('Aquarium volume must be a valid positive number');
  });

  it('uses the direct volume when dimensions are not provided', () => {
    const payload = mapAquariumCreateFormToPayload({
      ...buildFormValue(),
      usePhysicalDimensions: false,
      lengthCm: '',
      widthCm: '',
      heightCm: '',
      volume: '128,5',
    });

    expect(payload).toMatchObject({
      type: 'COMMUNITY',
      waterType: 'FRESHWATER',
      volume: 128.5,
      volumeUnit: 'LITER',
    });
  });

  it('maps selected dashboard parameters into display preferences', () => {
    const payload = mapAquariumCreateFormToPayload({
      ...buildFormValue(),
      displayParameters: ['displayPH', 'displayTemperature', 'displayAmmonia'],
    });

    expect(payload.displayPreferences).toEqual({
      displayPH: true,
      displayGH: false,
      displayKH: false,
      displayNitrate: false,
      displayNitrite: false,
      displayAmmonia: true,
      displayTemperature: true,
      displayTDS: false,
      displayCopper: false,
      displayPhosphate: false,
      displayIron: false,
      displayCO2: false,
      displayO2: false,
      displayCalcium: false,
      displaySilicates: false,
      displayDensitySalinity: false,
      displayMagnesium: false,
      displayIodine: false,
      displayMolybdenum: false,
      displayStrontium: false,
      displayPotassium: false,
    });
  });

  it('maps enabled alert parameters into numeric thresholds', () => {
    const payload = mapAquariumCreateFormToPayload({
      ...buildFormValue(),
      alertParameters: {
        ...buildFormValue().alertParameters,
        displayTemperature: {
          enabled: true,
          minimumValue: '24',
          maximumValue: '27',
          targetValue: '25.5',
        },
      },
    });

    expect(payload.alertParameters).toEqual({
      displayPH: {
        minimumValue: 6.6,
        maximumValue: 7.2,
        targetValue: 7,
      },
      displayGH: false,
      displayKH: false,
      displayNitrate: false,
      displayNitrite: false,
      displayAmmonia: false,
      displayTemperature: {
        minimumValue: 24,
        maximumValue: 27,
        targetValue: 25.5,
      },
      displayTDS: false,
      displayCopper: false,
      displayPhosphate: false,
      displayIron: false,
      displayCO2: false,
      displayO2: false,
      displayCalcium: false,
      displaySilicates: false,
      displayDensitySalinity: false,
      displayMagnesium: false,
      displayIodine: false,
      displayMolybdenum: false,
      displayStrontium: false,
      displayPotassium: false,
    });
  });

  it('preserves unknown aquarium types returned by the API', () => {
    expect(
      mapAquariumCreateFormToPayload({
        ...buildFormValue(),
        aquariumType: 'REEF',
      }),
    ).toMatchObject({
      type: 'REEF',
      waterType: 'FRESHWATER',
    });
  });
});
