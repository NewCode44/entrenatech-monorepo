import React, { useState } from 'react';
import AdvancedStats from '../components/AdvancedStats';

const ProgressPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'records' | 'achievements'>('overview');

  const level = 24;
  const currentXP = 3750;
  const nextLevelXP = 5000;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600">
                <span className="text-2xl font-black text-black">{level}</span>
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500">
                <span className="text-xs">👑</span>
              </div>
            </div>
            <div>
              <h1 className="mb-1 text-2xl font-bold text-white">Nivel {level}</h1>
              <p className="text-sm font-medium text-zinc-400">Miembro Elite</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-2xl font-bold text-white">#12</div>
            <p className="text-xs text-zinc-500">de 250</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-400">Experiencia</span>
            <span className="font-semibold text-white">
              {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-600">
            {(nextLevelXP - currentXP).toLocaleString()} XP para nivel {level + 1}
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-1">
        {[
          { id: 'overview', label: 'Resumen', icon: '📊' },
          { id: 'records', label: 'Récords', icon: '🏆' },
          { id: 'achievements', label: 'Logros', icon: '⭐' },
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

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Weekly Activity */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Actividad Semanal</h2>
              <span className="text-sm font-semibold text-cyan-400">4/7 días</span>
            </div>
            <div className="flex justify-between gap-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => {
                const completed = i < 4;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className={`flex aspect-square w-full items-center justify-center rounded-xl transition-all ${
                        completed
                          ? 'bg-cyan-500 scale-105'
                          : 'bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    >
                      {completed && <span className="text-xl text-black">✓</span>}
                    </div>
                    <span className={`text-xs font-medium ${completed ? 'text-cyan-400' : 'text-zinc-600'}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advanced Stats - Aaptiv Style */}
          <AdvancedStats />

          {/* Body Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Peso', value: '75.2', goal: '72kg', progress: 85, icon: '⚖️' },
              { label: 'Grasa', value: '18.5%', goal: '15%', progress: 70, icon: '📉' },
              { label: 'Músculo', value: '42.3', goal: '45kg', progress: 94, icon: '💪' },
              { label: 'IMC', value: '23.8', goal: '22.5', progress: 95, icon: '📊' },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs font-semibold text-zinc-600">{stat.progress}%</span>
                </div>
                <div className="mb-3">
                  <div className="mb-1 text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs font-medium text-zinc-500">{stat.label}</div>
                </div>
                <div className="mb-2 h-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
                <div className="text-xs text-zinc-600">Meta: {stat.goal}</div>
              </div>
            ))}
          </div>

          {/* Monthly Stats */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
            <h2 className="mb-6 text-base font-semibold text-white">Estadísticas del Mes</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Entrenamientos', value: '24', icon: '🏋️', change: '+12%' },
                { label: 'Tiempo Total', value: '18.5h', icon: '⏱️', change: '+8%' },
                { label: 'Calorías', value: '12.4K', icon: '🔥', change: '+15%' },
                { label: 'Récords', value: '6', icon: '🏆', change: '+3' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="mb-2 text-3xl">{stat.icon}</div>
                  <div className="mb-1 text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mb-1 text-xs font-medium text-zinc-500">{stat.label}</div>
                  <div className="text-xs font-semibold text-cyan-400">{stat.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Records Tab */}
      {selectedTab === 'records' && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">Récords Personales</h2>
          {[
            { exercise: 'Press de Banca', weight: '85kg', date: 'Hace 2 días', trend: '+5kg', icon: '💪' },
            { exercise: 'Sentadilla', weight: '120kg', date: 'Hace 1 semana', trend: '+10kg', icon: '🏋️' },
            { exercise: 'Peso Muerto', weight: '140kg', date: 'Hace 3 días', trend: '+15kg', icon: '⚡' },
            { exercise: 'Press Militar', weight: '55kg', date: 'Hace 5 días', trend: '+5kg', icon: '🎯' },
            { exercise: 'Dominadas', weight: '+20kg', date: 'Hace 1 semana', trend: '+5kg', icon: '💪' },
          ].map((record, i) => (
            <button
              key={i}
              onClick={() => alert(`Récord Personal: ${record.exercise}\n${record.weight} (${record.trend})\n${record.date}`)}
              className="group relative w-full overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 text-left transition-all hover:border-cyan-500/50 hover:bg-zinc-900/50 active:scale-95"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-cyan-500"></div>
              <div className="flex items-center gap-4 pl-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-xl">
                  {record.icon}
                </div>
                <div className="flex-1">
                  <h3 className="mb-0.5 font-semibold text-white">{record.exercise}</h3>
                  <p className="text-xs text-zinc-500">{record.date}</p>
                </div>
                <div className="text-right">
                  <div className="mb-0.5 text-xl font-bold text-white">{record.weight}</div>
                  <div className="text-xs font-semibold text-cyan-400">{record.trend}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-white">Mis Logros</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Guerrero', desc: '50 entrenamientos', unlocked: true, icon: '🏆', rarity: 'Épico' },
              { title: 'Racha de Fuego', desc: '30 días consecutivos', unlocked: true, icon: '🔥', rarity: 'Raro' },
              { title: 'Beast Mode', desc: '10 récords nuevos', unlocked: true, icon: '💪', rarity: 'Épico' },
              { title: 'Madrugador', desc: '20 sesiones 7AM', unlocked: false, icon: '🌅', rarity: 'Común' },
              { title: 'Perfectionist', desc: '7 días perfectos', unlocked: false, icon: '⭐', rarity: 'Raro' },
              { title: 'Elite', desc: 'Alcanzar nivel 50', unlocked: false, icon: '👑', rarity: 'Legendario' },
            ].map((achievement, i) => (
              <button
                key={i}
                onClick={() => alert(`${achievement.icon} ${achievement.title}\n${achievement.desc}\n${achievement.unlocked ? '✓ Desbloqueado' : '🔒 Bloqueado'}\nRareza: ${achievement.rarity}`)}
                className={`relative rounded-xl border p-4 text-left transition-all active:scale-95 ${
                  achievement.unlocked
                    ? 'border-zinc-800/50 bg-zinc-900/30 hover:border-cyan-500/50 hover:bg-zinc-900/50'
                    : 'border-zinc-800/30 bg-zinc-900/10 opacity-60 hover:opacity-80'
                }`}
              >
                {achievement.unlocked && (
                  <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500">
                    <span className="text-xs text-black">✓</span>
                  </div>
                )}
                <div className="mb-3 flex items-center justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${
                      achievement.unlocked
                        ? 'bg-zinc-800'
                        : 'bg-zinc-800/30'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                </div>
                <h3 className={`mb-1 text-center text-sm font-semibold ${achievement.unlocked ? 'text-white' : 'text-zinc-600'}`}>
                  {achievement.title}
                </h3>
                <p className={`mb-2 text-center text-xs ${achievement.unlocked ? 'text-zinc-500' : 'text-zinc-700'}`}>
                  {achievement.desc}
                </p>
                <div className="text-center">
                  <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                    achievement.rarity === 'Legendario' ? 'bg-amber-500/20 text-amber-400' :
                    achievement.rarity === 'Épico' ? 'bg-purple-500/20 text-purple-400' :
                    achievement.rarity === 'Raro' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-zinc-800 text-zinc-500'
                  }`}>
                    {achievement.rarity}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
