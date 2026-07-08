import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';

import { ChangePasswordRequestDto } from '../models/change-password-request.dto';
import { RequestAccountDeletionDto } from '../models/request-account-deletion.dto';
import { UserApiDto, UserPreferencesDto } from '../models/user-api.dto';
import { UpdateUserProfileRequestDto } from '../models/update-user-profile-request.dto';
import { UpdateUserPreferencesRequestDto } from '../models/update-user-preferences-request.dto';
import { API_LOCALE_LANGUAGE_CODE_MAP } from '../../../shared/constants/language-locale.constant';
import { LanguageService } from '../../../shared/services/language.service';
import { UserApiService } from './user-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly userApiService = inject(UserApiService);
  private readonly languageService = inject(LanguageService);
  private readonly _currentUser = signal<UserApiDto | null>(null);
  private currentUserRequest$: Observable<UserApiDto> | null = null;

  readonly currentUser = this._currentUser.asReadonly();

  loadCurrentUser(): Observable<UserApiDto> {
    if (this.currentUserRequest$) {
      return this.currentUserRequest$;
    }

    this.currentUserRequest$ = this.userApiService.getMe().pipe(
      tap((user) => {
        this._currentUser.set(user);
        this.syncLanguageFromPreferences(user.preferences);
      }),
      finalize(() => {
        this.currentUserRequest$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    return this.currentUserRequest$;
  }

  updateProfile(payload: UpdateUserProfileRequestDto): Observable<UserApiDto> {
    return this.userApiService.updateProfile(payload).pipe(
      map((user) => this.mergeCurrentUser(user)),
      tap((user) => this._currentUser.set(user)),
    );
  }

  updatePreferences(payload: UpdateUserPreferencesRequestDto): Observable<UserApiDto> {
    return this.userApiService.updatePreferences(payload).pipe(
      map((preferences) => this.mergeCurrentUserPreferences(preferences)),
      tap((user) => {
        this._currentUser.set(user);
        this.syncLanguageFromPreferences(user.preferences);
      }),
    );
  }

  updateAvatar(file: File): Observable<UserApiDto> {
    return this.userApiService.updateAvatar(file).pipe(
      map((user) => this.mergeCurrentUser(user)),
      tap((user) => this._currentUser.set(user)),
    );
  }

  changePassword(payload: ChangePasswordRequestDto): Observable<void> {
    return this.userApiService.changePassword(payload);
  }

  requestAccountDeletion(payload: RequestAccountDeletionDto): Observable<UserApiDto> {
    return this.userApiService.requestAccountDeletion(payload).pipe(
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

  private mergeCurrentUserPreferences(preferences: UserPreferencesDto): UserApiDto {
    const currentUser = this._currentUser();

    if (!currentUser) {
      return { preferences } as UserApiDto;
    }

    return {
      ...currentUser,
      preferences,
    };
  }

  private syncLanguageFromPreferences(preferences: UserPreferencesDto | undefined): void {
    const language = preferences?.language
      ? API_LOCALE_LANGUAGE_CODE_MAP[preferences.language]
      : undefined;

    if (language) {
      this.languageService.setLanguage(language);
    }
  }
}
