import { Component, input, output, inject } from '@angular/core';
import { ModelService } from '../../services/model.service';
import { getModelColor, getModelLogo } from '../../models/chat.models';

@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.html',
  styleUrl: './model-selector.css'
})
export class ModelSelectorComponent {
  modelService = inject(ModelService);

  activeModels = input.required<string[]>();
  modelsChanged = output<string[]>();

  getColor = getModelColor;
  getLogo = getModelLogo;

  isActive(id: string): boolean {
    return this.activeModels().includes(id);
  }

  toggle(id: string): void {
    const current = this.activeModels();
    if (current.includes(id)) {
      if (current.length <= 1) return;
      this.modelsChanged.emit(current.filter(m => m !== id));
    } else {
      this.modelsChanged.emit([...current, id]);
    }
  }
}
