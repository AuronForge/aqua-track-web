import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';

import { UserApiDto } from '../../../core/users/models/user-api.dto';
import { UserService } from '../../../core/users/services/user.service';
import { FeedbackMessageService } from '../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../shared/services/language.service';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileFacade } from './profile.facade';

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

describe('ProfileFacade', () => {
  let facade: ProfileFacade;
  let userService: {
    currentUser: ReturnType<typeof signal<UserApiDto | null>>;
    loadCurrentUser: jest.Mock;
    updateProfile: jest.Mock;
    updatePreferences: jest.Mock;
    updateAvatar: jest.Mock;
  };
  let feedbackMessageService: {
    showSuccess: jest.Mock;
    showError: jest.Mock;
  };

  beforeEach(() => {
    userService = {
      currentUser: signal<UserApiDto | null>(null),
      loadCurrentUser: jest.fn().mockReturnValue(of(mockUser)),
      updateProfile: jest.fn().mockReturnValue(of(mockUser)),
      updatePreferences: jest.fn().mockReturnValue(of(mockUser)),
      updateAvatar: jest.fn().mockReturnValue(of(mockUser)),
    };
    feedbackMessageService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProfileFacade,
        ProfileMapper,
        LanguageService,
        { provide: UserService, useValue: userService },
        { provide: FeedbackMessageService, useValue: feedbackMessageService },
      ],
    });

    facade = TestBed.inject(ProfileFacade);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('initial state', () => {
    it('userLoaded should be false when there is no current user', () => {
      expect(facade.userLoaded()).toBe(false);
    });

    it('user and preferences should be null when there is no current user', () => {
      expect(facade.user()).toBeNull();
      expect(facade.preferences()).toBeNull();
    });

    it('should expose mocked security info and aquarium options', () => {
      expect(facade.security().lastLoginAt).toBeTruthy();
      expect(facade.aquariumOptions().length).toBeGreaterThan(0);
    });

    it('saving/error/success signals should start falsy', () => {
      expect(facade.savingProfile()).toBe(false);
      expect(facade.profileSaveError()).toBeNull();
      expect(facade.profileSaveSuccess()).toBe(false);
      expect(facade.savingPreferences()).toBe(false);
      expect(facade.preferencesSaveError()).toBeNull();
      expect(facade.preferencesSaveSuccess()).toBe(false);
    });
  });

  describe('loadProfile', () => {
    it('should call loadCurrentUser when there is no user loaded yet', () => {
      facade.loadProfile();

      expect(userService.loadCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should not call loadCurrentUser again when a user is already loaded', () => {
      userService.currentUser.set(mockUser);

      facade.loadProfile();

      expect(userService.loadCurrentUser).not.toHaveBeenCalled();
    });
  });

  describe('derived view models', () => {
    it('should map user and preferences once currentUser is available', () => {
      userService.currentUser.set(mockUser);

      expect(facade.user()).toEqual(
        expect.objectContaining({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: null,
          birthDate: '1990-05-12',
        }),
      );
      expect(facade.preferences()).toEqual(
        expect.objectContaining({ temperatureUnit: 'celsius', concentrationUnit: 'mgL' }),
      );
      expect(facade.userLoaded()).toBe(true);
    });
  });

  describe('saveProfile', () => {
    it('should call updateProfile and flag success', () => {
      facade.saveProfile({
        fullName: 'New Name',
        email: 'new@example.com',
        phone: '',
        birthDate: '1991-06-13',
      });

      expect(userService.updateProfile).toHaveBeenCalledWith({
        name: 'New Name',
        email: 'new@example.com',
        phone: null,
        birthDate: '1991-06-13',
      });
      expect(facade.savingProfile()).toBe(false);
      expect(facade.profileSaveSuccess()).toBe(true);
      expect(facade.profileSaveError()).toBeNull();
      expect(feedbackMessageService.showSuccess).toHaveBeenCalledWith(
        'Perfil atualizado com sucesso.',
        { hasIcon: true, horizontalPosition: 'top', verticalPosition: 'end' },
      );
    });

    it('should flag an error when updateProfile fails', () => {
      userService.updateProfile.mockReturnValue(throwError(() => new Error('network error')));

      facade.saveProfile({
        fullName: 'New Name',
        email: 'new@example.com',
        phone: '',
        birthDate: '1991-06-13',
      });

      expect(facade.savingProfile()).toBe(false);
      expect(facade.profileSaveSuccess()).toBe(false);
      expect(facade.profileSaveError()).toBe(
        'Não foi possível salvar as alterações. Tente novamente.',
      );
      expect(feedbackMessageService.showError).toHaveBeenCalledWith(
        'Não foi possível salvar as alterações. Tente novamente.',
        { hasIcon: true, horizontalPosition: 'top', verticalPosition: 'end' },
      );
    });
  });

  describe('savePreferences', () => {
    it('should map the form value and call updatePreferences', () => {
      facade.savePreferences({
        temperatureUnit: 'fahrenheit',
        concentrationUnit: 'ppm',
        defaultAquariumId: 'aquarium-1',
        emailAlertsEnabled: false,
      });

      expect(userService.updatePreferences).toHaveBeenCalledWith({
        temperatureUnit: 'FAHRENHEIT',
        measurementUnit: 'PPM',
        notificationsEnabled: false,
      });
      expect(facade.preferencesSaveSuccess()).toBe(true);
    });

    it('should flag an error when updatePreferences fails', () => {
      userService.updatePreferences.mockReturnValue(throwError(() => new Error('network error')));

      facade.savePreferences({
        temperatureUnit: 'celsius',
        concentrationUnit: 'mgL',
        defaultAquariumId: null,
        emailAlertsEnabled: true,
      });

      expect(facade.savingPreferences()).toBe(false);
      expect(facade.preferencesSaveError()).toBeTruthy();
    });
  });

  describe('auxiliary actions', () => {
    it('requestPasswordChange should only flag unavailable, without calling any service', () => {
      facade.requestPasswordChange();

      expect(facade.passwordChangeUnavailable()).toBe(true);
      expect(userService.updateProfile).not.toHaveBeenCalled();
      expect(userService.updatePreferences).not.toHaveBeenCalled();
    });

    it('confirmDeleteAccount should only flag unavailable, without calling any service', () => {
      facade.confirmDeleteAccount();

      expect(facade.deleteAccountUnavailable()).toBe(true);
      expect(userService.updateProfile).not.toHaveBeenCalled();
      expect(userService.updatePreferences).not.toHaveBeenCalled();
    });

    it('requestAvatarChange should upload the avatar and clear the preview on success', () => {
      const file = new File(['data'], 'avatar.png', { type: 'image/png' });
      URL.createObjectURL = jest.fn().mockReturnValue('blob:preview-url');
      URL.revokeObjectURL = jest.fn();

      facade.requestAvatarChange(file);

      expect(userService.updateAvatar).toHaveBeenCalledWith(file);
      expect(facade.avatarPreviewUrl()).toBeNull();
      expect(facade.avatarUploading()).toBe(false);
      expect(facade.avatarUploadError()).toBe(false);
      expect(feedbackMessageService.showSuccess).toHaveBeenCalledWith(
        'Avatar atualizado com sucesso.',
        { hasIcon: true, horizontalPosition: 'top', verticalPosition: 'end' },
      );
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-url');
    });

    it('requestAvatarChange should flag an error and revert the preview when the upload fails', () => {
      const file = new File(['data'], 'avatar.png', { type: 'image/png' });
      URL.createObjectURL = jest.fn().mockReturnValue('blob:preview-url');
      URL.revokeObjectURL = jest.fn();
      userService.updateAvatar.mockReturnValue(throwError(() => new Error('network error')));

      facade.requestAvatarChange(file);

      expect(facade.avatarUploading()).toBe(false);
      expect(facade.avatarUploadError()).toBe(true);
      expect(facade.avatarPreviewUrl()).toBeNull();
      expect(feedbackMessageService.showError).toHaveBeenCalledWith(
        'Não foi possível atualizar o avatar. Tente novamente.',
        { hasIcon: true, horizontalPosition: 'top', verticalPosition: 'end' },
      );
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-url');
    });

    it('requestAvatarChange should ignore new selections while an upload is already in progress', () => {
      const pendingUpload = new Subject<UserApiDto>();
      URL.createObjectURL = jest.fn().mockReturnValue('blob:preview-url');
      URL.revokeObjectURL = jest.fn();
      userService.updateAvatar.mockReturnValue(pendingUpload);

      facade.requestAvatarChange(new File(['first'], 'first.png', { type: 'image/png' }));
      expect(facade.avatarUploading()).toBe(true);

      facade.requestAvatarChange(new File(['second'], 'second.png', { type: 'image/png' }));

      expect(userService.updateAvatar).toHaveBeenCalledTimes(1);

      pendingUpload.next(mockUser);
      pendingUpload.complete();
    });
  });
});
