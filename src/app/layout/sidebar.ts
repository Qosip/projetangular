import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ConversationService } from '../services/conversation.service';
import { AuthService } from '../services/auth.service';
import { getModelColor } from '../models/chat.models';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="h-full bg-base-200 border-r border-[var(--border-default)] flex flex-col">
      <!-- Logo -->
      <div class="h-12 flex items-center px-4 border-b border-[var(--border-subtle)]">
        <a routerLink="/" class="font-display text-lg font-bold text-primary tracking-wide">
          ◆ NEURO<span class="text-base-content/80">TERMINAL</span>
        </a>
      </div>

      <!-- New Chat Button -->
      <div class="p-3">
        <button (click)="newChat()"
                class="btn btn-primary btn-sm w-full font-mono uppercase tracking-wider gap-2
                       hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau Chat
        </button>
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto px-2">
        <p class="px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-base-content/25">
          > conversations_
        </p>
        <ul class="menu menu-sm gap-0.5 p-0">
          @for (conv of convService.conversations(); track conv.id) {
            <li class="group">
              <a [routerLink]="['/chat', conv.id]"
                 routerLinkActive="active-conv"
                 class="font-mono text-xs truncate pr-8 relative">
                <span class="flex items-center gap-2 truncate">
                  <span class="flex gap-0.5 shrink-0">
                    @for (model of conv.models.slice(0, 3); track model) {
                      <span class="w-1.5 h-1.5 rounded-full shrink-0"
                            [style.background]="getColor(model)"></span>
                    }
                  </span>
                  <span class="truncate">{{ conv.title }}</span>
                </span>
                <!-- Delete button -->
                <button (click)="deleteConv($event, conv.id)"
                        class="absolute right-1 top-1/2 -translate-y-1/2 opacity-0
                               group-hover:opacity-100 btn btn-ghost btn-xs btn-circle
                               text-base-content/30 hover:text-error transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </a>
            </li>
          } @empty {
            <li class="px-2 py-6 text-center">
              <span class="text-[10px] text-base-content/15 font-mono block">
                Aucune conversation<br/>
                <span class="text-primary/30">Cliquez + pour commencer</span>
              </span>
            </li>
          }
        </ul>
      </div>

      <!-- Footer — user info + logout -->
      <div class="p-3 border-t border-[var(--border-subtle)]">
        <div class="flex items-center gap-2 px-1">
          <div class="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20
                      flex items-center justify-center">
            <span class="font-mono text-[10px] text-primary font-bold">
              {{ auth.user()?.avatar }}
            </span>
          </div>
          <span class="font-mono text-xs text-base-content/50 truncate flex-1">
            {{ auth.user()?.username }}
          </span>
          <button (click)="auth.logout()"
                  class="btn btn-ghost btn-xs btn-circle text-base-content/30 hover:text-error"
                  title="Déconnexion">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: `
    .active-conv {
      background: rgba(0, 255, 136, 0.06) !important;
      border-left: 2px solid #00FF88;
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
