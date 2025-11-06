import { CHINESE_APIS, calculateCost } from './chinese-apis';

export interface TaskRequest {
  type: 'chat' | 'coaching' | 'nutrition' | 'analysis' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTokens?: {
    input: number;
    output: number;
  };
  userTier: 'basic' | 'premium' | 'enterprise';
  context?: string;
}

export interface APISelection {
  primary: string;
  fallback?: string;
  estimatedCost: number;
  reasoning: string;
}

export class CostOptimizer {
  private static instance: CostOptimizer;

  // Estrategia de asignación optimizada para costos
  private getTaskStrategy(task: TaskRequest): APISelection {
    const strategies = {
      // 80% de tareas - ultra económicas
      'chat_low_simple': {
        primary: 'bytedance',
        fallback: 'deepseek',
        maxBudget: 0.50 // MXN
      },

      // 15% de tareas - balance calidad/costo
      'coaching_moderate': {
        primary: 'deepseek',
        fallback: 'zhipuai',
        maxBudget: 2.00 // MXN
      },

      // 4% de tareas - mayor calidad
      'nutrition_complex': {
        primary: 'qwen',
        fallback: 'zhipuai',
        maxBudget: 5.00 // MXN
      },

      // 1% de tareas - máxima calidad
      'emergency_critical': {
        primary: 'zhipuai',
        fallback: 'deepseek',
        maxBudget: 20.00 // MXN
      }
    };

    const strategyKey = `${task.type}_${task.complexity}`;
    return strategies[strategyKey] || strategies['chat_low_simple'];
  }

  async selectOptimalAPI(task: TaskRequest): Promise<APISelection> {
    const strategy = this.getTaskStrategy(task);

    // Estimar costos
    const estimatedTokens = task.estimatedTokens || {
      input: this.estimateInputTokens(task),
      output: this.estimateOutputTokens(task)
    };

    const primaryCost = calculateCost(
      strategy.primary as keyof typeof CHINESE_APIS,
      estimatedTokens.input,
      estimatedTokens.output
    );

    // Si el costo excede el presupuesto, usar fallback
    if (primaryCost > strategy.maxBudget && strategy.fallback) {
      const fallbackCost = calculateCost(
        strategy.fallback as keyof typeof CHINESE_APIS,
        estimatedTokens.input,
        estimatedTokens.output
      );

      return {
        primary: strategy.fallback,
        estimatedCost: fallbackCost,
        reasoning: `Costo primary (${primaryCost.toFixed(2)} MXN) excede presupuesto (${strategy.maxBudget} MXN). Usando fallback.`
      };
    }

    return {
      primary: strategy.primary,
      fallback: strategy.fallback,
      estimatedCost: primaryCost,
      reasoning: `API seleccionada para ${task.type}/${task.complexity} - Costo estimado: ${primaryCost.toFixed(2)} MXN`
    };
  }

  private estimateInputTokens(task: TaskRequest): number {
    const baseTokens = {
      chat: 150,
      coaching: 300,
      nutrition: 400,
      analysis: 800,
      emergency: 200
    };

    const complexityMultipliers = {
      simple: 1,
      moderate: 1.5,
      complex: 2.5
    };

    return Math.ceil(
      baseTokens[task.type] * complexityMultipliers[task.complexity]
    );
  }

  private estimateOutputTokens(task: TaskRequest): number {
    const baseOutputTokens = {
      chat: 100,
      coaching: 250,
      nutrition: 350,
      analysis: 600,
      emergency: 150
    };

    const complexityMultipliers = {
      simple: 1,
      moderate: 2,
      complex: 4
    };

    return Math.ceil(
      baseOutputTokens[task.type] * complexityMultipliers[task.complexity]
    );
  }

  // Análisis de costos para reportes
  getCostAnalysis(task: TaskRequest, selection: APISelection) {
    return {
      task,
      selectedAPI: selection.primary,
      estimatedCost: selection.estimatedCost,
      costPerToken: selection.estimatedCost / (task.estimatedTokens?.input || 0),
      reasoning: selection.reasoning,
      savings: this.calculateSavings(task, selection)
    };
  }

  private calculateSavings(task: TaskRequest, selection: APISelection): number {
    // Costo si usáramos API premium (GPT-5)
    const premiumCost = {
      input: 9.00,   // $0.50 USD × 18
      output: 7.20   // $0.40 USD × 18
    };

    const estimatedTokens = task.estimatedTokens || {
      input: this.estimateInputTokens(task),
      output: this.estimateOutputTokens(task)
    };

    const premiumTotalCost =
      (estimatedTokens.input / 1000000) * premiumCost.input +
      (estimatedTokens.output / 1000000) * premiumCost.output;

    return premiumTotalCost - selection.estimatedCost;
  }

  static getInstance(): CostOptimizer {
    if (!CostOptimizer.instance) {
      CostOptimizer.instance = new CostOptimizer();
    }
    return CostOptimizer.instance;
  }
}

export const costRouter = CostOptimizer.getInstance();