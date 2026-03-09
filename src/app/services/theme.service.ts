import { Injectable, signal } from '@angular/core';

export interface AppTheme {
    id: string;
    label: string;
    accent: string;      // couleur primaire (hex) pour le dot preview
    base: string;        // couleur de fond (hex) pour le dot preview
}

export const THEMES: AppTheme[] = [
    { id: 'neuroterminal', label: 'Phosphore (Dark)', accent: '#00FF88', base: '#0E0E14' },
    { id: 'onyx-dark', label: 'Onyx (Noir)', accent: '#FFFFFF', base: '#050505' },
    { id: 'abyss-blue', label: 'Abyss (Bleu)', accent: '#38BDF8', base: '#0B1120' },
    { id: 'paper-light', label: 'Paper (Clair)', accent: '#111827', base: '#F9FAFB' },
    { id: 'sepia-warm', label: 'Sepia (Doux)', accent: '#D97757', base: '#FDFBF7' },
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly STORAGE_KEY = 'neuro_theme';

    currentTheme = signal<string>(this.loadSaved());

    constructor() {
        this.apply(this.currentTheme());
    }

    setTheme(id: string): void {
        this.currentTheme.set(id);
        localStorage.setItem(this.STORAGE_KEY, id);
        this.apply(id);
    }

    private apply(id: string): void {
        document.documentElement.setAttribute('data-theme', id);
    }

    private loadSaved(): string {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved && THEMES.some(t => t.id === saved) ? saved : 'neuroterminal';
    }
}
