import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat';
import { ChatService } from '../chat.service';
import { StreamingService } from '../streaming.service';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatServiceSpy: any;
  let streamingServiceSpy: any;
  let paramMapSubject = new Subject<any>();

  beforeEach(async () => {
    chatServiceSpy = {
      messages: signal([]),
      processing: signal(false),
      currentChat: signal({ id: 1, models: ['model1'] }),
      loadChat: vi.fn(),
      loadMessages: vi.fn(),
      sendMessage: vi.fn(),
      updateChatModels: vi.fn(),
      stopStreaming: vi.fn(),
    };
    streamingServiceSpy = {
      streamingMessages: signal({}),
      completedMessages: signal([]),
      isStreaming: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: StreamingService, useValue: streamingServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: paramMapSubject.asObservable() }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should react to route parameter changes', () => {
    paramMapSubject.next({ get: (key: string) => '456' });
    expect(chatServiceSpy.loadChat).toHaveBeenCalledWith(456);
    expect(chatServiceSpy.loadMessages).toHaveBeenCalledWith(456);
  });

  it('should handle models changed event', () => {
    component.onModelsChanged(['m1', 'm2']);
    expect(chatServiceSpy.updateChatModels).toHaveBeenCalledWith(1, ['m1', 'm2']);
  });

  it('should stop streaming on destroy', () => {
    component.ngOnDestroy();
    expect(chatServiceSpy.stopStreaming).toHaveBeenCalled();
  });

  it('should handle sendMessage', () => {
    component.onSendMessage('hello');
    expect(chatServiceSpy.sendMessage).toHaveBeenCalledWith(1, 'hello');
  });

  it('should not sendMessage if no chat', () => {
    chatServiceSpy.currentChat.set(null);
    component.onSendMessage('hello');
    expect(chatServiceSpy.sendMessage).not.toHaveBeenCalled();
  });
});
