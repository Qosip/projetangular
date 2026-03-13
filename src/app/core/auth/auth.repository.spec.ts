import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthRepository } from './auth.repository';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthRepository]
    });
    repository = TestBed.inject(AuthRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call login API', () => {
    const credentials = { email: 't@t.com', password: 'p' };
    const mockResponse = { token: 'abc' };

    repository.login(credentials).subscribe(res => {
      expect(res.token).toBe('abc');
    });

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should manage token in localStorage', () => {
    repository.saveToken('test-token');
    expect(repository.getToken()).toBe('test-token');
    
    repository.removeToken();
    expect(repository.getToken()).toBeNull();
  });
});
