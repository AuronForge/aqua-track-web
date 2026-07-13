import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { DropdownMenuItem } from '../../../../shared/components/dropdown-menu/dropdown-menu-item.model';
import { LanguageCode } from '../../../../shared/types/language-code.type';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-toolbar-showcase',
  standalone: true,
  imports: [CodeBlockComponent, ToolbarComponent],
  templateUrl: './toolbar-showcase.component.html',
  styleUrl: './toolbar-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarShowcaseComponent {
  readonly codeTs = `import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { DropdownMenuItem } from '../../shared/components/dropdown-menu/dropdown-menu-item.model';
import { LanguageCode } from '../../shared/types/language-code.type';

readonly menuItems: DropdownMenuItem[] = [
  { id: 'profile', label: 'My Profile', icon: 'person' },
  { id: 'logout', label: 'Logout', icon: 'logout', isDestructive: true, hasDividerBefore: true },
];

readonly language = signal<LanguageCode>('pt');`;

  readonly codeHtml = `<app-toolbar
  pageTitle="Dashboard"
  pageSubtitle="Visão geral dos aquários"
  userName="João Silva"
  userEmail="joao@aquatrack.com"
  userInitials="JS"
  [selectedLanguage]="language()"
  [userMenuItems]="menuItems"
  (languageChange)="language.set($event)"
  (userMenuItemClick)="onMenuItemClick($event)"
/>`;

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
