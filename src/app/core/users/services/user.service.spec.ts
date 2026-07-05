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

describe('UserService', () => {
  let service: UserService;
  let getMeSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserApiService,
          useValue: {
            getMe: jest.fn().mockReturnValue(of(mockUser)),
            updateProfile: jest.fn().mockReturnValue(of(mockUser)),
            updatePreferences: jest.fn().mockReturnValue(of(mockUser)),
            updateAvatar: jest.fn().mockReturnValue(of(mockUser)),
          },
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

  it('should update the profile and store the returned user', () => {
    const updatedUser: UserApiDto = { ...mockUser, name: 'New Name' };
    const userApiService = TestBed.inject(UserApiService);
    jest.spyOn(userApiService, 'updateProfile').mockReturnValue(of(updatedUser));

    service
      .updateProfile({
        name: 'New Name',
        email: 'new@example.com',
        phone: '+55 11 99999-0000',
        birthDate: '1991-06-13',
      })
      .subscribe();

    expect(userApiService.updateProfile).toHaveBeenCalledWith({
      name: 'New Name',
      email: 'new@example.com',
      phone: '+55 11 99999-0000',
      birthDate: '1991-06-13',
    });
    expect(service.currentUser()).toEqual(updatedUser);
  });

  it('should merge the profile response with the current user when preferences are omitted', () => {
    const userApiService = TestBed.inject(UserApiService);
    const partialProfileResponse = {
      id: mockUser.id,
      name: 'Merged Name',
      email: 'merged@example.com',
      phone: '+55 11 97777-0000',
      birthDate: '1991-06-13',
      avatarUrl: mockUser.avatarUrl,
      role: mockUser.role,
      plan: mockUser.plan,
      status: mockUser.status,
      createdAt: mockUser.createdAt,
      updatedAt: '2026-01-02T00:00:00.000Z',
      deletedAt: mockUser.deletedAt,
    };
    jest.spyOn(userApiService, 'updateProfile').mockReturnValue(of(partialProfileResponse));

    service.loadCurrentUser().subscribe();

    service
      .updateProfile({
        name: 'Merged Name',
        email: 'merged@example.com',
        phone: '+55 11 97777-0000',
        birthDate: '1991-06-13',
      })
      .subscribe();

    expect(service.currentUser()).toEqual({
      ...mockUser,
      ...partialProfileResponse,
      preferences: mockUser.preferences,
    });
  });

  it('should update preferences and store the returned user', () => {
    const userApiService = TestBed.inject(UserApiService);
    const payload = {
      temperatureUnit: 'FAHRENHEIT',
      measurementUnit: 'PPM',
      notificationsEnabled: false,
    };
    jest.spyOn(userApiService, 'updatePreferences').mockReturnValue(of(mockUser));

    service.updatePreferences(payload).subscribe();

    expect(userApiService.updatePreferences).toHaveBeenCalledWith(payload);
    expect(service.currentUser()).toEqual(mockUser);
  });

  it('should update the avatar and store the returned user', () => {
    const file = new File(['fake-image-bytes'], 'avatar.png', { type: 'image/png' });
    const avatarResponse = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      birthDate: mockUser.birthDate,
      avatarUrl: 'http://127.0.0.1:9000/bucket/key.png',
      role: mockUser.role,
      plan: mockUser.plan,
      status: mockUser.status,
      createdAt: mockUser.createdAt,
      updatedAt: mockUser.updatedAt,
      deletedAt: mockUser.deletedAt,
    };
    const updatedUser: UserApiDto = { ...mockUser, avatarUrl: avatarResponse.avatarUrl };
    const userApiService = TestBed.inject(UserApiService);
    jest.spyOn(userApiService, 'updateAvatar').mockReturnValue(of(avatarResponse));

    service.loadCurrentUser().subscribe();

    service.updateAvatar(file).subscribe();

    expect(userApiService.updateAvatar).toHaveBeenCalledWith(file);
    expect(service.currentUser()).toEqual(updatedUser);
  });
});
