import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { ChatStorageService } from './chat-storage.service';
import { ToastService } from '../../shared/services/toast.service';
import { StreamingService } from './streaming.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Chat } from './chat.models';

describe('ChatService', () => {
  let service: ChatService;
  let repoSpy: any;
  let storageSpy: any;
  let toastSpy: any;
  let streamingSpy: any;
  let routerSpy: any;

  const mockChat = (id: number, title = ''): Chat => ({
    id,
    title,
    models: ['gpt-4'],
    rounds: 2,
    processing: false,
    created_at: new Date().toISOString()
  });

  beforeEach(() => {
    repoSpy = {
      listChats: vi.fn(),
      getChat: vi.fn(),
      getMessages: vi.fn(),
      createChat: vi.fn(),
      sendMessage: vi.fn(),
    };
    storageSpy = {
      getStoredFavorites: vi.fn(() => new Set()),
      getDeletedIds: vi.fn(() => new Set()),
      applyStoredTitle: vi.fn((c) => c),
      markDeleted: vi.fn(),
      removeTitle: vi.fn(),
      removeFavorite: vi.fn((id, set) => {
        const next = new Set(set);
        next.delete(id);
        return next;
      }),
      setTitle: vi.fn(),
      saveFavorites: vi.fn(),
    };
    toastSpy = { show: vi.fn() };
    streamingSpy = { startStream: vi.fn(), stopStream: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: ChatRepository, useValue: repoSpy },
        { provide: ChatStorageService, useValue: storageSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: StreamingService, useValue: streamingSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(ChatService);
  });

  it('should load chat and update currentChat if not deleted', () => {
    const chat = mockChat(5, 'Chat 5');
    repoSpy.getChat.mockReturnValue(of(chat));
    storageSpy.getDeletedIds.mockReturnValue(new Set());

    service.loadChat(5);
    expect(service.currentChat()?.id).toBe(5);
  });

  it('should handle conflict (409) in sendMessage', () => {
    repoSpy.sendMessage.mockReturnValue(throwError(() => ({ status: 409 })));
    service.sendMessage(1, 'conflict');
    
    expect(service.processing()).toBe(true);
    expect(streamingSpy.startStream).toHaveBeenCalled();
  });

  it('should rename chat and update local list and current chat', () => {
    service.chats.set([mockChat(1, 'Old'), mockChat(2, 'Other')]);
    service.currentChat.set(mockChat(1, 'Old'));
    
    service.renameChat(1, 'New Title');
    
    expect(storageSpy.setTitle).toHaveBeenCalledWith(1, 'New Title');
    expect(service.chats()[0].title).toBe('New Title');
    expect(service.currentChat()?.title).toBe('New Title');
  });

  it('should update chat models', () => {
    service.currentChat.set(mockChat(1));
    service.chats.set([mockChat(1)]);
    
    service.updateChatModels(1, ['m1', 'm2']);
    
    expect(service.currentChat()?.models).toEqual(['m1', 'm2']);
    expect(service.chats()[0].models).toEqual(['m1', 'm2']);
  });

  it('should stop streaming', () => {
    service.stopStreaming();
    expect(streamingSpy.stopStream).toHaveBeenCalled();
  });
});
