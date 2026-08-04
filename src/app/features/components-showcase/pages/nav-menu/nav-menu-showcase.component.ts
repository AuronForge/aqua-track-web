import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { NavMenuItem } from '../../../../shared/components/nav-menu/nav-menu-item.model';
import { NavMenuComponent } from '../../../../shared/components/nav-menu/nav-menu.component';

@Component({
  selector: 'app-nav-menu-showcase',
  standalone: true,
  imports: [CodeBlockComponent, NavMenuComponent],
  templateUrl: './nav-menu-showcase.component.html',
  styleUrl: './nav-menu-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuShowcaseComponent {
  readonly codeTs = `import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';
import { NavMenuItem } from '../../shared/components/nav-menu/nav-menu-item.model';

readonly items: NavMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/', exact: true },
  {
    id: 'formfields',
    label: 'Formfields',
    icon: 'text_fields',
    children: [
      { id: 'text', label: 'Text Formfield', icon: 'text_fields', route: '/components/text-formfield' },
      { id: 'select', label: 'Select Formfield', icon: 'arrow_drop_down_circle', route: '/components/select-formfield' },
    ],
  },
  { id: 'admin', label: 'Admin', icon: 'admin_panel_settings', route: '/admin', roles: ['admin'] },
];`;

  readonly codeHtml = `<app-nav-menu [items]="items" [userRoles]="userRoles" />`;

  readonly navMenuItems: NavMenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/', exact: true },
    { id: 'aquariums', label: 'Aquarios', icon: 'waves', route: '/aquariums' },
    { id: 'measurements', label: 'Medicoes', icon: 'monitor_heart', route: '/measurements' },
    {
      id: 'formfields',
      label: 'Formfields',
      icon: 'text_fields',
      children: [
        {
          id: 'text-formfield',
          label: 'Text Formfield',
          icon: 'text_fields',
          route: '/components/text-formfield',
        },
        {
          id: 'textarea-formfield',
          label: 'Textarea Formfield',
          icon: 'notes',
          route: '/components/textarea-formfield',
        },
        {
          id: 'select-formfield',
          label: 'Select Formfield',
          icon: 'arrow_drop_down_circle',
          route: '/components/select-formfield',
        },
      ],
    },
    { id: 'alerts', label: 'Alertas', icon: 'notifications', route: '/alerts' },
    { id: 'aquatic-life', label: 'Vida Aquatica', icon: 'set_meal', route: '/aquatic-life' },
    { id: 'products', label: 'Produtos', icon: 'inventory_2', route: '/products' },
    { id: 'dosage', label: 'Calculadora de Dosagem', icon: 'calculate', route: '/dosage' },
    { id: 'settings', label: 'Configuracoes', icon: 'settings', route: '/settings' },
    {
      id: 'admin',
      label: 'Administracao',
      icon: 'admin_panel_settings',
      route: '/admin',
      roles: ['admin'],
    },
  ];
}
