import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { AvatarColor } from '../../ui/avatar/avatar-color.type';
import { AvatarComponent } from '../../ui/avatar/avatar.component';
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
  readonly pageTitle = input.required<string>();
  readonly pageSubtitle = input<string>('');
  readonly userName = input.required<string>();
  readonly userEmail = input.required<string>();
  readonly userInitials = input.required<string>();
  readonly userAvatarColor = input<AvatarColor>('primary');
  readonly selectedLanguage = input.required<LanguageCode>();
  readonly userMenuItems = input.required<DropdownMenuItem[]>();

  readonly languageChange = output<LanguageCode>();
  readonly userMenuItemClick = output<DropdownMenuItem>();
}
