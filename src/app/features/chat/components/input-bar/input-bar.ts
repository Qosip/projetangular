import { Component, output, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-bar',
  imports: [FormsModule],
  templateUrl: './input-bar.html',
  styleUrl: './input-bar.css'
})
export class InputBarComponent {
  disabled = input<boolean>(false);
  messageText = signal('');

  messageSent = output<string>();

  getPlaceholder(): string {
    return this.disabled() ? '> agents en reflexion...' : '> Message...';
  }

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
