import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { ProfileFacade } from '../../facades/profile.facade';
import { ProfileSecurity } from '../../models/profile-security.model';
import { ProfileUser } from '../../models/profile-user.model';
import { ProfilePreferences } from '../../models/profile-preferences.model';
import { ProfilePageComponent } from './profile-page.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => ({
  selectedLanguage: signal(lang),
  translation: computed(() => TRANSLATIONS[lang]),
  setLanguage: jest.fn(),
});

const USER: ProfileUser = {
  id: 'user-id',
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '(11) 99999-0000',
  birthDate: '1990-05-12',
  avatarUrl: null,
  initials: 'JD',
  memberSince: '2024-01-15T00:00:00.000Z',
};

const PREFERENCES: ProfilePreferences = {
  temperatureUnit: 'celsius',
  concentrationUnit: 'mgL',
  defaultAquariumId: null,
  emailAlertsEnabled: true,
};

const SECURITY: ProfileSecurity = {
  passwordLastChangedAt: '2026-06-02T12:00:00.000Z',
  lastLoginAt: '2026-02-28T13:30:00.000Z',
};

describe('ProfilePageComponent', () => {
  let fixture: ComponentFixture<ProfilePageComponent>;
  let element: HTMLElement;
  let facade: {
    user: ReturnType<typeof signal<ProfileUser | null>>;
    preferences: ReturnType<typeof signal<ProfilePreferences | null>>;
    security: ReturnType<typeof signal<ProfileSecurity>>;
    aquariumOptions: ReturnType<typeof signal<[]>>;
    savingProfile: ReturnType<typeof signal<boolean>>;
    profileSaveSuccess: ReturnType<typeof signal<boolean>>;
    profileSaveError: ReturnType<typeof signal<string | null>>;
    avatarPreviewUrl: ReturnType<typeof signal<string | null>>;
    avatarUploading: ReturnType<typeof signal<boolean>>;
    avatarUploadError: ReturnType<typeof signal<boolean>>;
    savingPreferences: ReturnType<typeof signal<boolean>>;
    preferencesSaveSuccess: ReturnType<typeof signal<boolean>>;
    preferencesSaveError: ReturnType<typeof signal<string | null>>;
    passwordChangeUnavailable: ReturnType<typeof signal<boolean>>;
    deleteAccountUnavailable: ReturnType<typeof signal<boolean>>;
    loadProfile: jest.Mock;
    saveProfile: jest.Mock;
    requestAvatarChange: jest.Mock;
    savePreferences: jest.Mock;
    requestPasswordChange: jest.Mock;
    confirmDeleteAccount: jest.Mock;
  };
  let pageTitleService: { set: jest.Mock };
  let confirmationDialogService: { confirm: jest.Mock };

  function createFixture() {
    facade = {
      user: signal<ProfileUser | null>(null),
      preferences: signal<ProfilePreferences | null>(null),
      security: signal(SECURITY),
      aquariumOptions: signal([]),
      savingProfile: signal(false),
      profileSaveSuccess: signal(false),
      profileSaveError: signal(null),
      avatarPreviewUrl: signal(null),
      avatarUploading: signal(false),
      avatarUploadError: signal(false),
      savingPreferences: signal(false),
      preferencesSaveSuccess: signal(false),
      preferencesSaveError: signal(null),
      passwordChangeUnavailable: signal(false),
      deleteAccountUnavailable: signal(false),
      loadProfile: jest.fn(),
      saveProfile: jest.fn(),
      requestAvatarChange: jest.fn(),
      savePreferences: jest.fn(),
      requestPasswordChange: jest.fn(),
      confirmDeleteAccount: jest.fn(),
    };

    pageTitleService = { set: jest.fn() };
    confirmationDialogService = { confirm: jest.fn().mockReturnValue(of(true)) };

    TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        { provide: ProfileFacade, useValue: facade },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: ConfirmationDialogService, useValue: confirmationDialogService },
        { provide: LanguageService, useValue: buildLanguageServiceMock() },
      ],
    });

    fixture = TestBed.createComponent(ProfilePageComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  }

  beforeEach(() => createFixture());

  it('should set the page title and load the profile on init', () => {
    expect(pageTitleService.set).toHaveBeenCalledWith(
      'My Profile',
      'Manage your account settings and preferences',
    );
    expect(facade.loadProfile).toHaveBeenCalled();
  });

  it('should show a loading state while the user is not loaded', () => {
    expect(element.querySelector('.profile-page__loading')).not.toBeNull();
    expect(element.querySelector('app-profile-information-card')).toBeNull();
  });

  it('should render all four cards once user and preferences are loaded', () => {
    facade.user.set(USER);
    facade.preferences.set(PREFERENCES);
    fixture.detectChanges();

    expect(element.querySelector('app-profile-information-card')).not.toBeNull();
    expect(element.querySelector('app-account-security-card')).not.toBeNull();
    expect(element.querySelector('app-preferences-card')).not.toBeNull();
    expect(element.querySelector('app-danger-zone-card')).not.toBeNull();
    expect(element.querySelector('.profile-page__loading')).toBeNull();
  });

  describe('once loaded', () => {
    beforeEach(() => {
      facade.user.set(USER);
      facade.preferences.set(PREFERENCES);
      fixture.detectChanges();
    });

    it('should delegate saveProfile events to the facade', () => {
      fixture.componentInstance['onSaveProfile']({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+55 11 98888-7777',
        birthDate: '1991-06-13',
      });

      expect(facade.saveProfile).toHaveBeenCalledWith({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+55 11 98888-7777',
        birthDate: '1991-06-13',
      });
    });

    it('should delegate avatarFileSelected events to the facade', () => {
      const file = new File(['x'], 'a.png', { type: 'image/png' });
      fixture.componentInstance['onAvatarFileSelected'](file);

      expect(facade.requestAvatarChange).toHaveBeenCalledWith(file);
    });

    it('should delegate savePreferences events to the facade', () => {
      fixture.componentInstance['onSavePreferences'](PREFERENCES);

      expect(facade.savePreferences).toHaveBeenCalledWith(PREFERENCES);
    });

    it('should delegate changePasswordRequested events to the facade', () => {
      fixture.componentInstance['onChangePasswordRequested']();

      expect(facade.requestPasswordChange).toHaveBeenCalled();
    });

    it('should open a confirmation dialog and only call confirmDeleteAccount when confirmed', () => {
      fixture.componentInstance['onDeleteAccountRequested']();

      expect(confirmationDialogService.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ tone: 'danger', confirmWord: 'DELETE' }),
      );
      expect(facade.confirmDeleteAccount).toHaveBeenCalled();
    });

    it('should not call confirmDeleteAccount when the dialog is cancelled', () => {
      confirmationDialogService.confirm.mockReturnValue(of(false));

      fixture.componentInstance['onDeleteAccountRequested']();

      expect(facade.confirmDeleteAccount).not.toHaveBeenCalled();
    });
  });

  it('should set the page title using the current language translation', () => {
    TestBed.resetTestingModule();

    facade = {
      user: signal<ProfileUser | null>(null),
      preferences: signal<ProfilePreferences | null>(null),
      security: signal(SECURITY),
      aquariumOptions: signal([]),
      savingProfile: signal(false),
      profileSaveSuccess: signal(false),
      profileSaveError: signal(null),
      avatarPreviewUrl: signal(null),
      avatarUploading: signal(false),
      avatarUploadError: signal(false),
      savingPreferences: signal(false),
      preferencesSaveSuccess: signal(false),
      preferencesSaveError: signal(null),
      passwordChangeUnavailable: signal(false),
      deleteAccountUnavailable: signal(false),
      loadProfile: jest.fn(),
      saveProfile: jest.fn(),
      requestAvatarChange: jest.fn(),
      savePreferences: jest.fn(),
      requestPasswordChange: jest.fn(),
      confirmDeleteAccount: jest.fn(),
    };
    pageTitleService = { set: jest.fn() };
    confirmationDialogService = { confirm: jest.fn().mockReturnValue(of(true)) };

    TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        { provide: ProfileFacade, useValue: facade },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: ConfirmationDialogService, useValue: confirmationDialogService },
        { provide: LanguageService, useValue: buildLanguageServiceMock('pt') },
      ],
    });

    const ptFixture = TestBed.createComponent(ProfilePageComponent);
    ptFixture.detectChanges();

    expect(pageTitleService.set).toHaveBeenCalledWith(
      'Meu Perfil',
      'Gerencie as configurações e preferências da sua conta',
    );
    expect(ptFixture.nativeElement.textContent).toContain('Carregando perfil...');
  });
});
