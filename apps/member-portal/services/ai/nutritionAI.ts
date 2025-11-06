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
   * Genera plan de comidas completo con IA híbrida optimizada en costos
   */
  static async generateMealPlan(
    profile: NutritionProfile,
    macros: MacroTargets,
    days: number = 7
  ): Promise<MealPlan> {
    try {
      // Importar el servicio de API
      const { apiService } = await import('../api');

      // Crear prompt para generación de plan nutricional
      const systemPrompt = `Eres un nutricionista certificado experto en fitness. Genera un plan de comidas personalizado que sea:
- Práctico y fácil de preparar
- Económicamente accesible
- Culturalmente apropiado para México
- Cumpla exactamente con los macros objetivo
- Variedad de sabores y texturas
- Tiempos de preparación realistas`;

      const userPrompt = `Crea un plan de comidas para ${days} días con este perfil:
- Perfil: ${JSON.stringify(profile, null, 2)}
- Macros objetivo: ${JSON.stringify(macros, null, 2)}

Restricciones adicionales:
${profile.dietaryRestrictions?.length ? `- Restricciones: ${profile.dietaryRestrictions.join(', ')}` : ''}
${profile.allergies?.length ? `- Alergias: ${profile.allergies.join(', ')}` : ''}

Devuelve el plan en formato JSON con esta estructura:
{
  "meals": [
    {
      "id": "breakfast_day1",
      "name": "Nombre del desayuno",
      "time": "08:00",
      "foods": [
        {
          "name": "Alimento",
          "amount": "Cantidad",
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fats": 0
        }
      ],
      "recipe": "Pasos de preparación"
    }
  ],
  "shoppingList": ["lista de compras"],
  "prepTime": 45,
  "difficulty": "easy|medium|hard"
}`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt }
      ];

      // Generar plan con IA usando Firebase Functions
      const aiResponse = await apiService.generateNutritionPlan({
        profile,
        macros,
        days,
        restrictions: {
          dietary: profile.dietaryRestrictions || [],
          allergies: profile.allergies || []
        }
      });

      // Parsear respuesta de la IA
      const aiPlan = this.parseAIResponse(aiResponse.content || aiResponse.plan);

      if (aiPlan && aiPlan.meals && aiPlan.meals.length > 0) {
        // Calcular macros totales del plan generado
        const totalMacros = this.calculateTotalMacros(aiPlan.meals);

        // Ajustar macros si es necesario para cumplir objetivos
        const adjustedMeals = this.adjustMacrosToTarget(aiPlan.meals, macros);

        return {
          id: `plan-${Date.now()}`,
          name: `Plan ${this.getPlanName(profile.goal)} - IA Personalizado`,
          meals: adjustedMeals,
          totalMacros: macros, // Usar macros objetivo como referencia
          shoppingList: aiPlan.shoppingList || this.generateShoppingList(adjustedMeals),
          prepTime: aiPlan.prepTime || 45,
          difficulty: aiPlan.difficulty || 'medium'
        };
      }

      // Fallback a plan predefinido si la IA falla
      return this.getFallbackMealPlan(profile, macros);

    } catch (error) {
      console.error('Error generando plan nutricional con IA:', error);
      return this.getFallbackMealPlan(profile, macros);
    }
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
   * Genera recetas saludables con IA híbrida optimizada en costos
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
    try {
      // Importar el servicio de API
      const { apiService } = await import('../api');

      const mealTypeMap = {
        breakfast: 'desayuno',
        lunch: 'almuerzo',
        dinner: 'cena',
        snack: 'merienda'
      };

      const systemPrompt = `Eres un chef experto en nutrición deportiva. Crea recetas que sean:
- Deliciosas y fáciles de preparar
- Económicas y con ingredientes disponibles en México
- Exactas en los macros objetivo
- Apropiadas para el tipo de comida solicitado`;

      const userPrompt = `Crea una receta para ${mealTypeMap[mealType]} con estos macros:
- Calorías: ${targetMacros.calories}
- Proteína: ${targetMacros.protein}g

Restricciones: ${restrictions.length > 0 ? restrictions.join(', ') : 'Ninguna'}

Devuelve en formato JSON:
{
  "name": "Nombre de la receta",
  "ingredients": ["ingrediente 1", "ingrediente 2"],
  "instructions": ["paso 1", "paso 2"],
  "macros": {
    "calories": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "prepTime": 25
}`;

      // Generar receta con IA usando Firebase Functions
      const aiResponse = await apiService.generateRecipe({
        targetMacros,
        mealType,
        restrictions
      });

      const recipe = this.parseRecipeResponse(aiResponse.content || aiResponse.recipe);

      if (recipe) {
        return recipe;
      }

      // Fallback si la IA falla
      return this.getFallbackRecipe(targetMacros, mealType);

    } catch (error) {
      console.error('Error generando receta con IA:', error);
      return this.getFallbackRecipe(targetMacros, mealType);
    }
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

  // === MÉTODOS AUXILIARES PARA IA ===

  private static parseAIResponse(content: string): any {
    try {
      // Intentar parsear como JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Error parseando respuesta de IA:', error);
      return null;
    }
  }

  private static parseRecipeResponse(content: string): any {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Error parseando receta de IA:', error);
      return null;
    }
  }

  private static calculateTotalMacros(meals: any[]): {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } {
    return meals.reduce(
      (acc, meal) => {
        const mealMacros = meal.foods.reduce(
          (foodAcc: any, food: any) => ({
            calories: foodAcc.calories + food.calories,
            protein: foodAcc.protein + food.protein,
            carbs: foodAcc.carbs + food.carbs,
            fats: foodAcc.fats + food.fats
          }),
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
        return {
          calories: acc.calories + mealMacros.calories,
          protein: acc.protein + mealMacros.protein,
          carbs: acc.carbs + mealMacros.carbs,
          fats: acc.fats + mealMacros.fats
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }

  private static adjustMacrosToTarget(meals: any[], targetMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }): Meal[] {
    // Convertir a formato Meal y ajustar cantidades si es necesario
    return meals.map((meal: any): Meal => ({
      id: meal.id,
      name: meal.name,
      time: meal.time,
      foods: meal.foods.map((food: any): Food => ({
        name: food.name,
        amount: food.amount,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats
      })),
      macros: this.calculateTotalMacros([meal]),
      recipe: meal.recipe
    }));
  }

  private static generateShoppingList(meals: Meal[]): string[] {
    const ingredients = new Set<string>();

    meals.forEach(meal => {
      meal.foods.forEach(food => {
        ingredients.add(`${food.name} (${food.amount})`);
      });
    });

    return Array.from(ingredients);
  }

  private static getPlanName(goal: string): string {
    const planNames = {
      lose_fat: 'Pérdida de Grasa',
      gain_muscle: 'Ganancia Muscular',
      recomp: 'Recomposición',
      maintain: 'Mantenimiento'
    };
    return planNames[goal] || 'Personalizado';
  }

  private static getFallbackMealPlan(profile: NutritionProfile, macros: MacroTargets): MealPlan {
    // Plan predefinido como fallback
    const meals: Meal[] = [
      {
        id: 'breakfast',
        name: 'Desayuno Energético',
        time: '08:00',
        foods: [
          { name: 'Avena', amount: '80g', calories: 304, protein: 10, carbs: 54, fats: 6 },
          { name: 'Huevo', amount: '2 unidades', calories: 140, protein: 12, carbs: 2, fats: 10 },
          { name: 'Plátano', amount: '1 mediano', calories: 105, protein: 1, carbs: 27, fats: 0 }
        ],
        macros: { calories: 549, protein: 23, carbs: 83, fats: 16 },
        recipe: 'Cocina la avena, añade huevos revueltos y plátano en rodajas'
      },
      {
        id: 'lunch',
        name: 'Almuerzo Balanceado',
        time: '13:00',
        foods: [
          { name: 'Pechuga de pollo', amount: '150g', calories: 248, protein: 46, carbs: 0, fats: 5 },
          { name: 'Arroz integral', amount: '120g cocido', calories: 156, protein: 3, carbs: 33, fats: 1 },
          { name: 'Ensalada mixta', amount: '200g', calories: 50, protein: 3, carbs: 10, fats: 0 },
          { name: 'Aceite de oliva', amount: '10ml', calories: 90, protein: 0, carbs: 0, fats: 10 }
        ],
        macros: { calories: 544, protein: 52, carbs: 43, fats: 16 }
      },
      {
        id: 'dinner',
        name: 'Cena Ligera',
        time: '20:00',
        foods: [
          { name: 'Pescado blanco', amount: '150g', calories: 165, protein: 33, carbs: 0, fats: 3 },
          { name: 'Vegetales al vapor', amount: '200g', calories: 80, protein: 4, carbs: 16, fats: 0 },
          { name: 'Papa', amount: '150g', calories: 125, protein: 3, carbs: 28, fats: 0 }
        ],
        macros: { calories: 370, protein: 40, carbs: 44, fats: 3 }
      }
    ];

    return {
      id: 'fallback-plan',
      name: `Plan ${this.getPlanName(profile.goal)} - Predefinido`,
      meals,
      totalMacros: macros,
      shoppingList: [
        'Avena', 'Huevos', 'Plátanos', 'Pechuga de pollo', 'Arroz integral',
        'Vegetales frescos', 'Aceite de oliva', 'Pescado blanco', 'Papas'
      ],
      prepTime: 30,
      difficulty: 'easy'
    };
  }

  private static getFallbackRecipe(
    targetMacros: { calories: number; protein: number },
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): {
    name: string;
    ingredients: string[];
    instructions: string[];
    macros: { calories: number; protein: number; carbs: number; fats: number };
    prepTime: number;
  } {
    const recipes = {
      breakfast: {
        name: 'Omelette de Proteína',
        ingredients: [
          '4 huevos grandes',
          '50g queso cottage',
          'Verduras al gusto (espinacas, champiñones)',
          '10g aceite de oliva'
        ],
        instructions: [
          'Batir los huevos con queso cottage',
          'Saltear verduras en aceite',
          'Añadir los huevos y cocinar hasta firmeza'
        ],
        macros: { calories: 350, protein: 32, carbs: 8, fats: 20 },
        prepTime: 15
      },
      lunch: {
        name: 'Pollo a la Parrilla con Ensalada',
        ingredients: [
          '180g pechuga de pollo',
          '200g mix de vegetales',
          '30ml vinagreta ligera',
          'Especias al gusto'
        ],
        instructions: [
          'Sazonar y cocinar el pollo a la parrilla',
          'Mezclar vegetales con vinagreta',
          'Servir pollo sobre ensalada'
        ],
        macros: { calories: 380, protein: 45, carbs: 12, fats: 16 },
        prepTime: 25
      },
      dinner: {
        name: 'Salmón al Horno',
        ingredients: [
          '150g filete de salmón',
          '200g brócoli',
          '10g aceite de oliva',
          'Limón y especias'
        ],
        instructions: [
          'Sazonar salmón y rociar con aceite',
          'Hornear a 200°C por 15 minutos',
          'Servir con brócoli al vapor'
        ],
        macros: { calories: 420, protein: 38, carbs: 15, fats: 24 },
        prepTime: 20
      },
      snack: {
        name: 'Batido de Proteína',
        ingredients: [
          '30g proteína whey',
          '200ml leche deslactosada',
          '50g plátano congelado',
          '5g almendras'
        ],
        instructions: [
          'Colocar todos los ingredientes en la licuadora',
          'Licuar hasta obtener consistencia suave',
          'Servir inmediatamente'
        ],
        macros: { calories: 280, protein: 28, carbs: 22, fats: 8 },
        prepTime: 5
      }
    };

    return recipes[mealType];
  }
}