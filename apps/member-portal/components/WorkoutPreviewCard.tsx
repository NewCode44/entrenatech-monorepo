import React from 'react';
import { Play, Clock, Flame, Dumbbell } from 'lucide-react';

interface WorkoutPreviewCardProps {
  name: string;
  duration: number;
  calories: number;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  exercises: number;
  imageUrl?: string;
  onStart: () => void;
}

const WorkoutPreviewCard: React.FC<WorkoutPreviewCardProps> = ({
  name,
  duration,
  calories,
  difficulty,
  exercises,
  imageUrl,
  onStart,
}) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Principiante':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermedio':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Avanzado':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
      {/* Image/Video Preview Area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <Dumbbell className="mx-auto mb-2 h-16 w-16 text-cyan-500 opacity-30" />
              <p className="text-sm text-zinc-400">Preview de entrenamiento</p>
            </div>
          </div>
        )}

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>

        {/* Play button overlay */}
        <button
          onClick={onStart}
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50 transition-transform active:scale-95">
            <Play className="h-8 w-8 text-black" fill="black" />
          </div>
        </button>

        {/* Difficulty badge */}
        <div className="absolute right-3 top-3">
          <div className={`rounded-lg border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${getDifficultyColor()}`}>
            {difficulty}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-3 text-lg font-bold text-zinc-900">{name}</h3>

        {/* Stats Grid */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
            <Clock className="h-4 w-4 text-cyan-600" />
            <div>
              <div className="text-xs font-semibold text-zinc-900">{duration} min</div>
              <div className="text-[10px] text-zinc-500">Duración</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
            <Flame className="h-4 w-4 text-orange-600" />
            <div>
              <div className="text-xs font-semibold text-zinc-900">{calories}</div>
              <div className="text-[10px] text-zinc-500">Kcal</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2">
            <Dumbbell className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-xs font-semibold text-zinc-900">{exercises}</div>
              <div className="text-[10px] text-zinc-500">Ejercicios</div>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-sm font-bold text-black transition-all hover:from-cyan-400 hover:to-blue-400 active:scale-95"
        >
          Comenzar Entrenamiento
        </button>
      </div>
    </div>
  );
};

export default WorkoutPreviewCard;
