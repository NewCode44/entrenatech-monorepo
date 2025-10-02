
import React, { useState } from 'react';
import Icon from '@/ui/Icon';

interface ContentItem {
  id: string;
  type: 'workout' | 'quote' | 'banner';
  content: string;
  isActive: boolean;
}

const PortalContent: React.FC = () => {
  const [workoutStyles, setWorkoutStyles] = useState([
    { id: '1', name: 'HIIT', duration: '20-30 min', calories: '300-500 cal', level: 'Avanzado', isActive: true },
    { id: '2', name: 'Yoga', duration: '30-45 min', calories: '150-250 cal', level: 'Todos', isActive: true },
    { id: '3', name: 'Kickboxing', duration: '30-45 min', calories: '400-600 cal', level: 'Intermedio', isActive: true },
  ]);

  const [quotes, setQuotes] = useState([
    { id: '1', text: 'El dolor que sientes hoy será la fuerza que sientas mañana', author: 'Arnold Schwarzenegger', isActive: true },
    { id: '2', text: 'El cuerpo logra lo que la mente cree', author: 'Jim Kwik', isActive: true },
  ]);

  const [banners, setBanners] = useState([
    { id: '1', title: 'Promoción 20% OFF', description: 'En todos los suplementos', isActive: true },
    { id: '2', title: 'Nueva Clase de Spinning', description: 'Martes y Jueves 6PM', isActive: true },
  ]);

  const [activeTab, setActiveTab] = useState<'workouts' | 'quotes' | 'banners'>('workouts');
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    calories: '',
    level: 'Todos'
  });

  const [newQuote, setNewQuote] = useState({
    text: '',
    author: ''
  });

  const [newBanner, setNewBanner] = useState({
    title: '',
    description: ''
  });

  const addWorkoutStyle = () => {
    setWorkoutStyles([...workoutStyles, {
      id: `w-${Date.now()}`,
      ...newWorkout,
      isActive: true
    }]);
    setAddModalOpen(false);
    setNewWorkout({ name: '', duration: '', calories: '', level: 'Todos' });
  };

  const addQuote = () => {
    setQuotes([...quotes, {
      id: `q-${Date.now()}`,
      ...newQuote,
      isActive: true
    }]);
    setAddModalOpen(false);
    setNewQuote({ text: '', author: '' });
  };

  const addBanner = () => {
    setBanners([...banners, {
      id: `b-${Date.now()}`,
      ...newBanner,
      isActive: true
    }]);
    setAddModalOpen(false);
    setNewBanner({ title: '', description: '' });
  };

  const toggleWorkoutStatus = (id: string) => {
    setWorkoutStyles(workoutStyles.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w));
  };

  const toggleQuoteStatus = (id: string) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, isActive: !q.isActive } : q));
  };

  const toggleBannerStatus = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const deleteWorkout = (id: string) => {
    setWorkoutStyles(workoutStyles.filter(w => w.id !== id));
  };

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
  };

  const deleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contenido del Portal</h1>
          <p className="text-gray-500">Gestiona estilos de entrenamiento, frases y promociones</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Icon name="Plus" className="w-5 h-5" />
          Agregar Contenido
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Estilos de Entrenamiento</h3>
            <Icon name="Dumbbell" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-white">{workoutStyles.filter(w => w.isActive).length}</p>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Frases Motivacionales</h3>
            <Icon name="MessageSquare" className="w-5 h-5 text-accent-green" />
          </div>
          <p className="text-3xl font-bold text-white">{quotes.filter(q => q.isActive).length}</p>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Banners Activos</h3>
            <Icon name="Layout" className="w-5 h-5 text-accent-blue" />
          </div>
          <p className="text-3xl font-bold text-white">{banners.filter(b => b.isActive).length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800">
        {[
          { id: 'workouts', label: 'Estilos de Entrenamiento', icon: 'Dumbbell' },
          { id: 'quotes', label: 'Frases Motivacionales', icon: 'MessageSquare' },
          { id: 'banners', label: 'Banners/Promociones', icon: 'Layout' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-primary text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <Icon name={tab.icon as any} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workout Styles Tab */}
      {activeTab === 'workouts' && (
        <div className="glass-card p-6">
          <div className="space-y-4">
            {workoutStyles.map((workout) => (
              <div key={workout.id} className="border border-zinc-800 rounded-xl p-5 hover:bg-zinc-900/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{workout.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>⏱️ {workout.duration}</span>
                      <span>🔥 {workout.calories}</span>
                      <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">{workout.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWorkoutStatus(workout.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        workout.isActive ? 'bg-accent-green/20 text-accent-green' : 'bg-zinc-800 text-gray-500'
                      }`}
                    >
                      {workout.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                    <button
                      onClick={() => deleteWorkout(workout.id)}
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
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div className="glass-card p-6">
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div key={quote.id} className="border border-zinc-800 rounded-xl p-5 hover:bg-zinc-900/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2 italic">"{quote.text}"</p>
                    <p className="text-sm text-gray-500">— {quote.author}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleQuoteStatus(quote.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quote.isActive ? 'bg-accent-green/20 text-accent-green' : 'bg-zinc-800 text-gray-500'
                      }`}
                    >
                      {quote.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                    <button
                      onClick={() => deleteQuote(quote.id)}
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
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="glass-card p-6">
          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="border border-zinc-800 rounded-xl p-5 hover:bg-zinc-900/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{banner.title}</h3>
                    <p className="text-sm text-gray-400">{banner.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBannerStatus(banner.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        banner.isActive ? 'bg-accent-green/20 text-accent-green' : 'bg-zinc-800 text-gray-500'
                      }`}
                    >
                      {banner.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                    <button
                      onClick={() => deleteBanner(banner.id)}
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
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setAddModalOpen(false)}>
          <div className="bg-secondary rounded-xl border border-gray-800 shadow-xl w-full max-w-2xl relative animate-slide-up flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Agregar {activeTab === 'workouts' ? 'Estilo de Entrenamiento' : activeTab === 'quotes' ? 'Frase' : 'Banner'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeTab === 'workouts' ? 'Nuevo estilo de entrenamiento' : activeTab === 'quotes' ? 'Nueva frase motivacional' : 'Nuevo banner promocional'}
                  </p>
                </div>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800"
                >
                  <Icon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">

              {activeTab === 'workouts' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre (ej: HIIT)"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    className="input-field"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Duración (ej: 20-30 min)"
                      value={newWorkout.duration}
                      onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Calorías (ej: 300-500 cal)"
                      value={newWorkout.calories}
                      onChange={(e) => setNewWorkout({ ...newWorkout, calories: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <select
                    value={newWorkout.level}
                    onChange={(e) => setNewWorkout({ ...newWorkout, level: e.target.value })}
                    className="input-field"
                  >
                    <option value="Todos">Todos los niveles</option>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              )}

              {activeTab === 'quotes' && (
                <div className="space-y-4">
                  <textarea
                    placeholder="Frase motivacional..."
                    value={newQuote.text}
                    onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Autor"
                    value={newQuote.author}
                    onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}

              {activeTab === 'banners' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título del banner"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                    className="input-field"
                  />
                  <textarea
                    placeholder="Descripción..."
                    value={newBanner.description}
                    onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                    className="input-field"
                    rows={2}
                  />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => setAddModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-lg border border-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={activeTab === 'workouts' ? addWorkoutStyle : activeTab === 'quotes' ? addQuote : addBanner}
                className="flex-1 px-6 py-3 bg-primary hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Agregar {activeTab === 'workouts' ? 'Estilo' : activeTab === 'quotes' ? 'Frase' : 'Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortalContent;
