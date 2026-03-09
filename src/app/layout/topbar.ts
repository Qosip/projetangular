import { Component, input } from '@angular/core';
import { getModelColor, AI_MODELS } from '../models/chat.models';

@Component({
  selector: 'app-topbar',
  template: `
    <header class="topbar">
      <!-- Hamburger (mobile) -->
      <label for="sidebar-toggle" class="hamburger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </label>

      <!-- Title -->
      <span class="topbar-title">
        {{ title() || '&gt; terminal' }}
      </span>

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
      background: rgba(19, 19, 27, 0.85);
      backdrop-filter: blur(12px);
    }

    .hamburger {
      display: none;
      width: 32px;
      height: 32px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: rgba(232, 232, 237, 0.3);
      border-radius: 4px;
      transition: color 0.15s, background 0.15s;
      flex-shrink: 0;
    }
    .hamburger:hover {
      color: rgba(232, 232, 237, 0.6);
      background: rgba(255, 255, 255, 0.03);
    }
    .hamburger svg { width: 18px; height: 18px; }

    @media (max-width: 1023px) {
      .hamburger { display: flex; }
    }

    .topbar-title {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      letter-spacing: 0.08em;
      color: rgba(232, 232, 237, 0.3);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

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

  getColor = getModelColor;

  getModelName(id: string): string {
    return AI_MODELS[id]?.name ?? id;
  }
}
