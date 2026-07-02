import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  handle(err: HttpErrorResponse): void {
    const { status } = err;

    if (status === HttpStatusCode.Unauthorized) {
      this.authService.clearToken();
      this.router.navigate(['/login']);
      return;
    }

    if (status === HttpStatusCode.NotFound) {
      this.router.navigate(['/error/404']);
      return;
    }

    if (status === 0 || status === HttpStatusCode.ServiceUnavailable || status >= 500) {
      this.router.navigate(['/error/503']);
      return;
    }
  }
}
