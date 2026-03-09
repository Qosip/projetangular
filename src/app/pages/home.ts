import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConversationService } from '../services/conversation.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="home-root">

      <!-- Central content -->
      <div class="home-center">

        <!-- Greeting -->
        <div class="home-header">
          <div class="home-symbol">◆</div>
          <h1 class="home-title">
            Bonjour, <span class="home-username">{{ username()?.username ?? 'Opérateur' }}</span>
          </h1>
          <p class="home-subtitle">
            Initiez une discussion de groupe avec vos agents IA.
          </p>
        </div>

        <!-- New chat CTA -->
        <button class="new-chat-cta" (click)="createChat()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"/>
          </svg>
          <span>Nouveau Chat</span>
        </button>

        <!-- Quick prompts -->
        <div class="quick-prompts">
          <button class="prompt-chip" (click)="createChatWithPrompt()">
            Comparez vos réponses sur un sujet
          </button>
          <button class="prompt-chip" (click)="createChatWithPrompt()">
            Débattez de l'IA générative
          </button>
          <button class="prompt-chip" (click)="createChatWithPrompt()">
            Expliquez le machine learning
          </button>
        </div>

        <!-- Recent conversations -->
        @if (conversations().length > 0) {
          <div class="recent-section">
            <p class="recent-label">&gt; conversations récentes</p>
            <div class="recent-list">
              @for (conv of conversations().slice(0, 4); track conv.id) {
                <a [routerLink]="['/chat', conv.id]" class="recent-item">
                  <div class="recent-dots">
                    @for (model of conv.models.slice(0, 3); track model) {
                      <span class="recent-dot" [style.background]="getModelColor(model)"></span>
                    }
                  </div>
                  <span class="recent-title">{{ conv.title }}</span>
                  <svg class="recent-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              }
            </div>
          </div>
        }

      </div>

      <!-- Bottom hint -->
      <p class="home-hint">&gt; neural gateway v1.0<span class="cursor-blink">_</span></p>

    </div>
  `,
  styles: `
    .home-root {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      padding: 2rem 1rem;
      position: relative;
    }

    .home-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
      max-width: 480px;
      animation: fade-up 0.5s ease both;
    }
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Header ── */
    .home-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .home-symbol {
      font-size: 1rem;
      color: rgba(0, 255, 136, 0.4);
      margin-bottom: 0.25rem;
    }
    .home-title {
      font-family: var(--font-display);
      font-size: 1.75rem;
      font-weight: 600;
      color: #E8E8ED;
      margin: 0;
      letter-spacing: -0.01em;
    }
    .home-username {
      color: #00FF88;
    }
    .home-subtitle {
      font-family: var(--font-body);
      font-size: 0.875rem;
      color: rgba(232, 232, 237, 0.35);
      margin: 0;
    }

    /* ── CTA button ── */
    .new-chat-cta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.5rem;
      background: transparent;
      border: 1px solid rgba(0, 255, 136, 0.3);
      border-radius: 4px;
      color: #00FF88;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .new-chat-cta svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
    .new-chat-cta::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 255, 136, 0.06);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.2s ease;
    }
    .new-chat-cta:hover::before { transform: scaleX(1); }
    .new-chat-cta:hover {
      border-color: rgba(0, 255, 136, 0.55);
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.12);
    }

    /* ── Quick prompts ── */
    .quick-prompts {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }
    .prompt-chip {
      padding: 0.35rem 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.625rem;
      letter-spacing: 0.04em;
      color: rgba(232, 232, 237, 0.3);
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .prompt-chip:hover {
      color: rgba(232, 232, 237, 0.6);
      border-color: rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
    }

    /* ── Recent conversations ── */
    .recent-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .recent-label {
      font-family: var(--font-mono);
      font-size: 0.5625rem;
      letter-spacing: 0.15em;
      color: rgba(232, 232, 237, 0.18);
      text-transform: uppercase;
      margin: 0;
    }
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .recent-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.55rem 0.6rem;
      border-radius: 4px;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .recent-item:hover {
      border-color: rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.02);
    }
    .recent-dots {
      display: flex;
      gap: 3px;
      flex-shrink: 0;
    }
    .recent-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
    }
    .recent-title {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      color: rgba(232, 232, 237, 0.45);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .recent-item:hover .recent-title {
      color: rgba(232, 232, 237, 0.7);
    }
    .recent-arrow {
      width: 12px;
      height: 12px;
      color: rgba(232, 232, 237, 0.15);
      flex-shrink: 0;
      transition: transform 0.15s, color 0.15s;
    }
    .recent-item:hover .recent-arrow {
      transform: translateX(2px);
      color: rgba(0, 255, 136, 0.4);
    }

    /* ── Bottom hint ── */
    .home-hint {
      position: absolute;
      bottom: 1rem;
      font-family: var(--font-mono);
      font-size: 0.5625rem;
      letter-spacing: 0.1em;
      color: rgba(232, 232, 237, 0.1);
      margin: 0;
    }

    /* ── Cursor blink ── */
    .cursor-blink {
      animation: blink 1s step-end infinite;
      color: rgba(0, 255, 136, 0.3);
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `
})
export class Home {
  private router = inject(Router);
  private auth = inject(AuthService);
  private convService = inject(ConversationService);

  username = this.auth.user;
  conversations = this.convService.conversations;

  getModelColor(modelId: string): string {
    const colors: Record<string, string> = {
      'claude': 'var(--model-claude)',
      'gpt-4': 'var(--model-gpt)',
      'gemini': 'var(--model-gemini)',
      'mistral': 'var(--model-mistral)',
      'llama': 'var(--model-llama)',
      'deepseek': 'var(--model-deepseek)',
    };
    return colors[modelId] ?? 'var(--model-custom)';
  }

  createChat() {
    const conv = this.convService.createConversation(['claude', 'gpt-4', 'gemini']);
    this.router.navigate(['/chat', conv.id]);
  }

  createChatWithPrompt() {
    this.createChat();
  }
}
