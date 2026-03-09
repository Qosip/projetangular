import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatRepository } from '../repositories/chat.repository';
import { StreamingService } from './streaming.service';
import { Chat, Message } from '../models/chat.models';

const TITLES_KEY = 'neuroterminal_chat_titles';
const DELETED_KEY = 'neuroterminal_deleted_chats';

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
    // Mémoriser l'ID comme supprimé
    const deleted = getDeletedIds();
    deleted.add(id);
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]));

    // Supprimer le titre stocké
    const stored = getStoredTitles();
    delete stored[id];
    localStorage.setItem(TITLES_KEY, JSON.stringify(stored));

    // Mettre à jour les signaux
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
}
