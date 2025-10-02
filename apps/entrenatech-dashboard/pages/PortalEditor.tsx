
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateSelector from '../components/portal-editor/TemplateSelector';
import CanvasEditor, { CanvasDesign } from '../components/portal-editor/CanvasEditor';
import PreviewModal from '../components/portal-editor/PreviewModal';
import Icon from '@/ui/Icon';

type EditorMode = 'templates' | 'canvas' | 'saved';

const PortalEditor: React.FC = () => {
  const [mode, setMode] = useState<EditorMode>('templates');
  const [currentDesign, setCurrentDesign] = useState<CanvasDesign | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<CanvasDesign[]>([]);

  const handleTemplateSelect = () => {
    // For now, start with a blank canvas
    const newDesign: CanvasDesign = {
      id: `design-${Date.now()}`,
      name: 'New Portal Design',
      elements: [],
      settings: {
        backgroundColor: '#ffffff',
        width: 1920,
        height: 1080
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCurrentDesign(newDesign);
    setMode('canvas');
  };

  const handleSaveDesign = (design: CanvasDesign) => {
    const existingIndex = savedDesigns.findIndex(d => d.id === design.id);

    if (existingIndex >= 0) {
      const newSavedDesigns = [...savedDesigns];
      newSavedDesigns[existingIndex] = design;
      setSavedDesigns(newSavedDesigns);
    } else {
      setSavedDesigns([...savedDesigns, design]);
    }

    setCurrentDesign(design);

    // Show success notification (could be replaced with a proper toast system)
    console.log('Design saved successfully!', design);
  };

  const handleLoadDesign = (design: CanvasDesign) => {
    setCurrentDesign(design);
    setMode('canvas');
  };

  const handlePreview = () => {
    if (currentDesign) {
      setShowPreview(true);
    }
  };

  const renderTemplateMode = () => (
    <motion.div
      key="templates"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-900">
          Editor de Portales Premium
        </h2>
        <p className="text-gray-600 mt-2">
          Crea una experiencia de conexión única para los miembros de tu gym. Empieza eligiendo una plantilla optimizada con IA o crea desde cero.
        </p>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleTemplateSelect}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <Icon name="Zap" className="w-5 h-5" />
            Crear desde Cero
          </button>
          <button
            onClick={() => setMode('saved')}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-xl font-medium transition-colors"
          >
            <Icon name="FolderOpen" className="w-5 h-5" />
            Mis Diseños ({savedDesigns.length})
          </button>
        </div>
      </div>

      <TemplateSelector />
    </motion.div>
  );

  const renderSavedMode = () => (
    <motion.div
      key="saved"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Diseños</h2>
          <p className="text-gray-500 mt-1">Gestiona tus diseños de portales guardados</p>
        </div>
        <button
          onClick={() => setMode('templates')}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-light hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <Icon name="ArrowLeft" className="w-4 h-4" />
          Volver
        </button>
      </div>

      {savedDesigns.length === 0 ? (
        <div className="bg-secondary rounded-xl border border-gray-800 p-12 text-center">
          <Icon name="FileX" className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No hay diseños guardados</h3>
          <p className="text-gray-500 mb-6">Crea tu primer diseño de portal para empezar</p>
          <button
            onClick={handleTemplateSelect}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors mx-auto"
          >
            <Icon name="Plus" className="w-5 h-5" />
            Crear Diseño
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedDesigns.map((design) => (
            <motion.div
              key={design.id}
              className="bg-secondary rounded-xl border border-gray-800 overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group"
              whileHover={{ y: -4 }}
              onClick={() => handleLoadDesign(design)}
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {design.elements.length} elementos
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                  {design.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Modificado {new Date(design.updatedAt).toLocaleDateString()}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-600">
                    {design.settings.width}×{design.settings.height}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                      <Icon name="Eye" className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-primary transition-colors">
                      <Icon name="Copy" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  const renderCanvasMode = () => (
    <motion.div
      key="canvas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen"
    >
      <CanvasEditor
        initialDesign={currentDesign}
        onSave={handleSaveDesign}
        onPreview={handlePreview}
      />
    </motion.div>
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {mode === 'templates' && renderTemplateMode()}
        {mode === 'saved' && renderSavedMode()}
        {mode === 'canvas' && renderCanvasMode()}
      </AnimatePresence>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        design={currentDesign}
        elements={currentDesign?.elements || []}
      />
    </>
  );
};

export default PortalEditor;