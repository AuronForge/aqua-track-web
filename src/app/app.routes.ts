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
    loadComponent: () =>
      import('./layouts/authenticated-layout/authenticated-layout.component').then(
        (m) => m.AuthenticatedLayoutComponent,
      ),
    canMatch: [authCanMatchGuard],
    canActivateChild: [authCanActivateChildGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
      },
      {
        path: 'aquariums/new',
        loadComponent: () =>
          import('./features/aquarium/pages/aquarium-create-page/aquarium-create-page.component').then(
            (m) => m.AquariumCreatePageComponent,
          ),
      },
      {
        path: 'measurements/new',
        loadComponent: () =>
          import('./features/measurement/pages/measurement-create-page/measurement-create-page.component').then(
            (m) => m.MeasurementCreatePageComponent,
          ),
      },
      {
        path: 'applications/new',
        loadComponent: () =>
          import('./features/application/pages/application-create-page/application-create-page.component').then(
            (m) => m.ApplicationCreatePageComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
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
        path: 'modal',
        loadComponent: () =>
          import('./features/components-showcase/pages/modal/modal-showcase.component').then(
            (m) => m.ModalShowcaseComponent,
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
        path: 'feedback-message',
        loadComponent: () =>
          import('./features/components-showcase/pages/feedback-message/feedback-message-showcase.component').then(
            (m) => m.FeedbackMessageShowcaseComponent,
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
        path: 'info-list',
        loadComponent: () =>
          import('./features/components-showcase/pages/info-list/info-list-showcase.component').then(
            (m) => m.InfoListShowcaseComponent,
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
        path: 'text-formfield',
        loadComponent: () =>
          import('./features/components-showcase/pages/formfields/text-formfield-showcase.component').then(
            (m) => m.TextFormfieldShowcaseComponent,
          ),
      },
      {
        path: 'datepicker-formfield',
        loadComponent: () =>
          import('./features/components-showcase/pages/formfields/datepicker-formfield-showcase.component').then(
            (m) => m.DatepickerFormfieldShowcaseComponent,
          ),
      },
      {
        path: 'select-formfield',
        loadComponent: () =>
          import('./features/components-showcase/pages/formfields/select-formfield-showcase.component').then(
            (m) => m.SelectFormfieldShowcaseComponent,
          ),
      },
      {
        path: 'textarea-formfield',
        loadComponent: () =>
          import('./features/components-showcase/pages/formfields/textarea-formfield-showcase.component').then(
            (m) => m.TextareaFormfieldShowcaseComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];
