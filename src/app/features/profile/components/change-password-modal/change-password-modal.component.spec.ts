import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';

import { ChangePasswordModalComponent } from './change-password-modal.component';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { ModalRef } from '../../../../shared/modal/modal-ref';
import { TRANSLATIONS } from '../../../../shared/constants/translations.constant';

describe('ChangePasswordModalComponent', () => {
  let fixture: ComponentFixture<ChangePasswordModalComponent>;
  let component: ChangePasswordModalComponent;
  let element: HTMLElement;
  let submitChangePassword: jest.Mock;
  let modalRef: { close: jest.Mock };
  let feedbackMessageService: { showSuccess: jest.Mock };

  function getPasswordField(fieldName: string): Element {
    return element.querySelector(`aq-text-formfield[formcontrolname="${fieldName}"]`) as Element;
  }

  function getPasswordInput(fieldName: string): HTMLInputElement {
    return getPasswordField(fieldName).querySelector('input') as HTMLInputElement;
  }

  function getPasswordToggle(fieldName: string): HTMLButtonElement {
    return getPasswordField(fieldName).querySelector(
      '.text-formfield__action',
    ) as HTMLButtonElement;
  }

  function createComponent() {
    submitChangePassword = jest.fn().mockReturnValue(of(void 0));
    modalRef = { close: jest.fn() };
    feedbackMessageService = { showSuccess: jest.fn() };

    TestBed.configureTestingModule({
      imports: [ChangePasswordModalComponent],
      providers: [
        {
          provide: LanguageService,
          useValue: {
            selectedLanguage: signal('en'),
            translation: signal(TRANSLATIONS.en),
          },
        },
        { provide: ModalRef, useValue: modalRef },
        { provide: FeedbackMessageService, useValue: feedbackMessageService },
      ],
    });

    fixture = TestBed.createComponent(ChangePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userIdentity', {
      email: 'john@example.com',
      name: 'John Doe',
      birthDate: '1990-05-12',
    });
    fixture.componentRef.setInput('submitChangePassword', submitChangePassword);
    fixture.detectChanges();
    element = fixture.nativeElement;
  }

  beforeEach(() => createComponent());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid form and disabled submit button', () => {
    expect(component['form'].invalid).toBe(true);
    expect(
      Array.from(element.querySelectorAll('button')).some(
        (button) =>
          button.textContent?.includes('Update Password') && button.hasAttribute('disabled'),
      ),
    ).toBe(true);
  });

  it('should validate password requirements and matching confirmation', () => {
    component['form'].controls.currentPassword.setValue('Current@123');
    component['form'].controls.newPassword.setValue('short');
    component['form'].controls.confirmNewPassword.setValue('short');
    component['form'].markAllAsTouched();
    fixture.detectChanges();

    expect(element.textContent).toContain('Your new password must meet all requirements.');

    component['form'].controls.newPassword.setValue('NewPassword@123');
    component['form'].controls.confirmNewPassword.setValue('Mismatch@123');
    fixture.detectChanges();

    expect(element.textContent).toContain('Passwords do not match.');
  });

  it('should show the confirm-password required message when confirmation is touched but empty', () => {
    component['form'].controls.confirmNewPassword.markAsTouched();
    fixture.detectChanges();

    expect(element.textContent).toContain('Password confirmation is required.');
  });

  it('should update password requirements in real time when the new password changes', () => {
    component['form'].controls.newPassword.setValue('Teste@1234');
    fixture.detectChanges();

    const metRequirements = element.querySelectorAll('.change-password-modal__requirement--met');

    expect(metRequirements).toHaveLength(4);
  });

  it('should block a new password equal to the current password', () => {
    component['form'].setValue({
      currentPassword: 'SamePassword@123',
      newPassword: 'SamePassword@123',
      confirmNewPassword: 'SamePassword@123',
    });
    component['form'].markAllAsTouched();
    fixture.detectChanges();

    expect(element.textContent).toContain(
      'New password must be different from your current password.',
    );
  });

  it('should toggle each password visibility independently', () => {
    const currentPasswordInput = getPasswordInput('currentPassword');
    const newPasswordInput = getPasswordInput('newPassword');

    expect(currentPasswordInput.type).toBe('password');
    getPasswordToggle('currentPassword').click();
    fixture.detectChanges();

    expect(currentPasswordInput.type).toBe('text');
    expect(newPasswordInput.type).toBe('password');
  });

  it('should toggle the new and confirm password fields independently', () => {
    const currentPasswordInput = getPasswordInput('currentPassword');
    const newPasswordInput = getPasswordInput('newPassword');
    const confirmPasswordInput = getPasswordInput('confirmNewPassword');

    getPasswordToggle('newPassword').click();
    getPasswordToggle('confirmNewPassword').click();
    fixture.detectChanges();

    expect(currentPasswordInput.type).toBe('password');
    expect(newPasswordInput.type).toBe('text');
    expect(confirmPasswordInput.type).toBe('text');
  });

  it('should not submit when the form is invalid', () => {
    component['submit']();

    expect(submitChangePassword).not.toHaveBeenCalled();
  });

  it('should call submitChangePassword with the correct payload on valid submit', () => {
    component['form'].setValue({
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();

    expect(submitChangePassword).toHaveBeenCalledWith({
      email: 'john@example.com',
      name: 'John Doe',
      birthDate: '1990-05-12',
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
    });
    expect(feedbackMessageService.showSuccess).toHaveBeenCalledWith(
      'Password updated successfully.',
      { hasIcon: true, horizontalPosition: 'top', verticalPosition: 'end' },
    );
    expect(modalRef.close).toHaveBeenCalledWith(
      expect.objectContaining({ reason: 'programmatic' }),
    );
  });

  it('should not call submitChangePassword again while submitting', () => {
    submitChangePassword.mockReturnValue(of(void 0));
    component['isSubmitting'].set(true);
    component['form'].setValue({
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();

    expect(submitChangePassword).not.toHaveBeenCalled();
  });

  it('should keep the submitting state until the password request completes', () => {
    const pendingRequest = new Subject<void>();
    submitChangePassword.mockReturnValue(pendingRequest);
    component['form'].setValue({
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();

    expect(component['isSubmitting']()).toBe(true);
    pendingRequest.next();
    pendingRequest.complete();
    expect(component['isSubmitting']()).toBe(false);
  });

  it('should show the current-password error returned by the backend and keep the modal open', () => {
    submitChangePassword.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { code: 'CURRENT_PASSWORD_INCORRECT' },
          }),
      ),
    );
    component['form'].setValue({
      currentPassword: 'Wrong@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();
    fixture.detectChanges();

    expect(element.textContent).toContain(
      'Current password is incorrect. Please review and try again.',
    );
    expect(modalRef.close).not.toHaveBeenCalled();
  });

  it('should treat FORBIDDEN with CURRENT_PASSWORD_INCORRECT as a current-password error', () => {
    submitChangePassword.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 403,
            error: { code: 'CURRENT_PASSWORD_INCORRECT' },
          }),
      ),
    );
    component['form'].setValue({
      currentPassword: 'Wrong@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();
    fixture.detectChanges();

    expect(component['form'].controls.currentPassword.hasError('incorrectPassword')).toBe(true);
    expect(element.textContent).toContain(
      'Current password is incorrect. Please review and try again.',
    );
  });

  it('should show a generic error when the backend error code does not match', () => {
    submitChangePassword.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { code: 'SOME_OTHER_ERROR' },
          }),
      ),
    );
    component['form'].setValue({
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();
    fixture.detectChanges();

    expect(element.textContent).toContain(
      "We couldn't update your password right now. Please try again.",
    );
  });

  it('should clear the backend incorrect-password error after the current password changes', () => {
    component['form'].controls.currentPassword.setErrors({ incorrectPassword: true });
    component['clearCurrentPasswordBackendError']();

    expect(component['form'].controls.currentPassword.hasError('incorrectPassword')).toBe(false);
    expect(component['form'].controls.currentPassword.errors).toBeNull();
  });

  it('should preserve other current-password errors when clearing the backend incorrect-password flag', () => {
    component['form'].controls.currentPassword.setErrors({
      incorrectPassword: true,
      customRule: true,
    });
    component['clearCurrentPasswordBackendError']();

    expect(component['form'].controls.currentPassword.hasError('incorrectPassword')).toBe(false);
    expect(component['form'].controls.currentPassword.hasError('customRule')).toBe(true);
  });

  it('should show a generic error when the thrown value is not an HttpErrorResponse', () => {
    submitChangePassword.mockReturnValue(throwError(() => new Error('plain failure')));
    component['form'].setValue({
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();
    fixture.detectChanges();

    expect(element.textContent).toContain(
      "We couldn't update your password right now. Please try again.",
    );
  });

  it('should render the unmet requirement icon when a password rule is not satisfied', () => {
    component['form'].controls.newPassword.setValue('short');
    fixture.detectChanges();

    expect(element.textContent).toContain('radio_button_unchecked');
  });

  it('should close with the close-button reason when the header close button is clicked', () => {
    const closeButton = element.querySelector(
      '.change-password-modal__close-button',
    ) as HTMLButtonElement;

    closeButton.click();

    expect(modalRef.close).toHaveBeenCalledWith({ reason: 'close-button' });
  });

  it('should show a generic submission error and keep the modal open on unexpected failure', () => {
    submitChangePassword.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component['form'].setValue({
      currentPassword: 'Current@123',
      newPassword: 'NewPassword@123',
      confirmNewPassword: 'NewPassword@123',
    });

    component['submit']();
    fixture.detectChanges();

    expect(element.textContent).toContain(
      "We couldn't update your password right now. Please try again.",
    );
    expect(modalRef.close).not.toHaveBeenCalled();
  });

  it('should close on cancel', () => {
    const cancelButton = Array.from(element.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Cancel'),
    ) as HTMLButtonElement;

    cancelButton.click();

    expect(modalRef.close).toHaveBeenCalledWith({
      reason: 'programmatic',
      data: { source: 'change-password-cancel' },
    });
  });
});
