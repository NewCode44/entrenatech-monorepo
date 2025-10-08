import React, { useState } from 'react';
import Card from '@/ui/Card';
import Icon from '@/ui/Icon';
import { NutritionAI, NutritionProfile, MacroTargets, MealPlan } from '../services/ai/nutritionAI';

interface NutritionCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const NutritionCalculator: React.FC<NutritionCalculatorProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'profile' | 'results' | 'plan'>('profile');
  const [profile, setProfile] = useState<NutritionProfile>({
    age: 25,
    weight: 70,
    height: 170,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryRestrictions: [],
    allergies: []
  });
  const [macros, setMacros] = useState<MacroTargets | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = () => {
    const calculatedMacros = NutritionAI.calculateMacros(profile);
    setMacros(calculatedMacros);
    setStep('results');
  };

  const handleGeneratePlan = async () => {
    if (!macros) return;
    setLoading(true);
    try {
      const plan = await NutritionAI.generateMealPlan(profile, macros);
      setMealPlan(plan);
      setStep('plan');
    } catch (error) {
      alert('Error al generar plan de comidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-secondary border-2 border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Apple" className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Calculadora Nutricional IA</h2>
              <p className="text-sm text-white/80">Planes personalizados con inteligencia artificial</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <Icon name="X" className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step: Profile */}
          {step === 'profile' && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-lg font-bold text-white mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Edad</label>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Género</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Altura (cm)</label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-bold text-white mb-4">Objetivo y Actividad</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Objetivo</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'lose_fat', label: 'Perder Grasa', icon: '🔥' },
                        { id: 'maintain', label: 'Mantener', icon: '⚖️' },
                        { id: 'gain_muscle', label: 'Ganar Músculo', icon: '💪' },
                        { id: 'recomp', label: 'Recomposición', icon: '✨' }
                      ].map(goal => (
                        <button
                          key={goal.id}
                          onClick={() => setProfile({ ...profile, goal: goal.id as any })}
                          className={`p-3 border-2 rounded-lg text-center transition-colors ${
                            profile.goal === goal.id
                              ? 'bg-primary/20 border-primary'
                              : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="text-2xl mb-1">{goal.icon}</div>
                          <p className="text-xs font-semibold text-white">{goal.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Nivel de Actividad</label>
                    <select
                      value={profile.activityLevel}
                      onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value as any })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="sedentary">Sedentario (poco o ningún ejercicio)</option>
                      <option value="light">Ligero (1-3 días/semana)</option>
                      <option value="moderate">Moderado (3-5 días/semana)</option>
                      <option value="active">Activo (6-7 días/semana)</option>
                      <option value="very_active">Muy Activo (2x/día)</option>
                    </select>
                  </div>
                </div>
              </Card>

              <button
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Calculator" className="w-5 h-5" />
                Calcular Macros con IA
              </button>
            </div>
          )}

          {/* Step: Results */}
          {step === 'results' && macros && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="Target" className="w-5 h-5 text-green-500" />
                  Tus Macros Objetivo
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black gradient-text mb-1">{macros.calories}</div>
                    <p className="text-sm text-gray-400">Calorías</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-blue-400 mb-1">{macros.protein}g</div>
                    <p className="text-sm text-gray-400">Proteína</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-green-400 mb-1">{macros.carbs}g</div>
                    <p className="text-sm text-gray-400">Carbohidratos</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-yellow-400 mb-1">{macros.fats}g</div>
                    <p className="text-sm text-gray-400">Grasas</p>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    <Icon name="Info" className="w-4 h-4 text-blue-500 inline mr-2" />
                    {macros.explanation}
                  </p>
                </div>
              </Card>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('profile')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={handleGeneratePlan}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader" className="w-5 h-5 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" className="w-5 h-5" />
                      Generar Plan de Comidas
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step: Meal Plan */}
          {step === 'plan' && mealPlan && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{mealPlan.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" className="w-4 h-4" />
                        {mealPlan.prepTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="ChefHat" className="w-4 h-4" />
                        {mealPlan.difficulty === 'easy' ? 'Fácil' : mealPlan.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{mealPlan.totalMacros.calories} cal</div>
                    <p className="text-xs text-gray-500">Total diario</p>
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-4">
                  {mealPlan.meals.map(meal => (
                    <div key={meal.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-white">{meal.name}</h4>
                          <p className="text-sm text-gray-500">{meal.time}</p>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <span className="text-blue-400">{meal.macros.protein}g P</span>
                          <span className="text-green-400">{meal.macros.carbs}g C</span>
                          <span className="text-yellow-400">{meal.macros.fats}g G</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {meal.foods.map((food, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-300">{food.name} ({food.amount})</span>
                            <span className="text-gray-500">{food.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Shopping List */}
              <Card>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="ShoppingCart" className="w-5 h-5 text-primary" />
                  Lista de Compras
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mealPlan.shoppingList.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('results')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Guardar Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionCalculator;