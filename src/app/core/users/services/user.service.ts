import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { UserApiDto } from '../models/user-api.dto';
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

  clearCurrentUser(): void {
    this._currentUser.set(null);
  }
}
