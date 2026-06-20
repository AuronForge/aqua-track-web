import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AvatarComponent } from '../../shared/ui/avatar/avatar.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { ChipComponent } from '../../shared/components/chip/chip.component';
import { DropdownMenuItem } from '../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../shared/ui/dropdown-menu/dropdown-menu.component';
import { LanguageCode } from '../../shared/types/language-code.type';
import { NavMenuItem } from '../../shared/components/nav-menu/nav-menu-item.model';
import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-components-showcase',
  standalone: true,
  imports: [
    AvatarComponent,
    ButtonComponent,
    BadgeComponent,
    ChipComponent,
    DropdownMenuComponent,
    NavMenuComponent,
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

  readonly navMenuItems: NavMenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/', exact: true },
    { id: 'aquariums', label: 'Aquários', icon: 'waves', route: '/aquariums' },
    { id: 'measurements', label: 'Medições', icon: 'monitor_heart', route: '/measurements' },
    { id: 'alerts', label: 'Alertas', icon: 'notifications', route: '/alerts' },
    { id: 'aquatic-life', label: 'Vida Aquática', icon: 'set_meal', route: '/aquatic-life' },
    { id: 'products', label: 'Produtos', icon: 'inventory_2', route: '/products' },
    {
      id: 'dosage',
      label: 'Calculadora de Dosagem',
      icon: 'calculate',
      route: '/dosage',
    },
    { id: 'settings', label: 'Configurações', icon: 'settings', route: '/settings' },
    {
      id: 'admin',
      label: 'Administração',
      icon: 'admin_panel_settings',
      route: '/admin',
      roles: ['admin'],
    },
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
