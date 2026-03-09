import { Component, input, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getModelColor, AI_MODELS } from '../models/chat.models';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-topbar',
  imports: [FormsModule],
  template: `
    <header class="topbar">
      <!-- Hamburger (mobile) -->
      <label for="sidebar-toggle" class="hamburger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      <!-- Title (editable when in a conversation) -->
      <div class="title-area">
        @if (convId() && isEditing()) {
          <input
            class="title-input"
            [(ngModel)]="editValue"
            (blur)="saveRename()"
            (keydown.enter)="saveRename()"
            (keydown.escape)="cancelRename()"
            #titleInput
            maxlength="60"
            autofocus />
        } @else if (convId() && title()) {
          <button class="title-btn" (click)="startRename()" title="Renommer">
            <span class="title-text">{{ title() }}</span>
            <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        } @else {
          <span class="title-placeholder">&gt; terminal</span>
        }
      </div>

      <!-- Active model chips -->
      <div class="model-chips">
        @for (modelId of models(); track modelId) {
          <span class="model-chip" [style.color]="getColor(modelId)" [style.border-color]="getColor(modelId) + '25'">
            <span class="model-dot" [style.background]="getColor(modelId)"></span>
            {{ getModelName(modelId) }}
          </span>
        }
      </div>
    </header>
  `,
  styles: `
    .topbar {
      height: 48px;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      gap: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
      background: color-mix(in srgb, var(--color-base-200) 85%, transparent);
      backdrop-filter: blur(12px);
    }

    .hamburger {
      display: none;
      width: 32px;
      height: 32px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: color-mix(in srgb, var(--color-base-content) 40%, transparent);
      border-radius: 4px;
      transition: color 0.15s, background 0.15s;
      flex-shrink: 0;
    }
    .hamburger:hover {
      color: color-mix(in srgb, var(--color-base-content) 75%, transparent);
      background: color-mix(in srgb, var(--color-base-content) 5%, transparent);
    }
    .hamburger svg { width: 18px; height: 18px; }
    @media (max-width: 1023px) { .hamburger { display: flex; } }

    /* ── Title area ── */
    .title-area {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      min-width: 0;
    }

    .title-btn {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: none;
      border: none;
      padding: 0.25rem 0.35rem;
      margin-left: -0.35rem;
      border-radius: 3px;
      cursor: pointer;
      max-width: 100%;
      transition: background 0.15s;
      min-width: 0;
    }
    .title-btn:hover { background: color-mix(in srgb, var(--color-base-content) 4%, transparent); }
    .title-btn:hover .edit-icon { opacity: 1; }

    .title-text {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      letter-spacing: 0.05em;
      color: color-mix(in srgb, var(--color-base-content) 65%, transparent);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.15s;
    }
    .title-btn:hover .title-text { color: color-mix(in srgb, var(--color-base-content) 90%, transparent); }

    .edit-icon {
      width: 11px;
      height: 11px;
      color: color-mix(in srgb, var(--color-primary) 50%, transparent);
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.15s;
    }

    .title-input {
      flex: 1;
      background: color-mix(in srgb, var(--color-primary) 4%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: 3px;
      padding: 0.2rem 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      letter-spacing: 0.04em;
      color: color-mix(in srgb, var(--color-base-content) 90%, transparent);
      outline: none;
      width: 100%;
      min-width: 0;
    }
    .title-input:focus {
      border-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 8%, transparent);
    }

    .title-placeholder {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      letter-spacing: 0.08em;
      color: color-mix(in srgb, var(--color-base-content) 25%, transparent);
    }

    /* ── Model chips ── */
    .model-chips {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      flex-shrink: 0;
    }
    .model-chip {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      border: 1px solid;
      font-family: var(--font-mono);
      font-size: 0.5625rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .model-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  `
})
export class Topbar {
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
