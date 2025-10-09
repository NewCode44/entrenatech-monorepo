import React, { useState } from 'react';
import { X, Sparkles, Target, User, Activity, AlertCircle } from 'lucide-react';
import { NutritionAI, NutritionProfile } from '../services/ai/nutritionAI';
import apiService from '../services/api';

interface AINutritionistGeneratorProps {
  onClose: () => void;
  onGenerate: (profile: NutritionProfile) => void;
}

const AINutritionistGenerator: React.FC<AINutritionistGeneratorProps> = ({ onClose, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState<NutritionProfile>({
    age: 25,
    weight: 70,
    height: 170,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryRestrictions: [],
    allergies: []
  });

  const goals = [
    { id: 'lose_fat', label: 'Perder Grasa', icon: '🔥', description: 'Déficit calórico controlado' },
    { id: 'gain_muscle', label: 'Ganar Músculo', icon: '💪', description: 'Superávit calórico con proteína' },
    { id: 'maintain', label: 'Mantenimiento', icon: '⚖️', description: 'Mantener peso actual' },
    { id: 'performance', label: 'Rendimiento', icon: '⚡', description: 'Máxima energía para entrenar' },
    { id: 'health', label: 'Salud General', icon: '❤️', description: 'Balance nutricional óptimo' }
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentario', description: 'Poco o ningún ejercicio', multiplier: '1.2x' },
    { id: 'light', label: 'Ligero', description: '1-3 días/semana', multiplier: '1.375x' },
    { id: 'moderate', label: 'Moderado', description: '3-5 días/semana', multiplier: '1.55x' },
    { id: 'active', label: 'Activo', description: '6-7 días/semana', multiplier: '1.725x' },
    { id: 'very_active', label: 'Muy Activo', description: 'Atleta/2x día', multiplier: '1.9x' }
  ];

  const dietaryOptions = [
    'Vegetariano', 'Vegano', 'Sin gluten', 'Sin lactosa',
    'Keto', 'Paleo', 'Bajo en carbos', 'Alto en proteína'
  ];

  const commonAllergies = [
    'Nueces', 'Maní', 'Lácteos', 'Huevos',
    'Soya', 'Trigo', 'Pescado', 'Mariscos'
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleGenerate = async () => {
    setGenerating(true);

    try {
      // Map form data to API format
      const apiProfile = {
        goals: [formData.goal],
        dietaryRestrictions: formData.dietaryRestrictions || [],
        allergies: formData.allergies || [],
        weight: formData.weight,
        height: formData.height,
        age: formData.age,
        gender: formData.gender,
        activityLevel: formData.activityLevel,
      };

      // Call backend API
      const response = await apiService.generateNutritionPlan(apiProfile);

      if (response.success && response.data) {
        // Combine form data with AI-generated plan
        onGenerate({
          ...formData,
          aiGeneratedPlan: response.data
        });
        onClose();
      } else {
        console.error('AI generation failed:', response.message);
        // Fallback to mock data
        onGenerate(formData);
        onClose();
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Fallback to mock data
      onGenerate(formData);
      onClose();
    } finally {
      setGenerating(false);
    }
  };

  const calculateBMI = () => {
    const heightInMeters = formData.height / 100;
    const bmi = formData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'text-blue-400' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-yellow-400' };
    return { label: 'Obesidad', color: 'text-red-400' };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-2xl border border-zinc-800/50 bg-zinc-950/95 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-zinc-800/50 bg-zinc-950/95 p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Nutriólogo Virtual</h2>
              </div>
              <p className="text-sm text-zinc-400">
                Genera tu plan nutricional personalizado con inteligencia artificial
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-900/50 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    step >= s
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      step > s ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-zinc-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Datos Personales */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <User className="h-5 w-5 text-green-400" />
                  Información Personal
                </h3>

                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">Edad</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-zinc-800/50 bg-zinc-900/50 px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      min="15"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">Sexo</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                          formData.gender === 'male'
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        ♂ Masculino
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                          formData.gender === 'female'
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        ♀ Femenino
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">Peso (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-zinc-800/50 bg-zinc-900/50 px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      min="30"
                      max="300"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-400">Altura (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-zinc-800/50 bg-zinc-900/50 px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                      min="120"
                      max="250"
                    />
                  </div>
                </div>

                {/* BMI Calculator */}
                {formData.weight > 0 && formData.height > 0 && (
                  <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-zinc-500">Índice de Masa Corporal (IMC)</p>
                        <p className={`text-2xl font-bold ${getBMICategory().color}`}>
                          {calculateBMI()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getBMICategory().color}`}>
                          {getBMICategory().label}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={formData.age < 15 || formData.weight < 30 || formData.height < 120}
                className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 2: Objetivo y Actividad */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Target className="h-5 w-5 text-green-400" />
                  ¿Cuál es tu objetivo?
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setFormData({ ...formData, goal: goal.id as any })}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        formData.goal === goal.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="mb-2 text-3xl">{goal.icon}</div>
                      <div className="mb-1 font-semibold text-white">{goal.label}</div>
                      <div className="text-xs text-zinc-500">{goal.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Activity className="h-5 w-5 text-green-400" />
                  Nivel de Actividad Física
                </h3>
                <div className="space-y-2">
                  {activityLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, activityLevel: level.id as any })}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                        formData.activityLevel === level.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="text-left">
                        <div className="mb-1 font-semibold text-white">{level.label}</div>
                        <div className="text-sm text-zinc-500">{level.description}</div>
                      </div>
                      <div className="text-sm font-bold text-green-400">{level.multiplier}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-zinc-800/50 bg-zinc-900/30 py-3 font-semibold text-white transition-all hover:bg-zinc-900/50"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Restricciones y Generar */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <AlertCircle className="h-5 w-5 text-green-400" />
                  Restricciones Dietéticas (Opcional)
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {dietaryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          dietaryRestrictions: toggleArrayItem(formData.dietaryRestrictions, option)
                        })
                      }
                      className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                        formData.dietaryRestrictions.includes(option)
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Alergias (Opcional)</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {commonAllergies.map((allergy) => (
                    <button
                      key={allergy}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          allergies: toggleArrayItem(formData.allergies, allergy)
                        })
                      }
                      className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                        formData.allergies.includes(allergy)
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumen */}
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
                <h4 className="mb-3 font-semibold text-white">Resumen de tu Perfil</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Edad / Sexo:</span>
                    <span className="text-white">{formData.age} años / {formData.gender === 'male' ? 'Masculino' : 'Femenino'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Peso / Altura:</span>
                    <span className="text-white">{formData.weight}kg / {formData.height}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">IMC:</span>
                    <span className={getBMICategory().color}>{calculateBMI()} - {getBMICategory().label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Objetivo:</span>
                    <span className="text-white">
                      {goals.find((g) => g.id === formData.goal)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Actividad:</span>
                    <span className="text-white">
                      {activityLevels.find((l) => l.id === formData.activityLevel)?.label}
                    </span>
                  </div>
                  {formData.dietaryRestrictions.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Restricciones:</span>
                      <span className="text-white">{formData.dietaryRestrictions.join(', ')}</span>
                    </div>
                  )}
                  {formData.allergies.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Alergias:</span>
                      <span className="text-red-400">{formData.allergies.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border border-zinc-800/50 bg-zinc-900/30 py-3 font-semibold text-white transition-all hover:bg-zinc-900/50"
                  disabled={generating}
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      Generando con IA...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generar Plan
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AINutritionistGenerator;
