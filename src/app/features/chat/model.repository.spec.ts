import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ModelRepository } from './model.repository';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ModelRepository', () => {
  let repository: ModelRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ModelRepository]
    });
    repository = TestBed.inject(ModelRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch models', () => {
    const mockModels = [{ id: 'm1', name: 'Model 1' }];
    repository.getModels().subscribe(models => {
      expect(models).toEqual(mockModels);
    });

    const req = httpMock.expectOne('/models');
    expect(req.request.method).toBe('GET');
    req.flush(mockModels);
  });
});
