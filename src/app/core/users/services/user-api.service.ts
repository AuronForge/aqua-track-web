import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ChangePasswordRequestDto } from '../models/change-password-request.dto';
import { RequestAccountDeletionDto } from '../models/request-account-deletion.dto';
import { UserApiDto, UserPreferencesDto } from '../models/user-api.dto';
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

  updatePreferences(payload: UpdateUserPreferencesRequestDto): Observable<UserPreferencesDto> {
    return this.http.put<UserPreferencesDto>(`${environment.apiBaseUrl}/me/preferences`, payload);
  }

  updateAvatar(file: File): Observable<Partial<UserApiDto>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.patch<Partial<UserApiDto>>(`${this.baseUrl}/me/avatar`, formData);
  }

  changePassword(payload: ChangePasswordRequestDto): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/me/password`, payload);
  }

  requestAccountDeletion(payload: RequestAccountDeletionDto): Observable<UserApiDto> {
    return this.http.patch<UserApiDto>(`${this.baseUrl}/me/delete-request`, payload);
  }
}
