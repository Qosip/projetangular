import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Conversation, getModelColor } from '../../models/chat.models';

@Component({
    selector: 'app-recent-conversations',
    imports: [RouterLink],
    templateUrl: './recent-conversations.component.html',
    styleUrl: './recent-conversations.component.css'
})
export class RecentConversationsComponent {
    conversations = input.required<Conversation[]>();

    getModelColor(modelId: string): string {
        const colors: Record<string, string> = {
            'claude': 'var(--model-claude)',
            'gpt-4': 'var(--model-gpt)',
            'gemini': 'var(--model-gemini)',
            'mistral': 'var(--model-mistral)',
            'llama': 'var(--model-llama)',
            'deepseek': 'var(--model-deepseek)',
        };
        return colors[modelId] ?? 'var(--model-custom)';
    }
}
