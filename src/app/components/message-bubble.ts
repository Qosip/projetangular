import { Component, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message, getModelColor } from '../models/chat.models';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe],
  template: `
    @if (message().author.type === 'user') {
      <!-- User message -->
      <div class="chat chat-end">
        <div class="chat-header mb-1">
          <span class="font-mono text-xs text-base-content/40">
            {{ message().author.name }}
          </span>
          <span class="text-[10px] text-base-content/20 font-mono ml-2">
            {{ message().timestamp | date:'HH:mm' }}
          </span>
        </div>
        <div class="chat-bubble bg-primary text-primary-content font-body leading-relaxed">
          {{ message().content }}
        </div>
      </div>
    } @else {
      <!-- AI message -->
      <div class="chat chat-start" [style.--model-color]="modelColor()">
        <div class="chat-image avatar">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold"
               [style.background]="modelColor() + '20'"
               [style.color]="modelColor()"
               [style.box-shadow]="'0 0 10px ' + modelColor() + '30'">
            {{ modelInitial() }}
          </div>
        </div>

        <div class="chat-header flex items-center gap-2 mb-1">
          <span class="font-mono text-xs uppercase tracking-wider"
                [style.color]="modelColor()">
            {{ message().author.name }}
          </span>
          <span class="text-[10px] text-base-content/20 font-mono">
            {{ message().timestamp | date:'HH:mm' }}
            @if (message().tokens) {
              · {{ message().tokens }} tokens
            }
            @if (message().latency) {
              · {{ message().latency }}s
            }
          </span>
        </div>

        <div class="chat-bubble bg-base-200 text-base-content border-l-[3px] font-body leading-relaxed"
             [style.border-left-color]="modelColor()">
          {{ message().content }}
          @if (message().isStreaming) {
            <span class="cursor-blink text-primary">▋</span>
          }
        </div>
      </div>
    }
  `
})
export class MessageBubble {
  message = input.required<Message>();

  modelColor = computed(() => {
    const model = this.message().author.model;
    return model ? getModelColor(model) : 'var(--model-custom)';
  });

  modelInitial = computed(() => {
    return this.message().author.name.charAt(0).toUpperCase();
  });
}
