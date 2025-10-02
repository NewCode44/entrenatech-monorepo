
import React, { useState } from 'react';
import Icon from '@/ui/Icon';

interface PortalFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'content' | 'commerce' | 'fitness' | 'social';
}

const Settings: React.FC = () => {
  const [features, setFeatures] = useState<PortalFeature[]>([
    // Content
    { id: 'home', name: 'Página Principal', description: 'Dashboard con estadísticas y métricas', icon: 'Home', enabled: true, category: 'content' },
    { id: 'workouts', name: 'Estilos de Entrenamiento', description: 'Catálogo de tipos de ejercicio (HIIT, Yoga, etc.)', icon: 'Dumbbell', enabled: true, category: 'fitness' },
    { id: 'live-classes', name: 'Clases en Vivo', description: 'Transmisiones en vivo y programadas', icon: 'Radio', enabled: true, category: 'fitness' },
    { id: 'quotes', name: 'Frases Motivacionales', description: 'Frases inspiradoras rotativas', icon: 'MessageSquare', enabled: true, category: 'content' },
    { id: 'banners', name: 'Banners y Promociones', description: 'Anuncios y ofertas especiales', icon: 'Layout', enabled: true, category: 'content' },

    // Fitness
    { id: 'routines', name: 'Mis Rutinas', description: 'Rutinas asignadas por entrenadores', icon: 'List', enabled: true, category: 'fitness' },
    { id: 'ai-trainer', name: 'AI Personal Trainer', description: 'Generador de rutinas con IA', icon: 'Sparkles', enabled: true, category: 'fitness' },
    { id: 'exercise-videos', name: 'Videos de Ejercicios', description: 'Tutoriales de YouTube integrados', icon: 'Play', enabled: true, category: 'fitness' },
    { id: 'progress', name: 'Progreso y Estadísticas', description: 'Gráficas de evolución', icon: 'LineChart', enabled: true, category: 'fitness' },
    { id: 'advanced-stats', name: 'Estadísticas Avanzadas', description: 'Análisis detallado de progreso', icon: 'BarChart3', enabled: true, category: 'fitness' },

    // Commerce
    { id: 'store', name: 'Tienda', description: 'Productos y suplementos', icon: 'ShoppingBag', enabled: true, category: 'commerce' },

    // Social
    { id: 'music-player', name: 'Reproductor de Música', description: 'Spotify integrado para entrenamientos', icon: 'Play', enabled: true, category: 'social' },
    { id: 'profile', name: 'Perfil de Usuario', description: 'Información personal y configuración', icon: 'UserCog', enabled: true, category: 'social' },
  ]);

  const [gymInfo, setGymInfo] = useState({
    name: 'Entrenatech Gym',
    logo: '',
    primaryColor: '#00D9FF',
    accentColor: '#9945FF'
  });

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const categories = [
    { id: 'content', name: 'Contenido', icon: 'Layout', color: 'from-blue-500 to-cyan-500' },
    { id: 'fitness', name: 'Fitness', icon: 'Dumbbell', color: 'from-orange-500 to-red-500' },
    { id: 'commerce', name: 'Comercio', icon: 'ShoppingBag', color: 'from-green-500 to-teal-500' },
    { id: 'social', name: 'Social', icon: 'Users', color: 'from-purple-500 to-pink-500' },
  ];

  const getEnabledCount = (category: string) => {
    return features.filter(f => f.category === category && f.enabled).length;
  };

  const getTotalCount = (category: string) => {
    return features.filter(f => f.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Icon name="Settings" className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Configuración del Portal</h1>
              <p className="text-gray-500">Personaliza las funcionalidades del member portal</p>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Icon name="Save" className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>

      {/* Gym Info */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="IdCard" className="w-6 h-6 text-primary" />
          Información del Gimnasio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nombre del Gimnasio</label>
            <input
              type="text"
              value={gymInfo.name}
              onChange={(e) => setGymInfo({ ...gymInfo, name: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Logo URL</label>
            <input
              type="text"
              value={gymInfo.logo}
              onChange={(e) => setGymInfo({ ...gymInfo, logo: e.target.value })}
              className="input-field"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Color Primario</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={gymInfo.primaryColor}
                onChange={(e) => setGymInfo({ ...gymInfo, primaryColor: e.target.value })}
                className="w-14 h-10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={gymInfo.primaryColor}
                onChange={(e) => setGymInfo({ ...gymInfo, primaryColor: e.target.value })}
                className="input-field flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Color de Acento</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={gymInfo.accentColor}
                onChange={(e) => setGymInfo({ ...gymInfo, accentColor: e.target.value })}
                className="w-14 h-10 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={gymInfo.accentColor}
                onChange={(e) => setGymInfo({ ...gymInfo, accentColor: e.target.value })}
                className="input-field flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features by Category */}
      {categories.map((category) => (
        <div key={category.id} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <Icon name={category.icon as any} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{category.name}</h2>
                <p className="text-sm text-gray-500">
                  {getEnabledCount(category.id)} de {getTotalCount(category.id)} activados
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {features.filter(f => f.category === category.id).map((feature) => (
              <div
                key={feature.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  feature.enabled
                    ? 'border-zinc-700 bg-zinc-900/50'
                    : 'border-zinc-800/50 bg-zinc-900/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    feature.enabled ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-gray-600'
                  }`}>
                    <Icon name={feature.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{feature.name}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFeature(feature.id)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    feature.enabled ? 'bg-primary' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                      feature.enabled ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save Button (sticky at bottom on mobile) */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">¿Listo para aplicar cambios?</h3>
            <p className="text-sm text-gray-500">Los cambios se verán reflejados inmediatamente en el member portal</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Icon name="Save" className="w-4 h-4" />
            Guardar y Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
