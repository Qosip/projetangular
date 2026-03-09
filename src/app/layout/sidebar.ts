import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConversationService } from '../services/conversation.service';
import { AuthService } from '../services/auth.service';
import { ThemeService, THEMES } from '../services/theme.service';
import { getModelColor } from '../models/chat.models';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="h-full flex flex-col" style="background: var(--surface-1); border-right: 1px solid var(--border-subtle);">

      <!-- Logo -->
      <div class="flex items-center px-4 shrink-0" style="height: 48px; border-bottom: 1px solid var(--border-subtle);">
        <a routerLink="/" class="flex items-center gap-2 group">
          <span style="color: var(--color-primary); font-size: 0.75rem;">◆</span>
          <span style="font-family: var(--font-display); font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.12em; color: var(--color-base-content);">
            NEURO<span style="color: color-mix(in srgb, var(--color-base-content) 40%, transparent);">TERMINAL</span>
          </span>
        </a>
      </div>

      <!-- New Chat -->
      <div class="px-3 py-2.5 shrink-0">
        <button (click)="newChat()"
                class="new-chat-btn w-full flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouveau Chat</span>
        </button>
      </div>

      <!-- Section header -->
      <p class="px-4 pt-1 pb-2 shrink-0" style="font-family: var(--font-mono); font-size: 0.5625rem; letter-spacing: 0.16em; color: color-mix(in srgb, var(--color-base-content) 20%, transparent); text-transform: uppercase;">
        &gt; conversations
      </p>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto px-2 pb-2">
        <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1px;">
          @for (conv of convService.conversations(); track conv.id) {
            <li class="group relative">
              <a [routerLink]="['/chat', conv.id]"
                 routerLinkActive="active-conv"
                 class="conv-item flex items-center gap-2 px-3 py-2 rounded truncate">
                <span class="flex gap-0.5 shrink-0">
                  @for (model of conv.models.slice(0, 3); track model) {
                    <span class="w-1 h-1 rounded-full"
                          [style.background]="getColor(model)"></span>
                  }
                </span>
                <span class="truncate flex-1" style="font-family: var(--font-mono); font-size: 0.6875rem; color: color-mix(in srgb, var(--color-base-content) 55%, transparent);">
                  {{ conv.title }}
                </span>
                <button (click)="deleteConv($event, conv.id)"
                        class="delete-btn shrink-0 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded"
                        style="width: 20px; height: 20px; color: color-mix(in srgb, var(--color-base-content) 20%, transparent); transition: all 0.15s;">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </a>
            </li>
          } @empty {
            <li class="py-8 text-center">
              <span style="font-family: var(--font-mono); font-size: 0.5625rem; color: color-mix(in srgb, var(--color-base-content) 12%, transparent); display: block; line-height: 1.8;">
                Aucune conversation<br>
                <span style="color: color-mix(in srgb, var(--color-primary) 25%, transparent);">↑ Commencer</span>
              </span>
            </li>
          }
        </ul>
      </div>

      <!-- Theme Picker -->
      <div class="theme-section px-4 py-2.5 shrink-0">
        <p class="theme-label">&gt; thème</p>
        <div class="theme-dots">
          @for (theme of themes; track theme.id) {
            <button
              class="theme-dot"
              [class.theme-dot--active]="themeService.currentTheme() === theme.id"
              [style.background]="theme.accent"
              [title]="theme.label"
              (click)="themeService.setTheme(theme.id)">
            </button>
          }
        </div>
      </div>

      <!-- User footer -->
      <div class="px-3 py-3 shrink-0" style="border-top: 1px solid var(--border-subtle);">
        <div class="flex items-center gap-2.5">
          <div class="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
               style="background: color-mix(in srgb, var(--color-primary) 10%, transparent); border: 1px solid color-mix(in srgb, var(--color-primary) 18%, transparent);">
            <span style="font-family: var(--font-mono); font-size: 0.5625rem; font-weight: 600; color: var(--color-primary);">
              {{ auth.user()?.avatar }}
            </span>
          </div>
          <span class="flex-1 truncate" style="font-family: var(--font-mono); font-size: 0.6875rem; color: color-mix(in srgb, var(--color-base-content) 35%, transparent);">
            {{ auth.user()?.username }}
          </span>
          <button (click)="auth.logout()"
                  title="Déconnexion"
                  class="logout-btn flex items-center justify-center rounded"
                  style="width: 22px; height: 22px; color: color-mix(in srgb, var(--color-base-content) 20%, transparent); transition: color 0.15s;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

    </aside>
  `,
  styles: `
    .new-chat-btn {
      padding: 0.45rem 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: color-mix(in srgb, var(--color-primary) 70%, transparent);
      background: color-mix(in srgb, var(--color-primary) 6%, transparent);
      border: 1px solid color-mix(in srgb, var(--color-primary) 16%, transparent);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .new-chat-btn:hover {
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      border-color: color-mix(in srgb, var(--color-primary) 32%, transparent);
      color: var(--color-primary);
      box-shadow: 0 0 14px color-mix(in srgb, var(--color-primary) 10%, transparent);
    }

    .conv-item {
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.12s ease;
    }
    .conv-item:hover {
      background: color-mix(in srgb, var(--color-base-content) 4%, transparent);
    }
    .active-conv {
      background: color-mix(in srgb, var(--color-primary) 6%, transparent) !important;
      border-left: 2px solid color-mix(in srgb, var(--color-primary) 55%, transparent);
    }
    .active-conv span {
      color: color-mix(in srgb, var(--color-base-content) 80%, transparent) !important;
    }
    .delete-btn:hover {
      color: var(--color-error) !important;
    }
    .logout-btn:hover {
      color: var(--color-error) !important;
    }

    /* ── Theme picker ── */
    .theme-section {
      border-top: 1px solid var(--border-subtle);
    }
    .theme-label {
      font-family: var(--font-mono);
      font-size: 0.5625rem;
      letter-spacing: 0.16em;
      color: color-mix(in srgb, var(--color-base-content) 18%, transparent);
      text-transform: uppercase;
      margin: 0 0 0.5rem 0;
    }
    .theme-dots {
      display: flex;
      gap: 0.45rem;
      align-items: center;
    }
    .theme-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .theme-dot:hover {
      transform: scale(1.25);
      box-shadow: 0 0 8px currentColor;
    }
    .theme-dot--active {
      border-color: var(--color-base-content);
      transform: scale(1.15);
      box-shadow: 0 0 10px currentColor;
    }
  `
})
export class Sidebar {
  convService = inject(ConversationService);
  auth = inject(AuthService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  getColor = getModelColor;
  themes = THEMES;

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
