import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { SidebarComponent } from './sidebar/sidebar';
import { TopbarComponent } from './topbar/topbar';
import { ChatService } from '../features/chat/chat.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="drawer lg:drawer-open">
      <input id="sidebar-toggle" type="checkbox" class="drawer-toggle" />

      <div class="drawer-content flex flex-col h-screen">
        <app-topbar class="h-12 shrink-0"
                    [chatId]="currentChatId()"
                    [models]="currentModels()" />

        <main class="flex-1 overflow-hidden">
          <router-outlet />
        </main>

        <div class="h-7 shrink-0 flex items-center px-4 border-t border-[var(--border-subtle)]
                    text-[9px] font-mono text-base-content/20 gap-4 bg-base-200/30">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
            Online
          </span>
          <span class="hidden sm:inline">NeuroTerminal v1.0</span>
          <span class="flex-1"></span>
          <span>{{ currentModels().length }} modeles actifs</span>
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
  private chatService = inject(ChatService);
  private router = inject(Router);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  currentChatId = computed(() => {
    const url = this.currentUrl();
    const match = url.match(/\/chat\/(\d+)/);
    return match ? +match[1] : null;
  });

  currentModels = computed(() => {
    const chat = this.chatService.currentChat();
    return chat?.models ?? [];
  });
}
