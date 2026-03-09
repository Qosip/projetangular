import { Injectable, signal, inject } from '@angular/core';
import { ChatRepository } from '../repositories/chat.repository';
import { StreamingService } from './streaming.service';
import { Chat, Message } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private repo = inject(ChatRepository);
  streaming = inject(StreamingService);

  chats = signal<Chat[]>([]);
  currentChat = signal<Chat | null>(null);
  messages = signal<Message[]>([]);
  processing = signal(false);

  loadChats(): void {
    this.repo.listChats().subscribe({
      next: (chats) => this.chats.set(chats),
    });
  }

  loadChat(id: number): void {
    this.repo.getChat(id).subscribe({
      next: (chat) => this.currentChat.set(chat),
    });
  }

  loadMessages(chatId: number): void {
    this.repo.getMessages(chatId).subscribe({
      next: (res) => {
        this.messages.set(res.messages);
        this.processing.set(res.processing);
      },
    });
  }

  createChat(models: string[], rounds = 2): void {
    this.repo.createChat(models, rounds).subscribe({
      next: (chat) => {
        this.chats.update((list) => [chat, ...list]);
        this.currentChat.set(chat);
      },
    });
  }

  sendMessage(chatId: number, content: string): void {
    this.repo.sendMessage(chatId, content).subscribe({
      next: (msg) => {
        this.messages.update((list) => [...list, msg]);
        this.processing.set(true);

        this.streaming.startStream(chatId, () => {
          this.loadMessages(chatId);
          this.loadChats();
        });
      },
      error: (err) => {
        if (err.status === 409) {
          this.processing.set(true);
          this.streaming.startStream(chatId, () => {
            this.loadMessages(chatId);
            this.loadChats();
          });
        }
      },
    });
  }

  stopStreaming(): void {
    this.streaming.stopStream();
  }
}
