import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chat, getModelColor } from '../../models/chat.models';

@Component({
    selector: 'app-recent-conversations',
    imports: [RouterLink],
    templateUrl: './recent-conversations.html',
    styleUrl: './recent-conversations.css'
})
export class RecentConversationsComponent {
    chats = input.required<Chat[]>();

    getColor = getModelColor;
}
