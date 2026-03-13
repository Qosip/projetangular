import { Component, input } from '@angular/core';
import { getModelColor } from '../../features/chat/chat.models';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class TopbarComponent {
  chatId = input<number | null>(null);
  models = input<string[]>([]);

  getColor = getModelColor;
}
