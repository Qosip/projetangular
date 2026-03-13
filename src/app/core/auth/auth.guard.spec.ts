import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('authGuard', () => {
  let authServiceSpy: any;
  let routerSpy: any;

  beforeEach(() => {
    authServiceSpy = { isLoggedIn: signal(false) };
    routerSpy = { createUrlTree: vi.fn(() => ({} as UrlTree)) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });
  });

  it('should return true if logged in', () => {
    authServiceSpy.isLoggedIn.set(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to login if not logged in', () => {
    authServiceSpy.isLoggedIn.set(false);
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
