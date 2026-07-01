import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
  HttpStatusCode,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { AuthService } from '../auth/services/auth.service';
import { HttpErrorHandlerService } from '../services/http-error-handler.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let getTokenSpy: jest.SpyInstance;
  let handleSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    getTokenSpy = jest.spyOn(TestBed.inject(AuthService), 'getToken');
    handleSpy = jest
      .spyOn(TestBed.inject(HttpErrorHandlerService), 'handle')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  it('should attach Authorization header when a token is present', () => {
    getTokenSpy.mockReturnValue('test-jwt-token');

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    req.flush({});
  });

  it('should not attach Authorization header when no token is present', () => {
    getTokenSpy.mockReturnValue(null);

    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should call errorHandler.handle when an HttpErrorResponse occurs', () => {
    getTokenSpy.mockReturnValue(null);

    http.get('/api/test').subscribe({ error: jest.fn() });

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: HttpStatusCode.Unauthorized, statusText: 'Unauthorized' });

    expect(handleSpy).toHaveBeenCalledWith(expect.any(HttpErrorResponse));
  });

  it('should not call errorHandler.handle for non-HttpErrorResponse errors', () => {
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const next = () => throwError(() => new Error('generic error'));
      authInterceptor(req, next as never).subscribe({ error: jest.fn() });
    });

    expect(handleSpy).not.toHaveBeenCalled();
  });
});
