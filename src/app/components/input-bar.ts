import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-bar',
  imports: [FormsModule],
  template: `
    <div class="border-t border-[var(--border-subtle)] bg-base-100 pt-3">
      <div class="max-w-[760px] mx-auto">
        <div class="flex items-end gap-2 bg-base-200 rounded-xl border border-[var(--border-default)]
                    focus-within:border-primary/30 focus-within:shadow-[0_0_20px_rgba(0,255,136,0.08)]
                    transition-all duration-200 p-2">
          <textarea
            class="textarea textarea-ghost flex-1 resize-none min-h-[40px] max-h-[200px]
                   font-mono text-sm leading-relaxed bg-transparent border-0 focus:outline-none
                   focus:shadow-none placeholder:text-base-content/20"
            placeholder="> Tapez votre message..."
            [(ngModel)]="messageText"
            (keydown.enter)="onEnter($event)"
            rows="1"
          ></textarea>

          <button
            class="btn btn-primary btn-sm btn-circle shrink-0"
            [disabled]="!messageText().trim()"
            (click)="send()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>

        <p class="text-[10px] font-mono text-base-content/20 text-center mt-2">
          Entrée pour envoyer · Shift+Entrée pour un retour à la ligne
        </p>
      </div>
    </div>
  `
})
export class InputBar {
  messageText = signal('');
  messageSent = output<string>();

  onEnter(event: Event) {
    const keyEvent = event as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      keyEvent.preventDefault();
      this.send();
    }
  }

  send() {
    const text = this.messageText().trim();
    if (text) {
      this.messageSent.emit(text);
      this.messageText.set('');
    }
  }
}
