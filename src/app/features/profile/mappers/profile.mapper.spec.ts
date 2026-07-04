import { UserApiDto } from '../../../core/users/models/user-api.dto';
import { ProfileMapper } from './profile.mapper';

const mockUser: UserApiDto = {
  id: 'user-id',
  name: 'John Doe',
  email: 'john@example.com',
  phone: null,
  birthDate: '1990-05-12',
  avatarUrl: null,
  role: 'USER',
  plan: 'FREE',
  status: 'ACTIVE',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
  deletedAt: null,
  preferences: {
    id: 'pref-id',
    userId: 'user-id',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    theme: 'system',
    temperatureUnit: 'CELSIUS',
    measurementUnit: 'MG_L',
    notificationsEnabled: true,
    phAlertEnabled: true,
    temperatureAlertEnabled: true,
    ammoniaAlertEnabled: true,
    nitriteAlertEnabled: true,
    nitrateAlertEnabled: true,
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
  },
};

describe('ProfileMapper', () => {
  let mapper: ProfileMapper;

  beforeEach(() => {
    mapper = new ProfileMapper();
  });

  describe('mapUserToProfileUser', () => {
    it('should map the DTO fields to the profile user view model', () => {
      const result = mapper.mapUserToProfileUser(mockUser);

      expect(result).toEqual({
        id: 'user-id',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: null,
        birthDate: '1990-05-12',
        avatarUrl: null,
        initials: 'JD',
        memberSince: '2024-01-15T00:00:00.000Z',
      });
    });
  });

  describe('mapUserToProfilePreferences', () => {
    it('should map known temperature and concentration units', () => {
      const result = mapper.mapUserToProfilePreferences(mockUser);

      expect(result).toEqual({
        temperatureUnit: 'celsius',
        concentrationUnit: 'mgL',
        defaultAquariumId: null,
        emailAlertsEnabled: true,
      });
    });

    it('should map FAHRENHEIT and PPM', () => {
      const dto: UserApiDto = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          temperatureUnit: 'FAHRENHEIT',
          measurementUnit: 'PPM',
          notificationsEnabled: false,
        },
      };

      const result = mapper.mapUserToProfilePreferences(dto);

      expect(result.temperatureUnit).toBe('fahrenheit');
      expect(result.concentrationUnit).toBe('ppm');
      expect(result.emailAlertsEnabled).toBe(false);
    });

    it('should default to celsius/mgL for unknown raw unit values', () => {
      const dto: UserApiDto = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          temperatureUnit: 'UNKNOWN',
          measurementUnit: 'METRIC',
        },
      };

      const result = mapper.mapUserToProfilePreferences(dto);

      expect(result.temperatureUnit).toBe('celsius');
      expect(result.concentrationUnit).toBe('mgL');
    });
  });

  describe('mapPreferencesFormToRequest', () => {
    it('should map the form value back to the update request DTO', () => {
      const result = mapper.mapPreferencesFormToRequest({
        temperatureUnit: 'fahrenheit',
        concentrationUnit: 'ppm',
        defaultAquariumId: 'aquarium-1',
        emailAlertsEnabled: false,
      });

      expect(result).toEqual({
        temperatureUnit: 'FAHRENHEIT',
        measurementUnit: 'PPM',
        notificationsEnabled: false,
      });
    });
  });
});
