import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthApiService } from './auth-api.service';
import { ForgotPasswordResponse } from '../models/forgot-password-response.model';
import { LoginResponse } from '../models/login-response.model';

const mockResponse: LoginResponse = {
  user: {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: null,
    status: 'ACTIVE',
    role: 'USER',
    plan: 'FREE',
  },
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
};

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to /auth/login with the given credentials', () => {
    service.login({ email: 'test@example.com', password: 'pass123' }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'pass123' });
    req.flush(mockResponse);
  });

  it('should POST to /auth/register with the given data', () => {
    service
      .register({ name: 'Test User', email: 'test@example.com', password: 'password123' })
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

    const req = httpMock.expectOne('http://localhost:3000/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    req.flush(mockResponse);
  });

  it('should POST to /auth/forgot-password with the given data and return the new password', () => {
    const mockForgotResponse: ForgotPasswordResponse = { newPassword: 'newPass123' };

    service
      .forgotPassword({ email: 'test@example.com', name: 'Test User', birthDate: '1990-01-15' })
      .subscribe((res) => {
        expect(res).toEqual(mockForgotResponse);
      });

    const req = httpMock.expectOne('http://localhost:3000/auth/forgot-password');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      name: 'Test User',
      birthDate: '1990-01-15',
    });
    req.flush(mockForgotResponse);
  });
});
