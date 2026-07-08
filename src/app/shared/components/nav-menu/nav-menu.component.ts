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
  readonly userPlan = input<string | null | undefined>(null);
  readonly collapseLabel = input<string>('Collapse');
  readonly expandLabel = input<string>('Expand');
  readonly homeAriaLabel = input<string>('Go to home page');

  protected readonly collapsed = signal(false);

  protected readonly visibleItems = computed(() => {
    const roles = this.userRoles();
    const plan = this.userPlan();

    return this.items().filter((item) => {
      if (item.displayRoute === false) return false;

      const hasRoleAccess =
        !item.roles || item.roles.length === 0 || item.roles.some((role) => roles.includes(role));

      if (!hasRoleAccess) return false;

      if (!item.allowedPlans || item.allowedPlans.length === 0) return true;
      return !!plan && item.allowedPlans.includes(plan);
    });
  });

  protected toggleCollapse(): void {
    this.collapsed.update((v) => !v);
  }
}
