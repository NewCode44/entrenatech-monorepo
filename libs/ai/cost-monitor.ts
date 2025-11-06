// Sistema de monitoreo de costos en tiempo real
export interface CostMetrics {
  timestamp: number;
  totalCost: number;
  costBreakdown: {
    bytedance: number;
    deepseek: number;
    zhipuai: number;
    qwen: number;
    openai: number;
    anthropic: number;
    google: number;
    cohere: number;
  };
  tokenUsage: {
    total: number;
    input: number;
    output: number;
    cached: number;
  };
  requests: {
    total: number;
    successful: number;
    failed: number;
    fallbacks: number;
  };
  users: {
    active: number;
    premium: number;
    averageCostPerUser: number;
  };
}

export interface CostAlert {
  type: 'budget_warning' | 'spike_detection' | 'cost_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  currentCost: number;
  threshold: number;
  recommendations: string[];
}

export class CostMonitor {
  private static instance: CostMonitor;
  private metrics: CostMetrics[] = [];
  private alerts: CostAlert[] = [];
  private dailyBudget: number = 50000; // $50,000 MXN/mes
  private hourlyBudget: number;
  private costHistory: Map<number, number> = new Map();

  constructor() {
    this.hourlyBudget = this.dailyBudget / 24;
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    // Limpiar métricas antiguas (más de 7 días)
    this.cleanupOldMetrics();

    // Iniciar monitoreo cada 5 minutos
    setInterval(() => {
      this.generateCostAlerts();
    }, 300000); // 5 minutos

    // Generar reporte diario
    setInterval(() => {
      this.generateDailyReport();
    }, 86400000); // 24 horas
  }

  // Registrar uso de API
  recordAPIUsage(
    apiName: string,
    inputTokens: number,
    outputTokens: number,
    cost: number,
    userId: string,
    success: boolean,
    fallbackUsed: boolean = false,
    cached: boolean = false
  ): void {
    const timestamp = Date.now();
    const hour = Math.floor(timestamp / (1000 * 60 * 60));

    // Actualizar métricas actuales
    const currentMetrics = this.getCurrentMetrics();
    currentMetrics.timestamp = timestamp;
    currentMetrics.totalCost += cost;
    currentMetrics.costBreakdown[apiName] += cost;
    currentMetrics.tokenUsage.total += inputTokens + outputTokens;
    currentMetrics.tokenUsage.input += inputTokens;
    currentMetrics.tokenUsage.output += outputTokens;
    currentMetrics.tokenUsage.cached += cached ? inputTokens + outputTokens : 0;
    currentMetrics.requests.total += 1;
    currentMetrics.requests.successful += success ? 1 : 0;
    currentMetrics.requests.failed += success ? 0 : 1;
    currentMetrics.requests.fallbacks += fallbackUsed ? 1 : 0;

    // Actualizar costo por usuario
    this.updateUserMetrics(userId, cost);

    // Guardar en historial
    this.metrics.push(currentMetrics);

    // Guardar en historial por hora
    const hourCost = this.costHistory.get(hour) || 0;
    this.costHistory.set(hour, hourCost + cost);

    // Detectar anomalías
    this.detectCostAnomalies(apiName, cost, timestamp);
  }

  private getCurrentMetrics(): CostMetrics {
    if (this.metrics.length === 0) {
      return this.createEmptyMetrics();
    }

    return {
      ...this.metrics[this.metrics.length - 1],
      timestamp: Date.now()
    };
  }

