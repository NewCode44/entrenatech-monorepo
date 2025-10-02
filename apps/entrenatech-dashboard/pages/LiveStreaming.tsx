
import React, { useState } from 'react';
import Icon from '@/ui/Icon';

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  streamUrl: string;
  category: string;
  isLive: boolean;
  participants: number;
}

const LiveStreaming: React.FC = () => {
  const [classes, setClasses] = useState<LiveClass[]>([
    {
      id: '1',
      title: 'HIIT Full Body Blast',
      instructor: 'María González',
      scheduledDate: '2024-03-15',
      scheduledTime: '18:00',
      duration: 30,
      streamUrl: 'https://youtube.com/live/xxxxx',
      category: 'HIIT',
      isLive: false,
      participants: 234
    },
    {
      id: '2',
      title: 'Yoga Flow Matutino',
      instructor: 'Carlos Ruiz',
      scheduledDate: '2024-03-16',
      scheduledTime: '07:00',
      duration: 45,
      streamUrl: 'https://youtube.com/live/yyyyy',
      category: 'Yoga',
      isLive: false,
      participants: 189
    },
  ]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    instructor: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 30,
    streamUrl: '',
    category: 'HIIT'
  });

  const handleAddClass = () => {
    const liveClass: LiveClass = {
      id: `live-${Date.now()}`,
      ...newClass,
      isLive: false,
      participants: 0
    };
    setClasses([...classes, liveClass]);
    setAddModalOpen(false);
    setNewClass({
      title: '',
      instructor: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 30,
      streamUrl: '',
      category: 'HIIT'
    });
  };

  const toggleLiveStatus = (id: string) => {
    setClasses(classes.map(c =>
      c.id === id ? { ...c, isLive: !c.isLive } : c
    ));
  };

  const deleteClass = (id: string) => {
    if (confirm('¿Eliminar esta clase en vivo?')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const liveNow = classes.filter(c => c.isLive).length;
  const scheduled = classes.filter(c => !c.isLive).length;
  const totalParticipants = classes.reduce((sum, c) => sum + c.participants, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clases en Vivo</h1>
          <p className="text-gray-500">Gestiona transmisiones en vivo para el portal de miembros</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Icon name="Radio" className="w-5 h-5" />
          Programar Clase
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">En Vivo Ahora</h3>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          <p className="text-3xl font-bold text-white">{liveNow}</p>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Programadas</h3>
            <Icon name="Calendar" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-white">{scheduled}</p>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Participantes</h3>
            <Icon name="Users" className="w-5 h-5 text-accent-green" />
          </div>
          <p className="text-3xl font-bold text-white">{totalParticipants}</p>
        </div>
      </div>

      {/* Classes List */}
      <div className="glass-card">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Clases Programadas</h2>

          <div className="space-y-4">
            {classes.map((liveClass) => (
              <div
                key={liveClass.id}
                className={`border rounded-xl p-5 transition-all ${
                  liveClass.isLive
                    ? 'border-red-500/50 bg-red-500/10'
                    : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {liveClass.isLive && (
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          EN VIVO
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {liveClass.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{liveClass.title}</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Instructor</p>
                        <p className="text-sm text-white font-medium">{liveClass.instructor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha</p>
                        <p className="text-sm text-white font-medium">{liveClass.scheduledDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hora</p>
                        <p className="text-sm text-white font-medium">{liveClass.scheduledTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duración</p>
                        <p className="text-sm text-white font-medium">{liveClass.duration} min</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Users" className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{liveClass.participants} participantes</span>
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                      <p className="text-xs text-gray-500 mb-1">URL de Streaming</p>
                      <p className="text-sm text-white font-mono truncate">{liveClass.streamUrl}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => toggleLiveStatus(liveClass.id)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        liveClass.isLive
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-primary hover:bg-primary-dark text-black'
                      }`}
                    >
                      {liveClass.isLive ? 'Finalizar' : 'Iniciar'}
                    </button>
                    <button
                      onClick={() => deleteClass(liveClass.id)}
                      className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Icon name="Trash2" className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Programar Clase en Vivo</h2>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Icon name="X" className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Título de la Clase</label>
                  <input
                    type="text"
                    value={newClass.title}
                    onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                    className="input-field"
                    placeholder="Ej: HIIT Full Body"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Instructor</label>
                    <input
                      type="text"
                      value={newClass.instructor}
                      onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                      className="input-field"
                      placeholder="Nombre del instructor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
                    <select
                      value={newClass.category}
                      onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
                      className="input-field"
                    >
                      <option value="HIIT">HIIT</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Kickboxing">Kickboxing</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Strength">Fuerza</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Fecha</label>
                    <input
                      type="date"
                      value={newClass.scheduledDate}
                      onChange={(e) => setNewClass({ ...newClass, scheduledDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Hora</label>
                    <input
                      type="time"
                      value={newClass.scheduledTime}
                      onChange={(e) => setNewClass({ ...newClass, scheduledTime: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Duración (min)</label>
                    <input
                      type="number"
                      value={newClass.duration}
                      onChange={(e) => setNewClass({ ...newClass, duration: Number(e.target.value) })}
                      className="input-field"
                      placeholder="30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">URL de Streaming</label>
                  <input
                    type="text"
                    value={newClass.streamUrl}
                    onChange={(e) => setNewClass({ ...newClass, streamUrl: e.target.value })}
                    className="input-field"
                    placeholder="https://youtube.com/live/xxxxx"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Soporta: YouTube Live, Zoom, Google Meet, etc.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900/50 text-white font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddClass}
                    className="flex-1 btn-primary"
                  >
                    Programar Clase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreaming;
