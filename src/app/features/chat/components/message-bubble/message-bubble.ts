import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message, getModelColor, getModelInitial, getModelLogo } from '../../chat.models';
import { MarkdownPipe } from '../../../../shared/pipes/markdown.pipe';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe, MarkdownPipe],
  templateUrl: './message-bubble.html',
  styleUrl: './message-bubble.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageBubbleComponent {
  message = input.required<Message>();
  isStreaming = input(false);

  isUser = computed(() => this.message().author === 'user');

  modelColor = computed(() => getModelColor(this.message().author));

  modelLogo = computed(() => getModelLogo(this.message().author));

  modelInitial = computed(() => getModelInitial(this.message().author));

  time = computed(() => new Date(this.message().created_at));
}
