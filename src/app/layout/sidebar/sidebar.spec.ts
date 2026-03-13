import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar';
import { ChatService } from '../../features/chat/chat.service';
import { AuthService } from '../../core/auth/auth.service';
import { ModelService } from '../../features/chat/model.service';
import { ThemeService } from '../../shared/services/theme.service';
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal } from '@angular/core';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let chatServiceSpy: any;
  let authServiceSpy: any;
  let modelServiceSpy: any;
  let themeServiceSpy: any;

  const mockChatObject = (id: number, title = '') => ({
    id,
    title,
    models: ['m1'],
    rounds: 2,
    processing: false,
    created_at: new Date().toISOString()
  });

  beforeEach(async () => {
    chatServiceSpy = {
      chats: signal([mockChatObject(1, 'Chat 1')]),
      currentChat: signal(null),
      favoriteIds: signal(new Set()),
      sortedChats: signal([mockChatObject(1, 'Chat 1')]),
      loadChats: vi.fn(),
      createChat: vi.fn(),
      deleteChat: vi.fn(),
      renameChat: vi.fn(),
      toggleFavorite: vi.fn(),
      isFavorite: vi.fn(() => false),
    };
    authServiceSpy = {
      isLoggedIn: signal(true),
      username: signal('User'),
      logout: vi.fn(),
    };
    modelServiceSpy = {
      models: signal([{ id: 'm1', name: 'Model 1' }, { id: 'm2', name: 'Model 2' }]),
      loadModels: vi.fn(),
    };
    themeServiceSpy = {
      currentTheme: signal('dark'),
      setTheme: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ModelService, useValue: modelServiceSpy },
        { provide: ThemeService, useValue: themeServiceSpy },
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle models in the new chat picker', () => {
    component.openNewChat();
    expect(component.isSelected('m1')).toBe(true);
    expect(component.isSelected('m2')).toBe(true);
    
    component.toggleModel('m1');
    expect(component.isSelected('m1')).toBe(false);
    
    component.toggleModel('m2');
    expect(component.isSelected('m2')).toBe(true);
  });

  it('should handle rename flow', () => {
    const event = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
    component.startEdit(1, 'Old Title', event as any);
    expect(component.editingId()).toBe(1);
    
    component.editTitle = 'New Title';
    component.confirmEdit(1);
    expect(chatServiceSpy.renameChat).toHaveBeenCalledWith(1, 'New Title');
  });

  it('should handle delete confirmation flow', () => {
    const event = { stopPropagation: vi.fn(), preventDefault: vi.fn() };
    component.askDelete(1, event as any);
    expect(component.confirmingDeleteId()).toBe(1);
    
    component.confirmDelete(1, event as any);
    expect(chatServiceSpy.deleteChat).toHaveBeenCalledWith(1);
  });
});
