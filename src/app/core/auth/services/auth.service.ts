import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'aqua-track.auth-token';
  private readonly authenticated = signal(this.readStoredToken() !== null);

  readonly isAuthenticated = this.authenticated.asReadonly();

  hasAccess(): boolean {
    const hasToken = this.readStoredToken() !== null;

    if (this.authenticated() !== hasToken) {
      this.authenticated.set(hasToken);
    }

    return hasToken;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(this.storageKey, token);
    }

    this.authenticated.set(true);
  }

  clearToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.storageKey);
    }

    this.authenticated.set(false);
  }

  private readStoredToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return window.localStorage.getItem(this.storageKey);
  }
}
