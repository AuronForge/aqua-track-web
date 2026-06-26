import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/services/auth.service';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { NavMenuComponent } from '../../shared/components/nav-menu/nav-menu.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { DropdownMenuItem } from '../../shared/ui/dropdown-menu/dropdown-menu-item.model';
import { NavMenuItem } from '../../shared/components/nav-menu/nav-menu-item.model';
import { LanguageCode } from '../../shared/types/language-code.type';
import { getInitialLanguage } from '../../shared/utils/get-initial-language.util';
import { LANGUAGE_STORAGE_KEY } from '../../shared/constants/language-storage-key.constant';
import { signal } from '@angular/core';

const NAV_ITEMS: NavMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard', route: '/home', exact: true },
  { id: 'aquariums', label: 'Aquários', icon: 'water_drop', route: '/aquariums' },
  { id: 'measurements', label: 'Medições', icon: 'show_chart', route: '/measurements' },
  { id: 'alerts', label: 'Alertas', icon: 'notifications', route: '/alerts' },
  { id: 'aquatic-life', label: 'Vida Aquática', icon: 'pets', route: '/aquatic-life' },
  { id: 'products', label: 'Produtos', icon: 'inventory_2', route: '/products' },
  {
    id: 'dosage-calculator',
    label: 'Calculadora de Dosagem',
    icon: 'calculate',
    route: '/dosage-calculator',
  },
  { id: 'settings', label: 'Configurações', icon: 'settings', route: '/settings' },
];

const USER_MENU_ITEMS: DropdownMenuItem[] = [
  { id: 'profile', label: 'My Profile', icon: 'person' },
  { id: 'help', label: 'Help & Support', icon: 'help_outline' },
  { id: 'logout', label: 'Logout', icon: 'logout', isDestructive: true, hasDividerBefore: true },
];

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

  protected readonly pageTitleService = inject(PageTitleService);

  protected readonly navItems = NAV_ITEMS;
  protected readonly userMenuItems = USER_MENU_ITEMS;

  protected readonly selectedLanguage = signal<LanguageCode>(getInitialLanguage());

  readonly userName = 'Usuário';
  readonly userEmail = 'usuario@aquatrack.app';
  readonly userInitials = 'U';

  protected onLanguageChange(language: LanguageCode): void {
    this.selectedLanguage.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }

  protected onUserMenuItemClick(item: DropdownMenuItem): void {
    if (item.id === 'logout') {
      this.authService.clearToken();
      this.router.navigate(['/login']);
    }
  }
}
