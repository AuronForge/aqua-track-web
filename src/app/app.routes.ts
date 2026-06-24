import { Routes } from '@angular/router';
import { authCanActivateChildGuard, authCanMatchGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./features/auth/registration/registration.component').then(
        (m) => m.RegistrationComponent,
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'error/404',
    loadComponent: () =>
      import('./features/errors/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: 'error/503',
    loadComponent: () =>
      import('./features/errors/service-unavailable/service-unavailable.component').then(
        (m) => m.ServiceUnavailableComponent,
      ),
  },
  {
    path: '',
    canMatch: [authCanMatchGuard],
    canActivateChild: [authCanActivateChildGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/welcome/welcome.component').then((m) => m.WelcomeComponent),
      },
    ],
  },
  {
    path: 'components',
    loadComponent: () =>
      import('./features/components-showcase/components-showcase.component').then(
        (m) => m.ComponentsShowcaseComponent,
      ),
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      {
        path: 'menu',
        loadComponent: () =>
          import('./features/components-showcase/pages/nav-menu/nav-menu-showcase.component').then(
            (m) => m.NavMenuShowcaseComponent,
          ),
      },
      {
        path: 'toolbar',
        loadComponent: () =>
          import('./features/components-showcase/pages/toolbar/toolbar-showcase.component').then(
            (m) => m.ToolbarShowcaseComponent,
          ),
      },
      {
        path: 'dropdown-menu',
        loadComponent: () =>
          import('./features/components-showcase/pages/dropdown-menu/dropdown-menu-showcase.component').then(
            (m) => m.DropdownMenuShowcaseComponent,
          ),
      },
      {
        path: 'button',
        loadComponent: () =>
          import('./features/components-showcase/pages/button/button-showcase.component').then(
            (m) => m.ButtonShowcaseComponent,
          ),
      },
      {
        path: 'avatar',
        loadComponent: () =>
          import('./features/components-showcase/pages/avatar/avatar-showcase.component').then(
            (m) => m.AvatarShowcaseComponent,
          ),
      },
      {
        path: 'chip',
        loadComponent: () =>
          import('./features/components-showcase/pages/chip/chip-showcase.component').then(
            (m) => m.ChipShowcaseComponent,
          ),
      },
      {
        path: 'info-card',
        loadComponent: () =>
          import('./features/components-showcase/pages/info-card/info-card-showcase.component').then(
            (m) => m.InfoCardShowcaseComponent,
          ),
      },
      {
        path: 'info-list-item',
        loadComponent: () =>
          import('./features/components-showcase/pages/info-list-item/info-list-item-showcase.component').then(
            (m) => m.InfoListItemShowcaseComponent,
          ),
      },
      {
        path: 'badge',
        loadComponent: () =>
          import('./features/components-showcase/pages/badge/badge-showcase.component').then(
            (m) => m.BadgeShowcaseComponent,
          ),
      },
      {
        path: 'input-select',
        loadComponent: () =>
          import('./features/components-showcase/pages/select/input-select-showcase.component').then(
            (m) => m.InputSelectShowcaseComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];
