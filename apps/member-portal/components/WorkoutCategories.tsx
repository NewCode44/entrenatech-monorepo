import React from 'react';
import { Flame, Heart, Zap, Wind, Dumbbell, Activity, Target, Timer } from 'lucide-react';

interface WorkoutCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  duration: string;
  calories: string;
  level: string;
  color: string;
  bgGradient: string;
}

interface WorkoutCategoriesProps {
  onSelectWorkout: (id: string) => void;
}

const WorkoutCategories: React.FC<WorkoutCategoriesProps> = ({ onSelectWorkout }) => {
  const workouts: WorkoutCategory[] = [
    {
      id: 'hiit',
      name: 'HIIT',
      icon: <Flame className="h-8 w-8" />,
      duration: '20-30 min',
      calories: '300-500 cal',
      level: 'Avanzado',
      color: 'text-orange-500',
      bgGradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'yoga',
      name: 'Yoga',
      icon: <Heart className="h-8 w-8" />,
      duration: '30-45 min',
      calories: '150-250 cal',
      level: 'Todos',
      color: 'text-purple-500',
      bgGradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'kickboxing',
      name: 'Kickboxing',
      icon: <Zap className="h-8 w-8" />,
      duration: '30-45 min',
      calories: '400-600 cal',
      level: 'Intermedio',
      color: 'text-yellow-500',
      bgGradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'cardio',
      name: 'Cardio',
      icon: <Activity className="h-8 w-8" />,
      duration: '25-40 min',
      calories: '250-400 cal',
      level: 'Todos',
      color: 'text-blue-500',
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'strength',
      name: 'Fuerza',
      icon: <Dumbbell className="h-8 w-8" />,
      duration: '40-60 min',
      calories: '200-350 cal',
      level: 'Intermedio',
      color: 'text-red-500',
      bgGradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'pilates',
      name: 'Pilates',
      icon: <Wind className="h-8 w-8" />,
      duration: '30-50 min',
      calories: '180-280 cal',
      level: 'Todos',
      color: 'text-teal-500',
      bgGradient: 'from-teal-500 to-green-500'
    },
    {
      id: 'barre',
      name: 'Barre',
      icon: <Target className="h-8 w-8" />,
      duration: '35-50 min',
      calories: '200-300 cal',
      level: 'Principiante',
      color: 'text-pink-500',
      bgGradient: 'from-pink-500 to-purple-500'
    },
    {
      id: 'tabata',
      name: 'Tabata',
      icon: <Timer className="h-8 w-8" />,
      duration: '15-25 min',
      calories: '250-400 cal',
      level: 'Avanzado',
      color: 'text-indigo-500',
      bgGradient: 'from-indigo-500 to-blue-500'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Estilos de Entrenamiento</h2>
        <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700">
          Ver todos
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {workouts.map((workout) => (
          <button
            key={workout.id}
            onClick={() => onSelectWorkout(workout.id)}
            className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-4 text-left transition-all hover:shadow-xl hover:scale-105 active:scale-100"
          >
            {/* Background Gradient on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${workout.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

            {/* Icon */}
            <div className={`relative mb-3 ${workout.color}`}>
              {workout.icon}
            </div>

            {/* Name */}
            <h3 className="relative mb-2 font-bold text-zinc-900">
              {workout.name}
            </h3>

            {/* Details */}
            <div className="relative space-y-1">
              <p className="text-xs text-zinc-500">
                ⏱️ {workout.duration}
              </p>
              <p className="text-xs text-zinc-500">
                🔥 {workout.calories}
              </p>
              <p className={`text-xs font-semibold ${workout.color}`}>
                {workout.level}
              </p>
            </div>

            {/* Arrow indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${workout.bgGradient} flex items-center justify-center text-white`}>
                →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkoutCategories;
