import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SettingsCardComponent } from '../../../../shared/components/settings-card/settings-card.component';
import { LANGUAGE_LOCALE_MAP } from '../../../../shared/constants/language-locale.constant';
import { LanguageService } from '../../../../shared/services/language.service';
import { ProfileSecurity } from '../../models/profile-security.model';

@Component({
  selector: 'app-account-security-card',
  standalone: true,
  imports: [DatePipe, ButtonComponent, SettingsCardComponent],
  templateUrl: './account-security-card.component.html',
  styleUrl: './account-security-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSecurityCardComponent {
  private readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.translation;
  protected readonly locale = computed(
    () => LANGUAGE_LOCALE_MAP[this.languageService.selectedLanguage()],
  );

  readonly security = input.required<ProfileSecurity>();
  readonly passwordChangeUnavailable = input<boolean>(false);

  readonly changePasswordRequested = output<void>();

  protected requestPasswordChange(): void {
    this.changePasswordRequested.emit();
  }
}
