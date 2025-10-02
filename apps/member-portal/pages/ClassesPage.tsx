import React, { useState } from 'react';

interface ClassSession {
  id: string;
  name: string;
  category: 'Yoga' | 'HIIT' | 'Strength' | 'Cardio' | 'Functional' | 'Pilates';
  instructor: string;
  instructorAvatar: string;
  dayOfWeek: string;
  time: string;
  duration: number;
  maxSpots: number;
  availableSpots: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  isBooked?: boolean;
}

const ClassesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'schedule' | 'booked'>('schedule');

  const classes: ClassSession[] = [
    {
      id: 'class-1',
      name: 'Yoga Flow Matutino',
      category: 'Yoga',
      instructor: 'María González',
      instructorAvatar: 'https://i.pravatar.cc/60?u=maria',
      dayOfWeek: 'Lunes',
      time: '07:00',
      duration: 60,
      maxSpots: 20,
      availableSpots: 5,
      difficulty: 'beginner',
      description: 'Comienza tu día con una sesión de yoga suave que conecta respiración y movimiento.',
      isBooked: true
    },
    {
      id: 'class-2',
      name: 'HIIT Extremo',
      category: 'HIIT',
      instructor: 'Carlos "Beast" Ramírez',
      instructorAvatar: 'https://i.pravatar.cc/60?u=carlos',
      dayOfWeek: 'Lunes',
      time: '18:00',
      duration: 45,
      maxSpots: 15,
      availableSpots: 2,
      difficulty: 'advanced',
      description: 'Entrenamiento de alta intensidad diseñado para quemar calorías y mejorar tu resistencia.',
      isBooked: false
    },
    {
      id: 'class-3',
      name: 'Strength Training',
      category: 'Strength',
      instructor: 'Roberto "Titan" Díaz',
      instructorAvatar: 'https://i.pravatar.cc/60?u=roberto',
      dayOfWeek: 'Martes',
      time: '19:00',
      duration: 60,
      maxSpots: 12,
      availableSpots: 8,
      difficulty: 'intermediate',
      description: 'Desarrolla fuerza y masa muscular con ejercicios de peso libre y máquinas.',
      isBooked: true
    },
    {
      id: 'class-4',
      name: 'Spinning Power',
      category: 'Cardio',
      instructor: 'Ana Torres',
      instructorAvatar: 'https://i.pravatar.cc/60?u=ana',
      dayOfWeek: 'Miércoles',
      time: '06:30',
      duration: 45,
      maxSpots: 25,
      availableSpots: 12,
      difficulty: 'intermediate',
      description: 'Pedalea al ritmo de la música en una clase energética de spinning.',
      isBooked: false
    },
    {
      id: 'class-5',
      name: 'Functional Training',
      category: 'Functional',
      instructor: 'Luis Méndez',
      instructorAvatar: 'https://i.pravatar.cc/60?u=luis',
      dayOfWeek: 'Miércoles',
      time: '17:30',
      duration: 50,
      maxSpots: 18,
      availableSpots: 6,
      difficulty: 'intermediate',
      description: 'Entrenamiento funcional que mejora tu rendimiento en actividades diarias.',
      isBooked: false
    },
    {
      id: 'class-6',
      name: 'Pilates Core',
      category: 'Pilates',
      instructor: 'Sofia Martínez',
      instructorAvatar: 'https://i.pravatar.cc/60?u=sofia',
      dayOfWeek: 'Jueves',
      time: '08:00',
      duration: 55,
      maxSpots: 15,
      availableSpots: 9,
      difficulty: 'beginner',
      description: 'Fortalece tu core y mejora tu postura con ejercicios de pilates.',
      isBooked: false
    },
    {
      id: 'class-7',
      name: 'CrossFit WOD',
      category: 'HIIT',
      instructor: 'Carlos "Beast" Ramírez',
      instructorAvatar: 'https://i.pravatar.cc/60?u=carlos',
      dayOfWeek: 'Viernes',
      time: '07:00',
      duration: 60,
      maxSpots: 20,
      availableSpots: 4,
      difficulty: 'advanced',
      description: 'Workout of the Day con movimientos funcionales variados de alta intensidad.',
      isBooked: true
    },
    {
      id: 'class-8',
      name: 'Yoga Restaurativo',
      category: 'Yoga',
      instructor: 'María González',
      instructorAvatar: 'https://i.pravatar.cc/60?u=maria',
      dayOfWeek: 'Viernes',
      time: '19:30',
      duration: 60,
      maxSpots: 20,
      availableSpots: 15,
      difficulty: 'beginner',
      description: 'Relájate y recupera con posturas suaves y respiración consciente.',
      isBooked: false
    },
    {
      id: 'class-9',
      name: 'Bootcamp Guerrero',
      category: 'Strength',
      instructor: 'Roberto "Titan" Díaz',
      instructorAvatar: 'https://i.pravatar.cc/60?u=roberto',
      dayOfWeek: 'Sábado',
      time: '09:00',
      duration: 75,
      maxSpots: 25,
      availableSpots: 10,
      difficulty: 'intermediate',
      description: 'Combina fuerza, resistencia y trabajo en equipo en este bootcamp intenso.',
      isBooked: false
    },
    {
      id: 'class-10',
      name: 'Zumba Fitness',
      category: 'Cardio',
      instructor: 'Ana Torres',
      instructorAvatar: 'https://i.pravatar.cc/60?u=ana',
      dayOfWeek: 'Sábado',
      time: '11:00',
      duration: 50,
      maxSpots: 30,
      availableSpots: 18,
      difficulty: 'beginner',
      description: '¡Baila, suda y diviértete! Una fiesta fitness con ritmos latinos.',
      isBooked: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: '🔥' },
    { id: 'Yoga', name: 'Yoga', icon: '🧘' },
    { id: 'HIIT', name: 'HIIT', icon: '💪' },
    { id: 'Strength', name: 'Fuerza', icon: '🏋️' },
    { id: 'Cardio', name: 'Cardio', icon: '❤️' },
    { id: 'Functional', name: 'Funcional', icon: '⚡' },
    { id: 'Pilates', name: 'Pilates', icon: '🤸' }
  ];

  const daysOfWeek = ['all', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const filteredClasses = classes.filter(classItem => {
    const categoryMatch = selectedCategory === 'all' || classItem.category === selectedCategory;
    const dayMatch = selectedDay === 'all' || classItem.dayOfWeek === selectedDay;
    return categoryMatch && dayMatch;
  });

  const bookedClasses = classes.filter(c => c.isBooked);

  const getSpotsColor = (available: number, max: number) => {
    const percentage = (available / max) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 20) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleBookClass = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    if (classItem) {
      alert(`✓ Clase Reservada\n\n${classItem.name}\n${classItem.dayOfWeek} a las ${classItem.time}\nInstructor: ${classItem.instructor}\n\n¡Te esperamos!`);
    }
  };

  const handleCancelBooking = (classId: string) => {
    const classItem = classes.find(c => c.id === classId);
    if (classItem) {
      alert(`Cancelar Reserva\n\n¿Estás seguro que deseas cancelar la clase de ${classItem.name}?\n${classItem.dayOfWeek} a las ${classItem.time}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
        <h2 className="mb-2 text-2xl font-bold text-white">Clases Grupales</h2>
        <p className="text-sm text-zinc-400">Reserva tu lugar en nuestras clases</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 text-center">
          <div className="mb-1 text-2xl">📅</div>
          <div className="mb-1 text-xl font-bold text-cyan-400">{bookedClasses.length}</div>
          <div className="text-xs text-zinc-600">Reservadas</div>
        </div>
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 text-center">
          <div className="mb-1 text-2xl">🏋️</div>
          <div className="mb-1 text-xl font-bold text-white">{classes.length}</div>
          <div className="text-xs text-zinc-600">Disponibles</div>
        </div>
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 text-center">
          <div className="mb-1 text-2xl">⭐</div>
          <div className="mb-1 text-xl font-bold text-white">{categories.length - 1}</div>
          <div className="text-xs text-zinc-600">Categorías</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-1">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
            activeTab === 'schedule'
              ? 'bg-cyan-500 text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span className="text-base">📅</span> Horario
        </button>
        <button
          onClick={() => setActiveTab('booked')}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
            activeTab === 'booked'
              ? 'bg-cyan-500 text-black'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span className="text-base">✓</span> Mis Clases
          {bookedClasses.length > 0 && (
            <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {bookedClasses.length}
            </div>
          )}
        </button>
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                    selectedCategory === category.id
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Day Filter */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                    selectedDay === day
                      ? 'border-cyan-500 bg-cyan-500 text-black'
                      : 'border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:text-white'
                  }`}
                >
                  {day === 'all' ? 'Todos' : day}
                </button>
              ))}
            </div>
          </div>

          {/* Classes List */}
          <div className="space-y-4">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className={`relative rounded-2xl border p-5 ${
                    classItem.isBooked
                      ? 'border-cyan-500/30 bg-cyan-500/5'
                      : 'border-zinc-800/50 bg-zinc-900/30'
                  }`}
                >
                  {/* Badges */}
                  <div className="mb-4 flex items-start justify-between">
                    {classItem.isBooked && (
                      <div className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-semibold text-black">
                        ✓ Reservada
                      </div>
                    )}
                    <div className={`ml-auto rounded-lg bg-zinc-800 px-3 py-1 text-xs font-semibold text-white ${!classItem.isBooked ? 'ml-0' : ''}`}>
                      {categories.find(c => c.id === classItem.category)?.icon} {classItem.category}
                    </div>
                  </div>

                  {/* Class Info */}
                  <h3 className="mb-2 text-lg font-semibold text-white">{classItem.name}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-zinc-400">{classItem.description}</p>

                  {/* Instructor */}
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3">
                    <div
                      className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-cyan-500 bg-cover bg-center"
                      style={{ backgroundImage: `url(${classItem.instructorAvatar})` }}
                    />
                    <div>
                      <div className="text-xs text-zinc-600">Instructor</div>
                      <div className="text-sm font-semibold text-white">{classItem.instructor}</div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-2 text-center">
                      <div className="text-xs text-zinc-600">Día</div>
                      <div className="text-sm font-semibold text-cyan-400">{classItem.dayOfWeek}</div>
                    </div>
                    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-2 text-center">
                      <div className="text-xs text-zinc-600">Hora</div>
                      <div className="text-sm font-semibold text-cyan-400">{classItem.time}</div>
                    </div>
                    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-2 text-center">
                      <div className="text-xs text-zinc-600">Duración</div>
                      <div className="text-sm font-semibold text-orange-400">{classItem.duration} min</div>
                    </div>
                    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-2 text-center">
                      <div className="text-xs text-zinc-600">Lugares</div>
                      <div className={`text-sm font-semibold ${getSpotsColor(classItem.availableSpots, classItem.maxSpots)}`}>
                        {classItem.availableSpots}/{classItem.maxSpots}
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className={`mb-4 inline-block rounded-lg px-3 py-1 text-xs font-semibold ${
                    classItem.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    classItem.difficulty === 'intermediate' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {classItem.difficulty === 'beginner' ? 'Principiante' : classItem.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                  </div>

                  {/* Action Button */}
                  {classItem.isBooked ? (
                    <button
                      onClick={() => handleCancelBooking(classItem.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-500 bg-red-500/10 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
                    >
                      <span>✕</span> Cancelar Reserva
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookClass(classItem.id)}
                      disabled={classItem.availableSpots === 0}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                        classItem.availableSpots === 0
                          ? 'cursor-not-allowed bg-zinc-800 text-zinc-600 opacity-50'
                          : 'bg-cyan-500 text-black hover:bg-cyan-400 active:scale-95'
                      }`}
                    >
                      <span>{classItem.availableSpots === 0 ? '🔒' : '✓'}</span>
                      {classItem.availableSpots === 0 ? 'Sin Lugares' : 'Reservar Clase'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-10 text-center">
                <div className="mb-4 text-6xl">🔍</div>
                <h3 className="mb-2 text-lg font-semibold text-white">No hay clases disponibles</h3>
                <p className="text-sm text-zinc-500">Intenta con otros filtros</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booked Tab */}
      {activeTab === 'booked' && (
        <div>
          {bookedClasses.length > 0 ? (
            <div className="space-y-4">
              {bookedClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-white">{classItem.name}</h3>
                      <p className="text-sm text-cyan-400">{classItem.category}</p>
                    </div>
                    <div className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-semibold text-black">
                      ✓ Confirmada
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3">
                    <div>
                      <div className="mb-1 text-xs text-zinc-600">📅 {classItem.dayOfWeek}</div>
                      <div className="text-sm font-semibold text-white">{classItem.time}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-zinc-600">⏱️ Duración</div>
                      <div className="text-sm font-semibold text-white">{classItem.duration} min</div>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="h-9 w-9 flex-shrink-0 rounded-full border-2 border-cyan-500 bg-cover bg-center"
                      style={{ backgroundImage: `url(${classItem.instructorAvatar})` }}
                    />
                    <div className="text-sm text-zinc-400">
                      Instructor: <span className="font-semibold text-white">{classItem.instructor}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(classItem.id)}
                    className="w-full rounded-xl border-2 border-red-500 bg-red-500/10 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-10 text-center">
              <div className="mb-4 text-6xl">📅</div>
              <h3 className="mb-2 text-lg font-semibold text-white">No tienes clases reservadas</h3>
              <p className="mb-5 text-sm text-zinc-500">Explora nuestro horario y reserva tu primera clase</p>
              <button
                onClick={() => setActiveTab('schedule')}
                className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cyan-400 active:scale-95"
              >
                Ver Horario
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
