import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { DropdownMenuItem } from '../../../../shared/components/dropdown-menu/dropdown-menu-item.model';
import { DropdownMenuComponent } from '../../../../shared/components/dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-dropdown-menu-showcase',
  standalone: true,
  imports: [AvatarComponent, CodeBlockComponent, DropdownMenuComponent],
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

  readonly codeTs = `import { DropdownMenuComponent } from '../../shared/components/dropdown-menu/dropdown-menu.component';
import { DropdownMenuItem } from '../../shared/components/dropdown-menu/dropdown-menu-item.model';

readonly menuItems: DropdownMenuItem[] = [
  { id: 'edit', label: 'Edit', icon: 'edit' },
  { id: 'delete', label: 'Delete', icon: 'delete', isDestructive: true, hasDividerBefore: true },
];`;

  readonly codeHtml = `<app-dropdown-menu
  [items]="menuItems"
  placement="bottom-right"
  (itemClick)="onItemClick($event)"
>
  <!-- Trigger: qualquer conteúdo -->
  <ng-container slot="trigger">
    Abrir menu
  </ng-container>

  <!-- Header opcional -->
  <div slot="header">Cabeçalho</div>
</app-dropdown-menu>`;

  onMenuItemClick(item: DropdownMenuItem): void {
    this.lastClicked.set(item.label);
  }
}
