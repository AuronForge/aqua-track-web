import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AuthenticatedLayoutComponent } from './authenticated-layout.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { LANGUAGE_STORAGE_KEY } from '../../shared/constants/language-storage-key.constant';

describe('AuthenticatedLayoutComponent', () => {
  const authServiceMock = () => ({
    clearToken: jest.fn(),
  });

  const pageTitleServiceMock = () => ({
    title: signal('Dashboard'),
    subtitle: signal('Overview'),
  });

  async function createFixture() {
    const auth = authServiceMock();
    const pageTitle = pageTitleServiceMock();

    await TestBed.configureTestingModule({
      imports: [AuthenticatedLayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: PageTitleService, useValue: pageTitle },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AuthenticatedLayoutComponent);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();

    return { fixture, auth, navigateSpy };
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('should create', async () => {
    const { fixture } = await createFixture();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render toolbar values from the page title service', async () => {
    const { fixture } = await createFixture();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Dashboard');
    expect(text).toContain('Overview');
  });

  it('should update selectedLanguage and persist it when localStorage is available', async () => {
    const { fixture } = await createFixture();

    fixture.componentInstance['onLanguageChange']('en');

    expect(fixture.componentInstance['selectedLanguage']()).toBe('en');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
  });

  it('should update selectedLanguage even when localStorage is unavailable', async () => {
    const { fixture } = await createFixture();
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: undefined,
    });

    fixture.componentInstance['onLanguageChange']('pt-BR');

    expect(fixture.componentInstance['selectedLanguage']()).toBe('pt-BR');

    if (originalDescriptor) {
      Object.defineProperty(window, 'localStorage', originalDescriptor);
    }
  });

  it('should clear the token and navigate to login on logout', async () => {
    const { fixture, auth, navigateSpy } = await createFixture();

    fixture.componentInstance['onUserMenuItemClick']({
      id: 'logout',
      label: 'Logout',
      icon: 'logout',
      isDestructive: true,
    });

    expect(auth.clearToken).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should ignore non-logout user menu actions', async () => {
    const { fixture, auth, navigateSpy } = await createFixture();

    fixture.componentInstance['onUserMenuItemClick']({
      id: 'profile',
      label: 'My Profile',
      icon: 'person',
    });

    expect(auth.clearToken).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
