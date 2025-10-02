import React, { useState } from 'react';
import { Flame, Dumbbell, Clock, Trophy, TrendingUp, Calendar, Users, Target, CheckCircle, Zap, Award } from 'lucide-react';
import WorkoutPreviewCard from '../components/WorkoutPreviewCard';
import WorkoutCategories from '../components/WorkoutCategories';
import LiveClasses from '../components/LiveClasses';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [currentStreak, setCurrentStreak] = useState(12);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
    if (!isCheckedIn) {
      setCurrentStreak(currentStreak + 1);
    }
  };

  const handleStartWorkout = () => {
    onNavigate?.('routines');
  };

  const handleNutrition = () => {
    onNavigate?.('nutrition');
  };

  const handleClasses = () => {
    onNavigate?.('classes');
  };

  return (
    <div className="space-y-4">
      {/* Welcome Card - Premium Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 p-5 shadow-lg">
        {/* Glow effect */}
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl"></div>

        <div className="relative">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-medium text-zinc-600">Bienvenido de vuelta</p>
                <Award className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <h1 className="mb-2 text-xl font-black text-zinc-900">Carlos Mendoza</h1>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  ⭐ Premium
                </span>
                <span className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm">
                  Nivel 24
                </span>
              </div>
            </div>

            {/* Streak Card */}
            <div className="relative">
              <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-3 shadow-md">
                <div className="mb-1 flex items-center justify-center gap-1.5">
                  <Flame className="h-6 w-6 text-orange-500" />
                  <span className="text-3xl font-black text-zinc-900">{currentStreak}</span>
                </div>
                <p className="text-center text-[10px] font-semibold text-orange-600">DÍAS DE RACHA</p>
              </div>
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-600">Meta Semanal</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-zinc-900">4/5</span>
                <span className="text-xs text-zinc-500">días</span>
              </div>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-zinc-100">
              <div className="absolute inset-0 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((day, i) => (
                  <div
                    key={day}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      i < 4
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-sm shadow-cyan-500/50'
                        : 'bg-zinc-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px]">
              <span className="text-zinc-500">1 día más para completar</span>
              <span className="font-semibold text-cyan-600">80%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Premium Design */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Entrenos', value: '24', icon: Dumbbell, color: 'text-cyan-600', bg: 'from-cyan-50 to-cyan-100', border: 'border-cyan-200', glow: 'shadow-cyan-500/20' },
          { label: 'Kcal', value: '2.4K', icon: Flame, color: 'text-orange-600', bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', glow: 'shadow-orange-500/20' },
          { label: 'Tiempo', value: '360', icon: Clock, color: 'text-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', glow: 'shadow-blue-500/20' },
          { label: 'PRs', value: '8', icon: Trophy, color: 'text-amber-600', bg: 'from-amber-50 to-amber-100', border: 'border-amber-200', glow: 'shadow-amber-500/20' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigate?.('progress')}
              className={`group relative overflow-hidden rounded-xl border ${stat.border} bg-gradient-to-br ${stat.bg} p-3 transition-all hover:scale-105 active:scale-95 ${stat.glow} hover:shadow-lg`}
            >
              <div className="relative">
                <Icon className={`mb-2 h-4 w-4 ${stat.color}`} />
                <div className="mb-0.5 text-lg font-black text-zinc-900">{stat.value}</div>
                <div className="text-[10px] font-medium text-zinc-600">{stat.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleCheckIn}
          className={`group relative overflow-hidden rounded-xl p-4 shadow-lg transition-all active:scale-95 ${
            isCheckedIn
              ? 'bg-gradient-to-br from-cyan-500 to-cyan-600'
              : 'bg-gradient-to-br from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            {isCheckedIn ? (
              <CheckCircle className="h-6 w-6 text-white" />
            ) : (
              <Target className="h-6 w-6 text-white" />
            )}
            <span className="text-xs font-bold text-white">
              {isCheckedIn ? '✓ Hecho' : 'Check-in'}
            </span>
          </div>
        </button>

        <button
          onClick={handleStartWorkout}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-4 shadow-lg transition-all hover:from-orange-400 hover:to-red-400 active:scale-95"
        >
          <div className="flex flex-col items-center gap-2">
            <Dumbbell className="h-6 w-6 text-white" />
            <span className="text-xs font-bold text-white">Comenzar</span>
          </div>
        </button>

        <button
          onClick={handleNutrition}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 p-4 shadow-lg transition-all hover:from-emerald-400 hover:to-green-400 active:scale-95"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="text-xs font-bold text-white">Nutrición</span>
          </div>
        </button>

        <button
          onClick={handleClasses}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 p-4 shadow-lg transition-all hover:from-blue-400 hover:to-purple-400 active:scale-95"
        >
          <div className="flex flex-col items-center gap-2">
            <Calendar className="h-6 w-6 text-white" />
            <span className="text-xs font-bold text-white">Clases</span>
          </div>
        </button>
      </div>

      {/* Today's Workout - Premium Card */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Entrenamiento de Hoy</h2>
          <div className="flex items-center gap-1.5 rounded-md bg-cyan-100 px-2 py-1">
            <Zap className="h-3.5 w-3.5 text-cyan-600" />
            <span className="text-xs font-bold text-cyan-700">Listo</span>
          </div>
        </div>
        <WorkoutPreviewCard
          name="Push Day - Pecho y Tríceps"
          duration={60}
          calories={450}
          difficulty="Intermedio"
          exercises={8}
          onStart={handleStartWorkout}
        />
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Actividad Reciente</h2>
          <button
            onClick={() => onNavigate?.('progress')}
            className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
          >
            Ver todo
          </button>
        </div>
        {[
          {
            user: 'Tú',
            action: 'nuevo récord',
            exercise: 'Press de Banca',
            value: '85kg',
            icon: Trophy,
            color: 'text-amber-500',
            bg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10',
            border: 'border-amber-500/30',
            page: 'progress',
            avatar: '🏆',
            time: 'Hace 2h'
          },
          {
            user: 'Ana R.',
            action: 'completó',
            exercise: 'HIIT Cardio',
            value: '500 kcal',
            icon: Flame,
            color: 'text-orange-500',
            bg: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10',
            border: 'border-orange-500/30',
            page: 'routines',
            avatar: '💪',
            time: 'Hace 4h'
          },
          {
            user: 'Carlos M.',
            action: 'racha de',
            exercise: '30 días consecutivos',
            value: '',
            icon: TrendingUp,
            color: 'text-cyan-500',
            bg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10',
            border: 'border-cyan-500/30',
            page: 'progress',
            avatar: '🔥',
            time: 'Hace 5h'
          },
        ].map((activity, i) => {
          const Icon = activity.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigate?.(activity.page)}
              className={`group mb-2 flex w-full items-start gap-3 rounded-xl border ${activity.border} ${activity.bg} p-3 text-left shadow-sm transition-all hover:scale-[1.01] hover:shadow-md active:scale-[0.99]`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-lg shadow-sm">
                  {activity.avatar}
                </div>
                {/* Icon badge */}
                <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${activity.bg} shadow-sm`}>
                  <Icon className={`h-3 w-3 ${activity.color}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <div className="mb-0.5 flex items-center justify-between gap-2">
                  <p className="truncate text-sm">
                    <span className="font-bold text-zinc-900">{activity.user}</span>
                    <span className="text-zinc-600"> {activity.action} </span>
                    <span className={`font-semibold ${activity.color}`}>{activity.exercise}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activity.value && (
                    <span className="text-sm font-bold text-zinc-900">{activity.value}</span>
                  )}
                  <span className="text-xs text-zinc-400">{activity.time}</span>
                </div>
              </div>

              {/* Like button */}
              <button className="mt-1 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </button>
          );
        })}
      </div>

      {/* Workout Categories - Nike Training Style */}
      <WorkoutCategories onSelectWorkout={(id) => onNavigate?.('routines')} />

      {/* Live Classes - Openfit Style */}
      <LiveClasses />

      {/* Upcoming Classes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Próximas Clases</h2>
          <button
            onClick={handleClasses}
            className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
          >
            Ver todas
          </button>
        </div>
        {[
          { name: 'Yoga Flow', time: 'Hoy 18:00', instructor: 'María G.', spots: 3 },
          { name: 'CrossFit WOD', time: 'Mañana 07:00', instructor: 'Carlos R.', spots: 5 },
        ].map((clase, i) => (
          <button
            key={i}
            onClick={() => onNavigate?.('classes')}
            className="mb-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition-all hover:border-cyan-300 hover:shadow-md active:scale-95"
          >
            <div className="flex items-start gap-3">
              <div className="h-full w-1 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500"></div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-900">{clase.name}</h3>
                  <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-700">
                    {clase.spots} lugares
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="h-3 w-3" />
                  <span>{clase.time}</span>
                  <span>•</span>
                  <Users className="h-3 w-3" />
                  <span>{clase.instructor}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quote */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 text-center shadow-lg">
        <div className="mb-3 text-3xl">💪</div>
        <p className="mb-2 text-sm font-semibold leading-relaxed text-zinc-900">
          "El dolor que sientes hoy será la fuerza que sientas mañana"
        </p>
        <p className="text-xs font-medium text-zinc-500">— Arnold Schwarzenegger</p>
      </div>
    </div>
  );
};

export default HomePage;
