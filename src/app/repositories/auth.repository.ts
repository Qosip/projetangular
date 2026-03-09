import { Injectable } from '@angular/core';
import { User } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class AuthRepository {
    private readonly STORAGE_KEY = 'neuro_user';

    getUser(): User | null {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    }

    saveUser(user: User): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }

    removeUser(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
