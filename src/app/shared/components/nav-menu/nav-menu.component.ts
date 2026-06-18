import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavMenuItem } from './nav-menu-item.model';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent {
  readonly items = input.required<NavMenuItem[]>();
  readonly userRoles = input<string[]>([]);

  protected readonly collapsed = signal(false);

  protected readonly visibleItems = computed(() => {
    const roles = this.userRoles();
    return this.items().filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.some((role) => roles.includes(role));
    });
  });

  protected toggleCollapse(): void {
    this.collapsed.update((v) => !v);
  }
}
