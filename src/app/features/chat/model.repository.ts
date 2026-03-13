import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiModel } from './chat.models';

const API = '';

@Injectable({ providedIn: 'root' })
export class ModelRepository {
  private http = inject(HttpClient);

  getModels(): Observable<AiModel[]> {
    return this.http.get<AiModel[]>(`${API}/models`);
  }
}
