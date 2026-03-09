import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConversationService } from '../services/conversation.service';
import { RouterLink } from '@angular/router';
import { RecentConversationsComponent } from '../components/recent-conversations/recent-conversations.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RecentConversationsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private convService = inject(ConversationService);

  username = this.auth.user;
  conversations = this.convService.conversations;



  createChat() {
    const conv = this.convService.createConversation(['claude', 'gpt-4', 'gemini']);
    this.router.navigate(['/chat', conv.id]);
  }

  createChatWithPrompt() {
    this.createChat();
  }
}
