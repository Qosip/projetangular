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
  template: `
    <div class="input-bar-root">
      <div class="input-bar-inner">

        <!-- Attachment preview -->
        @if (attachedFile()) {
          <div class="attachment-preview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="attachment-name">{{ attachedFile() }}</span>
            <button class="attachment-remove" (click)="attachedFile.set(null)">✕</button>
          </div>
        }

        <!-- Mode badge -->
        @if (activeMode() !== 'normal') {
          <div class="mode-badge-row">
            <span class="mode-badge" [class]="'mode-badge--' + activeMode()">
              {{ getModeLabel() }}
            </span>
            <button class="mode-cancel" (click)="activeMode.set('normal')">annuler</button>
          </div>
        }

        <!-- Main input container -->
        <div class="input-container" [class]="'input-container--' + activeMode()" [class.input-container--locked]="disabled()">

          <!-- Action icons -->
          <div class="action-icons">
            <button class="icon-btn" title="Joindre" (click)="attachPhoto()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>

            <button class="icon-btn" title="Recherche web"
                    [class.icon-btn--active-accent]="activeMode() === 'search'"
                    (click)="toggleMode('search')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button class="icon-btn" title="Deep thinking"
                    [class.icon-btn--active-warning]="activeMode() === 'deep-thinking'"
                    (click)="toggleMode('deep-thinking')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>

            <button class="icon-btn" title="Créatif"
                    [class.icon-btn--active-secondary]="activeMode() === 'creative'"
                    (click)="toggleMode('creative')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </button>
          </div>

          <!-- Textarea -->
          <textarea
            class="message-textarea"
            [placeholder]="disabled() ? '> agents en réflexion...' : getPlaceholder()"
            [(ngModel)]="messageText"
            (keydown.enter)="onEnter($event)"
            [disabled]="disabled()"
            rows="1">
          </textarea>

          <!-- Send button -->
          <button
            class="send-btn"
            [class.send-btn--active]="(messageText().trim() || attachedFile()) && !disabled()"
            [disabled]="(!messageText().trim() && !attachedFile()) || disabled()"
            (click)="send()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

        <p class="input-hint">↵ envoyer &nbsp;·&nbsp; Shift+↵ retour ligne</p>

      </div>
    </div>
  `,
  styles: `
    .input-bar-root {
      border-top: 1px solid var(--border-subtle);
      padding: 0.75rem 1rem 0.75rem;
    }
    .input-bar-inner {
      max-width: 760px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    /* ── Attachment ── */
    .attachment-preview {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.6rem;
      background: color-mix(in srgb, var(--color-base-content) 3%, transparent);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      color: color-mix(in srgb, var(--color-base-content) 40%, transparent);
    }
    .attachment-preview svg { width: 14px; height: 14px; color: color-mix(in srgb, var(--color-primary) 40%, transparent); }
    .attachment-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .attachment-remove {
      background: none; border: none; cursor: pointer;
      color: color-mix(in srgb, var(--color-base-content) 20%, transparent); font-size: 0.625rem;
      transition: color 0.15s;
    }
    .attachment-remove:hover { color: color-mix(in srgb, var(--color-error) 60%, transparent); }

    .input-container--locked {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .input-container--locked .message-textarea {
      cursor: not-allowed;
    }

    /* ── Mode badge ── */
    .mode-badge-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .mode-badge {
      font-family: var(--font-mono);
      font-size: 0.5625rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 99px;
      border: 1px solid;
    }
    .mode-badge--search   { color: var(--color-info); border-color: color-mix(in srgb, var(--color-info) 25%, transparent); background: color-mix(in srgb, var(--color-info) 6%, transparent); }
    .mode-badge--deep-thinking { color: var(--color-warning); border-color: color-mix(in srgb, var(--color-warning) 25%, transparent); background: color-mix(in srgb, var(--color-warning) 6%, transparent); }
    .mode-badge--creative { color: var(--color-secondary); border-color: color-mix(in srgb, var(--color-secondary) 25%, transparent); background: color-mix(in srgb, var(--color-secondary) 6%, transparent); }
    .mode-cancel {
      background: none; border: none; cursor: pointer;
      font-family: var(--font-mono); font-size: 0.5625rem;
      color: color-mix(in srgb, var(--color-base-content) 20%, transparent);
      transition: color 0.15s;
    }
    .mode-cancel:hover { color: color-mix(in srgb, var(--color-base-content) 50%, transparent); }

    /* ── Input container ── */
    .input-container {
      display: flex;
      align-items: flex-end;
      gap: 0.375rem;
      background: color-mix(in srgb, var(--color-base-content) 2%, transparent);
      border: 1px solid var(--border-default);
      border-radius: 6px;
      padding: 0.4rem 0.4rem 0.4rem 0.5rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-container:focus-within {
      border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 5%, transparent), 0 0 16px color-mix(in srgb, var(--color-primary) 8%, transparent);
    }
    .input-container--search:focus-within {
      border-color: color-mix(in srgb, var(--color-info) 30%, transparent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-info) 5%, transparent);
    }
    .input-container--deep-thinking:focus-within {
      border-color: color-mix(in srgb, var(--color-warning) 30%, transparent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-warning) 5%, transparent);
    }

    /* ── Action icons ── */
    .action-icons {
      display: flex;
      align-items: center;
      gap: 0;
      padding-bottom: 2px;
    }
    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: none;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: color-mix(in srgb, var(--color-base-content) 20%, transparent);
      transition: color 0.15s, background 0.15s;
    }
    .icon-btn svg { width: 14px; height: 14px; }
    .icon-btn:hover { color: color-mix(in srgb, var(--color-base-content) 50%, transparent); background: color-mix(in srgb, var(--color-base-content) 3%, transparent); }
    .icon-btn--active-accent  { color: var(--color-info) !important; }
    .icon-btn--active-warning { color: var(--color-warning) !important; }
    .icon-btn--active-secondary { color: var(--color-secondary) !important; }

    /* ── Textarea ── */
    .message-textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--color-base-content);
      min-height: 36px;
      max-height: 200px;
      padding: 0.3rem 0;
    }
    .message-textarea::placeholder {
      color: color-mix(in srgb, var(--color-base-content) 15%, transparent);
    }

    /* ── Send button ── */
    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      background: color-mix(in srgb, var(--color-base-content) 4%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-base-content) 8%, transparent);
      color: color-mix(in srgb, var(--color-base-content) 20%, transparent);
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .send-btn svg { width: 13px; height: 13px; }
    .send-btn--active {
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
      color: var(--color-primary);
    }
    .send-btn--active:hover {
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
      box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary) 12%, transparent);
    }
    .send-btn:disabled {
      cursor: not-allowed;
    }

    /* ── Hint ── */
    .input-hint {
      font-family: var(--font-mono);
      font-size: 0.5rem;
      letter-spacing: 0.06em;
      color: color-mix(in srgb, var(--color-base-content) 10%, transparent);
      text-align: center;
      margin: 0;
    }
  `
})
export class InputBar {
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
