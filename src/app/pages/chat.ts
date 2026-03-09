import { Component, inject, ElementRef, viewChild, OnInit, OnDestroy, effect, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageBubbleComponent } from '../components/message-bubble/message-bubble';
import { InputBarComponent } from '../components/input-bar/input-bar';
import { ModelSelectorComponent } from '../components/model-selector/model-selector';
import { ChatService } from '../services/chat.service';
import { StreamingService } from '../services/streaming.service';
import { getModelColor, getModelInitial } from '../models/chat.models';

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

  streamingEntries = computed(() => {
    const map = this.streamingMessages();
    return Object.entries(map).map(([author, content]) => ({ author, content }));
  });

  getColor = getModelColor;
  getInitial = getModelInitial;

  activeModels = computed(() => this.currentChat()?.models ?? []);

  private paramSub: any;

  constructor() {
    effect(() => {
      this.messages();
      this.streamingMessages();
      this.completedStreaming();
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

  private scrollToBottom() {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
