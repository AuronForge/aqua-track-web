import { Routes } from '@angular/router';

export const AQUARIUM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/aquarium-list-page/aquarium-list-page.component').then(
        (m) => m.AquariumListPageComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/aquarium-create-page/aquarium-create-page.component').then(
        (m) => m.AquariumCreatePageComponent,
      ),
  },
];
