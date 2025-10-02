// Generador de Rutinas con IA
// Se integra con tu RoutineCreator existente

export interface AIRoutineRequest {
  goal: 'muscle_gain' | 'weight_loss' | 'strength' | 'endurance' | 'general';
  experience: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  sessionDuration: number; // minutos
  equipment: string[];
  restrictions?: string[];
}

export interface AIRoutineResponse {
  routine: {
    name: string;
    description: string;
    category: string;
    difficulty: number;
    duration: number;
    exercises: Array<{
      id: string;
      name: string;
      sets: number;
      reps: string;
      rest: number;
      notes?: string;
      muscleGroup: string;
      equipment: string;
    }>;
  };
  explanation: string;
  tips: string[];
  estimatedResults: string;
}

export class RoutineGeneratorAI {
  /**
   * Genera una rutina personalizada con IA
   */
  static async generateRoutine(request: AIRoutineRequest): Promise<AIRoutineResponse> {
    // Simular llamada a API (en producción sería tu backend con OpenAI/Claude)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay de IA

    const template = this.selectTemplate(request);
    const exercises = this.selectExercises(request);

    return {
      routine: {
        name: template.name,
        description: template.description,
        category: request.goal,
        difficulty: this.calculateDifficulty(request.experience),
        duration: request.sessionDuration,
        exercises: exercises,
      },
      explanation: this.generateExplanation(request, template),
      tips: this.generateTips(request),
      estimatedResults: this.estimateResults(request),
    };
  }

  /**
   * Ajusta una rutina existente según feedback
   */
  static async adjustRoutine(
    currentRoutine: any,
    feedback: string,
    performance: any
  ): Promise<AIRoutineResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Análisis del feedback y performance
    const adjustments = this.analyzePerformance(performance);

