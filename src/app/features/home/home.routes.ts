import { Routes } from '@angular/router';

import { HomeDashboardFacade } from './facades/home-dashboard.facade';
import { HomeDashboardApiService } from './services/home-dashboard-api.service';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent),
    providers: [HomeDashboardFacade, HomeDashboardApiService],
  },
];
