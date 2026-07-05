import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { UserApiDto } from '../models/user-api.dto';
import { UpdateUserProfileRequestDto } from '../models/update-user-profile-request.dto';
import { UpdateUserPreferencesRequestDto } from '../models/update-user-preferences-request.dto';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userApiService = inject(UserApiService);
  private readonly _currentUser = signal<UserApiDto | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  loadCurrentUser(): Observable<UserApiDto> {
    return this.userApiService.getMe().pipe(tap((user) => this._currentUser.set(user)));
  }

  updateProfile(payload: UpdateUserProfileRequestDto): Observable<UserApiDto> {
    return this.userApiService.updateProfile(payload).pipe(
      map((user) => this.mergeCurrentUser(user)),
      tap((user) => this._currentUser.set(user)),
    );
  }

  updatePreferences(payload: UpdateUserPreferencesRequestDto): Observable<UserApiDto> {
    return this.userApiService
      .updatePreferences(payload)
      .pipe(tap((user) => this._currentUser.set(user)));
  }

  updateAvatar(file: File): Observable<UserApiDto> {
    return this.userApiService.updateAvatar(file).pipe(
      map((user) => this.mergeCurrentUser(user)),
      tap((user) => this._currentUser.set(user)),
    );
  }

  clearCurrentUser(): void {
    this._currentUser.set(null);
  }

  private mergeCurrentUser(user: Partial<UserApiDto>): UserApiDto {
    const currentUser = this._currentUser();

    if (!currentUser) {
      return user as UserApiDto;
    }

    return {
      ...currentUser,
      ...user,
      preferences: user.preferences ?? currentUser.preferences,
    };
  }
}
