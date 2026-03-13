import { TestBed } from '@angular/core/testing';
import { ChatStorageService } from './chat-storage.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ChatStorageService', () => {
  let service: ChatStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle deleted IDs', () => {
    expect(service.getDeletedIds().size).toBe(0);
    service.markDeleted(123);
    const deleted = service.getDeletedIds();
    expect(deleted.has(123)).toBe(true);
  });

  it('should manage custom chat titles', () => {
    expect(service.getStoredTitles()).toEqual({});
    service.setTitle(1, 'New Title');
    expect(service.getStoredTitles()[1]).toBe('New Title');
    
    service.removeTitle(1);
    expect(service.getStoredTitles()).toEqual({});
  });

  it('should manage favorites', () => {
    expect(service.getStoredFavorites().size).toBe(0);
    const favs = new Set([1, 2]);
    service.saveFavorites(favs);
    expect(service.getStoredFavorites().has(1)).toBe(true);
    
    const newFavs = service.removeFavorite(1, favs);
    expect(newFavs.has(1)).toBe(false);
    expect(newFavs.has(2)).toBe(true);
  });

  it('should apply stored titles to chat objects', () => {
    service.setTitle(1, 'Overridden Title');
    const chat = { id: 1, title: 'Original Title' };
    const result = service.applyStoredTitle(chat);
    expect(result.title).toBe('Overridden Title');
  });

  it('should not apply title if not in storage', () => {
    const chat = { id: 99, title: 'Original' };
    const result = service.applyStoredTitle(chat);
    expect(result.title).toBe('Original');
  });
});
