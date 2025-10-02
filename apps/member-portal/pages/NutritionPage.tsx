import React, { useEffect, useState } from 'react';
import { NutritionAI, MealPlan, MacroTargets, NutritionProfile } from '../services/ai/nutritionAI';
import AINutritionistGenerator from '../components/AINutritionistGenerator';
import { Sparkles } from 'lucide-react';

const NutritionPage: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [macros, setMacros] = useState<MacroTargets | null>(null);
  const [loading, setLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(6);
  const [selectedTab, setSelectedTab] = useState<'today' | 'plan' | 'shopping'>('today');
  const [showAINutritionist, setShowAINutritionist] = useState(false);

  const [userProfile, setUserProfile] = useState<NutritionProfile>({
    age: 28,
    weight: 75,
    height: 175,
    gender: 'male',
    activityLevel: 'active',
    goal: 'gain_muscle',
    dietaryRestrictions: [],
    allergies: []
  });

  useEffect(() => {
    const loadNutritionData = async () => {
      setLoading(true);
      const calculatedMacros = NutritionAI.calculateMacros(userProfile);
      const generatedPlan = await NutritionAI.generateMealPlan(userProfile, calculatedMacros);

      setMacros(calculatedMacros);
      setMealPlan(generatedPlan);
      setLoading(false);
    };

    loadNutritionData();
  }, [userProfile]);

  const handleAIProfileGenerated = async (newProfile: NutritionProfile) => {
    setUserProfile(newProfile);
    setLoading(true);
    const calculatedMacros = NutritionAI.calculateMacros(newProfile);
    const generatedPlan = await NutritionAI.generateMealPlan(newProfile, calculatedMacros);
    setMacros(calculatedMacros);
    setMealPlan(generatedPlan);
    setLoading(false);
  };

  const MacroCard = ({ label, value, unit, icon }: any) => (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
      <div className="mb-2 text-2xl">{icon}</div>
      <div className="mb-1 text-xl font-bold text-white">
        {value}{unit}
      </div>
      <div className="text-xs font-medium text-zinc-500">{label}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-5xl">🍽️</div>
          <p className="text-sm text-zinc-400">Cargando tu plan nutricional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-white">Nutrición</h2>
            <p className="text-sm text-zinc-400">
              Tu plan personalizado para {userProfile.goal === 'gain_muscle' ? 'ganar músculo' : userProfile.goal === 'lose_fat' ? 'perder grasa' : 'mantener peso'}
            </p>
          </div>
          <button
            onClick={() => setShowAINutritionist(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600 active:scale-95"
          >
            <Sparkles className="h-4 w-4" />
            AI Nutriólogo
          </button>
        </div>
      </div>

      {/* Daily Macros */}
      {macros && (
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
          <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-white">
            <span>🎯</span> Objetivos Diarios
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-zinc-500">
            {macros.explanation}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <MacroCard label="Calorías" value={macros.calories} unit=" kcal" icon="⚡" />
            <MacroCard label="Proteína" value={macros.protein} unit="g" icon="🥩" />
            <MacroCard label="Carbohidratos" value={macros.carbs} unit="g" icon="🍞" />
            <MacroCard label="Grasas" value={macros.fats} unit="g" icon="🥑" />
          </div>
        </div>
      )}

      {/* Water Intake */}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
          <span>💧</span> Hidratación
        </h3>

        <div className="mb-3 flex items-center justify-between text-sm">
          <p className="text-zinc-400">{waterIntake * 250}ml / 2000ml</p>
          <p className="font-semibold text-cyan-400">{waterIntake}/8 vasos</p>
        </div>

        <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${(waterIntake / 8) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, index) => (
            <button
              key={index}
              onClick={() => setWaterIntake(index + 1)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all active:scale-95 ${
                index < waterIntake
                  ? 'bg-cyan-500 scale-105'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              💧
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-1">
        {[
          { id: 'today', label: 'Hoy', icon: '📅' },
          { id: 'plan', label: 'Plan', icon: '📋' },
          { id: 'shopping', label: 'Compras', icon: '🛒' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
              selectedTab === tab.id
                ? 'bg-cyan-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Today's Meals Tab */}
      {selectedTab === 'today' && mealPlan && (
        <div className="space-y-4">
          {mealPlan.meals.map((meal) => (
            <div
              key={meal.id}
              className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-base font-semibold text-white">{meal.name}</h3>
                  <p className="text-sm text-cyan-400">{meal.time}</p>
                </div>
                <div className="rounded-lg bg-cyan-500/10 px-3 py-1.5 text-sm font-semibold text-cyan-400">
                  {meal.macros.calories} kcal
                </div>
              </div>

              {/* Macros Summary */}
              <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3">
                <div className="text-center">
                  <div className="mb-1 text-base font-bold text-red-400">{meal.macros.protein}g</div>
                  <div className="text-xs text-zinc-600">Proteína</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-base font-bold text-orange-400">{meal.macros.carbs}g</div>
                  <div className="text-xs text-zinc-600">Carbos</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 text-base font-bold text-green-400">{meal.macros.fats}g</div>
                  <div className="text-xs text-zinc-600">Grasas</div>
                </div>
              </div>

              {/* Foods List */}
              <div className="mb-3 space-y-2">
                {meal.foods.map((food, index) => (
                  <button
                    key={index}
                    onClick={() => alert(`${food.name}\n${food.amount}\n${food.calories} kcal`)}
                    className="flex w-full items-center justify-between rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3 text-left transition-all hover:border-cyan-500/50 active:scale-95"
                  >
                    <div>
                      <span className="text-sm font-medium text-white">{food.name}</span>
                      <span className="ml-2 text-xs text-zinc-600">{food.amount}</span>
                    </div>
                    <div className="text-sm font-semibold text-cyan-400">{food.calories} kcal</div>
                  </button>
                ))}
              </div>

              {/* Recipe */}
              {meal.recipe && (
                <details className="group">
                  <summary className="cursor-pointer py-2 text-sm font-semibold text-cyan-400 transition-all hover:text-cyan-300">
                    📝 Ver receta
                  </summary>
                  <div className="mt-2 whitespace-pre-line rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3 text-sm leading-relaxed text-zinc-400">
                    {meal.recipe}
                  </div>
                </details>
              )}
            </div>
          ))}

          {/* Daily Total */}
          {mealPlan.totalMacros && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
              <h3 className="mb-4 text-base font-semibold text-white">Total del Día</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="mb-1 text-lg font-bold text-white">{mealPlan.totalMacros.calories}</div>
                  <div className="text-xs text-zinc-500">Calorías</div>
                </div>
                <div>
                  <div className="mb-1 text-lg font-bold text-white">{mealPlan.totalMacros.protein}g</div>
                  <div className="text-xs text-zinc-500">Proteína</div>
                </div>
                <div>
                  <div className="mb-1 text-lg font-bold text-white">{mealPlan.totalMacros.carbs}g</div>
                  <div className="text-xs text-zinc-500">Carbos</div>
                </div>
                <div>
                  <div className="mb-1 text-lg font-bold text-white">{mealPlan.totalMacros.fats}g</div>
                  <div className="text-xs text-zinc-500">Grasas</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plan Tab */}
      {selectedTab === 'plan' && mealPlan && (
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
            <span>📋</span> {mealPlan.name}
          </h3>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
              <div className="mb-1 text-xs text-zinc-500">Tiempo de prep.</div>
              <div className="text-lg font-bold text-cyan-400">{mealPlan.prepTime} min</div>
            </div>
            <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
              <div className="mb-1 text-xs text-zinc-500">Dificultad</div>
              <div className="text-lg font-bold text-orange-400">
                {mealPlan.difficulty === 'easy' ? 'Fácil' : mealPlan.difficulty === 'medium' ? 'Media' : 'Alta'}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
            <p className="text-sm leading-relaxed text-zinc-400">
              Este plan está diseñado específicamente para tu objetivo de {userProfile.goal === 'gain_muscle' ? 'ganar músculo' : userProfile.goal === 'lose_fat' ? 'perder grasa' : 'mantener peso'}.
              Incluye {mealPlan.meals.length} comidas balanceadas al día con un total de {mealPlan.totalMacros.calories} calorías.
            </p>
          </div>
        </div>
      )}

      {/* Shopping List Tab */}
      {selectedTab === 'shopping' && mealPlan && (
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
          <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-white">
            <span>🛒</span> Lista de Compras Semanal
          </h3>
          <p className="mb-5 text-sm text-zinc-500">Todo lo que necesitas para la semana</p>

          <div className="mb-5 space-y-2">
            {mealPlan.shoppingList.map((item, index) => (
              <label
                key={index}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3 transition-all hover:border-cyan-500/50 active:scale-95"
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 cursor-pointer rounded accent-cyan-500"
                />
                <span className="text-sm text-white">{item}</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => alert('📤 Compartiendo lista de compras...\n\nPuedes enviarla por WhatsApp, email o copiarla al portapapeles.')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-black transition-all hover:bg-cyan-400 active:scale-95"
          >
            <span>📤</span> Compartir lista
          </button>
        </div>
      )}

      {/* AI Nutritionist Generator Modal */}
      {showAINutritionist && (
        <AINutritionistGenerator
          onClose={() => setShowAINutritionist(false)}
          onGenerate={handleAIProfileGenerated}
        />
      )}
    </div>
  );
};

export default NutritionPage;
