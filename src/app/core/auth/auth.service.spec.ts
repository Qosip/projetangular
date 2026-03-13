import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { ToastService } from '../../shared/services/toast.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let repoSpy: any;
  let toastSpy: any;
  let routerSpy: any;

  beforeEach(() => {
    localStorage.clear();
    repoSpy = {
      login: vi.fn(),
      saveToken: vi.fn(),
      getToken: vi.fn(() => null),
      removeToken: vi.fn(),
    };
    toastSpy = { show: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: repoSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should login successfully', () => {
    repoSpy.login.mockReturnValue(of({ token: 'jwt' }));
    
    service.login('John');

    expect(repoSpy.saveToken).toHaveBeenCalledWith('jwt');
    expect(service.username()).toBe('John');
    expect(service.isLoggedIn()).toBe(true);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    repoSpy.login.mockReturnValue(throwError(() => ({ error: { error: 'Failed' } })));
    
    service.login('John');

    expect(service.isLoggedIn()).toBe(false);
    expect(toastSpy.show).toHaveBeenCalledWith('Failed');
  });

  it('should logout', () => {
    service.logout();
    expect(repoSpy.removeToken).toHaveBeenCalled();
    expect(service.isLoggedIn()).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
