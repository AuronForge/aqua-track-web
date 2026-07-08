import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { ProfileFacade } from '../../facades/profile.facade';
import { ProfilePreferences } from '../../models/profile-preferences.model';
import { ProfileSecurity } from '../../models/profile-security.model';
import { ProfileUser } from '../../models/profile-user.model';
import { ProfilePageComponent } from './profile-page.component';

const buildLanguageServiceMock = (lang: LanguageCode = 'en') => {
  const selectedLanguage = signal<LanguageCode>(lang);

  return {
    selectedLanguage,
    translation: computed(() => TRANSLATIONS[selectedLanguage()]),
    setLanguage: jest.fn(),
  };
};

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
  preferredLanguage: 'pt',
  temperatureUnit: 'celsius',
  concentrationUnit: 'mgL',
  emailAlertsEnabled: true,
  phAlertsEnabled: true,
  temperatureAlertsEnabled: true,
  ammoniaAlertsEnabled: true,
  nitriteAlertsEnabled: true,
  nitrateAlertsEnabled: true,
};

const SECURITY: ProfileSecurity = {
  passwordLastChangedAt: '2026-06-02T12:00:00.000Z',
  lastLoginAt: '2026-02-28T13:30:00.000Z',
};

describe('ProfilePageComponent', () => {
  let fixture: ComponentFixture<ProfilePageComponent>;
  let element: HTMLElement;
  let languageService: ReturnType<typeof buildLanguageServiceMock>;
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
    deleteAccountRequestPending: ReturnType<typeof signal<boolean>>;
    loadProfile: jest.Mock;
    saveProfile: jest.Mock;
    requestAvatarChange: jest.Mock;
    savePreferences: jest.Mock;
    requestPasswordChange: jest.Mock;
    requestDeleteAccount: jest.Mock;
  };
  let pageTitleService: { set: jest.Mock };

  function createFacade() {
    return {
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
      deleteAccountRequestPending: signal(false),
      loadProfile: jest.fn(),
      saveProfile: jest.fn(),
      requestAvatarChange: jest.fn(),
      savePreferences: jest.fn(),
      requestPasswordChange: jest.fn(),
      requestDeleteAccount: jest.fn(),
    };
  }

  function createFixture(lang: LanguageCode = 'en') {
    facade = createFacade();
    pageTitleService = { set: jest.fn() };
    languageService = buildLanguageServiceMock(lang);

    TestBed.configureTestingModule({
      imports: [ProfilePageComponent],
      providers: [
        { provide: ProfileFacade, useValue: facade },
        { provide: PageTitleService, useValue: pageTitleService },
        { provide: LanguageService, useValue: languageService },
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

  it('should update the page title when the language changes', () => {
    pageTitleService.set.mockClear();

    languageService.selectedLanguage.set('pt');
    fixture.detectChanges();

    expect(pageTitleService.set).toHaveBeenCalledWith(
      'Meu Perfil',
      'Gerencie as configurações e preferências da sua conta',
    );
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

    it('should delegate deleteAccountRequested events to the facade', () => {
      fixture.componentInstance['onDeleteAccountRequested']();

      expect(facade.requestDeleteAccount).toHaveBeenCalled();
    });
  });

  it('should set the page title using the current language translation', () => {
    TestBed.resetTestingModule();
    createFixture('pt');

    expect(pageTitleService.set).toHaveBeenCalledWith(
      'Meu Perfil',
      'Gerencie as configurações e preferências da sua conta',
    );
    expect(fixture.nativeElement.textContent).toContain('Carregando perfil...');
  });
});
