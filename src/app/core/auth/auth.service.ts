import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRepository } from './auth.repository';
import { ToastService } from '../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private repo = inject(AuthRepository);
  private toast = inject(ToastService);

  private readonly USERNAME_KEY = 'auth_username';

  isLoggedIn = signal(!!this.repo.getToken());
  username = signal(localStorage.getItem(this.USERNAME_KEY) ?? '');
  error = signal('');
  loading = signal(false);

  login(displayName: string): void {
    this.loading.set(true);
    this.error.set('');

    this.repo.login({ email: 'student@test.com', password: 'password' }).subscribe({
      next: (res) => {
        this.repo.saveToken(res.token);
        localStorage.setItem(this.USERNAME_KEY, displayName);
        this.username.set(displayName);
        this.isLoggedIn.set(true);
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.error ?? 'Erreur de connexion';
        this.error.set(msg);
        this.toast.show(msg);
      },
    });
  }

  logout(): void {
    this.repo.removeToken();
    localStorage.removeItem(this.USERNAME_KEY);
    this.username.set('');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
