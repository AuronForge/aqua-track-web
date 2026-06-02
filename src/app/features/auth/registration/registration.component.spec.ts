import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NEVER, Observable, of, throwError } from 'rxjs';

import { AuthApiService } from '../../../core/auth/auth-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginResponse } from '../../../core/auth/models/login-response.model';
import { RegistrationComponent } from './registration.component';

const mockRegisterResponse: LoginResponse = {
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

const VALID_FORM_VALUES = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

describe('RegistrationComponent', () => {
  let fixture: ComponentFixture<RegistrationComponent>;

  async function createComponent(): Promise<void> {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
  }

  async function createComponentWithApiMock(
    registerFn: () => Observable<LoginResponse>,
  ): Promise<void> {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
      providers: [
        provideRouter([]),
        { provide: AuthApiService, useValue: { register: registerFn } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
  }

  beforeEach(() => {
    localStorage.clear();
  });

  it('should create', async () => {
    await createComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title in Portuguese by default', async () => {
    await createComponent();

    expect(fixture.nativeElement.querySelector('.login-card__title')?.textContent?.trim()).toBe(
      'Crie sua conta',
    );
  });

  it('should change the texts when the language changes', async () => {
    await createComponent();

    fixture.componentInstance.changeLanguage('en');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.login-card__title')?.textContent?.trim()).toBe(
      'Create your account',
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

  it('should fallback to Portuguese when localStorage is unavailable', async () => {
    const originalLocalStorage = window.localStorage;

    Object.defineProperty(window, 'localStorage', { configurable: true, value: undefined });

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

  it('should mark all controls as touched on submit', async () => {
    await createComponent();

    fixture.componentInstance.submit();

    const { controls } = fixture.componentInstance.registrationForm;
    expect(controls.fullName.touched).toBe(true);
    expect(controls.email.touched).toBe(true);
    expect(controls.password.touched).toBe(true);
    expect(controls.confirmPassword.touched).toBe(true);
  });

  describe('form validation', () => {
    it('should be invalid when all fields are empty', async () => {
      await createComponent();

      expect(fixture.componentInstance.registrationForm.invalid).toBe(true);
    });

    it('should be valid when all fields are correctly filled', async () => {
      await createComponent();

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);

      expect(fixture.componentInstance.registrationForm.valid).toBe(true);
    });

    it('should show the fullName required error after submit', async () => {
      await createComponent();

      fixture.componentInstance.submit();
      fixture.detectChanges();

      const texts = errorTexts(fixture);
      expect(texts).toContain('O nome completo é obrigatório.');
    });

    it('should show the email required error after submit', async () => {
      await createComponent();

      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain('O e-mail é obrigatório.');
    });

    it('should show the email invalid error when the format is wrong', async () => {
      await createComponent();

      fixture.componentInstance.registrationForm.controls.email.setValue('not-an-email');
      fixture.componentInstance.registrationForm.controls.email.markAsTouched();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain('Informe um e-mail válido.');
    });

    it('should show the password required error after submit', async () => {
      await createComponent();

      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain('A senha é obrigatória.');
    });

    it('should show the password minlength error when the password is too short', async () => {
      await createComponent();

      fixture.componentInstance.registrationForm.controls.password.setValue('short');
      fixture.componentInstance.registrationForm.controls.password.markAsTouched();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain('A senha deve ter pelo menos 8 caracteres.');
    });

    it('should show the confirmPassword required error after submit', async () => {
      await createComponent();

      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain('A confirmação de senha é obrigatória.');
    });

    it('should show the passwords mismatch error when passwords differ', async () => {
      await createComponent();

      fixture.componentInstance.registrationForm.setValue({
        ...VALID_FORM_VALUES,
        confirmPassword: 'different456',
      });
      fixture.componentInstance.registrationForm.controls.confirmPassword.markAsTouched();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain('As senhas não coincidem.');
    });
  });

  describe('API integration', () => {
    it('should not call the API when the form is invalid', async () => {
      const registerSpy = jest.fn();
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.submit();

      expect(registerSpy).not.toHaveBeenCalled();
    });

    it('should call the API with name, email and password on valid submit', async () => {
      const registerSpy = jest.fn().mockReturnValue(of(mockRegisterResponse));
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();

      expect(registerSpy).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should set isLoading to true while waiting for the API response', async () => {
      const registerSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();

      expect(fixture.componentInstance.isLoading()).toBe(true);
    });

    it('should show the loading label while the request is in progress', async () => {
      const registerSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.login-card__submit-button');
      expect(button.textContent.trim()).toBe('Criando conta...');
    });

    it('should not call the API again while a request is in progress', async () => {
      const registerSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.componentInstance.submit();

      expect(registerSpy).toHaveBeenCalledTimes(1);
    });

    it('should store the access token and navigate to "/" on success', async () => {
      const registerSpy = jest.fn().mockReturnValue(of(mockRegisterResponse));
      await createComponentWithApiMock(registerSpy);

      const authService = TestBed.inject(AuthService);
      const setTokenSpy = jest.spyOn(authService, 'setToken');
      const router = TestBed.inject(Router);
      const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();

      expect(setTokenSpy).toHaveBeenCalledWith('test-access-token');
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should show an error message and clear loading on API error', async () => {
      const registerSpy = jest.fn().mockReturnValue(throwError(() => new Error('400')));
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(fixture.componentInstance.isLoading()).toBe(false);
      expect(fixture.componentInstance.apiError()).not.toBeNull();
    });

    it('should render the API error message in the DOM', async () => {
      const registerSpy = jest.fn().mockReturnValue(throwError(() => new Error('400')));
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.login-card__api-error');
      expect(errorEl).not.toBeNull();
      expect(errorEl.textContent.trim()).toBe('Não foi possível criar a conta. Tente novamente.');
    });

    it('should clear the API error before a new request', async () => {
      const registerSpy = jest
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('400')))
        .mockReturnValueOnce(NEVER);
      await createComponentWithApiMock(registerSpy);

      fixture.componentInstance.registrationForm.setValue(VALID_FORM_VALUES);

      fixture.componentInstance.submit();
      fixture.detectChanges();
      expect(fixture.componentInstance.apiError()).not.toBeNull();

      fixture.componentInstance.submit();
      expect(fixture.componentInstance.apiError()).toBeNull();
    });
  });
});

function errorTexts(fixture: ComponentFixture<RegistrationComponent>): string[] {
  const nodes: NodeListOf<Element> = fixture.nativeElement.querySelectorAll('.login-card__error');
  return Array.from(nodes).map((el) => el.textContent?.trim() ?? '');
}
