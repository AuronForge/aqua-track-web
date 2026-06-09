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
import { RouterLink } from '@angular/router';

import { AuthApiService } from '../../../core/auth/services/auth-api.service';
import { getInitialLanguage } from '../../../shared/utils/get-initial-language.util';
import { LANGUAGE_STORAGE_KEY } from '../../../shared/constants/language-storage-key.constant';
import { LanguageCode } from '../../../shared/types/language-code.type';
import { TRANSLATIONS } from '../../../shared/constants/translations.constant';
import { DatepickerComponent } from '../../../shared/components/datepicker/datepicker.component';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LanguageSwitcherComponent, DatepickerComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly authApiService = inject(AuthApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentYear = new Date().getFullYear();
  readonly forgotPasswordForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  readonly selectedLanguage = signal<LanguageCode>(getInitialLanguage());
  readonly translation = computed(() => TRANSLATIONS[this.selectedLanguage()]);
  readonly isLoading = signal(false);
  readonly apiError = signal<string | null>(null);
  readonly newPassword = signal<string | null>(null);
  readonly isCopied = signal(false);

  changeLanguage(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }

  submit(): void {
    if (this.isLoading()) return;

    this.forgotPasswordForm.markAllAsTouched();

    if (this.forgotPasswordForm.invalid) return;

    const { email, username: name, birthDate } = this.forgotPasswordForm.getRawValue();

    this.isLoading.set(true);
    this.apiError.set(null);

    this.authApiService
      .forgotPassword({ email, name, birthDate })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.newPassword.set(response.newPassword);
        },
        error: () => {
          this.isLoading.set(false);
          this.apiError.set(this.translation().forgotPasswordError);
        },
      });
  }

  copyPassword(): void {
    const password = this.newPassword();
    if (!password) return;

    void navigator.clipboard.writeText(password).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000);
    });
  }
}
