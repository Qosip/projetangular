import { Component, inject, OnInit, effect, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ModelService } from '../services/model.service';
import { getModelColor } from '../models/chat.models';
import { ThemePickerComponent } from '../components/theme-picker/theme-picker';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ThemePickerComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit {
  chatService = inject(ChatService);
  auth = inject(AuthService);
  modelService = inject(ModelService);
  private router = inject(Router);

  getColor = getModelColor;
  showModelPicker = signal(false);
  selectedModels = signal<string[]>([]);

  constructor() {
    effect(() => {
      const chat = this.chatService.currentChat();
      if (chat) {
        this.router.navigate(['/chat', chat.id]);
      }
    });
  }

  ngOnInit() {
    this.chatService.loadChats();
    this.modelService.loadModels();
  }

  openNewChat() {
    const models = this.modelService.models();
    const defaults = models.length > 0
      ? models.slice(0, 2).map(m => m.id)
      : ['gpt-4', 'claude-3'];
    this.selectedModels.set(defaults);
    this.showModelPicker.set(true);
  }

  toggleModel(id: string) {
    const current = this.selectedModels();
    if (current.includes(id)) {
      if (current.length <= 1) return;
      this.selectedModels.set(current.filter(m => m !== id));
    } else {
      this.selectedModels.set([...current, id]);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedModels().includes(id);
  }

  confirmNewChat() {
    this.chatService.createChat(this.selectedModels());
    this.showModelPicker.set(false);
  }

  cancelNewChat() {
    this.showModelPicker.set(false);
  }
}
