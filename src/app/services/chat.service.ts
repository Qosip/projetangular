import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ChatRepository } from '../repositories/chat.repository';
import { StreamingService } from './streaming.service';
import { Chat, Message } from '../models/chat.models';

const TITLES_KEY = 'neuroterminal_chat_titles';
const DELETED_KEY = 'neuroterminal_deleted_chats';
const FAVORITES_KEY = 'neuroterminal_favorite_chats';

function getDeletedIds(): Set<number> {
  try {
    const arr = JSON.parse(localStorage.getItem(DELETED_KEY) ?? '[]') as number[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function getStoredTitles(): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem(TITLES_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function getStoredFavorites(): Set<number> {
  try {
    const arr = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]') as number[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function applyStoredTitle(chat: Chat): Chat {
  const stored = getStoredTitles();
  return stored[chat.id] ? { ...chat, title: stored[chat.id] } : chat;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private repo = inject(ChatRepository);
  private router = inject(Router);
  streaming = inject(StreamingService);

  chats = signal<Chat[]>([]);
  currentChat = signal<Chat | null>(null);
  messages = signal<Message[]>([]);
  processing = signal(false);
  favoriteIds = signal<Set<number>>(getStoredFavorites());

  /** Chats triés : favoris en premier, puis le reste dans l'ordre original */
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
        const deleted = getDeletedIds();
        this.chats.set(
          chats.filter((c) => !deleted.has(c.id)).map(applyStoredTitle)
        );
      },
    });
  }

  loadChat(id: number): void {
    this.repo.getChat(id).subscribe({
      next: (chat) => {
        if (getDeletedIds().has(chat.id)) return;
        this.currentChat.set(applyStoredTitle(chat));
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

  /** Suppression locale persistée via localStorage */
  deleteChat(id: number): void {
    const deleted = getDeletedIds();
    deleted.add(id);
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]));

    const stored = getStoredTitles();
    delete stored[id];
    localStorage.setItem(TITLES_KEY, JSON.stringify(stored));

    // Retirer des favoris si besoin
    const favs = new Set(this.favoriteIds());
    if (favs.has(id)) {
      favs.delete(id);
      this.favoriteIds.set(favs);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]));
    }

    this.chats.update((list) => list.filter((c) => c.id !== id));
    if (this.currentChat()?.id === id) {
      this.currentChat.set(null);
      this.messages.set([]);
      this.router.navigate(['/']);
    }
  }

  /** Renommage local persisté dans localStorage */
  renameChat(id: number, title: string): void {
    const stored = getStoredTitles();
    stored[id] = title;
    localStorage.setItem(TITLES_KEY, JSON.stringify(stored));

    this.chats.update((list) =>
      list.map((c) => (c.id === id ? { ...c, title } : c))
    );
    const current = this.currentChat();
    if (current?.id === id) {
      this.currentChat.set({ ...current, title });
    }
  }

  /** Basculer le statut favori d'un chat */
  toggleFavorite(id: number): void {
    const favs = new Set(this.favoriteIds());
    if (favs.has(id)) {
      favs.delete(id);
    } else {
      favs.add(id);
    }
    this.favoriteIds.set(favs);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]));
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  /** Mise à jour locale des modèles d'un chat (pas d'appel API) */
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
