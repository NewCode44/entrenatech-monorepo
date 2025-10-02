import React, { useState } from 'react';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import AIRoutineGenerator from '../components/AIRoutineGenerator';
import { Sparkles } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: string;
  notes?: string;
  completed?: boolean;
}

interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  isAIGenerated?: boolean;
}

const RoutinesPage: React.FC = () => {
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [restTimeLeft, setRestTimeLeft] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicProgress, setMusicProgress] = useState(45);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const initialRoutines: Routine[] = [
    {
      id: 'routine-1',
      name: 'Push Day - Pecho y Tríceps',
      description: 'Rutina de empuje enfocada en pecho, hombros y tríceps',
      exercises: [
        { id: 'ex-1', name: 'Press de Banca con Barra', sets: 4, reps: '8-10', weight: '80kg', rest: '90', notes: 'Mantén los omóplatos retraídos', completed: false },
        { id: 'ex-2', name: 'Press Inclinado con Mancuernas', sets: 3, reps: '10-12', weight: '30kg', rest: '75', completed: false },
        { id: 'ex-3', name: 'Aperturas en Máquina', sets: 3, reps: '12-15', rest: '60', completed: false },
        { id: 'ex-4', name: 'Fondos en Paralelas', sets: 3, reps: 'al fallo', rest: '90', notes: 'Inclinación hacia adelante', completed: false },
        { id: 'ex-5', name: 'Tríceps en Polea', sets: 3, reps: '12-15', rest: '45', completed: false }
      ]
    },
    {
      id: 'routine-2',
      name: 'Pull Day - Espalda y Bíceps',
      description: 'Rutina de tracción para espalda y bíceps',
      exercises: [
        { id: 'ex-6', name: 'Dominadas', sets: 4, reps: '8-12', rest: '120', completed: false },
        { id: 'ex-7', name: 'Remo con Barra', sets: 4, reps: '8-10', weight: '70kg', rest: '90', completed: false },
        { id: 'ex-8', name: 'Jalón al Pecho', sets: 3, reps: '10-12', rest: '75', completed: false },
        { id: 'ex-9', name: 'Curl de Bíceps con Barra', sets: 3, reps: '10-12', rest: '60', completed: false }
      ]
    },
    {
      id: 'routine-3',
      name: 'Leg Day - Piernas',
      description: 'Entrenamiento completo de piernas',
      exercises: [
        { id: 'ex-10', name: 'Sentadilla con Barra', sets: 5, reps: '6-8', weight: '120kg', rest: '180', completed: false },
        { id: 'ex-11', name: 'Prensa de Piernas', sets: 4, reps: '10-12', rest: '120', completed: false },
        { id: 'ex-12', name: 'Curl Femoral', sets: 3, reps: '12-15', rest: '60', completed: false },
        { id: 'ex-13', name: 'Elevaciones de Pantorrilla', sets: 4, reps: '15-20', rest: '45', completed: false }
      ]
    }
  ];

  const [routines, setRoutines] = useState(initialRoutines);

  const handleAIRoutineGenerated = (newRoutine: Routine) => {
    setRoutines([newRoutine, ...routines]);
  };

  const startRest = (seconds: number) => {
    setRestTimeLeft(seconds);
    setIsResting(true);
    const interval = setInterval(() => {
      setRestTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    if (selectedRoutine) {
      const updatedExercises = selectedRoutine.exercises.map(ex => {
        if (ex.id === exerciseId) {
          const newCompleted = !ex.completed;
          if (newCompleted && ex.rest) {
            startRest(parseInt(ex.rest));
          }
          return { ...ex, completed: newCompleted };
        }
        return ex;
      });
      setSelectedRoutine({ ...selectedRoutine, exercises: updatedExercises });
    }
  };

  const completedCount = selectedRoutine?.exercises.filter(ex => ex.completed).length || 0;
  const totalCount = selectedRoutine?.exercises.length || 0;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-white">Mis Rutinas</h2>
            <p className="text-sm text-zinc-400">
              {selectedRoutine ? 'Entrenamiento en progreso' : 'Selecciona una rutina o genera una con IA'}
            </p>
          </div>
          {!selectedRoutine && (
            <button
              onClick={() => setShowAIGenerator(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              AI Personal Trainer
            </button>
          )}
        </div>
      </div>

      {!selectedRoutine ? (
        /* Routine Selection */
        <div className="space-y-3">
          {routines.map((routine) => (
            <button
              key={routine.id}
              onClick={() => setSelectedRoutine(routine)}
              className={`w-full rounded-2xl border p-5 text-left transition-all ${
                routine.isAIGenerated
                  ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50'
                  : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
              }`}
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{routine.name}</h3>
                    {routine.isAIGenerated && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-400">
                        <Sparkles className="h-3 w-3" />
                        IA
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">{routine.description}</p>
                </div>
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${
                  routine.isAIGenerated ? 'bg-purple-500/20' : 'bg-cyan-500/10'
                }`}>
                  {routine.isAIGenerated ? '🤖' : '💪'}
                </div>
              </div>

              <div className="flex gap-6 border-t border-zinc-800/50 pt-3">
                <div>
                  <span className="text-xl font-bold text-white">{routine.exercises.length}</span>
                  <span className="ml-2 text-sm text-zinc-500">ejercicios</span>
                </div>
                <div>
                  <span className={`text-xl font-bold ${routine.isAIGenerated ? 'text-purple-400' : 'text-cyan-400'}`}>
                    {routine.exercises.reduce((acc, ex) => acc + ex.sets, 0)}
                  </span>
                  <span className="ml-2 text-sm text-zinc-500">series</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Active Workout */
        <div className="space-y-6">
          {/* Workout Header */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-lg font-semibold text-white">{selectedRoutine.name}</h3>
                <p className="text-sm text-zinc-500">
                  Progreso: {completedCount}/{totalCount} ejercicios
                </p>
              </div>
              <button
                onClick={() => setSelectedRoutine(null)}
                className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-zinc-700 hover:bg-zinc-900/50"
              >
                ← Cambiar
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Rest Timer */}
          {isResting && restTimeLeft !== null && (
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6 text-center backdrop-blur-sm">
              <div className="mb-3 text-6xl font-black text-orange-400">
                {restTimeLeft}
              </div>
              <p className="mb-4 text-base font-semibold text-white">Descansando...</p>
              <button
                onClick={() => {
                  setIsResting(false);
                  setRestTimeLeft(null);
                }}
                className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-900"
              >
                Saltar descanso
              </button>
            </div>
          )}

          {/* Integrated Music Player */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Música de Entrenamiento</h3>
              <button className="flex items-center gap-2 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-zinc-700 hover:text-white">
                <span className="text-sm">🎵</span>
                Spotify
              </button>
            </div>

            {/* Now Playing */}
            <div className="mb-3 flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-xl">
                🎵
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="mb-0.5 truncate text-sm font-semibold text-white">
                  Eye of the Tiger
                </h4>
                <p className="truncate text-xs text-zinc-500">Survivor</p>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-base transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-95"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 space-y-1.5">
              <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                  style={{ width: `${musicProgress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span>1:50</span>
                <span>4:04</span>
              </div>
            </div>

            {/* Mini Playlist */}
            <div className="space-y-1.5">
              {[
                { title: 'Stronger', artist: 'Kanye West' },
                { title: "Gonna Fly Now", artist: 'Bill Conti' },
              ].map((track, i) => (
                <button
                  key={i}
                  className="flex w-full items-center gap-2 rounded-lg border border-transparent p-2 text-left transition-all hover:border-zinc-800/50 hover:bg-zinc-900/30"
                >
                  <span className="text-sm">🎵</span>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate text-xs font-medium text-white">{track.title}</div>
                    <div className="truncate text-xs text-zinc-600">{track.artist}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            {selectedRoutine.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`rounded-2xl border p-5 transition-all ${
                  exercise.completed
                    ? 'border-cyan-500/30 bg-cyan-500/5'
                    : 'border-zinc-800/50 bg-zinc-900/30 hover:border-zinc-700/50 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex gap-4">
                  {/* Exercise Number Badge */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl font-bold ${
                      exercise.completed ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-white'
                    }`}
                  >
                    {exercise.completed ? '✓' : index + 1}
                  </div>

                  {/* Exercise Info */}
                  <div className="flex-1">
                    <h4 className={`mb-3 text-base font-semibold ${exercise.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                      {exercise.name}
                    </h4>

                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-center">
                        <div className="text-lg font-bold text-blue-400">{exercise.sets}</div>
                        <div className="text-xs text-zinc-500">Sets</div>
                      </div>
                      <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-2 text-center">
                        <div className="text-lg font-bold text-teal-400">{exercise.reps}</div>
                        <div className="text-xs text-zinc-500">Reps</div>
                      </div>
                      {exercise.weight && (
                        <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-2 text-center">
                          <div className="text-lg font-bold text-orange-400">{exercise.weight}</div>
                          <div className="text-xs text-zinc-500">Peso</div>
                        </div>
                      )}
                      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-center">
                        <div className="text-lg font-bold text-cyan-400">{exercise.rest}s</div>
                        <div className="text-xs text-zinc-500">Descanso</div>
                      </div>
                    </div>

                    {exercise.notes && (
                      <div className="mb-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-3">
                        <p className="text-sm text-zinc-400">💡 {exercise.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedExercise(exercise)}
                        className="flex-1 rounded-xl border border-purple-500/50 bg-purple-500/10 py-2.5 text-sm font-semibold text-purple-400 transition-all hover:bg-purple-500/20 active:scale-95"
                      >
                        📹 Ver Cómo Hacer
                      </button>
                      <button
                        onClick={() => toggleExerciseComplete(exercise.id)}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                          exercise.completed
                            ? 'border border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                            : 'bg-cyan-500 text-black hover:bg-cyan-400'
                        }`}
                      >
                        {exercise.completed ? '✓ Completado' : 'Completar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Complete Workout Button */}
          {progressPercent === 100 && (
            <button
              onClick={() => alert('¡Entrenamiento completado! 🎉\n\n¡Excelente trabajo! Has completado todos los ejercicios de la rutina.')}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 py-5 text-lg font-bold text-black transition-all hover:from-cyan-400 hover:to-blue-400 active:scale-95"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🎉</span>
                ¡Finalizar Entrenamiento!
                <span className="text-2xl">🎉</span>
              </div>
            </button>
          )}
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onMarkComplete={() => toggleExerciseComplete(selectedExercise.id)}
          isCompleted={selectedExercise.completed}
        />
      )}

      {/* AI Routine Generator Modal */}
      {showAIGenerator && (
        <AIRoutineGenerator
          onClose={() => setShowAIGenerator(false)}
          onGenerate={handleAIRoutineGenerated}
        />
      )}
    </div>
  );
};

export default RoutinesPage;
