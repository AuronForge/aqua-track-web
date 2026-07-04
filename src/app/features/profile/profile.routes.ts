import { Routes } from '@angular/router';

import { ProfileFacade } from './facades/profile.facade';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
    providers: [ProfileFacade],
  },
];
