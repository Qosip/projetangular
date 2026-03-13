import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemePickerComponent } from './theme-picker';
import { ThemeService } from '../../services/theme.service';
import { signal } from '@angular/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ThemePickerComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let themeServiceSpy: any;

  beforeEach(async () => {
    themeServiceSpy = {
      currentTheme: signal('dark'),
      setTheme: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemePickerComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display list of themes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should call setTheme when a theme is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(themeServiceSpy.setTheme).toHaveBeenCalled();
  });
});
