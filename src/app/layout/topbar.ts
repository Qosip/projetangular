import { Component, input } from '@angular/core';
import { getModelColor, AI_MODELS } from '../models/chat.models';

@Component({
  selector: 'app-topbar',
  template: `
    <header class="h-12 flex items-center px-4 border-b border-[var(--border-subtle)]
                   bg-base-200/80 backdrop-blur-md gap-3">
      <!-- Hamburger (mobile) -->
      <label for="sidebar-toggle"
             class="btn btn-ghost btn-sm btn-square lg:hidden text-base-content/50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      <!-- Title -->
      <h2 class="font-mono text-xs text-base-content/40 truncate flex-1 uppercase tracking-wider">
        {{ title() || '> terminal_' }}
      </h2>

      <!-- Active model badges -->
      <div class="flex items-center gap-1">
        @for (modelId of models(); track modelId) {
          <span class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px]
                       font-mono uppercase tracking-wider border border-[var(--border-subtle)]"
                [style.color]="getColor(modelId)"
                [style.border-color]="getColor(modelId) + '30'">
            <span class="w-1.5 h-1.5 rounded-full" [style.background]="getColor(modelId)"></span>
            {{ getModelName(modelId) }}
          </span>
        }
      </div>
    </header>
  `
})
export class Topbar {
  title = input<string>('');
  models = input<string[]>([]);

  getColor = getModelColor;

  getModelName(id: string): string {
    return AI_MODELS[id]?.name ?? id;
  }
}
