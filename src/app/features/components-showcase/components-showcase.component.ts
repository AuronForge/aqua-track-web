import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { DropdownMenuItem } from '../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../shared/ui/dropdown-menu/dropdown-menu.component';
import { LanguageCode } from '../../shared/types/language-code.type';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-components-showcase',
  standalone: true,
  imports: [
    AvatarComponent,
    ButtonComponent,
    ChipComponent,
    DropdownMenuComponent,
    ToolbarComponent,
  ],
  templateUrl: './components-showcase.component.html',
  styleUrl: './components-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsShowcaseComponent {
  readonly userMenuItems: DropdownMenuItem[] = [
    { id: 'profile', label: 'My Profile', icon: 'person' },
    { id: 'help', label: 'Help & Support', icon: 'help' },
    { id: 'logout', label: 'Logout', icon: 'logout', isDestructive: true, hasDividerBefore: true },
  ];

  readonly tableRowItems: DropdownMenuItem[] = [
    { id: 'edit', label: 'Edit', icon: 'edit' },
    { id: 'view', label: 'View Details', icon: 'visibility' },
    { id: 'delete', label: 'Delete', icon: 'delete', isDestructive: true, hasDividerBefore: true },
  ];

  readonly toolbarMenuItems: DropdownMenuItem[] = [
    { id: 'profile', label: 'My Profile', icon: 'person' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'logout', label: 'Logout', icon: 'logout', isDestructive: true, hasDividerBefore: true },
  ];

  readonly lastClicked = signal<string | null>(null);
  readonly toolbarLanguage = signal<LanguageCode>('pt');
  readonly toolbarLastMenuItem = signal<string | null>(null);

  onMenuItemClick(item: DropdownMenuItem): void {
    this.lastClicked.set(item.label);
  }

  onToolbarLanguageChange(code: LanguageCode): void {
    this.toolbarLanguage.set(code);
  }

  onToolbarMenuItemClick(item: DropdownMenuItem): void {
    this.toolbarLastMenuItem.set(item.label);
  }
}
