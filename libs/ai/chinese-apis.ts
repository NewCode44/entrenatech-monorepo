// Configuración de APIs Chinas para EntrenaTech
export interface ChineseAPIConfig {
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
}

export const CHINESE_APIS: Record<string, ChineseAPIConfig> = {
  bytedance: {
    name: 'ByteDance Doubao',
    endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    apiKey: process.env.VITE_DOUBAO_API_KEY || '',
    costPerMillionTokens: {
      input: 2.16,  // $0.12 USD × 18
      output: 5.22  // $0.29 USD × 18
    },
    reliability: 95,
    maxTokens: 32000,
    features: ['chat', 'reasoning', 'fitness']
  },

  deepseek: {
    name: 'DeepSeek V3.2',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: process.env.VITE_DEEPSEEK_API_KEY || '',
    costPerMillionTokens: {
      input: 5.04,  // $0.28 USD × 18
      output: 7.56  // $0.42 USD × 18
    },
    reliability: 98,
    maxTokens: 128000,
    features: ['chat', 'analysis', 'coaching', 'nutrition']
  },

  zhipuai: {
    name: 'Zhipu AI GLM-4.6',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    apiKey: process.env.VITE_ZHIPU_API_KEY || '',
    costPerMillionTokens: {
      input: 10.80, // $0.60 USD × 18
      output: 39.60  // $2.20 USD × 18
    },
    reliability: 97,
    maxTokens: 200000,
    features: ['chat', 'coding', 'analysis', 'multimodal']
  },

  qwen: {
    name: 'Alibaba Qwen-Plus',
    endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    apiKey: process.env.VITE_QWEN_API_KEY || '',
    costPerMillionTokens: {
      input: 7.20,  // $0.40 USD × 18
      output: 21.60  // $1.20 USD × 18
    },
    reliability: 96,
    maxTokens: 1000000,
    features: ['chat', 'thinking', 'context', 'multimodal']
  }
};

// Precios en MXN actualizados Noviembre 2025
export const PRICING_MXN = {
  byteDance: {
    input: 2.16,  // MXN por 1M tokens
    output: 5.22   // MXN por 1M tokens
  },
  deepseek: {
    input: 5.04,
    output: 7.56
  },
  zhipuai: {
    input: 10.80,
    output: 39.60
  },
  qwen: {
    input: 7.20,
    output: 21.60
  }
};

export const calculateCost = (
  apiName: keyof typeof CHINESE_APIS,
  inputTokens: number,
  outputTokens: number
): number => {
  const pricing = PRICING_MXN[apiName];
  const inputCost = (inputTokens / 1000000) * pricing.input;
  const outputCost = (outputTokens / 1000000) * pricing.output;
  return inputCost + outputCost;
};