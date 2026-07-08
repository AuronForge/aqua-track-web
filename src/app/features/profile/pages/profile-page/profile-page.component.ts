import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { LanguageService } from '../../../../shared/services/language.service';
import { AccountSecurityCardComponent } from '../../components/account-security-card/account-security-card.component';
import { DangerZoneCardComponent } from '../../components/danger-zone-card/danger-zone-card.component';
import { PreferencesCardComponent } from '../../components/preferences-card/preferences-card.component';
import { ProfileInformationCardComponent } from '../../components/profile-information-card/profile-information-card.component';
import { ProfileFacade } from '../../facades/profile.facade';
import { ProfileInformationFormValue } from '../../models/profile-information-form-value.model';
import { ProfilePreferencesFormValue } from '../../models/profile-preferences-form-value.model';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    AccountSecurityCardComponent,
    DangerZoneCardComponent,
    PreferencesCardComponent,
    ProfileInformationCardComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  protected readonly facade = inject(ProfileFacade);
  private readonly pageTitleService = inject(PageTitleService);
  private readonly languageService = inject(LanguageService);

  protected readonly t = this.languageService.translation;

  constructor() {
    effect(() => {
      this.pageTitleService.set(this.t().userMenuProfile, this.t().profilePageSubtitle);
    });

    this.facade.loadProfile();
  }

  protected onSaveProfile(value: ProfileInformationFormValue): void {
    this.facade.saveProfile(value);
  }

  protected onAvatarFileSelected(file: File): void {
    this.facade.requestAvatarChange(file);
  }

  protected onSavePreferences(value: ProfilePreferencesFormValue): void {
    this.facade.savePreferences(value);
  }

  protected onChangePasswordRequested(): void {
    this.facade.requestPasswordChange();
  }

  protected onDeleteAccountRequested(): void {
    this.facade.requestDeleteAccount();
  }
}
