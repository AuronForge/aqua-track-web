import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { AuthService } from '../auth/services/auth.service';
import { HttpErrorHandlerService } from '../services/http-error-handler.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const errorHandler = inject(HttpErrorHandlerService);

  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    tap({
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          errorHandler.handle(err);
        }
      },
    }),
  );
};
