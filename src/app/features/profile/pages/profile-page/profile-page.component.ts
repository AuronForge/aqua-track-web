import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';
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
export class ProfilePageComponent implements OnInit {
  protected readonly facade = inject(ProfileFacade);
  private readonly pageTitleService = inject(PageTitleService);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);
  private readonly languageService = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly t = this.languageService.translation;

  ngOnInit(): void {
    this.pageTitleService.set(this.t().userMenuProfile, this.t().profilePageSubtitle);
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
    const t = this.t();

    this.confirmationDialogService
      .confirm({
        title: t.deleteAccountLabel,
        message: t.deleteAccountMessage,
        confirmLabel: t.deleteAccountLabel,
        cancelLabel: t.cancelLabel,
        tone: 'danger',
        confirmWord: t.deleteAccountConfirmWord,
        confirmWordLabel: t.deleteAccountConfirmWordLabel,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          this.facade.confirmDeleteAccount();
        }
      });
  }
}
