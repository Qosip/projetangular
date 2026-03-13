import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatRepository } from './chat.repository';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ChatRepository', () => {
  let repository: ChatRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatRepository]
    });
    repository = TestBed.inject(ChatRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list chats', () => {
    const mockChats = [{ id: 1, title: 'Chat 1' }];
    repository.listChats().subscribe(chats => {
      expect(chats).toEqual(mockChats);
    });

    const req = httpMock.expectOne('/chats');
    expect(req.request.method).toBe('GET');
    req.flush(mockChats);
  });

  it('should get a single chat', () => {
    repository.getChat(123).subscribe();
    const req = httpMock.expectOne('/chats/123');
    expect(req.request.method).toBe('GET');
  });

  it('should create a chat', () => {
    repository.createChat(['model1'], 3).subscribe();
    const req = httpMock.expectOne('/chats');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ models: ['model1'], rounds: 3 });
  });

  it('should send a message', () => {
    repository.sendMessage(1, 'hello').subscribe();
    const req = httpMock.expectOne('/chats/1/messages');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'hello' });
  });
});