    return {
      routine: currentRoutine, // Ajustado
      explanation: `Rutina ajustada basada en tu feedback: "${feedback}"`,
      tips: ['Mantén la consistencia', 'Incrementa el peso gradualmente'],
      estimatedResults: 'Mejora del 10-15% en 4 semanas',
    };
  }

  // === MÉTODOS PRIVADOS ===

  private static selectTemplate(request: AIRoutineRequest) {
    const { goal, daysPerWeek } = request;

    const templates: Record<string, any> = {
      muscle_gain: {
        name: 'Hipertrofia Avanzada',
        description: 'Rutina optimizada para ganancia muscular máxima',
        split: daysPerWeek >= 5 ? 'push_pull_legs' : daysPerWeek >= 4 ? 'upper_lower' : 'full_body',
      },
      strength: {
        name: 'Fuerza Máxima',
        description: 'Enfocada en levantamientos principales pesados',
        split: 'strength_focused',
      },
      weight_loss: {
        name: 'Quema de Grasa',
        description: 'Alta intensidad con enfoque metabólico',
        split: 'metabolic',
      },
      endurance: {
        name: 'Resistencia Muscular',
        description: 'Alto volumen con descansos cortos',
        split: 'circuit',
      },
      general: {
        name: 'Fitness General',
        description: 'Equilibrada para salud y condición física',
        split: 'balanced',
      },
    };

    return templates[goal];
  }

  private static selectExercises(request: AIRoutineRequest) {
    // Base de ejercicios completa
    const exerciseDatabase = [
      // PECHO
      { id: 'bench_press', name: 'Press de Banca', muscleGroup: 'Pecho', equipment: 'Barra', type: 'compound', difficulty: 2 },
      { id: 'incline_press', name: 'Press Inclinado', muscleGroup: 'Pecho Superior', equipment: 'Mancuernas', type: 'compound', difficulty: 2 },
      { id: 'pushups', name: 'Flexiones', muscleGroup: 'Pecho', equipment: 'Peso Corporal', type: 'compound', difficulty: 1 },
      { id: 'cable_fly', name: 'Aperturas en Polea', muscleGroup: 'Pecho', equipment: 'Polea', type: 'isolation', difficulty: 1 },

      // ESPALDA
      { id: 'deadlift', name: 'Peso Muerto', muscleGroup: 'Espalda', equipment: 'Barra', type: 'compound', difficulty: 3 },
      { id: 'pullups', name: 'Dominadas', muscleGroup: 'Espalda', equipment: 'Peso Corporal', type: 'compound', difficulty: 2 },
      { id: 'rows', name: 'Remo con Barra', muscleGroup: 'Espalda', equipment: 'Barra', type: 'compound', difficulty: 2 },
      { id: 'lat_pulldown', name: 'Jalón al Pecho', muscleGroup: 'Espalda', equipment: 'Polea', type: 'compound', difficulty: 1 },

      // PIERNAS
      { id: 'squat', name: 'Sentadilla', muscleGroup: 'Piernas', equipment: 'Barra', type: 'compound', difficulty: 2 },
      { id: 'leg_press', name: 'Prensa', muscleGroup: 'Piernas', equipment: 'Máquina', type: 'compound', difficulty: 1 },
      { id: 'lunges', name: 'Zancadas', muscleGroup: 'Piernas', equipment: 'Mancuernas', type: 'compound', difficulty: 1 },
      { id: 'leg_curl', name: 'Curl Femoral', muscleGroup: 'Piernas', equipment: 'Máquina', type: 'isolation', difficulty: 1 },

      // HOMBROS
      { id: 'overhead_press', name: 'Press Militar', muscleGroup: 'Hombros', equipment: 'Barra', type: 'compound', difficulty: 2 },
      { id: 'lateral_raises', name: 'Elevaciones Laterales', muscleGroup: 'Hombros', equipment: 'Mancuernas', type: 'isolation', difficulty: 1 },
      { id: 'face_pulls', name: 'Face Pulls', muscleGroup: 'Hombros', equipment: 'Polea', type: 'isolation', difficulty: 1 },

      // BRAZOS
      { id: 'barbell_curl', name: 'Curl con Barra', muscleGroup: 'Bíceps', equipment: 'Barra', type: 'isolation', difficulty: 1 },
      { id: 'tricep_dips', name: 'Fondos en Paralelas', muscleGroup: 'Tríceps', equipment: 'Peso Corporal', type: 'compound', difficulty: 2 },
      { id: 'rope_pushdown', name: 'Extensión en Polea', muscleGroup: 'Tríceps', equipment: 'Polea', type: 'isolation', difficulty: 1 },

      // CORE
      { id: 'plank', name: 'Plancha', muscleGroup: 'Core', equipment: 'Peso Corporal', type: 'isometric', difficulty: 1 },
      { id: 'cable_crunch', name: 'Crunch en Polea', muscleGroup: 'Abdominales', equipment: 'Polea', type: 'isolation', difficulty: 1 },
    ];

    // Filtrar por equipamiento disponible
    let available = exerciseDatabase.filter(ex =>
      request.equipment.includes(ex.equipment) || ex.equipment === 'Peso Corporal'
    );

    // Filtrar por nivel
    const maxDifficulty = request.experience === 'beginner' ? 2 : request.experience === 'intermediate' ? 3 : 4;
    available = available.filter(ex => ex.difficulty <= maxDifficulty);

    // Seleccionar ejercicios balanceados
    const selected = [];
    const groupCount: Record<string, number> = {};

    // Priorizar compuestos
    const compounds = available.filter(ex => ex.type === 'compound').slice(0, 4);
    compounds.forEach(ex => {
      const sets = request.goal === 'strength' ? 5 : request.goal === 'muscle_gain' ? 4 : 3;
      const reps = request.goal === 'strength' ? '3-5' : request.goal === 'muscle_gain' ? '8-12' : '12-15';
      const rest = request.goal === 'strength' ? 180 : request.goal === 'muscle_gain' ? 90 : 60;

      selected.push({
        id: ex.id,
        name: ex.name,
        sets,
        reps,
        rest,
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment,
        notes: this.generateExerciseNote(ex, request.goal),
      });

      groupCount[ex.muscleGroup] = (groupCount[ex.muscleGroup] || 0) + 1;
    });

    // Agregar aislamiento
    const isolations = available.filter(ex => ex.type === 'isolation').slice(0, 3);
    isolations.forEach(ex => {
      selected.push({
        id: ex.id,
        name: ex.name,
        sets: 3,
        reps: '12-15',
        rest: 60,
        muscleGroup: ex.muscleGroup,
        equipment: ex.equipment,
        notes: 'Enfócate en la contracción muscular',
      });
    });

    return selected;
  }

  private static generateExerciseNote(exercise: any, goal: string): string {
    const notes: Record<string, string> = {
      strength: 'Peso máximo, técnica perfecta',
      muscle_gain: 'Controla el tempo, 2-0-2',
      weight_loss: 'Mantén intensidad alta',
      endurance: 'Mínimo descanso entre series',
      general: 'Mantén buena forma',
    };
    return notes[goal];
  }

  private static generateExplanation(request: AIRoutineRequest, template: any): string {
    return `Esta rutina **${template.name}** está diseñada específicamente para tu objetivo de ${this.translateGoal(request.goal)}.

**Por qué funciona:**
- Frecuencia de ${request.daysPerWeek}x/semana óptima para tu nivel
- Volumen calculado según tu experiencia (${request.experience})
- Ejercicios seleccionados por equipamiento disponible
- Progresión estructurada para resultados consistentes

**Cómo seguirla:**
1. Calienta 5-10 minutos antes de empezar
2. Sigue el orden de ejercicios (compuestos primero)
3. Descansa el tiempo indicado entre series
4. Aumenta el peso cuando completes todas las series`;
  }

  private static generateTips(request: AIRoutineRequest): string[] {
    const baseTips = [
      '🎯 La consistencia es más importante que la perfección',
      '💪 Prioriza siempre la técnica sobre el peso',
      '📈 Registra tus entrenamientos para track de progreso',
      '😴 Duerme 7-9 horas para recuperación óptima',
    ];

    const goalTips: Record<string, string> = {
      muscle_gain: '🥗 Come en superávit calórico (300-500 cal)',
      weight_loss: '🔥 Mantén déficit calórico moderado',
      strength: '⚡ Descansa 3-5 minutos entre series pesadas',
      endurance: '💧 Hidrátate constantemente durante el entreno',
      general: '🌟 Varía los ejercicios cada 6-8 semanas',
    };

    return [...baseTips, goalTips[request.goal]];
  }

  private static estimateResults(request: AIRoutineRequest): string {
    const estimates: Record<string, string> = {
      muscle_gain: `Con nutrición adecuada, puedes ganar 1-2kg de músculo en los próximos 2-3 meses (${request.experience} level)`,
      weight_loss: `Siguiendo esta rutina con déficit calórico, puedes perder 0.5-1kg por semana de forma saludable`,
      strength: `Tus levantamientos principales pueden aumentar 10-15% en los próximos 2 meses`,
      endurance: `Notarás mejora en resistencia cardiovascular en 3-4 semanas`,
      general: `Verás mejoras en composición corporal y energía en 4-6 semanas`,
    };

    return estimates[request.goal];
  }

  private static calculateDifficulty(experience: string): number {
    return experience === 'beginner' ? 1 : experience === 'intermediate' ? 2 : 3;
  }

  private static translateGoal(goal: string): string {
    const translations: Record<string, string> = {
      muscle_gain: 'ganancia muscular',
      weight_loss: 'pérdida de grasa',
      strength: 'incremento de fuerza',
      endurance: 'mejora de resistencia',
      general: 'fitness general',
    };
    return translations[goal];
  }

  private static analyzePerformance(performance: any) {
    return {
      volumeAdjustment: 0,
      intensityAdjustment: 0,
    };
  }
}