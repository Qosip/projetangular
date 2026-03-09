import { Component, input } from '@angular/core';
import { getModelColor } from '../models/chat.models';

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
