import { Component, input, output } from '@angular/core';
import { AI_MODELS, ALL_MODEL_IDS, getModelColor } from '../models/chat.models';

@Component({
  selector: 'app-model-selector',
  template: `
    <div class="dropdown dropdown-top dropdown-end">
      <div tabindex="0" role="button"
           class="btn btn-ghost btn-xs font-mono text-[10px] uppercase tracking-wider
                  text-base-content/40 hover:text-primary gap-1 border border-[var(--border-subtle)]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Modèles ({{ activeModels().length }})
      </div>

      <div tabindex="0"
           class="dropdown-content z-50 bg-base-200 border border-[var(--border-default)]
                  rounded-xl shadow-2xl p-3 w-56 mb-2">
        <p class="font-mono text-[9px] uppercase tracking-widest text-base-content/25 mb-2 px-1">
          > agents ia_
        </p>

        <div class="space-y-1">
          @for (modelId of allModels; track modelId) {
            <button (click)="toggle(modelId)"
                    class="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg
                           text-xs font-mono transition-all duration-150 hover:bg-base-300/50"
                    [class.opacity-40]="!isActive(modelId)">
              <span class="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                    [style.background]="getColor(modelId) + '20'"
                    [style.color]="getColor(modelId)">
                {{ getIcon(modelId) }}
              </span>
              <span class="flex-1 text-left" [style.color]="isActive(modelId) ? getColor(modelId) : ''">
                {{ getName(modelId) }}
              </span>
              @if (isActive(modelId)) {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              }
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class ModelSelector {
  activeModels = input.required<string[]>();
  modelsChanged = output<string[]>();

  allModels = ALL_MODEL_IDS;
  getColor = getModelColor;

  getName(id: string): string { return AI_MODELS[id]?.name ?? id; }
  getIcon(id: string): string { return AI_MODELS[id]?.icon ?? '?'; }

  isActive(id: string): boolean {
    return this.activeModels().includes(id);
  }

  toggle(id: string) {
    const current = this.activeModels();
    if (current.includes(id)) {
      if (current.length <= 1) return; // Keep at least one
      this.modelsChanged.emit(current.filter(m => m !== id));
    } else {
      this.modelsChanged.emit([...current, id]);
    }
  }
}
