import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  avatar: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(private router: Router) {
    const saved = localStorage.getItem('neuro_user');
    if (saved) {
      this.currentUser.set(JSON.parse(saved));
    }
  }

  login(username: string): void {
    const user: User = {
      username,
      avatar: username.substring(0, 2).toUpperCase(),
    };
    this.currentUser.set(user);
    localStorage.setItem('neuro_user', JSON.stringify(user));
    this.router.navigate(['/']);
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('neuro_user');
    this.router.navigate(['/login']);
  }
}
