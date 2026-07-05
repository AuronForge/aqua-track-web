import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserApiService } from './user-api.service';
import { UserApiDto } from '../models/user-api.dto';

const mockUser: UserApiDto = {
  id: 'user-id',
  name: 'Test User',
  email: 'test@example.com',
  phone: null,
  birthDate: '1990-05-12',
  avatarUrl: null,
  role: 'USER',
  plan: 'FREE',
  status: 'ACTIVE',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
  preferences: {
    id: 'pref-id',
    userId: 'user-id',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    theme: 'system',
    temperatureUnit: 'CELSIUS',
    measurementUnit: 'METRIC',
    notificationsEnabled: true,
    phAlertEnabled: true,
    temperatureAlertEnabled: true,
    ammoniaAlertEnabled: true,
    nitriteAlertEnabled: true,
    nitrateAlertEnabled: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET /users/me and return the response', () => {
    service.getMe().subscribe((res) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(
      (r) => r.url === 'http://localhost:3000/users/me' && r.method === 'GET',
    );
    req.flush(mockUser);
  });

  it('should PUT /users/me with the profile payload', () => {
    service
      .updateProfile({
        name: 'New Name',
        email: 'new@example.com',
        phone: '+55 11 99999-0000',
        birthDate: '1991-06-13',
      })
      .subscribe((res) => {
        expect(res).toEqual(mockUser);
      });

    const req = httpMock.expectOne('http://localhost:3000/users/me');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      name: 'New Name',
      email: 'new@example.com',
      phone: '+55 11 99999-0000',
      birthDate: '1991-06-13',
    });
    req.flush(mockUser);
  });

  it('should PATCH /users/me/preferences with the preferences payload', () => {
    const payload = {
      temperatureUnit: 'CELSIUS',
      measurementUnit: 'MG_L',
      notificationsEnabled: true,
    };

    service.updatePreferences(payload).subscribe((res) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/users/me/preferences');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush(mockUser);
  });

  it('should PATCH /users/me/avatar with a multipart FormData payload', () => {
    const file = new File(['fake-image-bytes'], 'avatar.png', { type: 'image/png' });
    const updatedUser = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      birthDate: mockUser.birthDate,
      phone: mockUser.phone,
      avatarUrl: 'http://127.0.0.1:9000/bucket/key.png',
      role: mockUser.role,
      plan: mockUser.plan,
      status: mockUser.status,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
      deletedAt: mockUser.deletedAt,
    };

    service.updateAvatar(file).subscribe((res) => {
      expect(res).toEqual(updatedUser);
    });

    const req = httpMock.expectOne('http://localhost:3000/users/me/avatar');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toBeInstanceOf(FormData);
    expect((req.request.body as FormData).get('avatar')).toBe(file);
    req.flush(updatedUser);
  });
});
