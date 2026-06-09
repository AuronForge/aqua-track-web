import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { DropdownMenuItem } from '../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../shared/ui/dropdown-menu/dropdown-menu.component';

const ICON_USER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const ICON_HELP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const ICON_LOGOUT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
const ICON_EDIT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const ICON_EYE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const ICON_TRASH = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;
const ICON_DOTS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>`;
const ICON_BELL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;

@Component({
  selector: 'app-components-showcase',
  standalone: true,
  imports: [AvatarComponent, DropdownMenuComponent],
  templateUrl: './components-showcase.component.html',
  styleUrl: './components-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsShowcaseComponent {
  readonly icons = {
    dots: ICON_DOTS,
    user: ICON_USER,
    bell: ICON_BELL,
  };

  readonly userMenuItems: DropdownMenuItem[] = [
    { id: 'profile', label: 'My Profile', icon: ICON_USER },
    { id: 'help', label: 'Help & Support', icon: ICON_HELP },
    {
      id: 'logout',
      label: 'Logout',
      icon: ICON_LOGOUT,
      isDestructive: true,
      hasDividerBefore: true,
    },
  ];

  readonly tableRowItems: DropdownMenuItem[] = [
    { id: 'edit', label: 'Edit', icon: ICON_EDIT },
    { id: 'view', label: 'View Details', icon: ICON_EYE },
    {
      id: 'delete',
      label: 'Delete',
      icon: ICON_TRASH,
      isDestructive: true,
      hasDividerBefore: true,
    },
  ];

  readonly lastClicked = signal<string | null>(null);

  onMenuItemClick(item: DropdownMenuItem): void {
    this.lastClicked.set(item.label);
  }
}
