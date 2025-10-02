import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/ui/Icon';
import Card from '@/ui/Card';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  theme: string;
  features: string[];
  gradient: string;
  active: boolean;
}

const templates: Template[] = [
  {
    id: 'energetica',
    name: 'Portal Energética',
    description: 'Diseño vibrante y dinámico para motivar a los clientes más activos',
    preview: '/previews/gym-energetica.png',
    theme: 'Energético',
    features: ['Colores vibrantes', 'Animaciones explosivas', 'Emojis motivacionales'],
    gradient: 'from-red-500 via-orange-500 to-yellow-500',
    active: true
  },
  {
    id: 'premium',
    name: 'Portal Premium',
    description: 'Elegancia y exclusividad para clientes VIP y servicios de lujo',
    preview: '/previews/gym-premium.png',
    theme: 'Premium',
    features: ['Diseño elegante', 'Colores dorados', 'Servicios exclusivos'],
    gradient: 'from-amber-400 via-yellow-500 to-orange-600',
    active: false
  },
  {
    id: 'deportiva',
    name: 'Portal Deportiva',
    description: 'Enfoque en rendimiento y competencia para atletas serios',
    preview: '/previews/gym-deportiva.png',
    theme: 'Deportivo',
    features: ['Métricas avanzadas', 'Leaderboards', 'Tracking detallado'],
    gradient: 'from-red-600 via-red-500 to-orange-500',
    active: false
  }
];

const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('energetica');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const handleActivateTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    console.log(`Activando plantilla: ${templateId}`);
  };

  const handlePreviewTemplate = (templateId: string) => {
    setPreviewTemplate(templateId);
    console.log(`Previsualizando plantilla: ${templateId}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black mb-2">
          <span className="gradient-text">Plantillas de Portal</span>
          <span className="ml-2">🎨</span>
        </h1>
        <p className="text-lg text-gray-400 mb-4">
          Selecciona la experiencia perfecta para tus clientes del gym
        </p>
        <div className="flex items-center justify-center md:justify-start space-x-2 bg-secondary-light px-4 py-2 rounded-full border border-gray-800 inline-flex">
          <Icon name="CheckCircle" className="w-4 h-4 text-success" />
          <span className="text-sm text-gray-300">
            Activa: {templates.find(t => t.id === selectedTemplate)?.name}
          </span>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full border-2 transition-all ${
              selectedTemplate === template.id 
                ? 'border-primary shadow-lg shadow-primary/20' 
                : 'border-gray-800 hover:border-gray-700'
            }`}>
              {/* Preview Section */}
              <div className={`relative h-48 bg-gradient-to-br ${template.gradient} rounded-lg mb-6 overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="Monitor" className="w-16 h-16 text-white/80" />
                </div>
                
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 bg-success text-black p-2 rounded-full">
                    <Icon name="CheckCircle" className="w-4 h-4" />
                  </div>
                )}
                
                <div className="absolute top-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {template.theme}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center">
                    {template.name}
                    {template.id === 'premium' && <span className="ml-2">👑</span>}
                    {template.id === 'energetica' && <span className="ml-2">⚡</span>}
                    {template.id === 'deportiva' && <span className="ml-2">🏆</span>}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => handlePreviewTemplate(template.id)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all group"
                  >
                    <Icon name="Eye" className="w-4 h-4" />
                    <span>Vista Previa</span>
                    <Icon name="ExternalLink" className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  </button>

                  {selectedTemplate === template.id ? (
                    <div className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-success/20 text-success rounded-lg font-bold border border-success/30">
                      <Icon name="CheckCircle" className="w-4 h-4" />
                      <span>Plantilla Activa</span>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => handleActivateTemplate(template.id)}
                      className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${template.gradient} text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-all`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon name="Zap" className="w-4 h-4" />
                      <span>Activar Portal</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Custom Template Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon name="Palette" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                ¿Necesitas algo único? 🎯
              </h3>
              <p className="text-gray-400">
                Crea una plantilla personalizada para tu marca de gym
              </p>
            </div>
          </div>
          <motion.button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="Plus" className="w-4 h-4" />
            <span>Crear Plantilla Custom</span>
          </motion.button>
        </div>
      </Card>

      {/* Preview Modal */}
      {previewTemplate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Icon name="Eye" className="w-5 h-5 mr-2" />
                  Vista Previa: {templates.find(t => t.id === previewTemplate)?.name}
                </h3>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-all"
                >
                  <Icon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-8 bg-secondary-light min-h-96 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Icon name="Monitor" className="w-32 h-32 mx-auto mb-6 text-gray-600" />
                <h4 className="text-xl font-bold text-white mb-2">
                  {templates.find(t => t.id === previewTemplate)?.name}
                </h4>
                <p className="text-gray-400 mb-4">
                  {templates.find(t => t.id === previewTemplate)?.description}
                </p>
                <div className="bg-gray-800 rounded-lg p-4 inline-block">
                  <p className="text-sm text-gray-300">
                    La vista previa interactiva se cargaría aquí en tiempo real
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplateSelector;