import { Injectable, signal } from '@angular/core';

const API = 'http://localhost:3333';

export interface StreamingMessage {
  author: string;
  content: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class StreamingService {
  streamingMessages = signal<Record<string, string>>({});
  completedMessages = signal<{ author: string; content: string }[]>([]);
  isStreaming = signal(false);

  private abortController: AbortController | null = null;

  startStream(chatId: number, onComplete: () => void): void {
    this.stopStream();
    this.streamingMessages.set({});
    this.completedMessages.set([]);
    this.isStreaming.set(true);

    const token = localStorage.getItem('auth_token');
    this.abortController = new AbortController();

    fetch(`${API}/chats/${chatId}/messages/stream`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: this.abortController.signal,
    }).then(response => {
      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const read = (): void => {
        reader.read().then(({ done, value }) => {
          if (done) {
            this.finish(onComplete);
            return;
          }

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
        });
      };

      read();
    }).catch(() => {
      this.finish(onComplete);
    });
  }

  stopStream(): void {
    this.abortController?.abort();
    this.abortController = null;
  }

  private finish(onComplete: () => void): void {
    this.isStreaming.set(false);
    this.streamingMessages.set({});
    this.completedMessages.set([]);
    this.stopStream();
    onComplete();
  }
}
