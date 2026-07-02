import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { DashboardApiDto } from '../models';

@Injectable()
export class HomeDashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/dashboard`;

  getDashboard(): Observable<DashboardApiDto> {
    return this.http.get<DashboardApiDto>(`${this.baseUrl}/aquariums`);
  }
}
