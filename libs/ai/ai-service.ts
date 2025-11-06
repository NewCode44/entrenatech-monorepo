import { CHINESE_APIS } from './chinese-apis';
import { costRouter, TaskRequest } from './cost-router';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  taskType?: TaskRequest['type'];
  complexity?: TaskRequest['complexity'];
  userTier?: TaskRequest['userTier'];
}

export interface AIResponse {
  content: string;
  model: string;
  cost: number;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  processingTime: number;
}

export class AIService {
  private static instance: AIService;
  private cache: Map<string, any> = new Map();

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();

    // 1. Crear task para el router de costos
    const task: TaskRequest = {
      type: request.taskType || 'chat',
      priority: this.determinePriority(request),
      complexity: request.complexity || 'simple',
      userTier: request.userTier || 'basic',
      estimatedTokens: this.estimateTokens(request.messages)
    };

    // 2. Seleccionar API óptima
    const apiSelection = await costRouter.selectOptimalAPI(task);

    try {
      // 3. Ejecutar con la API seleccionada
      const response = await this.callSelectedAPI(request, apiSelection.primary);

      // 4. Calcular costos reales
      const actualCost = this.calculateRealCost(
        apiSelection.primary,
        response.tokens.input,
        response.tokens.output
      );

      return {
        ...response,
        model: apiSelection.primary,
        cost: actualCost,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      // 5. Fallback automático
      if (apiSelection.fallback) {
        console.warn(`Fallback activated for ${apiSelection.primary}:`, error);
        const fallbackResponse = await this.callSelectedAPI(request, apiSelection.fallback);

        return {
          ...fallbackResponse,
          model: apiSelection.fallback,
          cost: this.calculateRealCost(
            apiSelection.fallback,
            fallbackResponse.tokens.input,
            fallbackResponse.tokens.output
          ),
          processingTime: Date.now() - startTime
        };
      }

      throw error;
    }
  }

  private async callSelectedAPI(request: AIRequest, apiName: string): Promise<Partial<AIResponse>> {
    const api = CHINESE_APIS[apiName];

    if (!api) {
      throw new Error(`API ${apiName} no configurada`);
    }

    try {
      const response = await fetch(api.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api.apiKey}`,
        },
        body: JSON.stringify({
          model: this.getModelName(apiName),
          messages: request.messages,
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        content: data.choices[0].message.content,
        tokens: {
          input: data.usage.prompt_tokens,
          output: data.usage.completion_tokens,
          total: data.usage.total_tokens
        }
      };

    } catch (error) {
      console.error(`Error calling ${apiName}:`, error);
      throw error;
    }
  }

  private getModelName(apiName: string): string {
    const modelMap = {
      bytedance: 'ep-20241029171457-5m4t3',
      deepseek: 'deepseek-chat',
      zhipuai: 'glm-4',
      qwen: 'qwen-plus'
    };
    return modelMap[apiName] || 'default';
  }

  private calculateRealCost(apiName: string, inputTokens: number, outputTokens: number): number {
    // Importar dinámicamente para evitar dependencia circular
    const { calculateCost } = require('./chinese-apis');
    return calculateCost(apiName as keyof typeof CHINESE_APIS, inputTokens, outputTokens);
  }

  private determinePriority(request: AIRequest): TaskRequest['priority'] {
    if (request.taskType === 'emergency') return 'critical';
    if (request.taskType === 'analysis') return 'high';
    if (request.taskType === 'coaching') return 'medium';
    return 'low';
  }

  private estimateTokens(messages: AIMessage[]): { input: number; output: number } {
    const inputText = messages.map(m => m.content).join(' ');
    const inputTokens = Math.ceil(inputText.length / 4); // ~4 chars per token

    return {
      input: inputTokens,
      output: Math.ceil(inputTokens * 0.75) // Estimated response length
    };
  }

  // Caching para respuestas repetitivas
  private getCacheKey(request: AIRequest): string {
    const content = JSON.stringify({
      messages: request.messages.slice(-2), // Últimos 2 mensajes
      temperature: request.temperature,
      taskType: request.taskType
    });
    return Buffer.from(content).toString('base64').slice(0, 32);
  }

  async processWithCache(request: AIRequest): Promise<AIResponse> {
    const cacheKey = this.getCacheKey(request);

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return {
        ...cached,
        cached: true,
        processingTime: 1
      };
    }

    // Process request
    const response = await this.processRequest(request);

    // Cache for 1 hour
    this.cache.set(cacheKey, { ...response });
    setTimeout(() => this.cache.delete(cacheKey), 3600000);

    return {
      ...response,
      cached: false
    };
  }

  // Métodos especializados por tipo de tarea
  async chat(messages: AIMessage[], userTier: TaskRequest['userTier'] = 'basic'): Promise<AIResponse> {
    return this.processWithCache({
      messages,
      taskType: 'chat',
      complexity: 'simple',
      userTier,
      temperature: 0.7,
      maxTokens: 500
    });
  }

  async coaching(messages: AIMessage[], userTier: TaskRequest['userTier'] = 'basic'): Promise<AIResponse> {
    return this.processWithCache({
      messages,
      taskType: 'coaching',
      complexity: 'moderate',
      userTier,
      temperature: 0.8,
      maxTokens: 800
    });
  }

  async nutrition(messages: AIMessage[], userTier: TaskRequest['userTier'] = 'basic'): Promise<AIResponse> {
    return this.processWithCache({
      messages,
      taskType: 'nutrition',
      complexity: 'complex',
      userTier,
      temperature: 0.6,
      maxTokens: 1000
    });
  }

  async analysis(messages: AIMessage[], userTier: TaskRequest['userTier'] = 'basic'): Promise<AIResponse> {
    return this.processRequest({
      messages,
      taskType: 'analysis',
      complexity: 'complex',
      userTier,
      temperature: 0.3,
      maxTokens: 1500,
      maxCompletionTokens: 800
    });
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
}

export const aiService = AIService.getInstance();