import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/auth/auth-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { LANGUAGE_STORAGE_KEY } from '../../../shared/constants/language-storage-key.constant';
import { TRANSLATIONS } from '../../../shared/constants/translations.constant';
import { LanguageCode } from '../../../shared/types/language-code.type';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';
import { getInitialLanguage } from '../../../shared/utils/get-initial-language.util';

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LanguageSwitcherComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
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

  changeLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }

  submit(): void {
    if (this.isLoading()) return;

    this.registrationForm.markAllAsTouched();

    if (this.registrationForm.invalid) return;

    const { fullName, email, password } = this.registrationForm.getRawValue();

    this.isLoading.set(true);
    this.apiError.set(null);

    this.authApiService
      .register({ name: fullName, email, password })
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
}
