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
    path: '**',
    redirectTo: 'error/404',
  },
];
