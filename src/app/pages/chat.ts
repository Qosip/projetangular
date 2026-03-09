import { Component, signal, computed, inject, ElementRef, viewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBubble } from '../components/message-bubble';
import { InputBar, SendMessageEvent } from '../components/input-bar';
import { ModelSelector } from '../components/model-selector';
import { ConversationService } from '../services/conversation.service';
import { Message } from '../models/chat.models';

@Component({
  selector: 'app-chat',
  imports: [MessageBubble, InputBar, ModelSelector],
  template: `
    <div class="flex flex-col h-full">
      <!-- Messages area -->
      <div class="flex-1 overflow-y-auto scroll-smooth" #messagesContainer>
        <div class="max-w-[760px] mx-auto px-4 py-6 space-y-1">
          @for (msg of messages(); track msg.id) {
            <app-message-bubble [message]="msg" />
          } @empty {
            <div class="flex flex-col items-center justify-center py-32 text-center">
              <div class="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10
                          flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p class="font-mono text-sm text-base-content/25">
                > conversation initialisée<span class="cursor-blink text-primary/40">_</span>
              </p>
              <p class="font-mono text-[10px] text-base-content/12 mt-2 max-w-xs">
                Envoyez un message pour lancer la discussion entre les agents IA.
              </p>
            </div>
          }
        </div>
      </div>

      <!-- Gradient fade -->
      <div class="h-6 bg-gradient-to-t from-base-100 to-transparent pointer-events-none -mt-6 relative z-10"></div>

      <!-- Bottom bar -->
      <div class="shrink-0 px-4 pb-3">
        <div class="max-w-[760px] mx-auto flex items-center justify-between mb-1">
          <!-- Waiting indicator -->
          @if (isWaiting()) {
            <span class="waiting-indicator">
              <span class="waiting-dot"></span>
              <span class="waiting-dot"></span>
              <span class="waiting-dot"></span>
              agents en réflexion...
            </span>
          } @else {
            <span></span>
          }
          <app-model-selector
            [activeModels]="activeModels()"
            (modelsChanged)="onModelsChanged($event)" />
        </div>
        <app-input-bar
          [disabled]="isWaiting()"
          (messageSent)="onSendMessage($event)" />
      </div>
    </div>
  `,
  styles: `
    .waiting-indicator {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--font-mono);
      font-size: 0.5625rem;
      letter-spacing: 0.1em;
      color: rgba(232, 232, 237, 0.2);
      text-transform: uppercase;
    }
    .waiting-dot {
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(0, 255, 136, 0.4);
      animation: wdot 1.2s ease-in-out infinite;
    }
    .waiting-dot:nth-child(2) { animation-delay: 0.2s; }
    .waiting-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes wdot {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.7); }
      40%            { opacity: 1;   transform: scale(1); }
    }
  `
})
export class Chat implements OnInit, OnDestroy {
  messagesContainer = viewChild<ElementRef>('messagesContainer');
  isWaiting = signal(false);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private convService = inject(ConversationService);

  convId = signal<string>('');

  messages = computed(() => {
    const id = this.convId();
    if (!id) return [];
    return this.convService.getMessages(id);
  });

  activeModels = computed(() => {
    const id = this.convId();
    if (!id) return ['claude', 'gpt-4', 'gemini'];
    const conv = this.convService.getConversation(id);
    return conv?.models ?? ['claude', 'gpt-4', 'gemini'];
  });

  private paramSub: any;

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id') ?? '';
      this.convId.set(id);

      // If conversation doesn't exist, it was probably navigated to via new chat
      const conv = this.convService.getConversation(id);
      if (!conv) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
  }

  onModelsChanged(models: string[]) {
    this.convService.updateModels(this.convId(), models);
  }

  onSendMessage(event: SendMessageEvent) {
    const id = this.convId();
    if (!id || this.isWaiting()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      conversationId: id,
      content: event.content,
      author: { type: 'user', name: 'Vous' },
      timestamp: new Date(),
      mode: event.mode,
      attachment: event.attachment,
    };

    this.convService.addMessage(id, userMsg);
    setTimeout(() => this.scrollToBottom(), 50);

    // System messages for special modes
    if (event.mode === 'search') {
      setTimeout(() => {
        this.convService.addMessage(id, {
          id: `sys-${Date.now()}`,
          conversationId: id,
          content: '⌕ Recherche web — 3 sources trouvées',
          author: { type: 'system', name: 'System' },
          timestamp: new Date(),
        });
        this.scrollToBottom();
      }, 500);
    } else if (event.mode === 'deep-thinking') {
      setTimeout(() => {
        this.convService.addMessage(id, {
          id: `sys-${Date.now()}`,
          conversationId: id,
          content: '◈ Deep Thinking activé — analyse en cours',
          author: { type: 'system', name: 'System' },
          timestamp: new Date(),
        });
        this.scrollToBottom();
      }, 300);
    }

    // Lock input while AI is responding
    this.isWaiting.set(true);
    const maxDelay = this.convService.simulateAiResponses(id, event.content, this.activeModels());
    setTimeout(() => {
      this.isWaiting.set(false);
      this.scrollToBottom();
    }, maxDelay + 200);

    // Auto-scroll during generation
    const scrollInterval = setInterval(() => this.scrollToBottom(), 400);
    setTimeout(() => clearInterval(scrollInterval), maxDelay + 500);
  }

  private scrollToBottom() {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
