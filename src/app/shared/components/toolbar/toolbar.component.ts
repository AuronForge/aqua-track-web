import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { AvatarColor } from '../avatar/avatar-color.type';
import { AvatarComponent } from '../avatar/avatar.component';
import { AvatarVariant } from '../avatar/avatar-variant.type';
import { DropdownMenuItem } from '../../ui/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../ui/dropdown-menu/dropdown-menu.component';
import { LanguageCode } from '../../types/language-code.type';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [AvatarComponent, DropdownMenuComponent, LanguageSwitcherComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly showBrand = input<boolean>(true);
  readonly pageTitle = input.required<string>();
  readonly pageSubtitle = input<string>('');
  readonly userName = input.required<string>();
  readonly userEmail = input.required<string>();
  readonly userInitials = input.required<string>();
  readonly userAvatarUrl = input<string | null>(null);
  readonly userAvatarColor = input<AvatarColor>('primary');
  readonly userPlan = input<string>('');
  readonly selectedLanguage = input.required<LanguageCode>();
  readonly languageSelectorLabel = input<string>('Select language');
  readonly userMenuItems = input.required<DropdownMenuItem[]>();

  readonly languageChange = output<LanguageCode>();
  readonly userMenuItemClick = output<DropdownMenuItem>();

  protected userAvatarVariant(): AvatarVariant {
    return this.userAvatarUrl() ? 'circular' : 'initials';
  }
}
