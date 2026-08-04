import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/auth/services/auth-api.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { DatepickerFormfieldComponent } from '../../../shared/components/formfields/datepicker-formfield/datepicker-formfield.component';
import { TextFormfieldComponent } from '../../../shared/components/formfields/text-formfield/text-formfield.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';
import { LANGUAGE_STORAGE_KEY } from '../../../shared/constants/language-storage-key.constant';
import { TRANSLATIONS } from '../../../shared/constants/translations.constant';
import { LanguageCode } from '../../../shared/types/language-code.type';
import { getInitialLanguage } from '../../../shared/utils/get-initial-language.util';
import {
  getPasswordPolicyState,
  passwordPolicyValidator,
} from '../../../shared/validators/password-policy.validator';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LanguageSwitcherComponent,
    DatepickerFormfieldComponent,
    TextFormfieldComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly passwordValue = signal('');

  readonly currentYear = new Date().getFullYear();
  readonly registrationForm = new FormGroup(
    {
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      birthDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, passwordPolicyValidator()],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: passwordsMatchValidator },
  );

  readonly selectedLanguage = signal<LanguageCode>(getInitialLanguage());
  readonly translation = computed(() => TRANSLATIONS[this.selectedLanguage()]);
  readonly isLoading = signal(false);
  readonly apiError = signal<string | null>(null);
  protected readonly passwordPolicyState = computed(() =>
    getPasswordPolicyState(this.passwordValue()),
  );
  protected readonly fullNameErrorMessages = computed(() => ({
    required: this.translation().fullNameRequired,
  }));
  protected readonly emailErrorMessages = computed(() => ({
    required: this.translation().emailRequired,
    email: this.translation().emailInvalid,
  }));
  protected readonly passwordErrorMessages = computed(() => ({
    required: this.translation().passwordRequired,
    passwordPolicy: this.translation().changePasswordRequirementsError,
  }));
  protected readonly confirmPasswordErrorMessages = computed(() => ({
    required: this.translation().confirmPasswordRequired,
  }));

  constructor() {
    this.registrationForm.controls.password.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.passwordValue.set(value));
  }

  changeLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }

  submit(): void {
    if (this.isLoading()) return;

    this.registrationForm.markAllAsTouched();
    Object.values(this.registrationForm.controls).forEach((control) => {
      control.markAsTouched({ onlySelf: true, emitEvent: true });
      control.markAsDirty({ onlySelf: true, emitEvent: true });
      control.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    });

    if (this.registrationForm.invalid) return;

    const { fullName, email, birthDate, password } = this.registrationForm.getRawValue();

    this.isLoading.set(true);
    this.apiError.set(null);

    this.authApiService
      .register({ name: fullName, email, birthDate, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authService.setToken(response.accessToken);
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading.set(false);
          this.apiError.set(this.translation().registrationError);
        },
      });
  }

  protected requirementIcon(met: boolean): string {
    return met ? 'check_circle' : 'radio_button_unchecked';
  }
}
