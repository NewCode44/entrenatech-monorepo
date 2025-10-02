import React, { useState } from 'react';
import { X, Sparkles, Target, Zap, Calendar } from 'lucide-react';

interface AIRoutineGeneratorProps {
  onClose: () => void;
  onGenerate: (routine: any) => void;
}

const AIRoutineGenerator: React.FC<AIRoutineGeneratorProps> = ({ onClose, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    goal: '',
    level: '',
    daysPerWeek: '3',
    duration: '45',
    equipment: [] as string[],
    focus: [] as string[]
  });

  const goals = [
    { id: 'muscle', label: 'Ganar Músculo', icon: '💪', description: 'Hipertrofia y fuerza' },
    { id: 'weight-loss', label: 'Perder Peso', icon: '🔥', description: 'Quemar grasa' },
    { id: 'strength', label: 'Aumentar Fuerza', icon: '⚡', description: 'Fuerza máxima' },
    { id: 'endurance', label: 'Resistencia', icon: '🏃', description: 'Cardio y aguante' },
    { id: 'general', label: 'Fitness General', icon: '✨', description: 'Balance total' }
  ];

  const levels = [
    { id: 'beginner', label: 'Principiante', description: '0-6 meses de experiencia' },
    { id: 'intermediate', label: 'Intermedio', description: '6-24 meses de experiencia' },
    { id: 'advanced', label: 'Avanzado', description: '2+ años de experiencia' }
  ];

  const equipmentOptions = [
    'Barra', 'Mancuernas', 'Máquinas', 'Bandas de resistencia',
    'Peso corporal', 'Kettlebells', 'TRX'
  ];

  const focusAreas = [
    'Pecho', 'Espalda', 'Piernas', 'Hombros',
    'Brazos', 'Core', 'Glúteos', 'Cardio'
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleGenerate = () => {
    setGenerating(true);

    // Simulación de generación con IA
    setTimeout(() => {
      const generatedRoutine = {
        id: `ai-routine-${Date.now()}`,
        name: `Rutina AI: ${goals.find(g => g.id === formData.goal)?.label}`,
        description: `Generada con IA para ${formData.level} - ${formData.daysPerWeek} días/semana`,
        isAIGenerated: true,
        exercises: generateExercises()
      };

      setGenerating(false);
      onGenerate(generatedRoutine);
      onClose();
    }, 2500);
  };

  const generateExercises = () => {
    const exerciseDatabase = {
      muscle: [
        { id: 'ex-ai-1', name: 'Press de Banca', sets: 4, reps: '8-10', rest: '90', notes: 'Generado por IA' },
        { id: 'ex-ai-2', name: 'Sentadilla con Barra', sets: 4, reps: '8-10', rest: '120', notes: 'Generado por IA' },
        { id: 'ex-ai-3', name: 'Peso Muerto', sets: 3, reps: '6-8', rest: '120', notes: 'Generado por IA' },
        { id: 'ex-ai-4', name: 'Press Militar', sets: 3, reps: '10-12', rest: '75', notes: 'Generado por IA' }
      ],
      'weight-loss': [
        { id: 'ex-ai-5', name: 'Burpees', sets: 4, reps: '15-20', rest: '45', notes: 'Alta intensidad' },
        { id: 'ex-ai-6', name: 'Mountain Climbers', sets: 4, reps: '30-40', rest: '30', notes: 'Cardio intenso' },
        { id: 'ex-ai-7', name: 'Jumping Jacks', sets: 3, reps: '50-60', rest: '30', notes: 'Calentamiento' },
        { id: 'ex-ai-8', name: 'Sentadillas con Salto', sets: 4, reps: '15-20', rest: '45', notes: 'Potencia' }
      ],
      strength: [
        { id: 'ex-ai-9', name: 'Sentadilla Pesada', sets: 5, reps: '3-5', rest: '180', notes: 'Fuerza máxima' },
        { id: 'ex-ai-10', name: 'Peso Muerto Pesado', sets: 5, reps: '3-5', rest: '180', notes: 'Fuerza máxima' },
        { id: 'ex-ai-11', name: 'Press de Banca Pesado', sets: 5, reps: '3-5', rest: '180', notes: 'Fuerza máxima' }
      ],
      endurance: [
        { id: 'ex-ai-12', name: 'Carrera Continua', sets: 1, reps: '20-30 min', rest: '0', notes: 'Ritmo constante' },
        { id: 'ex-ai-13', name: 'Circuito HIIT', sets: 5, reps: '1 min', rest: '30', notes: 'Máxima intensidad' },
        { id: 'ex-ai-14', name: 'Remo', sets: 4, reps: '5 min', rest: '60', notes: 'Cardio completo' }
      ],
      general: [
        { id: 'ex-ai-15', name: 'Sentadillas', sets: 3, reps: '12-15', rest: '60', notes: 'Piernas' },
        { id: 'ex-ai-16', name: 'Flexiones', sets: 3, reps: '10-15', rest: '60', notes: 'Pecho' },
        { id: 'ex-ai-17', name: 'Plancha', sets: 3, reps: '45-60s', rest: '45', notes: 'Core' },
        { id: 'ex-ai-18', name: 'Dominadas Asistidas', sets: 3, reps: '8-10', rest: '75', notes: 'Espalda' }
      ]
    };

    return exerciseDatabase[formData.goal as keyof typeof exerciseDatabase] || exerciseDatabase.general;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800/50 bg-zinc-950/95 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-zinc-800/50 bg-zinc-950/95 p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">AI Personal Trainer</h2>
              </div>
              <p className="text-sm text-zinc-400">
                Genera una rutina personalizada con inteligencia artificial
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
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      step > s ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-zinc-800'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Objetivo y Nivel */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Target className="h-5 w-5 text-purple-400" />
                  ¿Cuál es tu objetivo principal?
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setFormData({ ...formData, goal: goal.id })}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        formData.goal === goal.id
                          ? 'border-purple-500 bg-purple-500/10'
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
                  <Zap className="h-5 w-5 text-purple-400" />
                  ¿Cuál es tu nivel de experiencia?
                </h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, level: level.id })}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 transition-all ${
                        formData.level === level.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="text-left">
                        <div className="mb-1 font-semibold text-white">{level.label}</div>
                        <div className="text-sm text-zinc-500">{level.description}</div>
                      </div>
                      {formData.level === level.id && (
                        <div className="text-xl">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.goal || !formData.level}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 2: Frecuencia y Equipamiento */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Frecuencia de Entrenamiento
                </h3>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">Días por semana</label>
                    <select
                      value={formData.daysPerWeek}
                      onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800/50 bg-zinc-900/50 px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      {[2, 3, 4, 5, 6, 7].map((days) => (
                        <option key={days} value={days}>
                          {days} días
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-zinc-400">Duración (minutos)</label>
                    <select
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full rounded-xl border border-zinc-800/50 bg-zinc-900/50 px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                    >
                      {[30, 45, 60, 90].map((mins) => (
                        <option key={mins} value={mins}>
                          {mins} min
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Equipamiento Disponible</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {equipmentOptions.map((equipment) => (
                    <button
                      key={equipment}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          equipment: toggleArrayItem(formData.equipment, equipment)
                        })
                      }
                      className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                        formData.equipment.includes(equipment)
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {equipment}
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
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Áreas de Enfoque */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Áreas de Enfoque</h3>
                <p className="mb-4 text-sm text-zinc-400">
                  Selecciona las áreas en las que quieres concentrarte
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {focusAreas.map((area) => (
                    <button
                      key={area}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          focus: toggleArrayItem(formData.focus, area)
                        })
                      }
                      className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                        formData.focus.includes(area)
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumen */}
              <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
                <h4 className="mb-3 font-semibold text-white">Resumen de tu Rutina</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Objetivo:</span>
                    <span className="text-white">
                      {goals.find((g) => g.id === formData.goal)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Nivel:</span>
                    <span className="text-white">
                      {levels.find((l) => l.id === formData.level)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Frecuencia:</span>
                    <span className="text-white">{formData.daysPerWeek} días/semana</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Duración:</span>
                    <span className="text-white">{formData.duration} minutos</span>
                  </div>
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
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      Generando con IA...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Generar Rutina
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

export default AIRoutineGenerator;
