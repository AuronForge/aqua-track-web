import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, shareReplay, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { SystemValueApiDto } from '../models/system-value-api.dto';

export type RootSystemValue = 'AQUARIUM_TYPE' | 'WATER_TYPE' | (string & {});

@Injectable({
  providedIn: 'root',
})
export class SystemValuesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/system-values`;
  private readonly cache = new Map<RootSystemValue, Observable<SystemValueApiDto[]>>();

  getByRoot(
    rootSystemValue: RootSystemValue,
    options?: { forceRefresh?: boolean },
  ): Observable<SystemValueApiDto[]> {
    if (options?.forceRefresh) {
      this.cache.delete(rootSystemValue);
    }

    const cachedRequest = this.cache.get(rootSystemValue);

    if (cachedRequest) {
      return cachedRequest;
    }

    const request$ = this.http
      .get<SystemValueApiDto[]>(this.baseUrl, {
        params: {
          rootSystemValue,
        },
      })
      .pipe(
        catchError((error) => {
          this.cache.delete(rootSystemValue);
          return throwError(() => error);
        }),
        shareReplay({
          bufferSize: 1,
          refCount: true,
        }),
      );

    this.cache.set(rootSystemValue, request$);

    return request$;
  }

  listAquariumTypes(options?: { forceRefresh?: boolean }): Observable<SystemValueApiDto[]> {
    return this.getByRoot('AQUARIUM_TYPE', options);
  }

  listWaterTypes(options?: { forceRefresh?: boolean }): Observable<SystemValueApiDto[]> {
    return this.getByRoot('WATER_TYPE', options);
  }
}
