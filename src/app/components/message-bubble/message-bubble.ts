import { Component, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message, getModelColor, getModelInitial } from '../../models/chat.models';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css'
})
export class MessageBubbleComponent {
  message = input.required<Message>();
  isStreaming = input(false);

  isUser = computed(() => this.message().author === 'user');

  modelColor = computed(() => getModelColor(this.message().author));

  modelInitial = computed(() => getModelInitial(this.message().author));

  time = computed(() => new Date(this.message().created_at));
}
