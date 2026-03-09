import { Component, inject } from '@angular/core';
import { ThemeService, THEMES } from '../../services/theme.service';

@Component({
    selector: 'app-theme-picker',
    templateUrl: './theme-picker.component.html',
    styleUrl: './theme-picker.component.css'
})
export class ThemePickerComponent {
    themeService = inject(ThemeService);
    themes = THEMES;
}
