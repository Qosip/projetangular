import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Topbar],
  template: `
    <div class="drawer lg:drawer-open">
      <!-- Sidebar toggle (mobile) -->
      <input id="sidebar-toggle" type="checkbox" class="drawer-toggle" />

      <!-- Main content area -->
      <div class="drawer-content flex flex-col h-screen">
        <!-- Top Bar -->
        <app-topbar class="h-12 shrink-0" />

        <!-- Router Outlet -->
        <main class="flex-1 overflow-hidden">
          <router-outlet />
        </main>

        <!-- Status Bar -->
        <div class="h-7 shrink-0 flex items-center px-4 border-t border-[var(--border-subtle)]
                    text-[10px] font-mono text-base-content/30 gap-4">
          <span class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
            Online
          </span>
          <span>NeuroTerminal v1.0</span>
        </div>
      </div>

      <!-- Sidebar -->
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
export class MainLayout {}
