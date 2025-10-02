// AI Nutrition Generator - Planes nutricionales personalizados

export interface NutritionProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_fat' | 'maintain' | 'gain_muscle' | 'recomp';
  dietaryRestrictions?: string[];
  allergies?: string[];
}

export interface MacroTargets {
  calories: number;
  protein: number; // gramos
  carbs: number; // gramos
  fats: number; // gramos
  explanation: string;
}

export interface MealPlan {
  id: string;
  name: string;
  meals: Meal[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  shoppingList: string[];
  prepTime: number; // minutos
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  recipe?: string;
}

export interface Food {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export class NutritionAI {
  /**
   * Calcula macros objetivo personalizados
   */
  static calculateMacros(profile: NutritionProfile): MacroTargets {
    // Calcular TDEE (Total Daily Energy Expenditure)
    const bmr = this.calculateBMR(profile);
    const activityMultiplier = this.getActivityMultiplier(profile.activityLevel);
    const tdee = bmr * activityMultiplier;

    // Ajustar calorías según objetivo
    let targetCalories = tdee;
    let explanation = '';

    switch (profile.goal) {
      case 'lose_fat':
        targetCalories = tdee * 0.8; // Déficit 20%
        explanation = 'Déficit calórico moderado (20%) para pérdida de grasa sostenible de 0.5-1kg/semana';
        break;
      case 'gain_muscle':
        targetCalories = tdee * 1.15; // Superávit 15%
        explanation = 'Superávit calórico controlado (15%) para ganancia muscular magra';
        break;
      case 'recomp':
        targetCalories = tdee; // Mantenimiento
        explanation = 'Calorías de mantenimiento con alta proteína para recomposición corporal';
        break;
      case 'maintain':
        targetCalories = tdee;
        explanation = 'Calorías de mantenimiento para conservar peso y composición actual';
        break;
    }

    // Calcular macros
    const protein = this.calculateProtein(profile);
    const fats = this.calculateFats(profile, targetCalories);
    const carbs = (targetCalories - (protein * 4) - (fats * 9)) / 4;

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      explanation
    };
  }

  /**
   * Genera plan de comidas completo con IA
   */
  static async generateMealPlan(
    profile: NutritionProfile,
    macros: MacroTargets,
    days: number = 7
  ): Promise<MealPlan> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Ejemplo: Plan para un día
    const meals: Meal[] = [
      {
        id: 'breakfast',
        name: 'Desayuno',
        time: '08:00',
        foods: [
          { name: 'Avena', amount: '80g', calories: 304, protein: 10, carbs: 54, fats: 6 },
          { name: 'Plátano', amount: '1 mediano', calories: 105, protein: 1, carbs: 27, fats: 0 },
          { name: 'Mantequilla de maní', amount: '15g', calories: 94, protein: 4, carbs: 3, fats: 8 },
          { name: 'Proteína whey', amount: '30g', calories: 120, protein: 24, carbs: 3, fats: 2 }
        ],
        macros: { calories: 623, protein: 39, carbs: 87, fats: 16 },
        recipe: '1. Cocina la avena con agua\n2. Añade el plátano en rodajas\n3. Mezcla la mantequilla de maní\n4. Prepara el batido de proteína aparte'
      },
      {
        id: 'lunch',
        name: 'Almuerzo',
        time: '13:00',
        foods: [
          { name: 'Pechuga de pollo', amount: '200g', calories: 330, protein: 62, carbs: 0, fats: 7 },
          { name: 'Arroz integral', amount: '150g cocido', calories: 195, protein: 4, carbs: 41, fats: 1 },
          { name: 'Brócoli', amount: '200g', calories: 68, protein: 6, carbs: 14, fats: 0 },
          { name: 'Aceite de oliva', amount: '10g', calories: 90, protein: 0, carbs: 0, fats: 10 }
        ],
        macros: { calories: 683, protein: 72, carbs: 55, fats: 18 }
      },
      {
        id: 'snack',
        name: 'Merienda',
        time: '16:30',
        foods: [
          { name: 'Yogurt griego', amount: '170g', calories: 100, protein: 17, carbs: 6, fats: 0 },
          { name: 'Almendras', amount: '28g', calories: 164, protein: 6, carbs: 6, fats: 14 },
          { name: 'Manzana', amount: '1 mediana', calories: 95, protein: 0, carbs: 25, fats: 0 }
        ],
        macros: { calories: 359, protein: 23, carbs: 37, fats: 14 }
      },
      {
        id: 'dinner',
        name: 'Cena',
        time: '20:00',
        foods: [
          { name: 'Salmón', amount: '180g', calories: 367, protein: 40, carbs: 0, fats: 22 },
          { name: 'Camote', amount: '200g', calories: 180, protein: 4, carbs: 41, fats: 0 },
          { name: 'Espárragos', amount: '150g', calories: 30, protein: 3, carbs: 6, fats: 0 }
        ],
        macros: { calories: 577, protein: 47, carbs: 47, fats: 22 }
      }
    ];

