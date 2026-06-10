import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DropdownMenuItem } from '../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../shared/ui/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-components-showcase',
  standalone: true,
  imports: [AvatarComponent, ButtonComponent, DropdownMenuComponent],
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

  readonly lastClicked = signal<string | null>(null);

  onMenuItemClick(item: DropdownMenuItem): void {
    this.lastClicked.set(item.label);
  }
}
