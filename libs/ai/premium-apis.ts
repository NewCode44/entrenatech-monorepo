// APIs Premium para fallback y casos críticos
export interface PremiumAPIConfig {
  name: string;
  endpoint: string;
  apiKey: string;
  costPerMillionTokens: {
    input: number;  // en MXN
    output: number; // en MXN
  };
  reliability: number; // porcentaje
  maxTokens: number;
  features: string[];
  slas: {
    uptime: number;
    response_time?: number;
  };
}

export const PREMIUM_APIS: Record<string, PremiumAPIConfig> = {
  openai: {
    name: 'OpenAI GPT-5 Nano',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.VITE_OPENAI_API_KEY || '',
    costPerMillionTokens: {
      input: 9.00,   // $0.50 USD × 18
      output: 7.20   // $0.40 USD × 18
    },
    reliability: 99.9,
    maxTokens: 400000,
    features: ['chat', 'reasoning', 'safety', 'moderation'],
    slas: {
      uptime: 99.9,
      response_time: 500 // ms
    }
  },

  anthropic: {
    name: 'Anthropic Claude 4.5 Haiku',
    endpoint: 'https://api.anthropic.com/v1/messages',
    apiKey: process.env.VITE_ANTHROPIC_API_KEY || '',
    costPerMillionTokens: {
      input: 18.00,  // $1.00 USD × 18
      output: 90.00   // $5.00 USD × 18
    },
    reliability: 99.8,
    maxTokens: 200000,
    features: ['chat', 'analysis', 'safety', 'constitution'],
    slas: {
      uptime: 99.8,
      response_time: 800 // ms
    }
  },

  google: {
    name: 'Google Gemini 2.5 Pro',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-latest:generateContent',
    apiKey: process.env.VITE_GOOGLE_API_KEY || '',
    costPerMillionTokens: {
      input: 22.50,  // $1.25 USD × 18
      output: 180.00  // $10.00 USD × 18
    },
    reliability: 99.5,
    maxTokens: 1000000,
    features: ['multimodal', 'context', 'analysis', 'grounding'],
    slas: {
      uptime: 99.5,
      response_time: 2000 // ms
    }
  },

  cohere: {
    name: 'Cohere Command R+',
    endpoint: 'https://api.cohere.ai/v1/chat',
    apiKey: process.env.VITE_COHERE_API_KEY || '',
    costPerMillionTokens: {
      input: 54.00,  // $3.00 USD × 18
      output: 270.00  // $15.00 USD × 18
    },
    reliability: 99.5,
    maxTokens: 128000,
    features: ['rag', 'citations', 'enterprise', 'safety'],
    slas: {
      uptime: 99.5,
      response_time: 1000 // ms
    }
  }
};

// Estrategia de fallback basada en criticidad
export class PremiumFallback {
  private static instance: PremiumFallback;

  async getPremiumFallback(
    taskType: 'emergency' | 'safety' | 'enterprise' | 'complex_analysis',
    originalError: Error
  ): Promise<{ api: string; config: PremiumAPIConfig }> {
    const strategies = {
      emergency: {
        primary: 'openai',      // Más rápido y confiable
        fallback: 'anthropic'    // Más seguro
      },
      safety: {
        primary: 'anthropic',    // Constitucional safety
        fallback: 'cohere'       // Enterprise grade
      },
      enterprise: {
        primary: 'cohere',        // Enterprise ready
        fallback: 'google'       // Google Cloud SLA
      },
      complex_analysis: {
        primary: 'google',       // 1M tokens context
        fallback: 'anthropic'    // Deep reasoning
      }
    };

    const strategy = strategies[taskType];

    // Intentar API primaria
    try {
      const config = PREMIUM_APIS[strategy.primary];
      await this.testAPIAvailability(strategy.primary, config);

      return {
        api: strategy.primary,
        config
      };
    } catch (error) {
      console.warn(`Primary premium API ${strategy.primary} failed, trying fallback:`, error);

      // Intentar fallback
      if (strategy.fallback) {
        const fallbackConfig = PREMIUM_APIS[strategy.fallback];
        await this.testAPIAvailability(strategy.fallback, fallbackConfig);

        return {
          api: strategy.fallback,
          config: fallbackConfig
        };
      }

      throw new Error(`All premium APIs failed. Original error: ${originalError.message}`);
    }
  }

  private async testAPIAvailability(apiName: string, config: PremiumAPIConfig): Promise<void> {
    const testRequest = {
      model: this.getModelName(apiName),
      messages: [
        { role: 'user', content: 'Test availability' }
      ],
      max_tokens: 10
    };

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(testRequest),
    });

    if (!response.ok) {
      throw new Error(`Premium API ${apiName} unavailable: ${response.status}`);
    }
  }

  private getModelName(apiName: string): string {
    const modelMap = {
      openai: 'gpt-4o-mini',
      anthropic: 'claude-3-5-haiku-20241022',
      google: 'gemini-2.5-pro',
      cohere: 'command-r-plus-08-2024'
    };
    return modelMap[apiName] || 'default';
  }

  // Métodos específicos para casos críticos
  async emergencyRequest(messages: Array<{role: string; content: string}>): Promise<any> {
    const { api, config } = await this.getPremiumFallback('emergency', new Error('Emergency request'));

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.getModelName(api),
        messages,
        max_tokens: 500,
        temperature: 0.3, // Más consistente para emergencias
      }),
    });

    return response.json();
  }

  async safetyRequest(messages: Array<{role: string; content: string}>): Promise<any> {
    const { api, config } = await this.getPremiumFallback('safety', new Error('Safety check needed'));

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'anthropic-dangerous-direct-completion': 'false', // Safety first
      },
      body: JSON.stringify({
        model: this.getModelName(api),
        messages,
        max_tokens: 300,
        temperature: 0.1, // Muy conservador para safety
      }),
    });

    return response.json();
  }

  static getInstance(): PremiumFallback {
    if (!PremiumFallback.instance) {
      PremiumFallback.instance = new PremiumFallback();
    }
    return PremiumFallback.instance;
  }
}

export const premiumFallback = PremiumFallback.getInstance();