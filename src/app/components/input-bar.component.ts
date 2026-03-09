import { Component, output, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMode } from '../models/chat.models';

export interface SendMessageEvent {
  content: string;
  mode: ChatMode;
  attachment?: { type: 'image' | 'file'; name: string };
}

@Component({
  selector: 'app-input-bar',
  imports: [FormsModule],
  templateUrl: './input-bar.component.html',
  styleUrl: './input-bar.component.css'
})
export class InputBarComponent {
  disabled = input<boolean>(false);
  messageText = signal('');
  activeMode = signal<ChatMode>('normal');
  attachedFile = signal<string | null>(null);

  messageSent = output<SendMessageEvent>();

  toggleMode(mode: ChatMode) {
    this.activeMode.update(current => current === mode ? 'normal' : mode);
  }

  attachPhoto() {
    const fakeNames = ['capture_2026.png', 'screenshot.jpg', 'diagram.png', 'photo_001.jpg'];
    this.attachedFile.set(fakeNames[Math.floor(Math.random() * fakeNames.length)]);
  }

  getModeLabel(): string {
    const labels: Record<string, string> = {
      'search': '⌕ Recherche web',
      'deep-thinking': '◈ Deep Thinking',
      'creative': '✦ Mode Créatif',
    };
    return labels[this.activeMode()] ?? '';
  }

  getPlaceholder(): string {
    const p: Record<string, string> = {
      'search': '> Rechercher sur le web...',
      'deep-thinking': '> Réflexion approfondie...',
      'creative': '> Mode créatif activé...',
    };
    return p[this.activeMode()] ?? '> Message...';
  }

  onEnter(event: Event) {
    const keyEvent = event as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      keyEvent.preventDefault();
      this.send();
    }
  }

  send() {
    const text = this.messageText().trim();
    if (text || this.attachedFile()) {
      this.messageSent.emit({
        content: text || `[Image: ${this.attachedFile()}]`,
        mode: this.activeMode(),
        attachment: this.attachedFile() ? { type: 'image', name: this.attachedFile()! } : undefined,
      });
      this.messageText.set('');
      this.attachedFile.set(null);
      this.activeMode.set('normal');
    }
  }
}
