import { UserApiDto } from '../../../core/users/models/user-api.dto';
import { ProfileMapper } from './profile.mapper';

const mockUser: UserApiDto = {
  id: 'user-id',
  name: 'John Doe',
  email: 'john@example.com',
  phone: null,
  birthDate: '1990-05-12',
  avatarUrl: null,
  passwordChangedAt: '2026-06-02T12:00:00.000Z',
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
    concentrationUnit: 'MG_L',
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
        preferredLanguage: 'pt',
        temperatureUnit: 'celsius',
        concentrationUnit: 'mgL',
        emailAlertsEnabled: true,
        phAlertsEnabled: true,
        temperatureAlertsEnabled: true,
        ammoniaAlertsEnabled: true,
        nitriteAlertsEnabled: true,
        nitrateAlertsEnabled: true,
      });
    });

    it('should map FAHRENHEIT and PPM', () => {
      const dto: UserApiDto = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          temperatureUnit: 'FAHRENHEIT',
          concentrationUnit: 'PPM',
          notificationsEnabled: false,
        },
      };

      const result = mapper.mapUserToProfilePreferences(dto);

      expect(result.temperatureUnit).toBe('fahrenheit');
      expect(result.concentrationUnit).toBe('ppm');
      expect(result.preferredLanguage).toBe('pt');
      expect(result.emailAlertsEnabled).toBe(false);
      expect(result.phAlertsEnabled).toBe(true);
    });

    it('should map lowercase celsius and ppm returned by the API', () => {
      const dto: UserApiDto = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          temperatureUnit: 'celsius',
          concentrationUnit: 'ppm',
        },
      };

      const result = mapper.mapUserToProfilePreferences(dto);

      expect(result.preferredLanguage).toBe('pt');
      expect(result.temperatureUnit).toBe('celsius');
      expect(result.concentrationUnit).toBe('ppm');
    });

    it('should default to celsius/mgL for unknown raw unit values', () => {
      const dto: UserApiDto = {
        ...mockUser,
        preferences: {
          ...mockUser.preferences,
          language: 'fr-FR',
          temperatureUnit: 'UNKNOWN',
          concentrationUnit: 'METRIC',
        },
      };

      const result = mapper.mapUserToProfilePreferences(dto);

      expect(result.preferredLanguage).toBe('pt');
      expect(result.temperatureUnit).toBe('celsius');
      expect(result.concentrationUnit).toBe('mgL');
    });
  });

  describe('mapPreferencesFormToRequest', () => {
    it('should map the form value back to the update request DTO', () => {
      const result = mapper.mapPreferencesFormToRequest(
        {
          preferredLanguage: 'en',
          temperatureUnit: 'fahrenheit',
          concentrationUnit: 'ppm',
          emailAlertsEnabled: false,
          phAlertsEnabled: true,
          temperatureAlertsEnabled: false,
          ammoniaAlertsEnabled: true,
          nitriteAlertsEnabled: false,
          nitrateAlertsEnabled: true,
        },
        'en-US',
      );

      expect(result).toEqual({
        language: 'en-US',
        temperatureUnit: 'fahrenheit',
        concentrationUnit: 'ppm',
        notificationsEnabled: false,
        phAlertEnabled: true,
        temperatureAlertEnabled: false,
        ammoniaAlertEnabled: true,
        nitriteAlertEnabled: false,
        nitrateAlertEnabled: true,
      });
    });
  });
});
