import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { DashboardApiDto } from '../models';
import { MOCK_DASHBOARD_FULL } from '../mocks/home-dashboard.mock';

@Injectable()
export class HomeDashboardMockService {
  private readonly mockDelay = 600;

  getDashboard(): Observable<DashboardApiDto> {
    return of(MOCK_DASHBOARD_FULL).pipe(delay(this.mockDelay));
  }

  getDashboardError(): Observable<DashboardApiDto> {
    return throwError(() => new Error('Simulated API error')).pipe(delay(this.mockDelay));
  }
}
