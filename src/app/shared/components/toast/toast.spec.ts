import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast';
import { ToastService } from '../../services/toast.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty initially', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.alert').length).toBe(0);
  });

  it('should display toast message when added to service', () => {
    toastService.show('Hello World', 'success');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const alert = compiled.querySelector('.alert');
    expect(alert).toBeTruthy();
    expect(alert?.textContent).toContain('Hello World');
    expect(alert?.classList.contains('alert-success')).toBe(true);
  });

  it('should call dismiss when close button is clicked', () => {
    vi.spyOn(toastService, 'dismiss');
    toastService.show('Dismiss Me');
    fixture.detectChanges();
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    
    expect(toastService.dismiss).toHaveBeenCalled();
  });
});
