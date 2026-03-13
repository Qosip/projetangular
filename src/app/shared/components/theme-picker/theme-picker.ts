import { Component, inject } from '@angular/core';
import { ThemeService, THEMES } from '../../services/theme.service';

@Component({
    selector: 'app-theme-picker',
    templateUrl: './theme-picker.html',
    styleUrl: './theme-picker.css'
})
export class ThemePickerComponent {
    themeService = inject(ThemeService);
    themes = THEMES;
}
