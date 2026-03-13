import { TestBed } from '@angular/core/testing';
import { ModelService } from './model.service';
import { ModelRepository } from './model.repository';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ModelService', () => {
  let service: ModelService;
  let repoSpy: any;

  beforeEach(() => {
    repoSpy = {
      getModels: vi.fn(() => of([{ id: 'm1', name: 'Model 1' }]))
    };

    TestBed.configureTestingModule({
      providers: [
        ModelService,
        { provide: ModelRepository, useValue: repoSpy }
      ]
    });

    service = TestBed.inject(ModelService);
  });

  it('should load models into signal', () => {
    service.loadModels();
    expect(repoSpy.getModels).toHaveBeenCalled();
    expect(service.models().length).toBe(1);
    expect(service.models()[0].id).toBe('m1');
  });
});
