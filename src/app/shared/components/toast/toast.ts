import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast toast-end toast-bottom z-50">
      @for (t of toast.toasts(); track t.id) {
        <div class="alert shadow-lg font-mono text-sm"
          [class.alert-error]="t.type === 'error'"
          [class.alert-success]="t.type === 'success'"
          [class.alert-info]="t.type === 'info'">
          <span>{{ t.message }}</span>
          <button class="btn btn-ghost btn-xs" (click)="toast.dismiss(t.id)">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected toast = inject(ToastService);
}
