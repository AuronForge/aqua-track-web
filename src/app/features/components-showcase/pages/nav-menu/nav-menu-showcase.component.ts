import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NavMenuItem } from '../../../../shared/components/nav-menu/nav-menu-item.model';
import { NavMenuComponent } from '../../../../shared/components/nav-menu/nav-menu.component';

@Component({
  selector: 'app-nav-menu-showcase',
  standalone: true,
  imports: [NavMenuComponent],
  templateUrl: './nav-menu-showcase.component.html',
  styleUrl: './nav-menu-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuShowcaseComponent {
  readonly navMenuItems: NavMenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/', exact: true },
    { id: 'aquariums', label: 'Aquários', icon: 'waves', route: '/aquariums' },
    { id: 'measurements', label: 'Medições', icon: 'monitor_heart', route: '/measurements' },
    { id: 'alerts', label: 'Alertas', icon: 'notifications', route: '/alerts' },
    { id: 'aquatic-life', label: 'Vida Aquática', icon: 'set_meal', route: '/aquatic-life' },
    { id: 'products', label: 'Produtos', icon: 'inventory_2', route: '/products' },
    { id: 'dosage', label: 'Calculadora de Dosagem', icon: 'calculate', route: '/dosage' },
    { id: 'settings', label: 'Configurações', icon: 'settings', route: '/settings' },
    {
      id: 'admin',
      label: 'Administração',
      icon: 'admin_panel_settings',
      route: '/admin',
      roles: ['admin'],
    },
  ];
}
