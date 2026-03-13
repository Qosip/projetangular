import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopbarComponent } from './topbar';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display chat ID if provided', () => {
    fixture.componentRef.setInput('chatId', 456);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('456');
  });

  it('should show model indicators', () => {
    fixture.componentRef.setInput('models', ['model1', 'model2']);
    fixture.detectChanges();
    // In our template, the dot uses the class 'model-dot'
    const dots = fixture.nativeElement.querySelectorAll('.model-dot');
    expect(dots.length).toBe(2);
  });
});
