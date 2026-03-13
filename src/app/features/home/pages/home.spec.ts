import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { AuthService } from '../../../core/auth/auth.service';
import { ChatService } from '../../chat/chat.service';
import { ModelService } from '../../chat/model.service';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let chatServiceSpy: any;
  let modelServiceSpy: any;

  beforeEach(async () => {
    chatServiceSpy = {
      chats: signal([]),
      createChat: vi.fn(),
    };
    modelServiceSpy = {
      models: signal([{ id: 'm1' }]),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: { username: signal('User') } },
        { provide: ChatService, useValue: chatServiceSpy },
        { provide: ModelService, useValue: modelServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createChat with available models', () => {
    component.createChat();
    expect(chatServiceSpy.createChat).toHaveBeenCalledWith(['m1']);
  });
});
