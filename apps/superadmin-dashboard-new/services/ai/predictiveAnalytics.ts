// Predictive Analytics con IA
// Predice churn, identifica tendencias y genera insights accionables

export interface ChurnPrediction {
  memberId: string;
  memberName: string;
  churnRisk: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  reasons: string[];
  recommendations: string[];
}

export interface TrendInsight {
  metric: string;
  trend: 'up' | 'down' | 'stable';
  change: number; // porcentaje
  prediction: string;
  impact: 'positive' | 'negative' | 'neutral';
  icon: string;
}

export interface RevenueForecaste {
  period: string;
  predicted: number;
  confidence: number; // 0-1
  factors: string[];
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
  icon: string;
}

export class PredictiveAnalyticsAI {
  /**
   * Predice qué miembros están en riesgo de cancelar
   */
  static async predictChurnRisk(members?: any[]): Promise<ChurnPrediction[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulación basada en patrones reales de churn
    const predictions: ChurnPrediction[] = [
      {
        memberId: 'M001',
        memberName: 'Carlos Méndez',
        churnRisk: 'high',
        riskScore: 82,
        reasons: [
          'No asiste hace 2 semanas',
          'Llamadas sin responder (3)',
          'Plan vence en 5 días',
          'No usa app móvil'
        ],
        recommendations: [
          'Llamada personal del gerente',
          'Ofrecer descuento de retención 20%',
          'Sesión gratis con entrenador personal',
          'Recordatorio de beneficios no usados'
        ]
      },
      {
        memberId: 'M005',
        memberName: 'Ana Torres',
        churnRisk: 'medium',
        riskScore: 58,
        reasons: [
          'Asistencia bajó 40% último mes',
          'Últimas 3 visitas: menos de 30 min',
          'No participa en clases grupales'
        ],
        recommendations: [
          'Invitar a clase grupal nueva',
          'Email con motivación personalizada',
          'Check-in: ¿cómo podemos ayudar?'
        ]
      },
      {
        memberId: 'M012',
        memberName: 'Roberto Díaz',
        churnRisk: 'high',
        riskScore: 75,
        reasons: [
          'Membresía vence en 3 días',
          'No renovó automáticamente',
          'Bajó de Plan Premium a Básico'
        ],
        recommendations: [
          'Ofrecer pago flexible',
          'Destacar mejoras recientes del gym',
          'Descuento por renovación anticipada'
        ]
      }
    ];

    return predictions;
  }

  /**
   * Analiza tendencias clave y genera predicciones
   */
  static async analyzeTrends(): Promise<TrendInsight[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    return [
      {
        metric: 'Nuevos Miembros',
        trend: 'up',
        change: 18,
        prediction: 'Crecimiento sostenido. Proyección: +25 miembros próximo mes',
        impact: 'positive',
        icon: 'TrendingUp'
      },
      {
        metric: 'Tasa de Retención',
        trend: 'down',
        change: -5,
        prediction: 'Atención: Incremento en cancelaciones. Revisar experiencia del cliente',
        impact: 'negative',
        icon: 'AlertTriangle'
      },
      {
        metric: 'Ingresos por Miembro',
        trend: 'stable',
        change: 2,
        prediction: 'Estable. Oportunidad: upselling de servicios premium',
        impact: 'neutral',
        icon: 'DollarSign'
      },
      {
        metric: 'Asistencia a Clases',
        trend: 'up',
        change: 12,
        prediction: 'Clases populares: HIIT y Yoga. Considera agregar más horarios',
        impact: 'positive',
        icon: 'Users'
      }
    ];
  }

  /**
   * Genera forecast de ingresos con IA
   */
  static async forecastRevenue(months: number = 3): Promise<RevenueForecaste[]> {
    await new Promise(resolve => setTimeout(resolve, 700));

    const baseRevenue = 45000;
    const forecasts: RevenueForecaste[] = [];

    for (let i = 1; i <= months; i++) {
      const growth = 0.08 * i; // 8% crecimiento mensual
      const variance = (Math.random() - 0.5) * 0.1; // varianza ±5%

      forecasts.push({
        period: this.getMonthName(i),
        predicted: Math.round(baseRevenue * (1 + growth + variance)),
        confidence: 0.85 - (i * 0.05), // confianza disminuye con el tiempo
        factors: [
          'Tendencia histórica de crecimiento',
          'Estacionalidad (verano +15%)',
          'Plan de marketing activo',
          'Competencia en la zona'
        ]
      });
    }

    return forecasts;
  }

  /**
   * Genera insights accionables con IA
   */
  static async generateInsights(): Promise<AIInsight[]> {
    await new Promise(resolve => setTimeout(resolve, 900));

    return [
      {
        id: 'insight-1',
        type: 'opportunity',
        title: 'Oportunidad de Upselling',
        description: '23 miembros del plan básico asisten más de 4 días/semana. Alta probabilidad de upgrade a plan premium.',
        priority: 'high',
        action: 'Crear campaña de upgrade',
        icon: 'TrendingUp'
      },
      {
        id: 'insight-2',
        type: 'warning',
        title: 'Riesgo de Churn Elevado',
        description: '8 miembros con alta probabilidad de cancelación en los próximos 15 días. Valor en riesgo: $3,200/mes.',
        priority: 'high',
        action: 'Ver lista de riesgo',
        icon: 'AlertCircle'
      },
      {
        id: 'insight-3',
        type: 'opportunity',
        title: 'Horario Pico: 6-8 PM',
        description: 'Clases grupales en horario 6-8 PM tienen lista de espera. Considera duplicar capacidad.',
        priority: 'medium',
        action: 'Revisar horarios',
        icon: 'Clock'
      },
      {
        id: 'insight-4',
        type: 'info',
        title: 'Nuevos Miembros: Patrón de Edad',
        description: '65% de nuevos miembros tienen 25-35 años. Ajusta marketing para este segmento.',
        priority: 'low',
        action: 'Ver demografía',
        icon: 'Users'
      },
      {
        id: 'insight-5',
        type: 'opportunity',
        title: 'Entrenadores Populares',
        description: 'Entrenadoras María y Laura tienen 95% satisfacción. Destácalas en marketing.',
        priority: 'medium',
        action: 'Ver stats de entrenadores',
        icon: 'Star'
      },
      {
        id: 'insight-6',
        type: 'warning',
        title: 'Equipamiento: Uso Intensivo',
        description: 'Caminadoras y máquinas de peso tienen uso 90%+ en horas pico. Considera mantenimiento preventivo.',
        priority: 'medium',
        action: 'Programar mantenimiento',
        icon: 'Wrench'
      }
    ];
  }

  // === MÉTODOS AUXILIARES ===

  private static getMonthName(offset: number): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    const targetMonth = (currentMonth + offset) % 12;
    return months[targetMonth];
  }

  /**
   * Calcula score de salud del negocio (0-100)
   */
  static async calculateBusinessHealth(): Promise<{
    score: number;
    grade: string;
    factors: Array<{ name: string; score: number; weight: number }>;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const factors = [
      { name: 'Retención de Miembros', score: 78, weight: 0.3 },
      { name: 'Crecimiento Mensual', score: 85, weight: 0.25 },
      { name: 'Salud Financiera', score: 92, weight: 0.25 },
      { name: 'Satisfacción del Cliente', score: 88, weight: 0.2 }
    ];

    const score = factors.reduce((acc, f) => acc + (f.score * f.weight), 0);
    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';

    return { score: Math.round(score), grade, factors };
  }
}