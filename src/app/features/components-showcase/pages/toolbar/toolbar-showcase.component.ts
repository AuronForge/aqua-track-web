import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { DropdownMenuItem } from '../../../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-toolbar-showcase',
  standalone: true,
  imports: [ToolbarComponent],
  templateUrl: './toolbar-showcase.component.html',
  styleUrl: './toolbar-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarShowcaseComponent {
  readonly toolbarMenuItems: DropdownMenuItem[] = [
    { id: 'profile', label: 'My Profile', icon: 'person' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'logout', label: 'Logout', icon: 'logout', isDestructive: true, hasDividerBefore: true },
  ];

  readonly toolbarLanguage = signal<LanguageCode>('pt');
  readonly toolbarLastMenuItem = signal<string | null>(null);

  onToolbarLanguageChange(code: LanguageCode): void {
    this.toolbarLanguage.set(code);
  }

  onToolbarMenuItemClick(item: DropdownMenuItem): void {
    this.toolbarLastMenuItem.set(item.label);
  }
}
