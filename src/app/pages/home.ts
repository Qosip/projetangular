import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';
import { ModelService } from '../services/model.service';
import { RecentConversationsComponent } from '../components/recent-conversations/recent-conversations';

@Component({
  selector: 'app-home',
  imports: [RecentConversationsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  auth = inject(AuthService);
  chatService = inject(ChatService);
  modelService = inject(ModelService);

  chats = this.chatService.chats;

  createChat() {
    const models = this.modelService.models();
    const defaultModels = models.length > 0
      ? models.slice(0, 2).map(m => m.id)
      : ['gpt-4', 'claude-3'];

    this.chatService.createChat(defaultModels);
  }
}
