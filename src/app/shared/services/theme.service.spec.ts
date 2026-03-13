import { TestBed } from '@angular/core/testing';
import { ThemeService, THEMES } from './theme.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Default mock for setAttribute
    vi.spyOn(document.documentElement, 'setAttribute');
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to neuroterminal if no theme is saved', () => {
    expect(service.currentTheme()).toBe('neuroterminal');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'neuroterminal');
  });

  it('should load saved theme from localStorage on init', () => {
    localStorage.setItem('neuro_theme', 'abyss-blue');
    
    // We need to re-inject to trigger constructor after setting localStorage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    vi.spyOn(document.documentElement, 'setAttribute');
    service = TestBed.inject(ThemeService);
    
    expect(service.currentTheme()).toBe('abyss-blue');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'abyss-blue');
  });

  it('should fallback to default if saved theme is invalid', () => {
    localStorage.setItem('neuro_theme', 'invalid-theme');
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    vi.spyOn(document.documentElement, 'setAttribute');
    service = TestBed.inject(ThemeService);
    
    expect(service.currentTheme()).toBe('neuroterminal');
  });

  it('should change theme and update localStorage/DOM', () => {
    service.setTheme('onyx-dark');
    
    expect(service.currentTheme()).toBe('onyx-dark');
    expect(localStorage.getItem('neuro_theme')).toBe('onyx-dark');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'onyx-dark');
  });

  it('should provide the list of themes', () => {
    expect(THEMES.length).toBeGreaterThan(0);
    expect(THEMES[0].id).toBe('neuroterminal');
  });
});