  private createEmptyMetrics(): CostMetrics {
    return {
      timestamp: Date.now(),
      totalCost: 0,
      costBreakdown: {
        bytedance: 0,
        deepseek: 0,
        zhipuai: 0,
        qwen: 0,
        openai: 0,
        anthropic: 0,
        google: 0,
        cohere: 0
      },
      tokenUsage: {
        total: 0,
        input: 0,
        output: 0,
        cached: 0
      },
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        fallbacks: 0
      },
      users: {
        active: 0,
        premium: 0,
        averageCostPerUser: 0
      }
    };
  }

  private updateUserMetrics(userId: string, cost: number): void {
    // Actualizar usuarios activos y promedios
    const currentMetrics = this.metrics[this.metrics.length - 1];
    // Esto se actualizaría con datos reales de usuarios activos
    currentMetrics.users.averageCostPerUser = currentMetrics.totalCost / Math.max(1, currentMetrics.users.active);
  }

  private detectCostAnomalies(apiName: string, cost: number, timestamp: number): void {
    const hour = Math.floor(timestamp / (1000 * 60 * 60));
    const hourCost = this.costHistory.get(hour) || 0;

    // Detectar spike en costos
    const averageHourlyCost = this.calculateAverageHourlyCost();
    if (hourCost > averageHourlyCost * 3) {
      this.addAlert({
        type: 'spike_detection',
        severity: 'high',
        message: `Spike de costo detectado: $${hourCost.toFixed(2)} MXN esta hora (promedio: $${averageHourlyCost.toFixed(2)} MXN)`,
        currentCost: hourCost,
        threshold: averageHourlyCost * 3,
        recommendations: [
          'Revisar uso anormal de APIs',
          'Verificar posibles loops infinitos',
          'Considerar throttling de requests'
        ]
      });
    }

    // Detectar anomalías por API específica
    const apiAverageCost = this.getAPIAverageCost(apiName);
    if (cost > apiAverageCost * 5) {
      this.addAlert({
        type: 'cost_anomaly',
        severity: 'medium',
        message: `Anomalía en ${apiName}: $${cost.toFixed(2)} MXN (promedio: $${apiAverageCost.toFixed(2)} MXN)`,
        currentCost: cost,
        threshold: apiAverageCost * 5,
        recommendations: [
          'Verificar prompts muy largos',
          'Optimizar uso de caché',
          'Revisar lógica de fallback'
        ]
      });
    }
  }

  private calculateAverageHourlyCost(): number {
    const costs = Array.from(this.costHistory.values());
    if (costs.length === 0) return 0;

    const recentCosts = costs.slice(-24); // Últimas 24 horas
    return recentCosts.reduce((sum, cost) => sum + cost, 0) / recentCosts.length;
  }

  private getAPIAverageCost(apiName: string): number {
    const recentMetrics = this.metrics.slice(-100); // Últimas 100 métricas
    const apiCosts = recentMetrics.map(m => m.costBreakdown[apiName]).filter(c => c > 0);

    if (apiCosts.length === 0) return 0;
    return apiCosts.reduce((sum, cost) => sum + cost, 0) / apiCosts.length;
  }

  private generateCostAlerts(): void {
    const currentMetrics = this.getCurrentMetrics();
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
    const hourCost = this.costHistory.get(currentHour) || 0;

    // Alerta de presupuesto
    if (hourCost > this.hourlyBudget * 0.8) {
      this.addAlert({
        type: 'budget_warning',
        severity: 'medium',
        message: `Alto uso de costos: $${hourCost.toFixed(2)} MXN de $${this.hourlyBudget.toFixed(2)} MXN (${((hourCost / this.hourlyBudget) * 100).toFixed(1)}%)`,
        currentCost: hourCost,
        threshold: this.hourlyBudget * 0.8,
        recommendations: [
          'Considerar reducir uso de APIs premium',
          'Optimizar caché',
          'Implementar rate limiting'
        ]
      });
    }

    // Alerta crítica
    if (hourCost > this.hourlyBudget) {
      this.addAlert({
        type: 'budget_warning',
        severity: 'critical',
        message: `PRESUPUESTO EXCEDIDO: $${hourCost.toFixed(2)} MXN de $${this.hourlyBudget.toFixed(2)} MXN`,
        currentCost: hourCost,
        threshold: this.hourlyBudget,
        recommendations: [
          'Implementar throttling inmediato',
          'Detener servicios no críticos',
          'Contactar al equipo técnico'
        ]
      });
    }
  }

  private addAlert(alert: CostAlert): void {
    this.alerts.push(alert);

    // Mantener solo las últimas 100 alertas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Enviar notificación para alertas críticas
    if (alert.severity === 'critical') {
      this.sendCriticalAlert(alert);
    }
  }

  private async sendCriticalAlert(alert: CostAlert): Promise<void> {
    // Aquí se implementaría el envío de notificaciones
    // Por ahora, solo logueamos en consola
    console.error('🚨 ALERTA CRÍTICA DE COSTOS:', alert);
  }

  private generateDailyReport(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
    const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

    const dayMetrics = this.metrics.filter(
      m => m.timestamp >= yesterdayStart.getTime() && m.timestamp <= yesterdayEnd.getTime()
    );

    if (dayMetrics.length === 0) return;

    const totalCost = dayMetrics[dayMetrics.length - 1].totalCost;
    const dayMetricsStart = dayMetrics[0];
    const dayCostIncrease = totalCost - (dayMetrics.length > 1 ? dayMetrics[dayMetrics.length - 2].totalCost : 0);

    const report = {
      date: yesterdayStart.toISOString().split('T')[0],
      totalCost: totalCost.toFixed(2),
      dayCostIncrease: dayCostIncrease.toFixed(2),
      averageHourlyCost: (totalCost / 24).toFixed(2),
      totalRequests: dayMetrics[dayMetrics.length - 1].requests.total,
      successRate: `${((dayMetrics[dayMetrics.length - 1].requests.successful / dayMetrics[dayMetrics.length - 1].requests.total) * 100).toFixed(1)}%`,
      cacheHitRate: `${((dayMetrics[dayMetrics.length - 1].tokenUsage.cached / dayMetrics[dayMetrics.length - 1].tokenUsage.total) * 100).toFixed(1)}%`,
      topAPIs: this.getTopCosts(dayMetrics[dayMetrics.length - 1]),
      alerts: this.getAlertsForPeriod(yesterdayStart, yesterdayEnd)
    };

    console.log('📊 REPORTE DIARIO DE COSTOS:', report);
  }

  private getTopCosts(metrics: CostMetrics): Array<{ api: string; cost: number; percentage: number }> {
    const costs = Object.entries(metrics.costBreakdown)
      .filter(([_, cost]) => cost > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([api, cost]) => ({
        api,
        cost,
        percentage: (cost / metrics.totalCost) * 100
      }));

    return costs.slice(0, 5);
  }

  private getAlertsForPeriod(start: Date, end: Date): number {
    return this.alerts.filter(
      alert => alert.timestamp >= start.getTime() && alert.timestamp <= end.getTime()
    ).length;
  }

  private cleanupOldMetrics(): void {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > sevenDaysAgo);
  }

  // Métodos públicos para obtener métricas
  getRealTimeMetrics(): CostMetrics {
    return this.getCurrentMetrics();
  }

  getCurrentHourCost(): number {
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
    return this.costHistory.get(currentHour) || 0;
  }

  getDailyCostToDate(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    return Array.from(this.costHistory.values())
      .filter((_, hour) => hour >= todayStart / (1000 * 60 * 60))
      .reduce((sum, cost) => sum + cost, 0);
  }

  getActiveAlerts(): CostAlert[] {
    return this.alerts.filter(alert =>
      alert.timestamp > Date.now() - (60 * 60 * 1000) // Última hora
    );
  }

  static getInstance(): CostMonitor {
    if (!CostMonitor.instance) {
      CostMonitor.instance = new CostMonitor();
    }
    return CostMonitor.instance;
  }
}

export const costMonitor = CostMonitor.getInstance();