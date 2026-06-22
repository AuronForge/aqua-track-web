import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AvatarComponent } from '../../../../shared/ui/avatar/avatar.component';
import { DropdownMenuItem } from '../../../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../../../shared/ui/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-dropdown-menu-showcase',
  standalone: true,
  imports: [AvatarComponent, DropdownMenuComponent],
  templateUrl: './dropdown-menu-showcase.component.html',
  styleUrl: './dropdown-menu-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuShowcaseComponent {
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

  readonly lastClicked = signal<string | null>(null);

  onMenuItemClick(item: DropdownMenuItem): void {
    this.lastClicked.set(item.label);
  }
}
