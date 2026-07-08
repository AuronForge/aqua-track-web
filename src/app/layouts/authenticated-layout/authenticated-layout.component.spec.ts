import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../core/auth/services/auth.service';
import { UserApiDto } from '../../core/users/models/user-api.dto';
import { UserService } from '../../core/users/services/user.service';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { LanguageService } from '../../shared/services/language.service';
import { AuthenticatedLayoutComponent } from './authenticated-layout.component';

const mockUser: UserApiDto = {
  id: 'user-id',
  name: 'Admin AquaTrack',
  email: 'admin@aquatrack.com',
  phone: null,
  birthDate: '1990-05-12',
  avatarUrl: 'https://cdn.example.com/avatar.png',
  role: 'USER',
  plan: 'FREE',
  status: 'ACTIVE',
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
    concentrationUnit: 'MG_L',
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

describe('AuthenticatedLayoutComponent', () => {
  const authServiceMock = () => ({
    clearToken: jest.fn(),
  });

  const pageTitleServiceMock = () => ({
    title: signal('Dashboard'),
    subtitle: signal('Overview'),
  });

  const languageServiceMock = () => {
    const selectedLanguage = signal<'pt' | 'en' | 'es'>('pt');

    return {
      selectedLanguage,
      translation: signal({
        navCollapse: 'Collapse',
        navExpand: 'Expand',
        navGoHome: 'Go home',
        userMenuProfile: 'My Profile',
        userMenuHelp: 'Help',
        userMenuLogout: 'Logout',
        languageSelectorLabel: 'Select language',
        navDashboard: 'Dashboard',
        navAquariums: 'Aquariums',
        navMeasurements: 'Measurements',
        navAlerts: 'Alerts',
        navAquaticLife: 'Aquatic Life',
        navProducts: 'Products',
        navDosageCalculator: 'Dosage Calculator',
        navSettings: 'Settings',
      }),
      setLanguage: jest.fn((language: 'pt' | 'en' | 'es') => selectedLanguage.set(language)),
    };
  };

  const userServiceMock = () => ({
    currentUser: signal<UserApiDto | null>(mockUser),
    loadCurrentUser: jest.fn().mockReturnValue(of(mockUser)),
    clearCurrentUser: jest.fn(),
  });

  async function createFixture() {
    const auth = authServiceMock();
    const pageTitle = pageTitleServiceMock();
    const languageService = languageServiceMock();
    const userService = userServiceMock();

    await TestBed.configureTestingModule({
      imports: [AuthenticatedLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: PageTitleService, useValue: pageTitle },
        { provide: LanguageService, useValue: languageService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AuthenticatedLayoutComponent);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();

    return { fixture, auth, navigateSpy, languageService, userService };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.restoreAllMocks();
  });

  it('should create', async () => {
    const { fixture } = await createFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should load the current user on startup', async () => {
    const { userService } = await createFixture();

    expect(userService.loadCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should render toolbar values from the page title service', async () => {
    const { fixture } = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Dashboard');
    expect(text).toContain('Overview');
  });

  it('should render the current user name and email', async () => {
    const { fixture } = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Admin AquaTrack');
    expect(text).toContain('admin@aquatrack.com');
  });

  it('should hide the help user menu item while it is not ready', async () => {
    const { fixture } = await createFixture();
    const items = fixture.componentInstance['userMenuItems']();

    expect(items.some((item) => item.id === 'help')).toBe(false);
  });

  it('should show only ready navigation items in the sidebar', async () => {
    const { fixture } = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Dashboard');
    expect(text).not.toContain('Aquariums');
    expect(text).not.toContain('Measurements');
    expect(text).not.toContain('Alerts');
    expect(text).not.toContain('Settings');
  });

  it('should fall back to defaults when there is no current user', async () => {
    const userService = userServiceMock();
    userService.currentUser.set(null);
    const auth = authServiceMock();
    const pageTitle = pageTitleServiceMock();
    const languageService = languageServiceMock();

    await TestBed.configureTestingModule({
      imports: [AuthenticatedLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: PageTitleService, useValue: pageTitle },
        { provide: LanguageService, useValue: languageService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AuthenticatedLayoutComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance['userName']()).toBe('Usuário');
    expect(fixture.componentInstance['userEmail']()).toBe('');
    expect(fixture.componentInstance['userAvatarUrl']()).toBeNull();
    expect(fixture.componentInstance['userPlan']()).toBe('');
  });

  it('should update selectedLanguage through the language service', async () => {
    const { fixture, languageService } = await createFixture();

    fixture.componentInstance['onLanguageChange']('en');

    expect(fixture.componentInstance['selectedLanguage']()).toBe('en');
    expect(languageService.setLanguage).toHaveBeenCalledWith('en');
  });

  it('should clear user state, clear the token and navigate to login on logout', async () => {
    const { fixture, auth, navigateSpy, userService } = await createFixture();

    fixture.componentInstance['onUserMenuItemClick']({
      id: 'logout',
      label: 'Logout',
      icon: 'logout',
      isDestructive: true,
    });

    expect(userService.clearCurrentUser).toHaveBeenCalledTimes(1);
    expect(auth.clearToken).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /profile when the profile menu item is clicked', async () => {
    const { fixture, auth, navigateSpy } = await createFixture();

    fixture.componentInstance['onUserMenuItemClick']({
      id: 'profile',
      label: 'My Profile',
      icon: 'person',
    });

    expect(auth.clearToken).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/profile']);
  });

  it('should ignore unknown user menu actions', async () => {
    const { fixture, auth, navigateSpy } = await createFixture();

    fixture.componentInstance['onUserMenuItemClick']({
      id: 'help',
      label: 'Help',
      icon: 'help_outline',
    });

    expect(auth.clearToken).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
