import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let getItemSpy: jest.SpyInstance<string | null, [key: string]>;
  let setItemSpy: jest.SpyInstance<void, [key: string, value: string]>;
  let removeItemSpy: jest.SpyInstance<void, [key: string]>;
  const originalWindow = globalThis.window;

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined);
    removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => undefined);

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    });
    jest.restoreAllMocks();
  });

  it('should report access when there is a persisted token', () => {
    getItemSpy.mockReturnValue('token-value');

    expect(service.hasAccess()).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should persist a token and mark the user as authenticated', () => {
    service.setToken('fresh-token');

    expect(setItemSpy).toHaveBeenCalledWith('aqua-track.auth-token', 'fresh-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should clear a token and mark the user as unauthenticated', () => {
    service.clearToken();

    expect(removeItemSpy).toHaveBeenCalledWith('aqua-track.auth-token');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should report no access when there is no persisted token', () => {
    getItemSpy.mockReturnValue(null);

    expect(service.hasAccess()).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should report no access when window is unavailable', () => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: undefined,
    });

    const windowlessService = TestBed.inject(AuthService);

    expect(windowlessService.hasAccess()).toBe(false);
    expect(windowlessService.isAuthenticated()).toBe(false);
  });

  it('should return the stored token via getToken', () => {
    getItemSpy.mockReturnValue('stored-token');

    expect(service.getToken()).toBe('stored-token');
  });

  it('should return null via getToken when no token is stored', () => {
    getItemSpy.mockReturnValue(null);

    expect(service.getToken()).toBeNull();
  });
});
