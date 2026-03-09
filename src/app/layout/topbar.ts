import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  template: `
    <header class="h-12 flex items-center px-4 border-b border-[var(--border-subtle)] bg-base-200/50 backdrop-blur-sm gap-3">
      <!-- Hamburger (mobile) -->
      <label for="sidebar-toggle" class="btn btn-ghost btn-sm btn-square lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      <!-- Conversation title -->
      <h2 class="font-mono text-sm text-base-content/60 truncate flex-1">
        Chat de groupe
      </h2>

      <!-- Model chips placeholder -->
      <div class="flex items-center gap-1.5">
        <span class="badge badge-xs" style="background: var(--model-claude)"></span>
        <span class="badge badge-xs" style="background: var(--model-gpt)"></span>
        <span class="badge badge-xs" style="background: var(--model-gemini)"></span>
      </div>
    </header>
  `
})
export class Topbar {}
