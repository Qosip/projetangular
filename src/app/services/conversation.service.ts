import { Injectable, signal, computed, effect } from '@angular/core';
import { Message, Conversation, AI_MODELS } from '../models/chat.models';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly STORAGE_KEY = 'neuro_conversations';
  private conversationsMap = signal<Record<string, Conversation>>(this.loadInitial());

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.conversationsMap()));
    });
  }

  private loadInitial(): Record<string, Conversation> {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return {};
    try {
      const parsed = JSON.parse(saved);
      // Revive date strings
      for (const id in parsed) {
        parsed[id].createdAt = new Date(parsed[id].createdAt);
        parsed[id].updatedAt = new Date(parsed[id].updatedAt);
        parsed[id].messages.forEach((m: any) => m.timestamp = new Date(m.timestamp));
      }
      return parsed;
    } catch {
      return {};
    }
  }

  conversations = computed(() =>
    Object.values(this.conversationsMap()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    )
  );

  createConversation(models: string[]): Conversation {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const conv: Conversation = {
      id,
      title: 'Nouveau chat',
      models,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversationsMap.update(map => ({ ...map, [id]: conv }));
    return conv;
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversationsMap()[id];
  }

  addMessage(conversationId: string, message: Message): void {
    this.conversationsMap.update(map => {
      const conv = map[conversationId];
      if (!conv) return map;

      const updated: Conversation = {
        ...conv,
        messages: [...conv.messages, message],
        updatedAt: new Date(),
      };

      // Auto-title from first user message
      if (conv.title === 'Nouveau chat' && message.author.type === 'user') {
        updated.title = message.content.substring(0, 40) + (message.content.length > 40 ? '...' : '');
      }

      return { ...map, [conversationId]: updated };
    });
  }

  updateModels(conversationId: string, models: string[]): void {
    this.conversationsMap.update(map => {
      const conv = map[conversationId];
      if (!conv) return map;
      return { ...map, [conversationId]: { ...conv, models, updatedAt: new Date() } };
    });
  }

  deleteConversation(id: string): void {
    this.conversationsMap.update(map => {
      const { [id]: _, ...rest } = map;
      return rest;
    });
  }

  renameConversation(id: string, title: string): void {
    this.conversationsMap.update(map => {
      const conv = map[id];
      if (!conv) return map;
      return { ...map, [id]: { ...conv, title: title.trim() || conv.title } };
    });
  }

  getMessages(conversationId: string): Message[] {
    return this.conversationsMap()[conversationId]?.messages ?? [];
  }

  simulateAiResponses(conversationId: string, userMessage: string, models: string[]): number {
    const responsePool: Record<string, string[]> = {
      'claude': [
        'C\'est une question fascinante. En analysant les différentes perspectives, je dirais que l\'essentiel est de maintenir un équilibre entre innovation et éthique.',
        'Permettez-moi d\'apporter une nuance importante. Les données récentes montrent que cette approche a ses mérites, mais aussi des limites qu\'il faut considérer.',
        'Je suis en partie d\'accord avec les autres modèles, mais je voudrais souligner un aspect souvent négligé dans ce débat.',
      ],
      'gpt-4': [
        'Excellente question. D\'un point de vue analytique, plusieurs facteurs entrent en jeu ici. La recherche académique suggère une approche plus nuancée.',
        'Je rebondis sur les points soulevés. Il me semble crucial d\'ajouter que les implications pratiques dépassent le cadre théorique initial.',
        'Pour enrichir cette discussion, je propose de considérer les aspects socio-économiques qui sont souvent sous-estimés dans ce type d\'analyse.',
      ],
      'gemini': [
        'Intéressant ! Je voudrais apporter une perspective complémentaire basée sur les dernières avancées dans ce domaine.',
        'C\'est un sujet qui mérite une analyse multicouche. En croisant différentes sources, on peut observer des patterns émergents assez révélateurs.',
        'Pour compléter ce qui a été dit, les données empiriques suggèrent une corrélation forte entre ces variables.',
      ],
      'mistral': [
        'Mon analyse de la situation est la suivante : il y a des arguments solides des deux côtés, mais les preuves penchent légèrement vers...',
        'Je propose une approche différente. Plutôt que de voir cela comme un dilemme binaire, considérons les multiples dimensions de ce problème.',
        'En m\'appuyant sur mon analyse, je dirais que la solution optimale se trouve à l\'intersection de ces différentes perspectives.',
      ],
      'llama': [
        'D\'un point de vue technique, cette question soulève des enjeux importants. Les architectures actuelles permettent d\'envisager des solutions innovantes.',
        'Pour ma part, je pense que l\'approche la plus prometteuse combine des éléments de chaque perspective mentionnée précédemment.',
      ],
      'deepseek': [
        'En analysant en profondeur ce sujet, plusieurs couches de complexité se révèlent. Ma recherche indique que les facteurs les plus déterminants sont...',
        'Je voudrais proposer un cadre d\'analyse systématique. En décomposant le problème, on identifie trois axes principaux de réflexion.',
      ],
    };

    let maxDelay = 0;

    models.forEach((modelId, index) => {
      const delay = 1500 + (index * 1500) + Math.random() * 1000;
      if (delay > maxDelay) maxDelay = delay;
      const model = AI_MODELS[modelId];
      if (!model) return;

      const thinkingId = `thinking-${Date.now()}-${modelId}`;
      const thinkingMsg: Message = {
        id: thinkingId,
        conversationId,
        content: '',
        author: { type: 'ai', name: model.name, model: modelId },
        timestamp: new Date(),
        isStreaming: true,
      };

      setTimeout(() => {
        this.addMessage(conversationId, thinkingMsg);
      }, delay - 800);

      setTimeout(() => {
        this.conversationsMap.update(map => {
          const conv = map[conversationId];
          if (!conv) return map;
          const filtered = conv.messages.filter(m => m.id !== thinkingId);
          return { ...map, [conversationId]: { ...conv, messages: filtered } };
        });

        const responses = responsePool[modelId] ?? responsePool['claude'];
        const response = responses[Math.floor(Math.random() * responses.length)];

        const aiMsg: Message = {
          id: Date.now().toString() + modelId,
          conversationId,
          content: response,
          author: { type: 'ai', name: model.name, model: modelId },
          timestamp: new Date(),
          tokens: Math.floor(Math.random() * 150) + 50,
          latency: +(Math.random() * 2 + 0.5).toFixed(1),
        };
        this.addMessage(conversationId, aiMsg);
      }, delay);
    });

    return maxDelay;
  }
}
