import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col items-center justify-center h-full gap-8 p-8">
      <div class="text-center max-w-md">
        <h1 class="font-display text-4xl font-bold mb-4">
          Bienvenue, <span class="text-primary">Opérateur</span>
        </h1>
        <p class="font-body text-base-content/60 text-lg">
          Initiez une conversation de groupe avec vos agents IA.
        </p>
      </div>

      <button class="btn btn-primary btn-lg font-mono uppercase tracking-wider gap-2"
              (click)="createChat()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Nouveau Chat
      </button>

      <!-- Quick prompts -->
      <div class="flex flex-wrap gap-3 max-w-lg justify-center">
        <button class="btn btn-ghost btn-sm font-mono text-xs border border-base-300"
                (click)="createChat()">
          "Comparez vos réponses sur..."
        </button>
        <button class="btn btn-ghost btn-sm font-mono text-xs border border-base-300"
                (click)="createChat()">
          "Débattez de l'IA générative"
        </button>
        <button class="btn btn-ghost btn-sm font-mono text-xs border border-base-300"
                (click)="createChat()">
          "Expliquez-moi le machine learning"
        </button>
      </div>
    </div>
  `
})
export class Home {
  constructor(private router: Router) {}

  createChat() {
    // Pour l'instant, navigation vers un chat de démo
    this.router.navigate(['/chat', '1']);
  }
}
