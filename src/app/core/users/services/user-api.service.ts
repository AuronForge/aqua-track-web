import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserApiDto } from '../models/user-api.dto';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  getMe(): Observable<UserApiDto> {
    return this.http.get<UserApiDto>(`${this.baseUrl}/me`, {
      params: { expand: 'preferences' },
    });
  }
}
