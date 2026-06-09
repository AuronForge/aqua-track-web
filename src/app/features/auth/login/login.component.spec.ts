import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';

import { AuthApiService } from '../../../core/auth/services/auth-api.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { LoginResponse } from '../../../core/auth/models/login-response.model';
import { LoginComponent } from './login.component';

const mockLoginResponse: LoginResponse = {
  user: {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: null,
    status: 'ACTIVE',
    role: 'USER',
    plan: 'FREE',
  },
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
};

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  async function createComponent(): Promise<void> {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  }

  async function createComponentWithApiMock(
    loginFn: () => Observable<LoginResponse>,
  ): Promise<void> {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthApiService, useValue: { login: loginFn } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    localStorage.clear();
  });

  it('should create', async () => {
    await createComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title in Portuguese by default', async () => {
    await createComponent();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.login-card__title')?.textContent?.trim()).toBe(
      'Bem-vindo ao AquaTrack',
    );
  });

  it('should change the texts when the language changes', async () => {
    await createComponent();

    fixture.componentInstance.changeLanguage('en');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.login-card__title')?.textContent?.trim()).toBe(
      'Welcome to AquaTrack',
    );
  });

  it('should use the stored language when it is valid', async () => {
    localStorage.setItem('aqua-track.language', 'es');

    await createComponent();

    expect(fixture.componentInstance.selectedLanguage()).toBe('es');
  });

  it('should fallback to Portuguese when the stored language is invalid', async () => {
    localStorage.setItem('aqua-track.language', 'fr');

    await createComponent();

    expect(fixture.componentInstance.selectedLanguage()).toBe('pt');
  });

  it('should persist the selected language', async () => {
    await createComponent();

    fixture.componentInstance.changeLanguage('en');

    expect(localStorage.getItem('aqua-track.language')).toBe('en');
  });

  it('should change language when clicking an option in the language switcher', async () => {
    await createComponent();

    const trigger = fixture.nativeElement.querySelector(
      '.language-switcher__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click(); // English
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.login-card__title')?.textContent?.trim()).toBe(
      'Welcome to AquaTrack',
    );
  });

  it('should close the language menu after clicking a language option', async () => {
    await createComponent();

    const trigger = fixture.nativeElement.querySelector(
      '.language-switcher__trigger',
    ) as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll(
      '.language-switcher__option',
    ) as NodeListOf<HTMLButtonElement>;
    options[1].click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.language-switcher__menu')).toBeNull();
  });

  it('should mark all controls as touched on submit', async () => {
    await createComponent();

    fixture.componentInstance.submit();

    expect(fixture.componentInstance.loginForm.controls.email.touched).toBe(true);
    expect(fixture.componentInstance.loginForm.controls.password.touched).toBe(true);
  });

  it('should fallback to Portuguese when localStorage is unavailable', async () => {
    const originalLocalStorage = window.localStorage;

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: undefined,
    });

    try {
      await createComponent();

      expect(fixture.componentInstance.selectedLanguage()).toBe('pt');
    } finally {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  describe('API integration', () => {
    it('should not call the API when the form is invalid', async () => {
      const loginSpy = jest.fn();
      await createComponentWithApiMock(loginSpy);

      fixture.componentInstance.submit();

      expect(loginSpy).not.toHaveBeenCalled();
    });

    it('should call the API with email and password on valid submit', async () => {
      const loginSpy = jest.fn().mockReturnValue(of(mockLoginResponse));
      await createComponentWithApiMock(loginSpy);

      fixture.componentInstance.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.componentInstance.submit();

      expect(loginSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should set isLoading to true while waiting for the API response', async () => {
      const loginSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(loginSpy);

      fixture.componentInstance.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.componentInstance.submit();

      expect(fixture.componentInstance.isLoading()).toBe(true);
    });

    it('should not call the API again while a request is in progress', async () => {
      const loginSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(loginSpy);

      fixture.componentInstance.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.componentInstance.submit();
      fixture.componentInstance.submit();

      expect(loginSpy).toHaveBeenCalledTimes(1);
    });

    it('should store the access token and navigate to "/" on success', async () => {
      const loginSpy = jest.fn().mockReturnValue(of(mockLoginResponse));
      await createComponentWithApiMock(loginSpy);

      const authService = TestBed.inject(AuthService);
      const setTokenSpy = jest.spyOn(authService, 'setToken');
      const router = TestBed.inject(Router);
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      fixture.componentInstance.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.componentInstance.submit();

      expect(setTokenSpy).toHaveBeenCalledWith('test-access-token');
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should show an error message and clear loading on API error', async () => {
      const loginSpy = jest.fn().mockReturnValue(throwError(() => new Error('400')));
      await createComponentWithApiMock(loginSpy);

      fixture.componentInstance.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(fixture.componentInstance.isLoading()).toBe(false);
      expect(fixture.componentInstance.apiError()).not.toBeNull();
    });

    it('should render the API error message in the DOM', async () => {
      const loginSpy = jest.fn().mockReturnValue(throwError(() => new Error('400')));
      await createComponentWithApiMock(loginSpy);

      fixture.componentInstance.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });
      fixture.componentInstance.submit();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.login-card__api-error');
      expect(errorEl).not.toBeNull();
      expect(errorEl.textContent.trim()).toBe('E-mail ou senha incorretos. Tente novamente.');
    });

    it('should clear the API error before a new request', async () => {
      const loginSpy = jest
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('400')))
        .mockReturnValueOnce(NEVER);
      await createComponentWithApiMock(loginSpy);

      fixture.componentInstance.loginForm.setValue({
        email: 'test@example.com',
        password: 'password123',
      });

      fixture.componentInstance.submit();
      fixture.detectChanges();
      expect(fixture.componentInstance.apiError()).not.toBeNull();

      fixture.componentInstance.submit();
      expect(fixture.componentInstance.apiError()).toBeNull();
    });
  });
});
