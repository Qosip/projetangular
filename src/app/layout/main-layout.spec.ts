import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayout } from './main-layout';
import { ChatService } from '../features/chat/chat.service';
import { Router, NavigationEnd, provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { signal, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: '',
  standalone: true
})
class MockSidebarComponent {}

@Component({
  selector: 'app-topbar',
  template: '',
  standalone: true
})
class MockTopbarComponent {}

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;
  let chatServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    chatServiceSpy = {
      currentChat: signal(null),
    };

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [
        { provide: ChatService, useValue: chatServiceSpy },
        provideRouter([]),
      ]
    }).overrideComponent(MainLayout, {
      set: {
        imports: [MockSidebarComponent, MockTopbarComponent],
        template: '<div>Mock</div>'
      }
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get models from active chat', () => {
    chatServiceSpy.currentChat.set({ id: 1, models: ['gpt-4', 'claude'] });
    expect(component.currentModels()).toEqual(['gpt-4', 'claude']);
  });

  it('should handle navigation events to update chatId', async () => {
    // Simulate navigation end
    const routerEvents = (router as any).events as Subject<any>;
    routerEvents.next(new NavigationEnd(1, '/chat/12345', '/chat/12345'));
    
    fixture.detectChanges();
    expect(component.currentChatId()).toBe(12345);
  });

  it('should return null for chatId on non-chat pages', () => {
    const routerEvents = (router as any).events as Subject<any>;
    routerEvents.next(new NavigationEnd(1, '/settings', '/settings'));
    
    fixture.detectChanges();
    expect(component.currentChatId()).toBeNull();
  });
});
