import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add authorization header if token exists', () => {
    localStorage.setItem('auth_token', 'my-token');
    const req = new HttpRequest('GET', '/test');
    const next: any = vi.fn((clonedReq) => {
      expect(clonedReq.headers.get('Authorization')).toBe('Bearer my-token');
      return of({});
    });

    authInterceptor(req, next);
    expect(next).toHaveBeenCalled();
  });

  it('should not add header if token is missing', () => {
    const req = new HttpRequest('GET', '/test');
    const next: any = vi.fn((clonedReq) => {
      expect(clonedReq.headers.has('Authorization')).toBe(false);
      return of({});
    });

    authInterceptor(req, next);
    expect(next).toHaveBeenCalled();
  });
});
