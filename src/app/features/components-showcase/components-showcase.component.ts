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
    {
      id: 'card-selection',
      label: 'Card Selection',
      icon: 'dashboard_customize',
      route: '/components/card-selection',
    },
    { id: 'chip', label: 'Chip', icon: 'label', route: '/components/chip' },
    {
      id: 'dropdown-menu',
      label: 'Dropdown Menu',
      icon: 'expand_circle_down',
      route: '/components/dropdown-menu',
    },
    {
      id: 'feedback-message',
      label: 'Feedback Message',
      icon: 'announcement',
      route: '/components/feedback-message',
    },
    {
      id: 'formfields',
      label: 'Formfields',
      icon: 'text_fields',
      children: [
        {
          id: 'datepicker-formfield',
          label: 'Datepicker Formfield',
          icon: 'calendar_month',
          route: '/components/datepicker-formfield',
        },
        {
          id: 'search-formfield',
          label: 'Search Formfield',
          icon: 'search',
          route: '/components/search-formfield',
        },
        {
          id: 'select-formfield',
          label: 'Select Formfield',
          icon: 'arrow_drop_down_circle',
          route: '/components/select-formfield',
        },
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
      ],
    },
    { id: 'info-card', label: 'Info Card', icon: 'info', route: '/components/info-card' },
    {
      id: 'info-list',
      label: 'Info List',
      icon: 'view_list',
      route: '/components/info-list',
    },
    {
      id: 'info-list-item',
      label: 'Info List Item',
      icon: 'format_list_bulleted',
      route: '/components/info-list-item',
    },
    { id: 'menu', label: 'Nav Menu', icon: 'menu', route: '/components/menu' },
    { id: 'modal', label: 'Modal', icon: 'open_in_new', route: '/components/modal' },
    {
      id: 'photo-upload',
      label: 'Photo Upload',
      icon: 'upload_file',
      route: '/components/photo-upload',
    },
    { id: 'tabs', label: 'Tabs', icon: 'tab', route: '/components/tabs' },
    { id: 'table', label: 'Table', icon: 'table_chart', route: '/components/table' },
    { id: 'toolbar', label: 'Toolbar', icon: 'web_asset', route: '/components/toolbar' },
  ];
}
