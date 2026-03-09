import { Component, output, signal } from '@angular/core';
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
  template: `
    <div class="border-t border-[var(--border-subtle)] bg-base-100 pt-3">
      <div class="max-w-[760px] mx-auto">

        <!-- Attachment preview -->
        @if (attachedFile()) {
          <div class="flex items-center gap-2 mb-2 px-2 py-1.5 bg-base-300/50 rounded-lg
                      border border-[var(--border-subtle)] text-xs font-mono">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="truncate text-base-content/60">{{ attachedFile() }}</span>
            <button (click)="attachedFile.set(null)"
                    class="btn btn-ghost btn-xs btn-circle text-base-content/30 hover:text-error ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }

        <!-- Mode indicator -->
        @if (activeMode() !== 'normal') {
          <div class="flex items-center gap-2 mb-2 px-2">
            <span class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px]
                         font-mono uppercase tracking-wider border"
                  [class]="getModeClasses()">
              {{ getModeLabel() }}
            </span>
            <button (click)="activeMode.set('normal')"
                    class="text-[10px] text-base-content/30 hover:text-base-content/60 font-mono">
              annuler
            </button>
          </div>
        }

        <!-- Main input area -->
        <div class="flex items-end gap-2 bg-base-200 rounded-xl border transition-all duration-300 p-2"
             [class]="getInputBorderClass()">
          <!-- Feature buttons -->
          <div class="flex items-center gap-0.5 shrink-0 pb-0.5">
            <button (click)="attachPhoto()"
                    class="btn btn-ghost btn-xs btn-circle text-base-content/30 hover:text-primary"
                    title="Joindre une image">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button (click)="toggleMode('search')"
                    class="btn btn-ghost btn-xs btn-circle transition-colors"
                    [class.text-accent]="activeMode() === 'search'"
                    [class.text-base-content/30]="activeMode() !== 'search'"
                    title="Mode recherche">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button (click)="toggleMode('deep-thinking')"
                    class="btn btn-ghost btn-xs btn-circle transition-colors"
                    [class.text-warning]="activeMode() === 'deep-thinking'"
                    [class.text-base-content/30]="activeMode() !== 'deep-thinking'"
                    title="Deep thinking">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>

            <button (click)="toggleMode('creative')"
                    class="btn btn-ghost btn-xs btn-circle transition-colors"
                    [class.text-secondary]="activeMode() === 'creative'"
                    [class.text-base-content/30]="activeMode() !== 'creative'"
                    title="Mode créatif">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </button>
          </div>

          <textarea
            class="textarea textarea-ghost flex-1 resize-none min-h-[40px] max-h-[200px]
                   font-mono text-sm leading-relaxed bg-transparent border-0 focus:outline-none
                   focus:shadow-none placeholder:text-base-content/15"
            [placeholder]="getPlaceholder()"
            [(ngModel)]="messageText"
            (keydown.enter)="onEnter($event)"
            rows="1"
          ></textarea>

          <button
            class="btn btn-primary btn-sm btn-circle shrink-0 mb-0.5"
            [disabled]="!messageText().trim() && !attachedFile()"
            (click)="send()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

        <p class="text-[9px] font-mono text-base-content/15 text-center mt-1.5">
          Entrée envoyer · Shift+Entrée retour ligne
        </p>
      </div>
    </div>
  `
})
export class InputBar {
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
      'search': 'Recherche web',
      'deep-thinking': 'Deep Thinking',
      'creative': 'Mode Créatif',
    };
    return labels[this.activeMode()] ?? '';
  }

  getModeClasses(): string {
    const classes: Record<string, string> = {
      'search': 'text-accent border-accent/30 bg-accent/5',
      'deep-thinking': 'text-warning border-warning/30 bg-warning/5',
      'creative': 'text-secondary border-secondary/30 bg-secondary/5',
    };
    return classes[this.activeMode()] ?? '';
  }

  getInputBorderClass(): string {
    const classes: Record<string, string> = {
      'search': 'border-accent/20 shadow-[0_0_15px_rgba(91,141,239,0.06)]',
      'deep-thinking': 'border-warning/20 shadow-[0_0_15px_rgba(255,184,0,0.06)]',
      'creative': 'border-secondary/20 shadow-[0_0_15px_rgba(139,139,158,0.06)]',
    };
    return classes[this.activeMode()] ?? 'border-[var(--border-default)] focus-within:border-primary/30 focus-within:shadow-[0_0_20px_rgba(0,255,136,0.06)]';
  }

  getPlaceholder(): string {
    const placeholders: Record<string, string> = {
      'search': '> Rechercher sur le web...',
      'deep-thinking': '> Réflexion approfondie...',
      'creative': '> Laissez libre cours à la créativité...',
    };
    return placeholders[this.activeMode()] ?? '> Tapez votre message...';
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
