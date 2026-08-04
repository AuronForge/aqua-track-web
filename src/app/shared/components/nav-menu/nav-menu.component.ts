import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavMenuItem } from './nav-menu-item.model';

type VisibleNavMenuItem = NavMenuItem & { children?: VisibleNavMenuItem[] };

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
  protected readonly expandedGroups = signal<Record<string, boolean>>({});

  protected readonly visibleItems = computed(() =>
    this.items()
      .map((item) => this.toVisibleItem(item, this.userRoles(), this.userPlan()))
      .filter((item): item is VisibleNavMenuItem => item !== null),
  );

  protected toggleCollapse(): void {
    this.collapsed.update((value) => !value);
  }

  protected hasChildren(item: VisibleNavMenuItem): boolean {
    return !!item.children?.length;
  }

  protected isGroupExpanded(item: VisibleNavMenuItem): boolean {
    if (!this.hasChildren(item)) {
      return false;
    }

    return this.expandedGroups()[item.id] ?? true;
  }

  protected toggleGroup(item: VisibleNavMenuItem): void {
    if (!this.hasChildren(item) || this.collapsed()) {
      return;
    }

    this.expandedGroups.update((groups) => ({
      ...groups,
      [item.id]: !this.isGroupExpanded(item),
    }));
  }

  private toVisibleItem(
    item: NavMenuItem,
    roles: string[],
    plan: string | null | undefined,
  ): VisibleNavMenuItem | null {
    if (item.displayRoute === false) {
      return null;
    }

    const hasRoleAccess =
      !item.roles || item.roles.length === 0 || item.roles.some((role) => roles.includes(role));

    if (!hasRoleAccess) {
      return null;
    }

    const hasPlanAccess =
      !item.allowedPlans ||
      item.allowedPlans.length === 0 ||
      (!!plan && item.allowedPlans.includes(plan));

    if (!hasPlanAccess) {
      return null;
    }

    const visibleChildren =
      item.children
        ?.map((child) => this.toVisibleItem(child, roles, plan))
        .filter((child): child is VisibleNavMenuItem => child !== null) ?? [];

    if (visibleChildren.length > 0) {
      return { ...item, children: visibleChildren };
    }

    if (!item.route) {
      return null;
    }

    return { ...item, children: undefined };
  }
}
