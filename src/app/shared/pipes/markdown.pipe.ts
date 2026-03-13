import { Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

// Configuration de marked : liens sécurisés, retour à la ligne doux activé
const renderer = new marked.Renderer();

// Ouvre les liens dans un nouvel onglet
renderer.link = ({ href, title, text }) => {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.setOptions({ renderer });

@Pipe({
    name: 'markdown',
    standalone: true,
    pure: true,
})
export class MarkdownPipe implements PipeTransform {
    private sanitizer = inject(DomSanitizer);

    transform(value: string | null | undefined): SafeHtml {
        if (!value) return '';
        const raw = marked.parse(value) as string;
        return this.sanitizer.bypassSecurityTrustHtml(raw);
    }
}
