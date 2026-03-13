import { Injectable, signal, inject } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';

const API = '';

export interface StreamingMessage {
  author: string;
  content: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class StreamingService {
  private toast = inject(ToastService);
  streamingMessages = signal<Record<string, string>>({});
  completedMessages = signal<{ author: string; content: string }[]>([]);
  isStreaming = signal(false);

  private abortController: AbortController | null = null;
  private watchdogTimer: any = null;

  private resetWatchdog(onComplete: () => void): void {
    this.clearWatchdog();
    this.watchdogTimer = setTimeout(() => {
      if (this.isStreaming()) {
        this.toast.show('Le serveur ne répond plus');
        this.finish(onComplete);
      }
    }, 10000); // 10s d'inactivité
  }

  private clearWatchdog(): void {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }

  startStream(chatId: number, onComplete: () => void): void {
    this.stopStream();
    this.streamingMessages.set({});
    this.completedMessages.set([]);
    this.isStreaming.set(true);

    const token = localStorage.getItem('auth_token');
    this.abortController = new AbortController();
    let receivedCycleComplete = false;

    fetch(`${API}/chats/${chatId}/messages/stream`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: this.abortController.signal,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }
      if (!response.body) {
        this.finish(onComplete);
        return;
      }

      this.resetWatchdog(onComplete);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const read = (): void => {
        reader.read().then(({ done, value }) => {
          if (done) {
            this.clearWatchdog();
            if (!receivedCycleComplete) {
              this.toast.show('Le flux s\'est arrêté prématurément');
            }
            this.finish(onComplete);
            return;
          }

          this.resetWatchdog(onComplete);

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const json = line.substring(6).trim();
            if (!json) continue;

            try {
              const event = JSON.parse(json);

              if (event.type === 'cycle_complete') {
                receivedCycleComplete = true;
                this.clearWatchdog();
                this.finish(onComplete);
                return;
              }

              const msg = event as StreamingMessage;
              if (msg.done) {
                // Message complete — move to completed, clear from streaming
                const finalContent = (this.streamingMessages()[msg.author] ?? '') + msg.content;
                this.completedMessages.update(list => [...list, { author: msg.author, content: finalContent }]);
                this.streamingMessages.update(map => {
                  const { [msg.author]: _, ...rest } = map;
                  return rest;
                });
              } else {
                this.streamingMessages.update(map => ({
                  ...map,
                  [msg.author]: (map[msg.author] ?? '') + msg.content,
                }));
              }
            } catch {
              // Ignore parse errors
            }
          }

          read();
        }).catch(err => {
          this.clearWatchdog();
          if (err?.name !== 'AbortError') {
            this.toast.show('Le flux a été interrompu');
          }
          this.finish(onComplete);
        });
      };

      read();
    }).catch((err) => {
      this.clearWatchdog();
      if (err?.name !== 'AbortError') {
        this.toast.show(err?.message || 'Erreur de connexion au streaming');
      }
      this.finish(onComplete);
    });
  }

  stopStream(): void {
    this.abortController?.abort();
    this.abortController = null;
  }

  private finish(onComplete: () => void): void {
    this.clearWatchdog();
    this.isStreaming.set(false);
    this.streamingMessages.set({});
    this.completedMessages.set([]);
    this.stopStream();
    onComplete();
  }
}
