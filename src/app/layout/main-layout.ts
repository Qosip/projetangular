import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { ConversationService } from '../services/conversation.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Topbar],
  template: `
    <div class="drawer lg:drawer-open">
      <input id="sidebar-toggle" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col h-screen">
        <app-topbar class="h-12 shrink-0"
                    [title]="currentTitle()"
                    [convId]="currentConvId()"
                    [models]="currentModels()" />

        <main class="flex-1 overflow-hidden">
          <router-outlet />
        </main>

        <!-- Status Bar -->
        <div class="h-7 shrink-0 flex items-center px-4 border-t border-[var(--border-subtle)]
                    text-[9px] font-mono text-base-content/20 gap-4 bg-base-200/30">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            Online
          </span>
          <span class="hidden sm:inline">NeuroTerminal v1.0</span>
          <span class="flex-1"></span>
          <span>{{ currentModels().length }} modèles actifs</span>
        </div>
      </div>

      <div class="drawer-side z-30">
        <label for="sidebar-toggle" class="drawer-overlay"></label>
        <app-sidebar class="w-72 h-full" />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100vh;
    }
  `
})
export class MainLayout {
  private convService = inject(ConversationService);
  private router = inject(Router);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  currentConvId = computed(() => {
    const url = this.currentUrl();
    const match = url.match(/\/chat\/(.+)/);
    return match ? match[1] : null;
  });

  currentTitle = computed(() => {
    const id = this.currentConvId();
    if (!id) return '';
    const conv = this.convService.getConversation(id);
    return conv?.title ?? '';
  });

  currentModels = computed(() => {
    const id = this.currentConvId();
    if (!id) return [];
    const conv = this.convService.getConversation(id);
    return conv?.models ?? [];
  });
}
