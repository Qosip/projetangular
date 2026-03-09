import { Injectable, signal, inject } from '@angular/core';
import { ModelRepository } from '../repositories/model.repository';
import { AiModel } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ModelService {
  private repo = inject(ModelRepository);

  models = signal<AiModel[]>([]);

  loadModels(): void {
    this.repo.getModels().subscribe({
      next: (models) => this.models.set(models),
    });
  }
}
