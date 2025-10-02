import React from 'react';
import { Radio, Users, Clock, Calendar } from 'lucide-react';

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  duration: string;
  participants: number;
  isLive: boolean;
  category: string;
  thumbnail: string;
}

const LiveClasses: React.FC = () => {
  const liveClasses: LiveClass[] = [
    {
      id: '1',
      title: 'HIIT Full Body Blast',
      instructor: 'María González',
      startTime: 'Ahora',
      duration: '30 min',
      participants: 234,
      isLive: true,
      category: 'HIIT',
      thumbnail: '🔥'
    },
    {
      id: '2',
      title: 'Yoga Flow Matutino',
      instructor: 'Carlos Ruiz',
      startTime: 'En 15 min',
      duration: '45 min',
      participants: 189,
      isLive: false,
      category: 'Yoga',
      thumbnail: '🧘'
    },
    {
      id: '3',
      title: 'Kickboxing Cardio',
      instructor: 'Ana Martínez',
      startTime: 'En 30 min',
      duration: '40 min',
      participants: 156,
      isLive: false,
      category: 'Cardio',
      thumbnail: '🥊'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
            <Radio className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Clases En Vivo</h2>
        </div>
        <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700">
          Ver horario
        </button>
      </div>

      <div className="space-y-3">
        {liveClasses.map((liveClass) => (
          <div
            key={liveClass.id}
            className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-4 hover:shadow-xl transition-all"
          >
            {/* Live Indicator */}
            {liveClass.isLive && (
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  EN VIVO
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="relative flex-shrink-0">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center text-4xl">
                  {liveClass.thumbnail}
                </div>
                {liveClass.isLive && (
                  <div className="absolute inset-0 rounded-xl bg-red-500/10 border-2 border-red-500 animate-pulse" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <h3 className="font-bold text-zinc-900 truncate mb-1">
                    {liveClass.title}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    con {liveClass.instructor}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {liveClass.startTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {liveClass.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {liveClass.participants}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center">
                <button
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    liveClass.isLive
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 animate-pulse'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400'
                  }`}
                >
                  {liveClass.isLive ? 'Unirse' : 'Recordar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">
            🎥 Transmisión en Directo
          </h3>
          <p className="text-sm text-purple-100 mb-4">
            Únete a clases en vivo desde casa con entrenadores expertos
          </p>
          <button className="bg-white text-purple-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-purple-50 transition-all">
            Explorar Calendario
          </button>
        </div>
        <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10" />
      </div>
    </div>
  );
};

export default LiveClasses;
