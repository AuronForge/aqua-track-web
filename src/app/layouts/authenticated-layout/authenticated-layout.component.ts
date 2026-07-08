import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../core/users/services/user.service';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { DropdownMenuItem } from '../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { NavMenuItem } from '../../shared/components/nav-menu/nav-menu-item.model';
import { LanguageCode } from '../../shared/types/language-code.type';
import { LanguageService } from '../../shared/services/language.service';
import { buildInitials } from '../../shared/utils/build-initials.util';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent, ToolbarComponent],
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  protected readonly languageService = inject(LanguageService);
  protected readonly pageTitleService = inject(PageTitleService);

  protected readonly selectedLanguage = this.languageService.selectedLanguage;
  private readonly t = this.languageService.translation;
  private readonly currentUser = this.userService.currentUser;

  protected readonly userName = computed(() => this.currentUser()?.name ?? 'Usuário');
  protected readonly userEmail = computed(() => this.currentUser()?.email ?? '');
  protected readonly userInitials = computed(() => buildInitials(this.currentUser()?.name));
  protected readonly userAvatarUrl = computed(() => this.currentUser()?.avatarUrl ?? null);
  protected readonly userPlan = computed(() => this.currentUser()?.plan ?? '');
  protected readonly userRoles = computed(() => {
    const role = this.currentUser()?.role;
    return role ? [role] : [];
  });

  protected readonly userMenuItems = computed<DropdownMenuItem[]>(() => {
    const t = this.t();
    return [
      { id: 'profile', label: t.userMenuProfile, icon: 'person' },
      {
        id: 'logout',
        label: t.userMenuLogout,
        icon: 'logout',
        isDestructive: true,
        hasDividerBefore: true,
      },
    ];
  });

  protected readonly navItems = computed<NavMenuItem[]>(() => {
    const t = this.t();
    return [
      {
        id: 'dashboard',
        label: t.navDashboard,
        icon: 'space_dashboard',
        route: '/home',
        exact: true,
        displayRoute: true,
      },
      {
        id: 'aquariums',
        label: t.navAquariums,
        icon: 'water_drop',
        route: '/aquariums',
        displayRoute: false,
      },
      {
        id: 'measurements',
        label: t.navMeasurements,
        icon: 'show_chart',
        route: '/measurements',
        displayRoute: false,
      },
      {
        id: 'alerts',
        label: t.navAlerts,
        icon: 'notifications',
        route: '/alerts',
        displayRoute: false,
      },
      {
        id: 'aquatic-life',
        label: t.navAquaticLife,
        icon: 'pets',
        route: '/aquatic-life',
        displayRoute: false,
      },
      {
        id: 'products',
        label: t.navProducts,
        icon: 'inventory_2',
        route: '/products',
        displayRoute: false,
      },
      {
        id: 'dosage-calculator',
        label: t.navDosageCalculator,
        icon: 'calculate',
        route: '/dosage-calculator',
        displayRoute: false,
      },
      {
        id: 'settings',
        label: t.navSettings,
        icon: 'settings',
        route: '/settings',
        displayRoute: false,
      },
    ];
  });

  constructor() {
    this.userService.loadCurrentUser().pipe(takeUntilDestroyed()).subscribe();
  }

  protected onLanguageChange(language: LanguageCode): void {
    this.languageService.setLanguage(language);
  }

  protected onUserMenuItemClick(item: DropdownMenuItem): void {
    if (item.id === 'logout') {
      this.userService.clearCurrentUser();
      this.authService.clearToken();
      this.router.navigate(['/login']);
      return;
    }

    if (item.id === 'profile') {
      this.router.navigate(['/profile']);
    }
  }
}
