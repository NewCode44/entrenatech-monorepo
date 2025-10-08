import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/lib/utils';
import Icon from '@/ui/Icon';
import Canvas, { CanvasElement } from './Canvas';
import Toolbox from './Toolbox';
import PropertyPanel from './PropertyPanel';
import LayerPanel from './LayerPanel';

interface CanvasEditorProps {
  onSave?: (design: CanvasDesign) => void;
  onPreview?: () => void;
  initialDesign?: CanvasDesign;
}

export interface CanvasDesign {
  id: string;
  name: string;
  elements: CanvasElement[];
  settings: {
    backgroundColor: string;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  onSave,
  onPreview,
  initialDesign
}) => {
  // Estado principal
  const [elements, setElements] = useState<CanvasElement[]>(initialDesign?.elements || []);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [draggedElementType, setDraggedElementType] = useState<CanvasElement['type'] | null>(null);

  // Estado de visibilidad de los paneles
  const [showToolbox, setShowToolbox] = useState(true);
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);
  const [showLayerPanel, setShowLayerPanel] = useState(true);

  // Estados de los elementos
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());
  const [lockedElements, setLockedElements] = useState<Set<string>>(new Set());

  // Configuración del diseño
  const [designName, setDesignName] = useState(initialDesign?.name || 'Untitled Design');
  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: initialDesign?.settings.backgroundColor || '#0A0A0A',
    width: initialDesign?.settings.width || 1920,
    height: initialDesign?.settings.height || 1080,
  });

  // Historial para deshacer/rehacer
  const [history, setHistory] = useState<CanvasElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Atajos de teclado
  useHotkeys('ctrl+z, cmd+z', () => undo(), { preventDefault: true });
  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', () => redo(), { preventDefault: true });
  useHotkeys('delete, backspace', () => deleteSelectedElement(), { preventDefault: true });
  useHotkeys('ctrl+d, cmd+d', () => duplicateSelectedElement(), { preventDefault: true });
  useHotkeys('ctrl+s, cmd+s', () => handleSave(), { preventDefault: true });
  useHotkeys('escape', () => setSelectedElementId(null), { preventDefault: true });

  // Gestión del historial
  const saveToHistory = useCallback((newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setElements(newElements);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setElements([...history[prevIndex]]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setElements([...history[nextIndex]]);
    }
  }, [history, historyIndex]);

  // Gestión de elementos
  const handleAddElement = useCallback((type: CanvasElement['type'], elementData?: Partial<CanvasElement>) => {
    const newElement: CanvasElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 100 },
      properties: {},
      zIndex: elements.length + 1,
      ...elementData
    };

    const newElements = [...elements, newElement];
    saveToHistory(newElements);
    setSelectedElementId(newElement.id);
  }, [elements, saveToHistory]);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    saveToHistory(newElements);
  }, [elements, saveToHistory]);

  const handleElementsChange = useCallback((newElements: CanvasElement[]) => {
    saveToHistory(newElements);
  }, [saveToHistory]);

  const deleteSelectedElement = useCallback(() => {
    if (!selectedElementId) return;

    const newElements = elements.filter(el => el.id !== selectedElementId);
    saveToHistory(newElements);
    setSelectedElementId(null);
  }, [selectedElementId, elements, saveToHistory]);

  const duplicateSelectedElement = useCallback(() => {
    const selectedElement = elements.find(el => el.id === selectedElementId);
    if (!selectedElement) return;

    const newElement: CanvasElement = {
      ...selectedElement,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: selectedElement.position.x + 20,
        y: selectedElement.position.y + 20
      },
      zIndex: Math.max(...elements.map(el => el.zIndex)) + 1
    };

    const newElements = [...elements, newElement];
    saveToHistory(newElements);
    setSelectedElementId(newElement.id);
  }, [selectedElementId, elements, saveToHistory]);

  // Gestión de capas
  const handleToggleVisibility = useCallback((elementId: string) => {
    const newHidden = new Set(hiddenElements);
    if (newHidden.has(elementId)) {
      newHidden.delete(elementId);
    } else {
      newHidden.add(elementId);
    }
    setHiddenElements(newHidden);
  }, [hiddenElements]);

  const handleToggleLock = useCallback((elementId: string) => {
    const newLocked = new Set(lockedElements);
    if (newLocked.has(elementId)) {
      newLocked.delete(elementId);
    } else {
      newLocked.add(elementId);
    }
    setLockedElements(newLocked);
  }, [lockedElements]);

  const handleRenameElement = useCallback((elementId: string, name: string) => {
    handleElementUpdate(elementId, {
      properties: {
        ...elements.find(el => el.id === elementId)?.properties,
        name
      }
    });
  }, [elements, handleElementUpdate]);

  // Funcionalidad de guardado
  const handleSave = useCallback(() => {
    const design: CanvasDesign = {
      id: initialDesign?.id || `design-${Date.now()}`,
      name: designName,
      elements,
      settings: canvasSettings,
      createdAt: initialDesign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave?.(design);
  }, [designName, elements, canvasSettings, initialDesign, onSave]);

  // Arrastrar y soltar desde la caja de herramientas
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    if (id.startsWith('template-')) {
      const elementType = id.replace('template-', '') as CanvasElement['type'];
      setDraggedElementType(elementType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedElementType(null);
    // La lógica adicional de fin de arrastre se maneja en el componente Canvas
  };

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Barra de herramientas superior */}
        <motion.div
          className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 z-40 shadow-sm"
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="bg-transparent text-lg font-semibold text-gray-900 border-none outline-none focus:bg-gray-100 rounded px-2 py-1"
              placeholder="Nombre del diseño"
            />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{elements.length} elementos</span>
              <span>•</span>
              <span>{Math.round(zoom * 100)}% zoom</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Controles de vista */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowToolbox(!showToolbox)}
                className={cn(
                  "p-2 rounded text-sm transition-colors",
                  showToolbox ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                )}
                title="Mostrar/Ocultar Herramientas"
              >
                <Icon name="Package" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowLayerPanel(!showLayerPanel)}
                className={cn(
                  "p-2 rounded text-sm transition-colors",
                  showLayerPanel ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                )}
                title="Mostrar/Ocultar Capas"
              >
                <Icon name="Layers" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowPropertyPanel(!showPropertyPanel)}
                className={cn(
                  "p-2 rounded text-sm transition-colors",
                  showPropertyPanel ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                )}
                title="Mostrar/Ocultar Propiedades"
              >
                <Icon name="Settings" className="w-4 h-4" />
              </button>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900 transition-colors"
                title="Deshacer (Ctrl+Z)"
              >
                <Icon name="Undo" className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900 transition-colors"
                title="Rehacer (Ctrl+Y)"
              >
                <Icon name="Redo" className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <button
                onClick={onPreview}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded transition-colors"
              >
                <Icon name="Eye" className="w-4 h-4" />
                Vista previa
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
              >
                <Icon name="Save" className="w-4 h-4" />
                Guardar Diseño
              </button>
            </div>
          </div>
        </motion.div>

        {/* Área principal del editor */}
        <div className="flex flex-1 overflow-hidden">
          {/* Caja de herramientas */}
          <AnimatePresence>
            {showToolbox && (
              <Toolbox onAddElement={handleAddElement} />
            )}
          </AnimatePresence>

          {/* Área del lienzo */}
          <div className="flex-1 flex flex-col">
            <Canvas
              elements={elements.filter(el => !hiddenElements.has(el.id))}
              onElementsChange={handleElementsChange}
              selectedElementId={selectedElementId}
              onElementSelect={setSelectedElementId}
              zoom={zoom}
              onZoomChange={setZoom}
            />
          </div>

          {/* Panel de capas */}
          <AnimatePresence>
            {showLayerPanel && (
              <LayerPanel
                elements={elements}
                selectedElementId={selectedElementId}
                hiddenElements={hiddenElements}
                lockedElements={lockedElements}
                onElementsReorder={handleElementsChange}
                onElementSelect={setSelectedElementId}
                onToggleVisibility={handleToggleVisibility}
                onToggleLock={handleToggleLock}
                onRenameElement={handleRenameElement}
                onDuplicateElement={duplicateSelectedElement}
                onDeleteElement={(id) => {
                  setSelectedElementId(id);
                  deleteSelectedElement();
                }}
              />
            )}
          </AnimatePresence>

          {/* Panel de propiedades */}
          <AnimatePresence>
            {showPropertyPanel && (
              <PropertyPanel
                selectedElement={selectedElement}
                onElementUpdate={handleElementUpdate}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Barra de estado */}
        <motion.div
          className="flex items-center justify-between px-6 py-2 bg-secondary border-t border-gray-800 text-xs text-gray-400"
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <span>Canvas: {canvasSettings.width} × {canvasSettings.height}</span>
            {selectedElement && (
              <span>
                Selected: {selectedElement.size.width} × {selectedElement.size.height} at ({selectedElement.position.x}, {selectedElement.position.y})
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>Guardado automático</span>
            <span>•</span>
            <span>Listo</span>
          </div>
        </motion.div>
      </div>
    </DndContext>
  );
};

export default CanvasEditor;