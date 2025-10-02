import React, { useState } from 'react';
import { X, Play, Youtube, Image as ImageIcon, Info, CheckCircle } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    notes?: string;
  };
  onClose: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onMarkComplete,
  isCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'image' | 'info'>('video');

  // Base de datos de videos de YouTube de ejercicios populares
  const exerciseVideos: { [key: string]: string } = {
    'Press de Banca': 'gRVjAtPip0Y',
    'Sentadilla': 'aclHkVaku9U',
    'Peso Muerto': 'op9kVnSso6Q',
    'Press Militar': '2yjwXTZQDDI',
    'Dominadas': 'eGo4IYlbE5g',
    'Fondos': '0326dy_-CzM',
    'Curl de Bíceps': 'ykJmrZ5v0Oo',
    'Extensión de Tríceps': 'YbX7Wd8jQ-Q',
    'Remo con Barra': 'kBWAon7ItDw',
    'Press Inclinado': 'SrqOu55lrYU',
    'Curl Martillo': 'zC3nLlEvin4',
    'Elevaciones Laterales': '3VcKaXpzqRo',
    'Zancadas': 'QOVaHwm-Q6U',
    'Hip Thrust': 'xDmFkJxPzeM',
    'Plancha': 'ASdvN_XEl_c'
  };

  // Generar ID de video basado en el nombre del ejercicio
  const getVideoId = (exerciseName: string): string => {
    // Buscar coincidencia exacta o parcial
    for (const [key, value] of Object.entries(exerciseVideos)) {
      if (exerciseName.toLowerCase().includes(key.toLowerCase()) ||
          key.toLowerCase().includes(exerciseName.toLowerCase())) {
        return value;
      }
    }
    // Video por defecto si no se encuentra
    return 'gRVjAtPip0Y'; // Video genérico de ejercicios
  };

  const videoId = getVideoId(exercise.name);

  // Generar URL de imagen de demostración
  const getExerciseImage = (exerciseName: string): string => {
    // Usando placeholders con el nombre del ejercicio
    return `https://via.placeholder.com/600x400/2196F3/FFFFFF?text=${encodeURIComponent(exerciseName)}`;
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white p-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-zinc-900">{exercise.name}</h2>
            <p className="text-sm text-zinc-500">
              {exercise.sets} series × {exercise.reps} reps · {exercise.rest} descanso
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-100 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 px-4">
          {[
            { id: 'video', label: 'Video', icon: Youtube },
            { id: 'image', label: 'Imagen', icon: ImageIcon },
            { id: 'info', label: 'Información', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Video Tab */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                  title={exercise.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Play className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Tutorial en Video
                    </h3>
                    <p className="text-sm text-blue-700">
                      Mira cuidadosamente la técnica correcta para evitar lesiones y maximizar resultados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Tab */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-zinc-200">
                <img
                  src={getExerciseImage(exercise.name)}
                  alt={exercise.name}
                  className="h-auto w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center">
                  <p className="text-2xl font-bold text-zinc-900">{exercise.sets}</p>
                  <p className="text-xs text-zinc-600">Series</p>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center">
                  <p className="text-2xl font-bold text-zinc-900">{exercise.reps}</p>
                  <p className="text-xs text-zinc-600">Repeticiones</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <h3 className="mb-2 font-semibold text-zinc-900">📋 Detalles del Ejercicio</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Series:</span>
                      <span className="font-semibold text-zinc-900">{exercise.sets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Repeticiones:</span>
                      <span className="font-semibold text-zinc-900">{exercise.reps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Descanso:</span>
                      <span className="font-semibold text-zinc-900">{exercise.rest}</span>
                    </div>
                  </div>
                </div>

                {exercise.notes && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <h3 className="mb-2 font-semibold text-amber-900">💡 Notas del Entrenador</h3>
                    <p className="text-sm text-amber-800">{exercise.notes}</p>
                  </div>
                )}

                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <h3 className="mb-2 font-semibold text-green-900">✅ Consejos de Forma</h3>
                  <ul className="space-y-1.5 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Mantén la espalda recta durante todo el movimiento
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Controla la respiración: exhala en esfuerzo
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Enfócate en la técnica antes que en el peso
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-zinc-200 bg-white p-4">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 font-semibold text-zinc-700 hover:bg-zinc-50 transition-all"
            >
              Cerrar
            </button>
            {onMarkComplete && (
              <button
                onClick={() => {
                  onMarkComplete();
                  onClose();
                }}
                className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white transition-all ${
                  isCompleted
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {isCompleted ? 'Completado' : 'Marcar Completado'}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
