import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { UserApiDto } from '../models/user-api.dto';
import { UpdateUserProfileRequestDto } from '../models/update-user-profile-request.dto';
import { UpdateUserPreferencesRequestDto } from '../models/update-user-preferences-request.dto';

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

  updateProfile(payload: UpdateUserProfileRequestDto): Observable<Partial<UserApiDto>> {
    return this.http.put<Partial<UserApiDto>>(`${this.baseUrl}/me`, payload);
  }

  updatePreferences(payload: UpdateUserPreferencesRequestDto): Observable<UserApiDto> {
    return this.http.patch<UserApiDto>(`${this.baseUrl}/me/preferences`, payload);
  }

  updateAvatar(file: File): Observable<Partial<UserApiDto>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.patch<Partial<UserApiDto>>(`${this.baseUrl}/me/avatar`, formData);
  }
}
