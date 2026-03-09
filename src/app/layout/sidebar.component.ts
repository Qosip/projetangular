import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConversationService } from '../services/conversation.service';
import { AuthService } from '../services/auth.service';
import { getModelColor } from '../models/chat.models';
import { ThemePickerComponent } from '../components/theme-picker/theme-picker.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ThemePickerComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  convService = inject(ConversationService);
  auth = inject(AuthService);
  private router = inject(Router);

  getColor = getModelColor;

  newChat() {
    const conv = this.convService.createConversation(['claude', 'gpt-4', 'gemini']);
    this.router.navigate(['/chat', conv.id]);
  }

  deleteConv(event: Event, id: string) {
    event.preventDefault();
    event.stopPropagation();
    this.convService.deleteConversation(id);
    this.router.navigate(['/']);
  }
}
