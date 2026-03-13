import { Injectable } from '@angular/core';

const TITLES_KEY = 'neuroterminal_chat_titles';
const DELETED_KEY = 'neuroterminal_deleted_chats';
const FAVORITES_KEY = 'neuroterminal_favorite_chats';

@Injectable({ providedIn: 'root' })
export class ChatStorageService {

  getDeletedIds(): Set<number> {
    try {
      const arr = JSON.parse(localStorage.getItem(DELETED_KEY) ?? '[]') as number[];
      return new Set(arr);
    } catch {
      return new Set();
    }
  }

  markDeleted(id: number): void {
    const deleted = this.getDeletedIds();
    deleted.add(id);
    localStorage.setItem(DELETED_KEY, JSON.stringify([...deleted]));
  }

  getStoredTitles(): Record<number, string> {
    try {
      return JSON.parse(localStorage.getItem(TITLES_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  setTitle(id: number, title: string): void {
    const stored = this.getStoredTitles();
    stored[id] = title;
    localStorage.setItem(TITLES_KEY, JSON.stringify(stored));
  }

  removeTitle(id: number): void {
    const stored = this.getStoredTitles();
    delete stored[id];
    localStorage.setItem(TITLES_KEY, JSON.stringify(stored));
  }

  getStoredFavorites(): Set<number> {
    try {
      const arr = JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]') as number[];
      return new Set(arr);
    } catch {
      return new Set();
    }
  }

  saveFavorites(favs: Set<number>): void {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs]));
  }

  removeFavorite(id: number, favs: Set<number>): Set<number> {
    const copy = new Set(favs);
    copy.delete(id);
    this.saveFavorites(copy);
    return copy;
  }

  applyStoredTitle<T extends { id: number; title?: string }>(chat: T): T {
    const stored = this.getStoredTitles();
    return stored[chat.id] ? { ...chat, title: stored[chat.id] } : chat;
  }
}
