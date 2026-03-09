import { Component, signal, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="login-root">

      <!-- Ambient grid -->
      <div class="ambient-grid"></div>

      <!-- Scanlines overlay -->
      <div class="scanlines"></div>

      <!-- Corner decorations -->
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>

      <!-- Main panel -->
      <div class="login-panel" [class.shake]="shake()">

        <!-- Header -->
        <div class="panel-header">
          <div class="logo-mark">◆</div>
          <h1 class="logo-text">NEUROTERMINAL</h1>
          <div class="logo-line"></div>
        </div>

        <!-- Terminal prompt -->
        <p class="terminal-prompt">
          <span class="prompt-char">&gt;</span>
          <span class="prompt-text" #promptText></span><span class="cursor-blink">_</span>
        </p>

        <!-- Form -->
        <form class="login-form" (ngSubmit)="connect()" autocomplete="off">

          <div class="field-group">
            <label class="field-label">EMAIL</label>
            <input
              type="email"
              class="field-input"
              placeholder="operator@neuro.dev"
              [(ngModel)]="email"
              name="email"
              spellcheck="false"
              autocomplete="off"
              (keydown.enter)="connect()" />
          </div>

          <div class="field-group">
            <label class="field-label">PASSWORD</label>
            <input
              type="password"
              class="field-input"
              placeholder="••••••••••••"
              [(ngModel)]="password"
              name="password"
              autocomplete="current-password"
              (keydown.enter)="connect()" />
          </div>

          <button
            type="submit"
            class="connect-btn"
            [disabled]="isConnecting()">
            @if (isConnecting()) {
              <span class="loading-dots">
                <span></span><span></span><span></span>
              </span>
            } @else {
              <span class="btn-text">CONNECT</span>
              <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            }
          </button>

        </form>

        @if (error()) {
          <div class="error-msg">
            <span class="error-icon">!</span>
            <span>{{ error() }}</span>
          </div>
        }

        <!-- Version hint -->
        <p class="panel-footer">sys v1.0 · neural interface</p>

      </div>

      <!-- Bottom ambient -->
      <p class="ambient-bottom">&gt; ready<span class="cursor-blink text-primary">_</span></p>

    </div>
  `,
  styles: `
    .login-root {
      min-height: 100vh;
      background: var(--surface-0, #0E0E14);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
    }

    /* ── Ambient grid ── */
    .ambient-grid {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
      background-size: 64px 64px;
      pointer-events: none;
    }

    /* ── Scanlines ── */
    .scanlines {
      position: fixed;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.006) 2px,
        rgba(255, 255, 255, 0.006) 4px
      );
      pointer-events: none;
      z-index: 100;
    }

    /* ── Corner decorations ── */
    .corner {
      position: fixed;
      width: 32px;
      height: 32px;
      border-color: rgba(0, 255, 136, 0.12);
      border-style: solid;
    }
    .corner-tl { top: 20px; left: 20px; border-width: 1px 0 0 1px; }
    .corner-tr { top: 20px; right: 20px; border-width: 1px 1px 0 0; }
    .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 1px 1px; }
    .corner-br { bottom: 20px; right: 20px; border-width: 0 1px 1px 0; }

    /* ── Panel ── */
    .login-panel {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 360px;
      padding: 0 1rem;
      animation: panel-in 0.6s ease both;
    }

    @keyframes panel-in {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .shake {
      animation: shake 0.35s ease-in-out !important;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-10px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-6px); }
      80%       { transform: translateX(4px); }
    }

    /* ── Header ── */
    .panel-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;
      gap: 0.25rem;
    }

    .logo-mark {
      font-size: 1.25rem;
      color: #00FF88;
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .logo-text {
      font-family: var(--font-display, 'Space Grotesk', sans-serif);
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #E8E8ED;
      margin: 0;
    }

    .logo-line {
      width: 48px;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(0, 255, 136, 0.4), transparent);
      margin-top: 0.5rem;
    }

    /* ── Terminal prompt ── */
    .terminal-prompt {
      font-size: 0.625rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: rgba(232, 232, 237, 0.25);
      margin: 0 0 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.4em;
      min-height: 1em;
    }
    .prompt-char { color: rgba(0, 255, 136, 0.4); }

    /* ── Form ── */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .field-label {
      font-size: 0.6rem;
      letter-spacing: 0.18em;
      color: rgba(232, 232, 237, 0.3);
      user-select: none;
    }

    .field-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      padding: 0.65rem 0.85rem;
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 0.8125rem;
      color: #E8E8ED;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      box-sizing: border-box;
    }
    .field-input::placeholder {
      color: rgba(232, 232, 237, 0.15);
    }
    .field-input:focus {
      border-color: rgba(0, 255, 136, 0.35);
      background: rgba(0, 255, 136, 0.025);
      box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.05), 0 0 16px rgba(0, 255, 136, 0.08);
    }

    /* ── Connect button ── */
    .connect-btn {
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.7rem 1rem;
      background: transparent;
      border: 1px solid rgba(0, 255, 136, 0.35);
      border-radius: 4px;
      color: #00FF88;
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .connect-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 255, 136, 0.06);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.2s ease;
    }
    .connect-btn:hover:not(:disabled)::before {
      transform: scaleX(1);
    }
    .connect-btn:hover:not(:disabled) {
      border-color: rgba(0, 255, 136, 0.6);
      box-shadow: 0 0 24px rgba(0, 255, 136, 0.15);
    }
    .connect-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-arrow {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }
    .connect-btn:hover:not(:disabled) .btn-arrow {
      transform: translateX(3px);
    }

    /* ── Loading dots ── */
    .loading-dots {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .loading-dots span {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #00FF88;
      animation: dot-pulse 1.2s ease-in-out infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dot-pulse {
      0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
      40%            { opacity: 1;   transform: scale(1); }
    }

    /* ── Error ── */
    .error-msg {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid rgba(255, 59, 92, 0.25);
      border-radius: 4px;
      background: rgba(255, 59, 92, 0.06);
      font-size: 0.6875rem;
      color: rgba(255, 59, 92, 0.85);
      letter-spacing: 0.04em;
      animation: error-in 0.2s ease;
    }
    @keyframes error-in {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .error-icon {
      font-weight: 700;
      flex-shrink: 0;
      opacity: 0.7;
    }

    /* ── Panel footer ── */
    .panel-footer {
      margin-top: 1.75rem;
      font-size: 0.5625rem;
      letter-spacing: 0.12em;
      color: rgba(232, 232, 237, 0.1);
      text-align: center;
    }

    /* ── Ambient bottom ── */
    .ambient-bottom {
      position: fixed;
      bottom: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.5625rem;
      letter-spacing: 0.12em;
      color: rgba(232, 232, 237, 0.1);
      white-space: nowrap;
    }

    /* ── Cursor blink ── */
    .cursor-blink {
      animation: blink 1s step-end infinite;
      color: #00FF88;
      opacity: 0.5;
    }
    @keyframes blink {
      0%, 50% { opacity: 0.5; }
      51%, 100% { opacity: 0; }
    }
  `
})
export class Login implements OnInit {
  email = '';
  password = '';
  isConnecting = signal(false);
  shake = signal(false);
  error = signal('');

  @ViewChild('promptText') promptTextRef!: ElementRef<HTMLSpanElement>;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Typing effect for the terminal prompt
    const text = 'identification';
    let i = 0;
    const interval = setInterval(() => {
      if (this.promptTextRef?.nativeElement) {
        this.promptTextRef.nativeElement.textContent = text.slice(0, ++i);
      }
      if (i >= text.length) clearInterval(interval);
    }, 60);
  }

  connect() {
    this.error.set('');
    const em = this.email.trim();
    const pw = this.password.trim();

    if (!em) {
      this.triggerError('Veuillez entrer votre email');
      return;
    }
    if (!pw) {
      this.triggerError('Veuillez entrer votre mot de passe');
      return;
    }

    this.isConnecting.set(true);
    // Simulated auth — use email prefix as username
    setTimeout(() => {
      const username = em.split('@')[0];
      this.auth.login(username);
    }, 900);
  }

  private triggerError(msg: string) {
    this.error.set(msg);
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 400);
    setTimeout(() => this.error.set(''), 3000);
  }
}
