import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavMenuItem } from '../../shared/components/nav-menu/nav-menu-item.model';
import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';

@Component({
  selector: 'app-components-showcase',
  standalone: true,
  imports: [NavMenuComponent, RouterOutlet],
  templateUrl: './components-showcase.component.html',
  styleUrl: './components-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsShowcaseComponent {
  readonly sidebarItems: NavMenuItem[] = [
    { id: 'avatar', label: 'Avatar', icon: 'account_circle', route: '/components/avatar' },
    { id: 'badge', label: 'Badge', icon: 'local_offer', route: '/components/badge' },
    { id: 'button', label: 'Button', icon: 'smart_button', route: '/components/button' },
    { id: 'chip', label: 'Chip', icon: 'label', route: '/components/chip' },
    {
      id: 'dropdown-menu',
      label: 'Dropdown Menu',
      icon: 'expand_circle_down',
      route: '/components/dropdown-menu',
    },
    { id: 'info-card', label: 'Info Card', icon: 'info', route: '/components/info-card' },
    {
      id: 'input-select',
      label: 'Input Select',
      icon: 'unfold_more',
      route: '/components/input-select',
    },
    { id: 'menu', label: 'Nav Menu', icon: 'menu', route: '/components/menu' },
    { id: 'toolbar', label: 'Toolbar', icon: 'web_asset', route: '/components/toolbar' },
  ];
}
