import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputBarComponent } from './input-bar';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('InputBarComponent', () => {
  let component: InputBarComponent;
  let fixture: ComponentFixture<InputBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InputBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit message and clear input on send', () => {
    vi.spyOn(component.messageSent, 'emit');
    component.messageText.set('Hello');
    component.send();
    
    expect(component.messageSent.emit).toHaveBeenCalledWith('Hello');
    expect(component.messageText()).toBe('');
  });

  it('should not emit if message is empty', () => {
    vi.spyOn(component.messageSent, 'emit');
    component.messageText.set('   ');
    component.send();
    
    expect(component.messageSent.emit).not.toHaveBeenCalled();
  });

  it('should show different placeholder when disabled', () => {
    fixture.componentRef.setInput('disabled', false);
    expect(component.getPlaceholder()).toContain('Message');
    
    fixture.componentRef.setInput('disabled', true);
    expect(component.getPlaceholder()).toContain('reflexion');
  });
});
