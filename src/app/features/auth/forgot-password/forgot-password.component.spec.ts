import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';

import { AuthApiService } from '../../../core/auth/services/auth-api.service';
import { ForgotPasswordComponent } from './forgot-password.component';

const VALID_FORM_VALUES = {
  email: 'test@example.com',
  username: 'testuser',
  birthDate: '1990-01-15',
};

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  async function createComponent(): Promise<void> {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();
  }

  async function createComponentWithApiMock(
    forgotPasswordFn: () => ReturnType<AuthApiService['forgotPassword']>,
  ): Promise<void> {
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideRouter([]),
        { provide: AuthApiService, useValue: { forgotPassword: forgotPasswordFn } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
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
      'Esqueceu a senha?',
    );
  });

  it('should change the texts when the language changes', async () => {
    await createComponent();

    fixture.componentInstance.changeLanguage('en');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.login-card__title')?.textContent?.trim()).toBe(
      'Forgot your password?',
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

  it('should mark all controls as touched on submit', async () => {
    await createComponent();

    fixture.componentInstance.submit();

    const { controls } = fixture.componentInstance.forgotPasswordForm;
    expect(controls.email.touched).toBe(true);
    expect(controls.username.touched).toBe(true);
    expect(controls.birthDate.touched).toBe(true);
  });

  describe('form validation', () => {
    it('should be invalid when all fields are empty', async () => {
      await createComponent();

      expect(fixture.componentInstance.forgotPasswordForm.invalid).toBe(true);
    });

    it('should be valid when all fields are correctly filled', async () => {
      await createComponent();

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);

      expect(fixture.componentInstance.forgotPasswordForm.valid).toBe(true);
    });

    it('should show the email required error after submit', async () => {
      await createComponent();

      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain(fixture.componentInstance.translation().emailRequired);
    });

    it('should show the email invalid error when the format is wrong', async () => {
      await createComponent();

      fixture.componentInstance.forgotPasswordForm.controls.email.setValue('not-an-email');
      fixture.componentInstance.forgotPasswordForm.controls.email.markAsTouched();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain(fixture.componentInstance.translation().emailInvalid);
    });

    it('should show the username required error after submit', async () => {
      await createComponent();

      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain(
        fixture.componentInstance.translation().fullNameRequired,
      );
    });

    it('should show the birthdate required error after submit', async () => {
      await createComponent();

      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(errorTexts(fixture)).toContain(
        fixture.componentInstance.translation().birthdateRequired,
      );
    });
  });

  describe('API integration', () => {
    it('should not call the API when the form is invalid', async () => {
      const forgotPasswordSpy = jest.fn();
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.submit();

      expect(forgotPasswordSpy).not.toHaveBeenCalled();
    });

    it('should call the API with email, username and birthDate on valid submit', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(of({ newPassword: 'new-pass-123' }));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();

      expect(forgotPasswordSpy).toHaveBeenCalledWith({
        email: 'test@example.com',
        name: 'testuser',
        birthDate: '1990-01-15',
      });
    });

    it('should set isLoading to true while waiting for the API response', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();

      expect(fixture.componentInstance.isLoading()).toBe(true);
    });

    it('should show the loading label while the request is in progress', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('.login-card__submit-button');
      expect(button.textContent.trim()).toBe('Enviando...');
    });

    it('should not call the API again while a request is in progress', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(NEVER);
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.componentInstance.submit();

      expect(forgotPasswordSpy).toHaveBeenCalledTimes(1);
    });

    it('should set isLoading to false on success', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(of({ newPassword: 'new-pass-123' }));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();

      expect(fixture.componentInstance.isLoading()).toBe(false);
    });

    it('should show an error message and clear loading on API error', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(throwError(() => new Error('500')));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(fixture.componentInstance.isLoading()).toBe(false);
      expect(fixture.componentInstance.apiError()).not.toBeNull();
    });

    it('should render the API error message in the DOM', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(throwError(() => new Error('500')));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.login-card__api-error');
      expect(errorEl).not.toBeNull();
      expect(errorEl.textContent.trim()).toBe(
        'Não foi possível enviar as instruções. Verifique os dados e tente novamente.',
      );
    });

    it('should set newPassword on success', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(of({ newPassword: 'secret-pass-42' }));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();

      expect(fixture.componentInstance.newPassword()).toBe('secret-pass-42');
    });

    it('should display the new password in the DOM after success', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(of({ newPassword: 'secret-pass-42' }));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      const passwordEl = fixture.nativeElement.querySelector('.login-card__password-text');
      expect(passwordEl).not.toBeNull();
      expect(passwordEl.textContent.trim()).toBe('secret-pass-42');
    });

    it('should hide the form and show the success state after success', async () => {
      const forgotPasswordSpy = jest.fn().mockReturnValue(of({ newPassword: 'secret-pass-42' }));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.login-card__form')).toBeNull();
      expect(fixture.nativeElement.querySelector('.login-card__success')).not.toBeNull();
    });

    it('should not call clipboard when copyPassword is called with no password set', async () => {
      const writeTextMock = jest.fn();
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      await createComponent();

      fixture.componentInstance.copyPassword();

      expect(writeTextMock).not.toHaveBeenCalled();
    });

    it('should copy the password to clipboard when the copy button is clicked', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      const forgotPasswordSpy = jest.fn().mockReturnValue(of({ newPassword: 'secret-pass-42' }));
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);
      fixture.componentInstance.submit();
      fixture.detectChanges();

      fixture.nativeElement.querySelector('.login-card__copy-button').click();

      expect(writeTextMock).toHaveBeenCalledWith('secret-pass-42');
    });

    it('should clear the API error before a new request', async () => {
      const forgotPasswordSpy = jest
        .fn()
        .mockReturnValueOnce(throwError(() => new Error('500')))
        .mockReturnValueOnce(NEVER);
      await createComponentWithApiMock(forgotPasswordSpy);

      fixture.componentInstance.forgotPasswordForm.setValue(VALID_FORM_VALUES);

      fixture.componentInstance.submit();
      fixture.detectChanges();
      expect(fixture.componentInstance.apiError()).not.toBeNull();

      fixture.componentInstance.submit();
      expect(fixture.componentInstance.apiError()).toBeNull();
    });
  });
});

function errorTexts(fixture: ComponentFixture<ForgotPasswordComponent>): string[] {
  const nodes: NodeListOf<Element> = fixture.nativeElement.querySelectorAll(
    '.text-formfield__error, .login-card__error',
  );
  return Array.from(nodes).map((el) => el.textContent?.trim() ?? '');
}
