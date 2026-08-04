import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { SystemValueApiDto } from '../models/system-value-api.dto';

@Injectable({
  providedIn: 'root',
})
export class SystemValuesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/system-values`;

  listAquariumTypes(): Observable<SystemValueApiDto[]> {
    return this.http.get<SystemValueApiDto[]>(this.baseUrl, {
      params: {
        rootSystemValue: 'AQUARIUM_TYPE',
      },
    });
  }

  listWaterTypes(): Observable<SystemValueApiDto[]> {
    return this.http.get<SystemValueApiDto[]>(this.baseUrl, {
      params: {
        rootSystemValue: 'WATER_TYPE',
      },
    });
  }
}
