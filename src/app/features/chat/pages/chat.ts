import { Component, inject, ElementRef, viewChild, OnInit, OnDestroy, effect, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageBubbleComponent } from '../components/message-bubble/message-bubble';
import { InputBarComponent } from '../components/input-bar/input-bar';
import { ModelSelectorComponent } from '../components/model-selector/model-selector';
import { ChatService } from '../chat.service';
import { StreamingService } from '../streaming.service';
import { getModelColor, getModelInitial, getModelLogo } from '../chat.models';

@Component({
  selector: 'app-chat',
  imports: [MessageBubbleComponent, InputBarComponent, ModelSelectorComponent],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  private streamingService = inject(StreamingService);

  messagesContainer = viewChild<ElementRef>('messagesContainer');

  messages = this.chatService.messages;
  processing = this.chatService.processing;
  currentChat = this.chatService.currentChat;
  streamingMessages = this.streamingService.streamingMessages;
  completedStreaming = this.streamingService.completedMessages;
  isStreaming = this.streamingService.isStreaming;

  activeModels = computed(() => this.currentChat()?.models ?? []);

  filteredMessages = computed(() => {
    const active = this.activeModels();
    return this.chatService.messages().filter(
      (msg) => msg.author === 'user' || active.includes(msg.author)
    );
  });

  streamingEntries = computed(() => {
    const map = this.streamingMessages();
    const active = this.activeModels();
    return Object.entries(map)
      .filter(([author]) => active.includes(author))
      .map(([author, content]) => ({ author, content }));
  });

  filteredCompletedStreaming = computed(() => {
    const active = this.activeModels();
    return this.completedStreaming().filter((e) => active.includes(e.author));
  });

  getColor = getModelColor;
  getInitial = getModelInitial;
  getLogo = getModelLogo;

  private paramSub: any;

  constructor() {
    effect(() => {
      this.filteredMessages();
      this.streamingMessages();
      this.filteredCompletedStreaming();
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  ngOnInit() {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = +(params.get('id') ?? '0');
      if (id) {
        this.chatService.loadChat(id);
        this.chatService.loadMessages(id);
      }
    });
  }

  ngOnDestroy() {
    this.paramSub?.unsubscribe();
    this.chatService.stopStreaming();
  }

  onSendMessage(content: string) {
    const chat = this.chatService.currentChat();
    if (!chat || this.processing()) return;
    this.chatService.sendMessage(chat.id, content);
  }

  onModelsChanged(models: string[]) {
    const chat = this.chatService.currentChat();
    if (!chat) return;
    this.chatService.updateChatModels(chat.id, models);
  }

  private scrollToBottom() {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
