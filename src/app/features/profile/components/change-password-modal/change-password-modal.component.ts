import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ChangePasswordRequestDto } from '../../../../core/users/models/change-password-request.dto';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextFormfieldComponent } from '../../../../shared/components/formfields/text-formfield/text-formfield.component';
import { ModalRef } from '../../../../shared/modal/modal-ref';
import { FeedbackMessageService } from '../../../../shared/services/feedback-message.service';
import { LanguageService } from '../../../../shared/services/language.service';
import {
  passwordDifferentFromCurrentValidator,
  passwordsMatchValidator,
} from '../../../../shared/validators/password-match.validator';
import {
  getPasswordPolicyState,
  passwordPolicyValidator,
} from '../../../../shared/validators/password-policy.validator';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, TextFormfieldComponent],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent implements AfterViewInit {
  private readonly modalRef = inject(ModalRef);
  private readonly feedbackMessageService = inject(FeedbackMessageService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitChangePassword =
    input.required<(payload: ChangePasswordRequestDto) => Observable<void>>();
  readonly userIdentity =
    input.required<Pick<ChangePasswordRequestDto, 'email' | 'name' | 'birthDate'>>();

  private readonly currentPasswordField =
    viewChild.required<TextFormfieldComponent>('currentPasswordField');

  protected readonly t = this.languageService.translation;
  protected readonly isSubmitting = signal(false);
  protected readonly submissionError = signal<string | null>(null);
  private readonly newPasswordValue = signal('');

  protected readonly form = new FormGroup(
    {
      currentPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, passwordPolicyValidator()],
      }),
      confirmNewPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    {
      validators: [
        passwordsMatchValidator('newPassword', 'confirmNewPassword'),
        passwordDifferentFromCurrentValidator('currentPassword', 'newPassword'),
      ],
    },
  );

  protected readonly passwordPolicyState = computed(() =>
    getPasswordPolicyState(this.newPasswordValue()),
  );
  protected readonly currentPasswordErrorMessages = computed(() => ({
    required: this.t().passwordRequired,
    incorrectPassword: this.t().changePasswordCurrentPasswordIncorrect,
  }));
  protected readonly newPasswordErrorMessages = computed(() => ({
    required: this.t().passwordRequired,
    passwordPolicy: this.t().changePasswordRequirementsError,
    passwordUnchanged: this.t().changePasswordNewPasswordDifferent,
  }));
  protected readonly confirmPasswordErrorMessages = computed(() => ({
    required: this.t().confirmPasswordRequired,
    passwordsMismatch: this.t().passwordsMismatch,
  }));

  constructor() {
    this.form.controls.currentPassword.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.clearCurrentPasswordBackendError());

    this.form.controls.newPassword.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.newPasswordValue.set(value));

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.submissionError.set(null);
    });
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.currentPasswordField().focus());
  }

  protected close(reason: 'cancel' | 'close-button'): void {
    this.resetState();
    this.modalRef.close(
      reason === 'close-button'
        ? { reason: 'close-button' }
        : { reason: 'programmatic', data: { source: 'change-password-cancel' } },
    );
  }

  protected submit(): void {
    if (this.isSubmitting()) return;

    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { currentPassword, newPassword } = this.form.getRawValue();
    const { email, name, birthDate } = this.userIdentity();

    this.isSubmitting.set(true);
    this.submissionError.set(null);
    this.form.disable({ emitEvent: false });

    this.submitChangePassword()({
      email,
      name,
      birthDate,
      currentPassword,
      newPassword,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.form.enable({ emitEvent: false });
          this.feedbackMessageService.showSuccess(this.t().changePasswordSuccessMessage, {
            hasIcon: true,
            horizontalPosition: 'top',
            verticalPosition: 'end',
          });
          this.resetState();
          this.modalRef.close({
            reason: 'programmatic',
            data: { source: 'change-password-success' },
          });
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.form.enable({ emitEvent: false });
          this.handleSubmissionError(error);
        },
      });
  }

  protected fieldError(
    fieldName: 'currentPassword' | 'newPassword' | 'confirmNewPassword',
  ): string | null {
    const control = this.form.controls[fieldName];

    if (!control.touched && !control.dirty) {
      return null;
    }

    if (fieldName === 'currentPassword' && control.hasError('incorrectPassword')) {
      return this.t().changePasswordCurrentPasswordIncorrect;
    }

    if (control.hasError('required')) {
      return fieldName === 'confirmNewPassword'
        ? this.t().confirmPasswordRequired
        : this.t().passwordRequired;
    }

    if (
      fieldName === 'newPassword' &&
      (control.hasError('passwordPolicy') || this.form.hasError('passwordUnchanged'))
    ) {
      return this.form.hasError('passwordUnchanged')
        ? this.t().changePasswordNewPasswordDifferent
        : this.t().changePasswordRequirementsError;
    }

    if (
      fieldName === 'confirmNewPassword' &&
      this.form.hasError('passwordsMismatch') &&
      control.value
    ) {
      return this.t().passwordsMismatch;
    }

    return null;
  }

  protected requirementIcon(met: boolean): string {
    return met ? 'check_circle' : 'radio_button_unchecked';
  }

  private handleSubmissionError(error: unknown): void {
    if (this.isCurrentPasswordIncorrectError(error)) {
      const control = this.form.controls.currentPassword;
      control.setValue('');
      control.setErrors({ ...(control.errors ?? {}), incorrectPassword: true });
      control.markAsTouched();
      this.currentPasswordField().focus();
      return;
    }

    this.submissionError.set(this.t().changePasswordErrorMessage);
  }

  private isCurrentPasswordIncorrectError(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return false;
    }

    const errorCode =
      typeof error.error === 'object' && error.error
        ? String((error.error as Record<string, unknown>)['code'] ?? '')
        : '';

    return (
      (error.status === HttpStatusCode.BadRequest ||
        error.status === HttpStatusCode.UnprocessableEntity ||
        error.status === HttpStatusCode.Forbidden) &&
      errorCode.toUpperCase() === 'CURRENT_PASSWORD_INCORRECT'
    );
  }

  private clearCurrentPasswordBackendError(): void {
    const control = this.form.controls.currentPassword;

    if (!control.hasError('incorrectPassword')) {
      return;
    }

    const remainingErrors = { ...(control.errors ?? {}) };
    delete remainingErrors['incorrectPassword'];
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }

  private resetState(): void {
    this.form.reset(
      {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      { emitEvent: false },
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.enable({ emitEvent: false });
    this.newPasswordValue.set('');
    this.isSubmitting.set(false);
    this.submissionError.set(null);
  }
}
