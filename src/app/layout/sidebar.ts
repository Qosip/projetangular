import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConversationService } from '../services/conversation.service';
import { AuthService } from '../services/auth.service';
import { getModelColor } from '../models/chat.models';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="h-full flex flex-col" style="background: var(--surface-1); border-right: 1px solid var(--border-subtle);">

      <!-- Logo -->
      <div class="flex items-center px-4 shrink-0" style="height: 48px; border-bottom: 1px solid var(--border-subtle);">
        <a routerLink="/" class="flex items-center gap-2 group">
          <span style="color: #00FF88; font-size: 0.75rem;">◆</span>
          <span style="font-family: var(--font-display); font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.12em; color: #E8E8ED;">
            NEURO<span style="color: rgba(232,232,237,0.4);">TERMINAL</span>
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
      <p class="px-4 pt-1 pb-2 shrink-0" style="font-family: var(--font-mono); font-size: 0.5625rem; letter-spacing: 0.16em; color: rgba(232,232,237,0.2); text-transform: uppercase;">
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
                <!-- Model dots -->
                <span class="flex gap-0.5 shrink-0">
                  @for (model of conv.models.slice(0, 3); track model) {
                    <span class="w-1 h-1 rounded-full"
                          [style.background]="getColor(model)"></span>
                  }
                </span>
                <span class="truncate flex-1" style="font-family: var(--font-mono); font-size: 0.6875rem; color: rgba(232,232,237,0.55);">
                  {{ conv.title }}
                </span>
                <!-- Delete -->
                <button (click)="deleteConv($event, conv.id)"
                        class="delete-btn shrink-0 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded"
                        style="width: 20px; height: 20px; color: rgba(232,232,237,0.2); transition: all 0.15s;">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </a>
            </li>
          } @empty {
            <li class="py-8 text-center">
              <span style="font-family: var(--font-mono); font-size: 0.5625rem; color: rgba(232,232,237,0.12); display: block; line-height: 1.8;">
                Aucune conversation<br>
                <span style="color: rgba(0,255,136,0.2);">↑ Commencer</span>
              </span>
            </li>
          }
        </ul>
      </div>

      <!-- User footer -->
      <div class="px-3 py-3 shrink-0" style="border-top: 1px solid var(--border-subtle);">
        <div class="flex items-center gap-2.5">
          <div class="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
               style="background: rgba(0,255,136,0.08); border: 1px solid rgba(0,255,136,0.15);">
            <span style="font-family: var(--font-mono); font-size: 0.5625rem; font-weight: 600; color: #00FF88;">
              {{ auth.user()?.avatar }}
            </span>
          </div>
          <span class="flex-1 truncate" style="font-family: var(--font-mono); font-size: 0.6875rem; color: rgba(232,232,237,0.35);">
            {{ auth.user()?.username }}
          </span>
          <button (click)="auth.logout()"
                  title="Déconnexion"
                  class="logout-btn flex items-center justify-center rounded"
                  style="width: 22px; height: 22px; color: rgba(232,232,237,0.2); transition: color 0.15s;">
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
      color: rgba(0, 255, 136, 0.7);
      background: rgba(0, 255, 136, 0.05);
      border: 1px solid rgba(0, 255, 136, 0.15);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .new-chat-btn:hover {
      background: rgba(0, 255, 136, 0.08);
      border-color: rgba(0, 255, 136, 0.3);
      color: #00FF88;
      box-shadow: 0 0 14px rgba(0, 255, 136, 0.1);
    }

    .conv-item {
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.12s ease;
    }
    .conv-item:hover {
      background: rgba(255, 255, 255, 0.03);
    }
    .active-conv {
      background: rgba(0, 255, 136, 0.05) !important;
      border-left: 2px solid rgba(0, 255, 136, 0.5);
    }
    .active-conv span {
      color: rgba(232, 232, 237, 0.8) !important;
    }

    .delete-btn:hover {
      color: rgba(255, 59, 92, 0.6) !important;
    }

    .logout-btn:hover {
      color: rgba(255, 59, 92, 0.5) !important;
    }
  `
})
export class Sidebar {
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
