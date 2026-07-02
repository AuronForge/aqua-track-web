import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { HttpErrorHandlerService } from './http-error-handler.service';

describe('HttpErrorHandlerService', () => {
  let service: HttpErrorHandlerService;
  let router: jest.Mocked<Pick<Router, 'navigate'>>;
  let clearTokenSpy: jest.SpyInstance;

  const makeError = (status: number) => new HttpErrorResponse({ status, url: '/api/test' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { navigate: jest.fn() } }],
    });

    service = TestBed.inject(HttpErrorHandlerService);
    router = TestBed.inject(Router) as never;
    clearTokenSpy = jest
      .spyOn(TestBed.inject(AuthService), 'clearToken')
      .mockImplementation(jest.fn());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clears token and navigates to /login on 401', () => {
    service.handle(makeError(HttpStatusCode.Unauthorized));

    expect(clearTokenSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('navigates to /error/404 on 404', () => {
    service.handle(makeError(HttpStatusCode.NotFound));

    expect(clearTokenSpy).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/error/404']);
  });

  it('navigates to /error/503 on 503', () => {
    service.handle(makeError(HttpStatusCode.ServiceUnavailable));

    expect(router.navigate).toHaveBeenCalledWith(['/error/503']);
  });

  it('navigates to /error/503 on status 0 (network unreachable)', () => {
    service.handle(makeError(0));

    expect(router.navigate).toHaveBeenCalledWith(['/error/503']);
  });

  it('navigates to /error/503 on generic 5xx errors', () => {
    service.handle(makeError(500));

    expect(router.navigate).toHaveBeenCalledWith(['/error/503']);
  });

  it('does nothing for unhandled 4xx errors', () => {
    service.handle(makeError(HttpStatusCode.BadRequest));

    expect(clearTokenSpy).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
