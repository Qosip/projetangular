import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-base-100 flex items-center justify-center p-4 relative overflow-hidden">
      <!-- Scanlines -->
      <div class="scanlines pointer-events-none fixed inset-0 z-50"></div>

      <!-- Background grid effect -->
      <div class="fixed inset-0 opacity-[0.03]"
           style="background-image: linear-gradient(rgba(0,255,136,.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,255,136,.1) 1px, transparent 1px);
                  background-size: 50px 50px;">
      </div>

      <div class="card w-full max-w-sm bg-base-200 border border-base-300 shadow-2xl z-10"
           [class.animate-shake]="showError()">
        <div class="card-body gap-6">
          <!-- Logo -->
          <div class="text-center">
            <h1 class="font-display text-2xl font-bold text-primary tracking-wider">
              ◆ NEUROTERMINAL
            </h1>
            <div class="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-3"></div>
          </div>

          <!-- Terminal prompt -->
          <p class="font-mono text-xs uppercase tracking-widest text-base-content/30">
            > identification<span class="cursor-blink text-primary">_</span>
          </p>

          <!-- Username -->
          <div class="form-control">
            <label class="label pb-1">
              <span class="font-mono text-[10px] uppercase tracking-widest text-base-content/40">
                Nom d'opérateur
              </span>
            </label>
            <input type="text"
                   class="input input-bordered w-full font-mono text-sm bg-base-300/50"
                   placeholder="operator"
                   [(ngModel)]="username"
                   (keydown.enter)="connect()" />
          </div>

          <!-- Password (decorative) -->
          <div class="form-control">
            <label class="label pb-1">
              <span class="font-mono text-[10px] uppercase tracking-widest text-base-content/40">
                Mot de passe
              </span>
            </label>
            <input type="password"
                   class="input input-bordered w-full font-mono text-sm bg-base-300/50"
                   placeholder="••••••••"
                   value="password"
                   (keydown.enter)="connect()" />
          </div>

          <!-- Connect button -->
          <button class="btn btn-primary w-full gap-2"
                  [disabled]="isConnecting()"
                  (click)="connect()">
            @if (isConnecting()) {
              <span class="loading loading-dots loading-sm"></span>
              Connexion...
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              CONNECT
            }
          </button>

          @if (showError()) {
            <div class="alert alert-error py-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span class="font-mono text-xs">Veuillez entrer un nom d'opérateur</span>
            </div>
          }
        </div>
      </div>

      <!-- Bottom ambient text -->
      <p class="fixed bottom-4 font-mono text-[10px] text-base-content/15 z-10">
        > system v1.0 — neural interface ready<span class="cursor-blink text-primary/30">_</span>
      </p>
    </div>
  `,
  styles: `
    .animate-shake {
      animation: shake 0.3s ease-in-out;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }
    .scanlines {
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.008) 2px,
        rgba(255, 255, 255, 0.008) 4px
      );
    }
  `
})
export class Login {
  username = signal('');
  isConnecting = signal(false);
  showError = signal(false);

  constructor(private auth: AuthService) {}

  connect() {
    const name = this.username().trim();
    if (!name) {
      this.showError.set(true);
      setTimeout(() => this.showError.set(false), 2000);
      return;
    }

    this.isConnecting.set(true);
    // Fake delay for the animation
    setTimeout(() => {
      this.auth.login(name);
    }, 800);
  }
}
