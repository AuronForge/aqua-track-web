import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LanguageService } from '../../../shared/services/language.service';
import { UserApiService } from './user-api.service';
import { UserService } from './user.service';
import { UserApiDto } from '../models/user-api.dto';

const mockUser: UserApiDto = {
  id: 'user-id',
  name: 'Test User',
  email: 'test@example.com',
  phone: null,
  birthDate: '1990-05-12',
  avatarUrl: null,
  passwordChangedAt: '2026-06-02T12:00:00.000Z',
  lastLoginAt: '2026-07-07T23:25:28.149Z',
  role: 'USER',
  plan: 'FREE',
  status: 'ACTIVE',
  accountDeletionRequestedAt: null,
  accountDeletionReason: null,
  accountDeletionConfirmedAt: null,
  accountDeletionConfirmedBy: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
  preferences: {
    id: 'pref-id',
    userId: 'user-id',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    theme: 'system',
    temperatureUnit: 'CELSIUS',
    concentrationUnit: 'METRIC',
    notificationsEnabled: true,
    phAlertEnabled: true,
    temperatureAlertEnabled: true,
    ammoniaAlertEnabled: true,
    nitriteAlertEnabled: true,
    nitrateAlertEnabled: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('UserService', () => {
  let service: UserService;
  let getMeSpy: jest.SpyInstance;
  let languageService: { setLanguage: jest.Mock };

  beforeEach(() => {
    languageService = {
      setLanguage: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LanguageService,
          useValue: languageService,
        },
        {
          provide: UserApiService,
          useValue: {
            getMe: jest.fn().mockReturnValue(of(mockUser)),
            updateProfile: jest.fn().mockReturnValue(of(mockUser)),
            updatePreferences: jest.fn().mockReturnValue(of(mockUser)),
            updateAvatar: jest.fn().mockReturnValue(of(mockUser)),
            changePassword: jest.fn().mockReturnValue(of(void 0)),
            requestAccountDeletion: jest.fn().mockReturnValue(of(mockUser)),
          },
        },
      ],
    });

    service = TestBed.inject(UserService);
    getMeSpy = jest.spyOn(TestBed.inject(UserApiService), 'getMe');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should start with no current user', () => {
    expect(service.currentUser()).toBeNull();
  });

  it('should load and store the current user', () => {
    getMeSpy.mockReturnValue(of(mockUser));

    service.loadCurrentUser().subscribe();

    expect(service.currentUser()).toEqual(mockUser);
    expect(languageService.setLanguage).toHaveBeenCalledWith('pt');
  });

  it('should clear the current user', () => {
    getMeSpy.mockReturnValue(of(mockUser));
    service.loadCurrentUser().subscribe();

    service.clearCurrentUser();

    expect(service.currentUser()).toBeNull();
  });

  it('should update the profile and store the returned user', () => {
    const updatedUser: UserApiDto = { ...mockUser, name: 'New Name' };
    const userApiService = TestBed.inject(UserApiService);
    jest.spyOn(userApiService, 'updateProfile').mockReturnValue(of(updatedUser));

    service
      .updateProfile({
        name: 'New Name',
        email: 'new@example.com',
        phone: '+55 11 99999-0000',
        birthDate: '1991-06-13',
      })
      .subscribe();

    expect(userApiService.updateProfile).toHaveBeenCalledWith({
      name: 'New Name',
      email: 'new@example.com',
      phone: '+55 11 99999-0000',
      birthDate: '1991-06-13',
    });
    expect(service.currentUser()).toEqual(updatedUser);
  });

  it('should store the updated profile even when there is no current user loaded yet', () => {
    const updatedUser: UserApiDto = { ...mockUser, name: 'First Load User' };
    const userApiService = TestBed.inject(UserApiService);
    jest.spyOn(userApiService, 'updateProfile').mockReturnValue(of(updatedUser));

    service
      .updateProfile({
        name: 'First Load User',
        email: 'first@example.com',
        phone: null,
        birthDate: '1991-06-13',
      })
      .subscribe();

    expect(service.currentUser()).toEqual(updatedUser);
  });

  it('should merge the profile response with the current user when preferences are omitted', () => {
    const userApiService = TestBed.inject(UserApiService);
    const partialProfileResponse = {
      id: mockUser.id,
      name: 'Merged Name',
      email: 'merged@example.com',
      phone: '+55 11 97777-0000',
      birthDate: '1991-06-13',
      avatarUrl: mockUser.avatarUrl,
      role: mockUser.role,
      plan: mockUser.plan,
      status: mockUser.status,
      createdAt: mockUser.createdAt,
      updatedAt: '2026-01-02T00:00:00.000Z',
      deletedAt: mockUser.deletedAt,
    };
    jest.spyOn(userApiService, 'updateProfile').mockReturnValue(of(partialProfileResponse));

    service.loadCurrentUser().subscribe();

    service
      .updateProfile({
        name: 'Merged Name',
        email: 'merged@example.com',
        phone: '+55 11 97777-0000',
        birthDate: '1991-06-13',
      })
      .subscribe();

    expect(service.currentUser()).toEqual({
      ...mockUser,
      ...partialProfileResponse,
      preferences: mockUser.preferences,
    });
  });

  it('should update preferences and store the returned user', () => {
    const userApiService = TestBed.inject(UserApiService);
    const payload = {
      language: 'pt-BR',
      temperatureUnit: 'fahrenheit',
      concentrationUnit: 'ppm',
      notificationsEnabled: false,
      phAlertEnabled: true,
      temperatureAlertEnabled: false,
      ammoniaAlertEnabled: true,
      nitriteAlertEnabled: false,
      nitrateAlertEnabled: true,
    };
    const updatedPreferences = {
      ...mockUser.preferences,
      language: 'pt-BR',
      temperatureUnit: 'fahrenheit',
      concentrationUnit: 'ppm',
      notificationsEnabled: false,
      phAlertEnabled: true,
      temperatureAlertEnabled: false,
      ammoniaAlertEnabled: true,
      nitriteAlertEnabled: false,
      nitrateAlertEnabled: true,
    };
    jest.spyOn(userApiService, 'updatePreferences').mockReturnValue(of(updatedPreferences));

    service.loadCurrentUser().subscribe();
    service.updatePreferences(payload).subscribe();

    expect(userApiService.updatePreferences).toHaveBeenCalledWith(payload);
    expect(service.currentUser()).toEqual({
      ...mockUser,
      preferences: updatedPreferences,
    });
    expect(languageService.setLanguage).toHaveBeenCalledWith('pt');
  });

  it('should store preferences even when they are updated before loading the current user', () => {
    const userApiService = TestBed.inject(UserApiService);
    const updatedPreferences = {
      ...mockUser.preferences,
      language: 'en-US',
    };
    jest.spyOn(userApiService, 'updatePreferences').mockReturnValue(of(updatedPreferences));

    service.updatePreferences({ language: 'en-US' } as never).subscribe();

    expect(service.currentUser()).toEqual({ preferences: updatedPreferences });
    expect(languageService.setLanguage).toHaveBeenCalledWith('en');
  });

  it('should apply the language returned by preferences when loading the current user', () => {
    const englishUser: UserApiDto = {
      ...mockUser,
      preferences: {
        ...mockUser.preferences,
        language: 'en-US',
      },
    };
    getMeSpy.mockReturnValue(of(englishUser));

    service.loadCurrentUser().subscribe();

    expect(languageService.setLanguage).toHaveBeenCalledWith('en');
  });

  it('should ignore unknown language locales returned by preferences', () => {
    const unsupportedLocaleUser: UserApiDto = {
      ...mockUser,
      preferences: {
        ...mockUser.preferences,
        language: 'fr-FR',
      },
    };
    getMeSpy.mockReturnValue(of(unsupportedLocaleUser));

    service.loadCurrentUser().subscribe();

    expect(languageService.setLanguage).not.toHaveBeenCalled();
  });

  it('should not try to sync language when the loaded user has no preferences', () => {
    getMeSpy.mockReturnValue(of({ ...mockUser, preferences: undefined } as unknown as UserApiDto));

    service.loadCurrentUser().subscribe();

    expect(languageService.setLanguage).not.toHaveBeenCalled();
  });

  it('should update the avatar and store the returned user', () => {
    const file = new File(['fake-image-bytes'], 'avatar.png', { type: 'image/png' });
    const avatarResponse = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      birthDate: mockUser.birthDate,
      avatarUrl: 'http://127.0.0.1:9000/bucket/key.png',
      role: mockUser.role,
      plan: mockUser.plan,
      status: mockUser.status,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
      deletedAt: mockUser.deletedAt,
    };
    const updatedUser: UserApiDto = { ...mockUser, avatarUrl: avatarResponse.avatarUrl };
    const userApiService = TestBed.inject(UserApiService);
    jest.spyOn(userApiService, 'updateAvatar').mockReturnValue(of(avatarResponse));

    service.loadCurrentUser().subscribe();

    service.updateAvatar(file).subscribe();

    expect(userApiService.updateAvatar).toHaveBeenCalledWith(file);
    expect(service.currentUser()).toEqual(updatedUser);
  });

  it('should store the avatar response even when there is no current user loaded yet', () => {
    const file = new File(['fake-image-bytes'], 'avatar.png', { type: 'image/png' });
    const avatarResponse = {
      ...mockUser,
      avatarUrl: 'http://127.0.0.1:9000/bucket/key.png',
    };
    const userApiService = TestBed.inject(UserApiService);
    jest.spyOn(userApiService, 'updateAvatar').mockReturnValue(of(avatarResponse));

    service.updateAvatar(file).subscribe();

    expect(service.currentUser()).toEqual(avatarResponse);
  });

  it('should change the password without mutating the current user state', () => {
    const userApiService = TestBed.inject(UserApiService);
    jest.spyOn(userApiService, 'changePassword').mockReturnValue(of(void 0));

    service.loadCurrentUser().subscribe();
    service
      .changePassword({
        email: 'test@example.com',
        name: 'Test User',
        birthDate: '1990-05-12',
        currentPassword: 'Current@123',
        newPassword: 'NewPassword@123',
      })
      .subscribe();

    expect(userApiService.changePassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
      birthDate: '1990-05-12',
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
    });
    expect(service.currentUser()).toEqual(mockUser);
  });

  it('should request account deletion and store the returned user state', () => {
    const userApiService = TestBed.inject(UserApiService);
    const deletionRequestedUser: UserApiDto = {
      ...mockUser,
      status: 'INACTIVE',
      accountDeletionRequestedAt: '2026-07-07T23:25:47.101Z',
      accountDeletionReason: 'No longer needed',
      updatedAt: '2026-07-07T23:25:47.102Z',
    };
    jest.spyOn(userApiService, 'requestAccountDeletion').mockReturnValue(of(deletionRequestedUser));

    service.loadCurrentUser().subscribe();
    service.requestAccountDeletion({ reason: 'No longer needed' }).subscribe();

    expect(userApiService.requestAccountDeletion).toHaveBeenCalledWith({
      reason: 'No longer needed',
    });
    expect(service.currentUser()).toEqual(deletionRequestedUser);
  });

  it('should store the deletion-request response even when there is no current user loaded yet', () => {
    const userApiService = TestBed.inject(UserApiService);
    const deletionRequestedUser: UserApiDto = {
      ...mockUser,
      status: 'INACTIVE',
      accountDeletionRequestedAt: '2026-07-07T23:25:47.101Z',
    };
    jest.spyOn(userApiService, 'requestAccountDeletion').mockReturnValue(of(deletionRequestedUser));

    service.requestAccountDeletion({ reason: null }).subscribe();

    expect(service.currentUser()).toEqual(deletionRequestedUser);
  });
});
