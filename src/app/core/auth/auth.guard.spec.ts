import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authCanActivateChildGuard, authCanMatchGuard } from './auth.guard';

describe('auth guards', () => {
  let authService: jest.Mocked<Pick<AuthService, 'hasAccess'>>;
  let createUrlTree: jest.Mock;

  beforeEach(() => {
    createUrlTree = jest.fn((commands: unknown[]) => ({ commands }));
    authService = {
      hasAccess: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        {
          provide: Router,
          useValue: {
            createUrlTree,
          },
        },
      ],
    });
  });

  it('should allow match when the user has access', () => {
    authService.hasAccess.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authCanMatchGuard({} as never, []));

    expect(result).toBe(true);
  });

  it('should redirect match to login when the user has no access', () => {
    authService.hasAccess.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => authCanMatchGuard({} as never, []));

    expect(result).toEqual({
      commands: ['/login'],
    });
    expect(createUrlTree).toHaveBeenCalled();
  });

  it('should allow child activation when the user has access', () => {
    authService.hasAccess.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authCanActivateChildGuard({} as never, { url: '/' } as never),
    );

    expect(result).toBe(true);
  });

  it('should redirect child activation to login when the user has no access', () => {
    authService.hasAccess.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authCanActivateChildGuard({} as never, { url: '/reports' } as never),
    );

    expect(result).toEqual({
      commands: ['/login'],
    });
    expect(createUrlTree).toHaveBeenCalled();
  });
});
