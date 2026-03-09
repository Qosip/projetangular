import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.models';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => this.currentUser() !== null);

  constructor(private router: Router, private authRepository: AuthRepository) {
    const saved = this.authRepository.getUser();
    if (saved) {
      this.currentUser.set(saved);
    }
  }

  login(username: string): void {
    const user: User = {
      username,
      avatar: username.substring(0, 2).toUpperCase(),
    };
    this.currentUser.set(user);
    this.authRepository.saveUser(user);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.currentUser.set(null);
    this.authRepository.removeUser();
    this.router.navigate(['/login']);
  }
}
