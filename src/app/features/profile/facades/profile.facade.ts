import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserService } from '../../../core/users/services/user.service';
import { FeedbackMessageService } from '../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../shared/services/language.service';
import { ProfileMapper } from '../mappers/profile.mapper';
import { MOCK_AQUARIUM_OPTIONS, MOCK_PROFILE_SECURITY } from '../mocks/profile.mock';
import { ProfileInformationFormValue } from '../models/profile-information-form-value.model';
import { ProfilePreferencesFormValue } from '../models/profile-preferences-form-value.model';

@Injectable()
export class ProfileFacade {
  private readonly userService = inject(UserService);
  private readonly mapper = inject(ProfileMapper);
  private readonly destroyRef = inject(DestroyRef);
  private readonly feedbackMessageService = inject(FeedbackMessageService);
  private readonly languageService = inject(LanguageService);

  private readonly currentUser = this.userService.currentUser;
  private readonly t = this.languageService.translation;

  readonly userLoaded = computed(() => this.currentUser() !== null);

  readonly user = computed(() => {
    const dto = this.currentUser();
    return dto ? this.mapper.mapUserToProfileUser(dto) : null;
  });

  readonly preferences = computed(() => {
    const dto = this.currentUser();
    return dto ? this.mapper.mapUserToProfilePreferences(dto) : null;
  });

  readonly security = signal(MOCK_PROFILE_SECURITY).asReadonly();
  readonly aquariumOptions = signal(MOCK_AQUARIUM_OPTIONS).asReadonly();

  private readonly _savingProfile = signal(false);
  private readonly _profileSaveError = signal<string | null>(null);
  private readonly _profileSaveSuccess = signal(false);

  readonly savingProfile = this._savingProfile.asReadonly();
  readonly profileSaveError = this._profileSaveError.asReadonly();
  readonly profileSaveSuccess = this._profileSaveSuccess.asReadonly();

  private readonly _savingPreferences = signal(false);
  private readonly _preferencesSaveError = signal<string | null>(null);
  private readonly _preferencesSaveSuccess = signal(false);

  readonly savingPreferences = this._savingPreferences.asReadonly();
  readonly preferencesSaveError = this._preferencesSaveError.asReadonly();
  readonly preferencesSaveSuccess = this._preferencesSaveSuccess.asReadonly();

  private readonly _avatarPreviewUrl = signal<string | null>(null);
  private readonly _avatarUploading = signal(false);
  private readonly _avatarUploadError = signal(false);
  private readonly _passwordChangeUnavailable = signal(false);
  private readonly _deleteAccountUnavailable = signal(false);

  readonly avatarPreviewUrl = this._avatarPreviewUrl.asReadonly();
  readonly avatarUploading = this._avatarUploading.asReadonly();
  readonly avatarUploadError = this._avatarUploadError.asReadonly();
  readonly passwordChangeUnavailable = this._passwordChangeUnavailable.asReadonly();
  readonly deleteAccountUnavailable = this._deleteAccountUnavailable.asReadonly();

  loadProfile(): void {
    if (this.currentUser()) return;

    this.userService.loadCurrentUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  saveProfile(value: ProfileInformationFormValue): void {
    this._savingProfile.set(true);
    this._profileSaveError.set(null);
    this._profileSaveSuccess.set(false);

    this.userService
      .updateProfile({
        name: value.fullName,
        email: value.email,
        phone: value.phone.trim() || null,
        birthDate: value.birthDate,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this._savingProfile.set(false);
          this._profileSaveSuccess.set(true);
          this.feedbackMessageService.showSuccess(this.t().profileSaveSuccessMessage, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
        },
        error: () => {
          this._savingProfile.set(false);
          this._profileSaveError.set(this.t().profileSaveErrorMessage);
          this.feedbackMessageService.showError(this.t().profileSaveErrorMessage, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
        },
      });
  }

  savePreferences(value: ProfilePreferencesFormValue): void {
    this._savingPreferences.set(true);
    this._preferencesSaveError.set(null);
    this._preferencesSaveSuccess.set(false);

    this.userService
      .updatePreferences(this.mapper.mapPreferencesFormToRequest(value))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this._savingPreferences.set(false);
          this._preferencesSaveSuccess.set(true);
        },
        error: () => {
          this._savingPreferences.set(false);
          this._preferencesSaveError.set(
            'NÃ£o foi possÃ­vel salvar as preferÃªncias. Tente novamente.',
          );
        },
      });
  }

  requestAvatarChange(file: File): void {
    if (this._avatarUploading()) return;

    const previewUrl = URL.createObjectURL(file);

    this._avatarPreviewUrl.set(previewUrl);
    this._avatarUploading.set(true);
    this._avatarUploadError.set(false);

    this.userService
      .updateAvatar(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this._avatarUploading.set(false);
          this.feedbackMessageService.showSuccess(this.t().profileAvatarUploadSuccess, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
          this._avatarPreviewUrl.set(null);
          URL.revokeObjectURL(previewUrl);
        },
        error: () => {
          this._avatarUploading.set(false);
          this._avatarUploadError.set(true);
          this.feedbackMessageService.showError(this.t().profileAvatarUploadError, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
          this._avatarPreviewUrl.set(null);
          URL.revokeObjectURL(previewUrl);
        },
      });
  }

  requestPasswordChange(): void {
    this._passwordChangeUnavailable.set(true);
  }

  confirmDeleteAccount(): void {
    this._deleteAccountUnavailable.set(true);
  }
}
