import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SettingsCardComponent } from '../../../../shared/components/settings-card/settings-card.component';
import { LanguageService } from '../../../../shared/services/language.service';

@Component({
  selector: 'app-danger-zone-card',
  standalone: true,
  imports: [ButtonComponent, SettingsCardComponent],
  templateUrl: './danger-zone-card.component.html',
  styleUrl: './danger-zone-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DangerZoneCardComponent {
  private readonly languageService = inject(LanguageService);
  protected readonly t = this.languageService.translation;

  readonly unavailable = input<boolean>(false);

  readonly deleteAccountRequested = output<void>();

  protected requestDeleteAccount(): void {
    this.deleteAccountRequested.emit();
  }
}