    const totalMacros = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.macros.calories,
        protein: acc.protein + meal.macros.protein,
        carbs: acc.carbs + meal.macros.carbs,
        fats: acc.fats + meal.macros.fats
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    return {
      id: 'plan-1',
      name: `Plan ${profile.goal === 'lose_fat' ? 'Pérdida de Grasa' : profile.goal === 'gain_muscle' ? 'Ganancia Muscular' : 'Mantenimiento'}`,
      meals,
      totalMacros,
      shoppingList: [
        'Avena (560g)',
        'Plátanos (7)',
        'Mantequilla de maní (1 frasco)',
        'Proteína whey (1 contenedor)',
        'Pechuga de pollo (1.4kg)',
        'Arroz integral (1kg)',
        'Brócoli fresco (1.4kg)',
        'Aceite de oliva extra virgen',
        'Yogurt griego natural (1.2L)',
        'Almendras (200g)',
        'Manzanas (7)',
        'Salmón fresco (1.2kg)',
        'Camotes (1.4kg)',
        'Espárragos frescos (1kg)'
      ],
      prepTime: 45,
      difficulty: 'medium'
    };
  }

  /**
   * Ajusta plan según feedback
   */
  static async adjustPlan(
    currentPlan: MealPlan,
    feedback: string,
    compliance: number // 0-100
  ): Promise<{ suggestions: string[]; adjustedMacros?: MacroTargets }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const suggestions: string[] = [];

    if (compliance < 60) {
      suggestions.push('El cumplimiento es bajo. Considera simplificar las comidas');
      suggestions.push('Agrega comidas preparadas con anticipación los domingos');
      suggestions.push('Permite 1-2 comidas "flexibles" por semana');
    }

    if (feedback.toLowerCase().includes('hambre')) {
      suggestions.push('Incrementa fibra: más vegetales y granos integrales');
      suggestions.push('Distribuye proteína equitativamente en todas las comidas');
      suggestions.push('Considera añadir una merienda adicional');
    }

    if (feedback.toLowerCase().includes('cansancio') || feedback.toLowerCase().includes('energía')) {
      suggestions.push('Incrementa carbohidratos pre-entrenamiento en +30g');
      suggestions.push('Verifica hidratación: min 2.5L agua diaria');
      suggestions.push('Revisa calidad de sueño (7-9h)');
    }

    return { suggestions };
  }

  /**
   * Genera recetas saludables con IA
   */
  static async generateRecipe(
    targetMacros: { calories: number; protein: number },
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    restrictions: string[] = []
  ): Promise<{
    name: string;
    ingredients: string[];
    instructions: string[];
    macros: { calories: number; protein: number; carbs: number; fats: number };
    prepTime: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    // Ejemplo de receta generada
    return {
      name: 'Pollo Teriyaki con Arroz de Coliflor',
      ingredients: [
        '300g pechuga de pollo',
        '300g arroz de coliflor',
        '2 tbsp salsa teriyaki baja en azúcar',
        '1 tbsp aceite de sésamo',
        '100g edamame',
        'Jengibre y ajo al gusto'
      ],
      instructions: [
        'Corta el pollo en cubos y marina con teriyaki 10 min',
        'Saltea el pollo en aceite de sésamo 8-10 min',
        'Cocina el arroz de coliflor al vapor 5 min',
        'Mezcla todo y añade edamame',
        'Sirve caliente'
      ],
      macros: {
        calories: 520,
        protein: 58,
        carbs: 32,
        fats: 16
      },
      prepTime: 25
    };
  }

  // === MÉTODOS PRIVADOS ===

  private static calculateBMR(profile: NutritionProfile): number {
    // Mifflin-St Jeor Equation
    if (profile.gender === 'male') {
      return (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
    } else {
      return (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
    }
  }

  private static getActivityMultiplier(level: string): number {
    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    return multipliers[level] || 1.55;
  }

  private static calculateProtein(profile: NutritionProfile): number {
    // Basado en objetivo
    let proteinPerKg = 1.6; // default

    switch (profile.goal) {
      case 'lose_fat':
        proteinPerKg = 2.0; // Alta proteína para preservar músculo
        break;
      case 'gain_muscle':
        proteinPerKg = 2.2; // Máxima síntesis proteica
        break;
      case 'recomp':
        proteinPerKg = 2.4; // Muy alta para recomp
        break;
      case 'maintain':
        proteinPerKg = 1.8;
        break;
    }

    return profile.weight * proteinPerKg;
  }

  private static calculateFats(profile: NutritionProfile, calories: number): number {
    // 25-30% de calorías totales
    const percentage = profile.goal === 'lose_fat' ? 0.25 : 0.30;
    return (calories * percentage) / 9;
  }
}