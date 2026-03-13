import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModelSelectorComponent } from './model-selector';
import { ModelService } from '../../model.service';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ModelSelectorComponent', () => {
  let component: ModelSelectorComponent;
  let fixture: ComponentFixture<ModelSelectorComponent>;
  let modelServiceSpy: any;

  beforeEach(async () => {
    modelServiceSpy = {
      models: signal([{ id: 'm1', name: 'Model 1' }, { id: 'm2', name: 'Model 2' }]),
    };

    await TestBed.configureTestingModule({
      imports: [ModelSelectorComponent],
      providers: [
        { provide: ModelService, useValue: modelServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModelSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('activeModels', ['m1']);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should detect active models', () => {
    fixture.componentRef.setInput('activeModels', ['m1']);
    fixture.detectChanges();
    expect(component.isActive('m1')).toBe(true);
    expect(component.isActive('m2')).toBe(false);
  });

  it('should emit new model list on toggle', () => {
    vi.spyOn(component.modelsChanged, 'emit');
    fixture.componentRef.setInput('activeModels', ['m1']);
    fixture.detectChanges();
    
    component.toggle('m2');
    expect(component.modelsChanged.emit).toHaveBeenCalledWith(['m1', 'm2']);
  });

  it('should not allow removing the last model', () => {
    vi.spyOn(component.modelsChanged, 'emit');
    fixture.componentRef.setInput('activeModels', ['m1']);
    fixture.detectChanges();
    
    component.toggle('m1');
    expect(component.modelsChanged.emit).not.toHaveBeenCalled();
  });
});
