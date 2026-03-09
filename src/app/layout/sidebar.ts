import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="h-full bg-base-200 border-r border-[var(--border-default)] flex flex-col">
      <!-- Logo -->
      <div class="h-12 flex items-center px-4 border-b border-[var(--border-subtle)]">
        <a routerLink="/" class="font-display text-lg font-bold text-primary tracking-wide">
          ◆ NEURO<span class="text-base-content">TERMINAL</span>
        </a>
      </div>

      <!-- New Chat Button -->
      <div class="p-3">
        <a routerLink="/"
           class="btn btn-primary btn-sm w-full font-mono uppercase tracking-wider gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau Chat
        </a>
      </div>

      <!-- Conversations List -->
      <div class="flex-1 overflow-y-auto px-2">
        <p class="px-2 py-2 font-mono text-[10px] uppercase tracking-widest text-base-content/30">
          Conversations
        </p>
        <ul class="menu menu-sm gap-0.5">
          @for (conv of conversations(); track conv.id) {
            <li>
              <a [routerLink]="['/chat', conv.id]"
                 routerLinkActive="active"
                 class="font-mono text-xs truncate">
                {{ conv.title }}
              </a>
            </li>
          } @empty {
            <li class="px-2 py-4 text-center">
              <span class="text-xs text-base-content/20 font-mono">Aucune conversation</span>
            </li>
          }
        </ul>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-[var(--border-subtle)]">
        <div class="flex items-center gap-2 px-2">
          <div class="w-7 h-7 rounded-lg bg-base-300 flex items-center justify-center">
            <span class="font-mono text-xs text-primary">OP</span>
          </div>
          <span class="font-mono text-xs text-base-content/60 truncate">Opérateur</span>
        </div>
      </div>
    </aside>
  `
})
export class Sidebar {
  conversations = signal([
    { id: '1', title: 'Débat sur l\'IA générative' },
    { id: '2', title: 'Comparaison des modèles' },
  ]);
}
