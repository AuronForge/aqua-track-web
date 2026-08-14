import { mapAquariumApiToListItem } from './aquarium-list-item.mapper';
import { AquariumListResponseDto } from '../models/aquarium-api.dto';
import { SystemValueApiDto } from '../models/system-value-api.dto';

const aquariumTypeValues: SystemValueApiDto[] = [
  {
    id: '1',
    rootSystemValue: 'AQUARIUM_TYPE',
    systemValue: 'COMMUNITY_TANK',
    description: 'Community tank',
    displayValue: 'Community Tank',
  },
];

const aquarium: AquariumListResponseDto = {
  id: 'aq-1',
  ownerId: 'user-1',
  name: 'Aquario principal',
  description: 'Sala',
  type: 'COMMUNITY_TANK',
  waterType: 'FRESHWATER',
  volume: 200,
  volumeUnit: 'LITER',
  setupDate: '2025-01-01T00:00:00.000Z',
  primaryPhotoUrl: null,
  photosCount: 0,
  displayPreferences: {
    displayPH: true,
    displayGH: true,
    displayKH: true,
    displayNitrate: true,
    displayNitrite: true,
    displayAmmonia: true,
    displayTemperature: true,
    displayTDS: true,
    displayCopper: false,
    displayPhosphate: false,
    displayIron: false,
    displayCO2: true,
    displayO2: true,
    displayCalcium: false,
    displaySilicates: false,
    displayDensitySalinity: false,
    displayMagnesium: false,
    displayIodine: false,
    displayMolybdenum: false,
    displayStrontium: false,
    displayPotassium: true,
  },
  alertParameters: {},
  status: 'ACTIVE',
  createdAt: '2026-07-10T12:00:00.000Z',
  updatedAt: '2026-07-20T12:00:00.000Z',
  deletedAt: null,
};

describe('mapAquariumApiToListItem', () => {
  it('maps the API response using the catalog display name and relative setup time', () => {
    expect(
      mapAquariumApiToListItem(aquarium, aquariumTypeValues, new Date('2026-07-28T12:00:00.000Z')),
    ).toEqual({
      id: 'aq-1',
      name: 'Aquario principal',
      aquariumType: 'COMMUNITY_TANK',
      waterType: 'FRESHWATER',
      subtitle: 'Community Tank',
      volumeLiters: 200,
      installedAmount: 1,
      installedUnit: 'YEAR',
      status: 'ACTIVE',
      recentParameters: [],
    });
  });

  it('falls back to a humanized type and converts gallons to liters', () => {
    expect(
      mapAquariumApiToListItem(
        {
          ...aquarium,
          type: 'REEF_TANK',
          volume: 10,
          volumeUnit: 'GALLON',
          setupDate: '2026-06-15T00:00:00.000Z',
          status: 'ARCHIVED',
        },
        [],
        new Date('2026-07-28T12:00:00.000Z'),
      ),
    ).toMatchObject({
      subtitle: 'Reef Tank',
      volumeLiters: 37.9,
      installedAmount: 1,
      installedUnit: 'MONTH',
      status: 'ARCHIVED',
    });
  });

  it('falls back to a humanized type when the catalog value has no display name', () => {
    expect(
      mapAquariumApiToListItem(
        aquarium,
        [
          {
            ...aquariumTypeValues[0],
            displayValue: '',
          },
        ],
        new Date('2026-07-28T12:00:00.000Z'),
      ).subtitle,
    ).toBe('Community Tank');
  });

  it('returns zero installed amount for an invalid setup date', () => {
    expect(
      mapAquariumApiToListItem(
        {
          ...aquarium,
          setupDate: 'invalid-date',
          status: 'INACTIVE',
        },
        aquariumTypeValues,
      ),
    ).toMatchObject({
      installedAmount: 0,
      installedUnit: 'MONTH',
      status: 'INACTIVE',
    });
  });

  it('returns zero installed amount when setup date is missing', () => {
    expect(
      mapAquariumApiToListItem(
        {
          ...aquarium,
          setupDate: null,
        },
        aquariumTypeValues,
      ),
    ).toMatchObject({
      installedAmount: 0,
      installedUnit: 'MONTH',
    });
  });

  it('subtracts the current partial month when setup day has not arrived yet', () => {
    expect(
      mapAquariumApiToListItem(
        {
          ...aquarium,
          setupDate: '2026-06-30T00:00:00.000Z',
        },
        aquariumTypeValues,
        new Date('2026-07-28T12:00:00.000Z'),
      ),
    ).toMatchObject({
      installedAmount: 1,
      installedUnit: 'MONTH',
    });
  });

  it('normalizes future setup dates to at least one month for recent aquariums', () => {
    expect(
      mapAquariumApiToListItem(
        {
          ...aquarium,
          setupDate: '2026-08-01T00:00:00.000Z',
        },
        aquariumTypeValues,
        new Date('2026-07-28T12:00:00.000Z'),
      ),
    ).toMatchObject({
      installedAmount: 1,
      installedUnit: 'MONTH',
    });
  });
});
