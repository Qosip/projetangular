import { Component, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message, getModelColor } from '../models/chat.models';

@Component({
  selector: 'app-message-bubble',
  imports: [DatePipe],
  template: `
    @if (message().author.type === 'system') {
      <!-- System message -->
      <div class="flex justify-center py-2">
        <span class="font-mono text-[10px] text-base-content/20 px-3 py-1 rounded-full
                     border border-[var(--border-subtle)] bg-base-200/50">
          {{ message().content }}
        </span>
      </div>
    } @else if (message().author.type === 'user') {
      <!-- User message -->
      <div class="chat chat-end">
        <div class="chat-header mb-1">
          <span class="font-mono text-[10px] text-base-content/30">
            {{ message().timestamp | date:'HH:mm' }}
          </span>
          @if (message().mode && message().mode !== 'normal') {
            <span class="ml-1.5 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                  [class]="getModeClasses()">
              {{ getModeIcon() }} {{ message().mode }}
            </span>
          }
        </div>
        @if (message().attachment) {
          <div class="chat-bubble bg-base-300 mb-1 p-2">
            <div class="flex items-center gap-2 text-xs font-mono text-base-content/60">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ message().attachment!.name }}
            </div>
          </div>
        }
        <div class="chat-bubble bg-primary text-primary-content font-body leading-relaxed text-sm">
          {{ message().content }}
        </div>
      </div>
    } @else if (message().isStreaming) {
      <!-- AI thinking/streaming -->
      <div class="chat chat-start" [style.--model-color]="modelColor()">
        <div class="chat-image avatar">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold"
               [style.background]="modelColor() + '15'"
               [style.color]="modelColor()">
            {{ modelInitial() }}
          </div>
        </div>
        <div class="chat-header mb-1">
          <span class="font-mono text-[10px] uppercase tracking-wider"
                [style.color]="modelColor()">
            {{ message().author.name }}
          </span>
        </div>
        <div class="chat-bubble bg-base-200 text-base-content border-l-[3px]"
             [style.border-left-color]="modelColor()">
          <div class="flex items-center gap-2">
            <div class="thinking-dots flex gap-1">
              <span class="w-1.5 h-1.5 rounded-full animate-bounce" [style.background]="modelColor()" style="animation-delay: 0s"></span>
              <span class="w-1.5 h-1.5 rounded-full animate-bounce" [style.background]="modelColor()" style="animation-delay: 0.15s"></span>
              <span class="w-1.5 h-1.5 rounded-full animate-bounce" [style.background]="modelColor()" style="animation-delay: 0.3s"></span>
            </div>
            <span class="font-mono text-[10px] text-base-content/30">en réflexion...</span>
          </div>
        </div>
      </div>
    } @else {
      <!-- AI message -->
      <div class="chat chat-start" [style.--model-color]="modelColor()">
        <div class="chat-image avatar">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold
                      transition-all duration-300"
               [style.background]="modelColor() + '15'"
               [style.color]="modelColor()"
               [style.box-shadow]="'0 0 12px ' + modelColor() + '20'">
            {{ modelInitial() }}
          </div>
        </div>

        <div class="chat-header flex items-center gap-2 mb-1">
          <span class="font-mono text-[10px] uppercase tracking-wider"
                [style.color]="modelColor()">
            {{ message().author.name }}
          </span>
          <span class="text-[9px] text-base-content/20 font-mono">
            {{ message().timestamp | date:'HH:mm' }}
            @if (message().tokens) {
              · {{ message().tokens }}tk
            }
            @if (message().latency) {
              · {{ message().latency }}s
            }
          </span>
        </div>

        <div class="chat-bubble bg-base-200 text-base-content border-l-[3px]
                    font-body leading-relaxed text-sm"
             [style.border-left-color]="modelColor()">
          {{ message().content }}
        </div>
      </div>
    }
  `,
  styles: `
    .thinking-dots span {
      animation-duration: 0.8s;
      animation-iteration-count: infinite;
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
    return this.message().author.name.substring(0, 2).toUpperCase();
  });

  getModeClasses(): string {
    const mode = this.message().mode;
    const classes: Record<string, string> = {
      'search': 'text-accent bg-accent/10',
      'deep-thinking': 'text-warning bg-warning/10',
      'creative': 'text-secondary bg-secondary/10',
    };
    return classes[mode ?? ''] ?? '';
  }

  getModeIcon(): string {
    const mode = this.message().mode;
    const icons: Record<string, string> = {
      'search': '⌕',
      'deep-thinking': '◈',
      'creative': '✦',
    };
    return icons[mode ?? ''] ?? '';
  }
}
