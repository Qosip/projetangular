import { Injectable } from '@angular/core';
import { Conversation } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ConversationRepository {
    private readonly STORAGE_KEY = 'neuro_conversations';

    loadConversations(): Record<string, Conversation> {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (!saved) return {};
        try {
            const parsed = JSON.parse(saved);
            // Revive date strings
            for (const id in parsed) {
                parsed[id].createdAt = new Date(parsed[id].createdAt);
                parsed[id].updatedAt = new Date(parsed[id].updatedAt);
                parsed[id].messages.forEach((m: any) => m.timestamp = new Date(m.timestamp));
            }
            return parsed;
        } catch {
            return {};
        }
    }

    saveConversations(conversations: Record<string, Conversation>): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
    }
}
