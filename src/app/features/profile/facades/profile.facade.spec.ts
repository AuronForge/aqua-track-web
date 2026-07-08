import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';

import { UserApiDto } from '../../../core/users/models/user-api.dto';
import { UserService } from '../../../core/users/services/user.service';
import { FeedbackMessageService } from '../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../shared/services/language.service';
import { ModalService } from '../../../shared/services/modal.service';
import { ChangePasswordModalComponent } from '../components/change-password-modal/change-password-modal.component';
import { DeleteAccountRequestModalComponent } from '../components/delete-account-request-modal/delete-account-request-modal.component';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileFacade } from './profile.facade';

const mockUser: UserApiDto = {
  id: 'user-id',
  name: 'John Doe',
  email: 'john@example.com',
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

describe('ProfileFacade', () => {
  let facade: ProfileFacade;
  let userService: {
    currentUser: ReturnType<typeof signal<UserApiDto | null>>;
    loadCurrentUser: jest.Mock;
    updateProfile: jest.Mock;
    updatePreferences: jest.Mock;
    updateAvatar: jest.Mock;
    changePassword: jest.Mock;
    requestAccountDeletion: jest.Mock;
  };
  let feedbackMessageService: {
    showSuccess: jest.Mock;
    showError: jest.Mock;
  };
  let modalService: {
    open: jest.Mock;
  };

  beforeEach(() => {
    userService = {
      currentUser: signal<UserApiDto | null>(null),
      loadCurrentUser: jest.fn().mockReturnValue(of(mockUser)),
      updateProfile: jest.fn().mockReturnValue(of(mockUser)),
      updatePreferences: jest.fn().mockReturnValue(of(mockUser)),
      updateAvatar: jest.fn().mockReturnValue(of(mockUser)),
      changePassword: jest.fn().mockReturnValue(of(void 0)),
      requestAccountDeletion: jest.fn().mockReturnValue(of(mockUser)),
    };
    feedbackMessageService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
    };
    modalService = {
      open: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProfileFacade,
        ProfileMapper,
        LanguageService,
        { provide: UserService, useValue: userService },
        { provide: FeedbackMessageService, useValue: feedbackMessageService },
        { provide: ModalService, useValue: modalService },
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
      expect(facade.security().passwordLastChangedAt).toBeTruthy();
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
      expect(facade.deleteAccountRequestPending()).toBe(false);
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
      expect(facade.preferences()?.preferredLanguage).toBe('pt');
      expect(facade.security().passwordLastChangedAt).toBe('2026-06-02T12:00:00.000Z');
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
      const setLanguageSpy = jest.spyOn(TestBed.inject(LanguageService), 'setLanguage');

      facade.savePreferences({
        preferredLanguage: 'en',
        temperatureUnit: 'fahrenheit',
        concentrationUnit: 'ppm',
        emailAlertsEnabled: false,
        phAlertsEnabled: true,
        temperatureAlertsEnabled: false,
        ammoniaAlertsEnabled: true,
        nitriteAlertsEnabled: false,
        nitrateAlertsEnabled: true,
      });

      expect(userService.updatePreferences).toHaveBeenCalledWith({
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
      expect(facade.preferencesSaveSuccess()).toBe(true);
      expect(setLanguageSpy).toHaveBeenCalledWith('en');
    });

    it('should flag an error when updatePreferences fails', () => {
      userService.updatePreferences.mockReturnValue(throwError(() => new Error('network error')));

      facade.savePreferences({
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

      expect(facade.savingPreferences()).toBe(false);
      expect(facade.preferencesSaveError()).toBeTruthy();
    });
  });

  describe('auxiliary actions', () => {
    it('requestPasswordChange should open the change-password modal', () => {
      userService.currentUser.set(mockUser);

      facade.requestPasswordChange();

      expect(modalService.open).toHaveBeenCalledWith(
        expect.objectContaining({
          closeOnBackdropClick: false,
          closeOnEscape: true,
          size: 'medium',
          contentComponent: ChangePasswordModalComponent,
          contentComponentInputs: expect.objectContaining({
            userIdentity: {
              email: 'john@example.com',
              name: 'John Doe',
              birthDate: '1990-05-12',
            },
            submitChangePassword: expect.any(Function),
          }),
        }),
      );
    });

    it('requestPasswordChange should pass a submit handler that updates the password date', () => {
      userService.currentUser.set(mockUser);

      modalService.open.mockImplementation((config) => {
        config.contentComponentInputs
          .submitChangePassword({
            email: 'john@example.com',
            name: 'John Doe',
            birthDate: '1990-05-12',
            currentPassword: 'Current@123',
            newPassword: 'NewPassword@123',
          })
          .subscribe();
      });

      const previousDate = facade.security().passwordLastChangedAt;
      facade.requestPasswordChange();

      expect(userService.changePassword).toHaveBeenCalledWith({
        email: 'john@example.com',
        name: 'John Doe',
        birthDate: '1990-05-12',
        currentPassword: 'Current@123',
        newPassword: 'NewPassword@123',
      });
      expect(facade.security().passwordLastChangedAt).not.toBe(previousDate);
    });

    it('requestPasswordChange should show an error and not open the modal when current user identity is unavailable', () => {
      userService.currentUser.set(null);

      facade.requestPasswordChange();

      expect(modalService.open).not.toHaveBeenCalled();
      expect(feedbackMessageService.showError).toHaveBeenCalledWith(
        "We couldn't update your password right now. Please try again.",
        { hasIcon: true, horizontalPosition: 'top', verticalPosition: 'end' },
      );
      expect(userService.changePassword).not.toHaveBeenCalled();
    });

    it('requestDeleteAccount should open the deletion request modal', () => {
      facade.requestDeleteAccount();

      expect(modalService.open).toHaveBeenCalledWith(
        expect.objectContaining({
          closeOnBackdropClick: false,
          closeOnEscape: true,
          size: 'medium',
          contentComponent: DeleteAccountRequestModalComponent,
          contentComponentInputs: expect.objectContaining({
            submitDeleteAccountRequest: expect.any(Function),
          }),
        }),
      );
    });

    it('requestDeleteAccount should pass a submit handler that sends the request and reflects the pending state from the returned user', () => {
      const deletionRequestedUser: UserApiDto = {
        ...mockUser,
        status: 'INACTIVE',
        accountDeletionRequestedAt: '2026-07-07T23:25:47.101Z',
        accountDeletionReason: 'No longer needed',
      };
      userService.requestAccountDeletion.mockImplementation(() => {
        userService.currentUser.set(deletionRequestedUser);
        return of(deletionRequestedUser);
      });

      modalService.open.mockImplementation((config) => {
        config.contentComponentInputs
          .submitDeleteAccountRequest({
            reason: 'No longer needed',
          })
          .subscribe();
      });

      facade.requestDeleteAccount();

      expect(userService.requestAccountDeletion).toHaveBeenCalledWith({
        reason: 'No longer needed',
      });
      expect(facade.deleteAccountRequestPending()).toBe(true);
    });

    it('deleteAccountRequestPending should be true when the loaded user already has a deletion request', () => {
      userService.currentUser.set({
        ...mockUser,
        status: 'INACTIVE',
        accountDeletionRequestedAt: '2026-07-07T23:25:47.101Z',
        accountDeletionReason: 'No longer needed',
      });

      expect(facade.deleteAccountRequestPending()).toBe(true);
    });

    it('requestDeleteAccount should not open a new modal when the request is already pending', () => {
      userService.currentUser.set({
        ...mockUser,
        status: 'INACTIVE',
        accountDeletionRequestedAt: '2026-07-07T23:25:47.101Z',
        accountDeletionReason: null,
      });

      facade.requestDeleteAccount();

      expect(modalService.open).not.toHaveBeenCalled();
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
        'Avatar updated successfully.',
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
        'Could not update avatar. Please try again.',
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
