import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { DropdownMenuItem } from '../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { NavMenuItem } from '../../shared/components/nav-menu/nav-menu-item.model';
import { LanguageCode } from '../../shared/types/language-code.type';
import { LanguageService } from '../../shared/services/language.service';

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
  private readonly router = inject(Router);
  protected readonly languageService = inject(LanguageService);

  protected readonly pageTitleService = inject(PageTitleService);

  protected readonly selectedLanguage = this.languageService.selectedLanguage;
  private readonly t = this.languageService.translation;

  protected readonly userMenuItems = computed<DropdownMenuItem[]>(() => {
    const t = this.t();
    return [
      { id: 'profile', label: t.userMenuProfile, icon: 'person' },
      { id: 'help', label: t.userMenuHelp, icon: 'help_outline' },
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
      },
      { id: 'aquariums', label: t.navAquariums, icon: 'water_drop', route: '/aquariums' },
      { id: 'measurements', label: t.navMeasurements, icon: 'show_chart', route: '/measurements' },
      { id: 'alerts', label: t.navAlerts, icon: 'notifications', route: '/alerts' },
      { id: 'aquatic-life', label: t.navAquaticLife, icon: 'pets', route: '/aquatic-life' },
      { id: 'products', label: t.navProducts, icon: 'inventory_2', route: '/products' },
      {
        id: 'dosage-calculator',
        label: t.navDosageCalculator,
        icon: 'calculate',
        route: '/dosage-calculator',
      },
      { id: 'settings', label: t.navSettings, icon: 'settings', route: '/settings' },
    ];
  });

  readonly userName = 'Usuário';
  readonly userEmail = 'usuario@aquatrack.app';
  readonly userInitials = 'U';
  readonly userPlan = 'Pro Plan';

  protected onLanguageChange(language: LanguageCode): void {
    this.languageService.setLanguage(language);
  }

  protected onUserMenuItemClick(item: DropdownMenuItem): void {
    if (item.id === 'logout') {
      this.authService.clearToken();
      this.router.navigate(['/login']);
    }
  }
}
