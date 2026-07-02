import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UserApiService } from './user-api.service';
import { UserService } from './user.service';
import { UserApiDto } from '../models/user-api.dto';

const mockUser: UserApiDto = {
  id: 'user-id',
  name: 'Test User',
  email: 'test@example.com',
  phone: null,
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

describe('UserService', () => {
  let service: UserService;
  let getMeSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserApiService,
          useValue: { getMe: jest.fn().mockReturnValue(of(mockUser)) },
        },
      ],
    });

    service = TestBed.inject(UserService);
    getMeSpy = jest.spyOn(TestBed.inject(UserApiService), 'getMe');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should start with no current user', () => {
    expect(service.currentUser()).toBeNull();
  });

  it('should load and store the current user', () => {
    getMeSpy.mockReturnValue(of(mockUser));

    service.loadCurrentUser().subscribe();

    expect(service.currentUser()).toEqual(mockUser);
  });

  it('should clear the current user', () => {
    getMeSpy.mockReturnValue(of(mockUser));
    service.loadCurrentUser().subscribe();

    service.clearCurrentUser();

    expect(service.currentUser()).toBeNull();
  });
});
