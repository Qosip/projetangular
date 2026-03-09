import { Component, input, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getModelColor, AI_MODELS } from '../models/chat.models';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-topbar',
  imports: [FormsModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  title = input<string>('');
  models = input<string[]>([]);
  convId = input<string | null>(null);

  private convService = inject(ConversationService);

  isEditing = signal(false);
  editValue = '';

  getColor = getModelColor;

  getModelName(id: string): string {
    return AI_MODELS[id]?.name ?? id;
  }

  startRename() {
    this.editValue = this.title();
    this.isEditing.set(true);
  }

  saveRename() {
    const id = this.convId();
    if (id && this.editValue.trim()) {
      this.convService.renameConversation(id, this.editValue);
    }
    this.isEditing.set(false);
  }

  cancelRename() {
    this.isEditing.set(false);
  }
}
