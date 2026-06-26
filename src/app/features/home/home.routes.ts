import { Routes } from '@angular/router';

import { HomeDashboardFacade } from './facades/home-dashboard.facade';
import { HomeDashboardMockService } from './services/home-dashboard-mock.service';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent),
    providers: [HomeDashboardFacade, HomeDashboardMockService],
  },
];
