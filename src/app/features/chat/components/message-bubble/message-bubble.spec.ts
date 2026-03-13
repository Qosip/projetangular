import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageBubbleComponent } from './message-bubble';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MessageBubbleComponent', () => {
  let component: MessageBubbleComponent;
  let fixture: ComponentFixture<MessageBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageBubbleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageBubbleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('message', {
      author: 'user',
      content: 'hi',
      created_at: new Date().toISOString()
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should detect user messages', () => {
    fixture.componentRef.setInput('message', {
      author: 'user',
      content: 'test',
      created_at: new Date().toISOString()
    });
    fixture.detectChanges();
    expect(component.isUser()).toBe(true);
  });

  it('should detect model messages', () => {
    fixture.componentRef.setInput('message', {
      author: 'gpt-4',
      content: 'beeeep',
      created_at: new Date().toISOString()
    });
    fixture.detectChanges();
    expect(component.isUser()).toBe(false);
    // getModelInitial returns first 2 chars uppercase ('GP' for 'gpt-4')
    expect(component.modelInitial()).toBe('GP');
  });

  it('should show streaming indicator if provided', () => {
    fixture.componentRef.setInput('message', {
      author: 'gpt-4',
      content: 'typing...',
      created_at: new Date().toISOString()
    });
    fixture.componentRef.setInput('isStreaming', true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // In our template, the blink cursor is '.cursor-blink'
    expect(compiled.querySelector('.cursor-blink')).toBeTruthy();
  });
});
