import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ChatRepository } from './chat.repository';
import { StreamingService } from './streaming.service';
import { ChatStorageService } from './chat-storage.service';
import { Chat, Message } from './chat.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private repo = inject(ChatRepository);
  private router = inject(Router);
  private storage = inject(ChatStorageService);
  streaming = inject(StreamingService);

  chats = signal<Chat[]>([]);
  currentChat = signal<Chat | null>(null);
  messages = signal<Message[]>([]);
  processing = signal(false);
  favoriteIds = signal<Set<number>>(this.storage.getStoredFavorites());

  sortedChats = computed(() => {
    const favIds = this.favoriteIds();
    const all = this.chats();
    return [
      ...all.filter((c) => favIds.has(c.id)),
      ...all.filter((c) => !favIds.has(c.id)),
    ];
  });

  loadChats(): void {
    this.repo.listChats().subscribe({
      next: (chats) => {
        const deleted = this.storage.getDeletedIds();
        this.chats.set(
          chats.filter((c) => !deleted.has(c.id)).map((c) => this.storage.applyStoredTitle(c))
        );
      },
    });
  }

  loadChat(id: number): void {
    this.repo.getChat(id).subscribe({
      next: (chat) => {
        if (this.storage.getDeletedIds().has(chat.id)) return;
        this.currentChat.set(this.storage.applyStoredTitle(chat));
      },
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

  deleteChat(id: number): void {
    this.storage.markDeleted(id);
    this.storage.removeTitle(id);
    this.favoriteIds.update((favs) => this.storage.removeFavorite(id, favs));

    this.chats.update((list) => list.filter((c) => c.id !== id));
    if (this.currentChat()?.id === id) {
      this.currentChat.set(null);
      this.messages.set([]);
      this.router.navigate(['/']);
    }
  }

  renameChat(id: number, title: string): void {
    this.storage.setTitle(id, title);
    this.chats.update((list) =>
      list.map((c) => (c.id === id ? { ...c, title } : c))
    );
    const current = this.currentChat();
    if (current?.id === id) {
      this.currentChat.set({ ...current, title });
    }
  }

  toggleFavorite(id: number): void {
    const favs = new Set(this.favoriteIds());
    if (favs.has(id)) {
      favs.delete(id);
    } else {
      favs.add(id);
    }
    this.favoriteIds.set(favs);
    this.storage.saveFavorites(favs);
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  updateChatModels(id: number, models: string[]): void {
    this.chats.update((list) =>
      list.map((c) => (c.id === id ? { ...c, models } : c))
    );
    const current = this.currentChat();
    if (current?.id === id) {
      this.currentChat.set({ ...current, models });
    }
  }
}
