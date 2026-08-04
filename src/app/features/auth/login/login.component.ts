import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/auth/services/auth-api.service';
import { AuthService } from '../../../core/auth/services/auth.service';
import { getInitialLanguage } from '../../../shared/utils/get-initial-language.util';
import { LANGUAGE_STORAGE_KEY } from '../../../shared/constants/language-storage-key.constant';
import { LanguageCode } from '../../../shared/types/language-code.type';
import { TRANSLATIONS } from '../../../shared/constants/translations.constant';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';
import { TextFormfieldComponent } from '../../../shared/components/formfields/text-formfield/text-formfield.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LanguageSwitcherComponent, TextFormfieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentYear = new Date().getFullYear();
  readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  readonly selectedLanguage = signal<LanguageCode>(getInitialLanguage());
  readonly translation = computed(() => TRANSLATIONS[this.selectedLanguage()]);
  readonly isLoading = signal(false);
  readonly apiError = signal<string | null>(null);
  protected readonly emailErrorMessages = computed(() => ({
    required: this.translation().emailRequired,
    email: this.translation().emailInvalid,
  }));
  protected readonly passwordErrorMessages = computed(() => ({
    required: this.translation().passwordRequired,
  }));

  changeLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }

  submit(): void {
    if (this.isLoading()) return;

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();

    this.isLoading.set(true);
    this.apiError.set(null);

    this.authApiService
      .login({ email, password })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.authService.setToken(response.accessToken);
          this.router.navigate(['/home']);
        },
        error: () => {
          this.isLoading.set(false);
          this.apiError.set(this.translation().loginError);
        },
      });
  }
}
