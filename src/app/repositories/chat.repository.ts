import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chat, Message, MessagesResponse } from '../models/chat.models';

const API = '';

@Injectable({ providedIn: 'root' })
export class ChatRepository {
  private http = inject(HttpClient);

  listChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${API}/chats`);
  }

  getChat(id: number): Observable<Chat> {
    return this.http.get<Chat>(`${API}/chats/${id}`);
  }

  createChat(models: string[], rounds = 2): Observable<Chat> {
    return this.http.post<Chat>(`${API}/chats`, { models, rounds });
  }

  getMessages(chatId: number): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(`${API}/chats/${chatId}/messages`);
  }

  sendMessage(chatId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${API}/chats/${chatId}/messages`, { content });
  }

  deleteChat(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/chats/${id}`);
  }

  renameChat(id: number, title: string): Observable<Chat> {
    return this.http.patch<Chat>(`${API}/chats/${id}`, { title });
  }
}
