import { Component, signal, computed, inject, ElementRef, viewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBubble } from '../components/message-bubble';
import { InputBarComponent, SendMessageEvent } from '../components/input-bar.component';
import { ModelSelector } from '../components/model-selector';
import { ConversationService } from '../services/conversation.service';
import { Message } from '../models/chat.models';

@Component({
  selector: 'app-chat',
  imports: [MessageBubble, InputBarComponent, ModelSelector],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
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
