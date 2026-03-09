import { Component, signal, ElementRef, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageBubble } from '../components/message-bubble';
import { InputBar } from '../components/input-bar';
import { Message } from '../models/chat.models';

@Component({
  selector: 'app-chat',
  imports: [MessageBubble, InputBar],
  template: `
    <div class="flex flex-col h-full">
      <!-- Messages area -->
      <div class="flex-1 overflow-y-auto scroll-smooth" #messagesContainer>
        <div class="max-w-[760px] mx-auto px-4 py-6 space-y-1">
          @for (msg of messages(); track msg.id) {
            <app-message-bubble [message]="msg" />
          } @empty {
            <div class="flex flex-col items-center justify-center h-full py-20 text-center">
              <p class="font-mono text-sm text-base-content/30">
                > conversation initialisée_
              </p>
              <p class="font-mono text-xs text-base-content/15 mt-2">
                Envoyez un message pour commencer le débat entre les IA.
              </p>
            </div>
          }
        </div>
      </div>

      <!-- Gradient fade -->
      <div class="h-8 bg-gradient-to-t from-base-100 to-transparent pointer-events-none -mt-8 relative z-10"></div>

      <!-- Input bar -->
      <app-input-bar class="shrink-0 px-4 pb-4"
                     (messageSent)="onSendMessage($event)" />
    </div>
  `
})
export class Chat {
  messagesContainer = viewChild<ElementRef>('messagesContainer');

  messages = signal<Message[]>([
    {
      id: '1',
      conversationId: '1',
      content: 'Bonjour ! Quels sont les avantages et inconvénients de l\'IA générative dans l\'éducation ?',
      author: { type: 'user', name: 'Vous' },
      timestamp: new Date('2026-03-09T10:00:00'),
    },
    {
      id: '2',
      conversationId: '1',
      content: 'L\'IA générative offre une personnalisation sans précédent de l\'apprentissage. Elle permet d\'adapter le contenu au rythme de chaque étudiant, de générer des exercices sur mesure et de fournir un feedback instantané.',
      author: { type: 'ai', name: 'Claude', model: 'claude' },
      timestamp: new Date('2026-03-09T10:00:05'),
      tokens: 142,
      latency: 1.2,
    },
    {
      id: '3',
      conversationId: '1',
      content: 'Je suis d\'accord avec Claude sur la personnalisation, mais il faut aussi souligner les risques : dépendance technologique, biais dans les contenus générés, et la question de l\'évaluation authentique des compétences.',
      author: { type: 'ai', name: 'GPT-4', model: 'gpt-4' },
      timestamp: new Date('2026-03-09T10:00:12'),
      tokens: 98,
      latency: 2.1,
    },
    {
      id: '4',
      conversationId: '1',
      content: 'Un point que mes collègues n\'ont pas mentionné : l\'accessibilité. L\'IA peut rendre l\'éducation accessible à des personnes qui n\'y avaient pas accès auparavant — traduction instantanée, adaptation pour les handicaps, disponibilité 24/7.',
      author: { type: 'ai', name: 'Gemini', model: 'gemini' },
      timestamp: new Date('2026-03-09T10:00:18'),
      tokens: 115,
      latency: 1.8,
    },
  ]);

  constructor(private route: ActivatedRoute) {}

  onSendMessage(content: string) {
    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: '1',
      content,
      author: { type: 'user', name: 'Vous' },
      timestamp: new Date(),
    };

    this.messages.update(msgs => [...msgs, newMsg]);

    // Scroll to bottom
    setTimeout(() => this.scrollToBottom(), 50);

    // Simulate AI responses
    this.simulateAiResponses(content);
  }

  private simulateAiResponses(userMessage: string) {
    const models = [
      { name: 'Claude', model: 'claude', delay: 1500 },
      { name: 'GPT-4', model: 'gpt-4', delay: 3000 },
      { name: 'Gemini', model: 'gemini', delay: 4500 },
    ];

    const responses = [
      'C\'est une question intéressante. Je pense que la clé est de trouver un équilibre entre l\'utilisation de l\'IA comme outil et le maintien de l\'esprit critique.',
      'Je rebondis sur ce que vient de dire Claude. Il est essentiel de former les enseignants à ces nouveaux outils pour qu\'ils puissent guider les étudiants efficacement.',
      'Pour compléter les points soulevés, je voudrais ajouter que les données montrent une amélioration significative des résultats quand l\'IA est utilisée de manière complémentaire.',
    ];

    models.forEach((m, i) => {
      setTimeout(() => {
        const aiMsg: Message = {
          id: Date.now().toString() + i,
          conversationId: '1',
          content: responses[i],
          author: { type: 'ai', name: m.name, model: m.model },
          timestamp: new Date(),
          tokens: Math.floor(Math.random() * 100) + 50,
          latency: +(Math.random() * 2 + 0.5).toFixed(1),
        };
        this.messages.update(msgs => [...msgs, aiMsg]);
        setTimeout(() => this.scrollToBottom(), 50);
      }, m.delay);
    });
  }

  private scrollToBottom() {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
