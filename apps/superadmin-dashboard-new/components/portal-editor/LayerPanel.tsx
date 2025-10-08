import React, { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Icon from '@/ui/Icon';
import { CanvasElement } from './Canvas';

interface LayerItemProps {
  element: CanvasElement;
  isSelected: boolean;
  isVisible: boolean;
  isLocked: boolean;
  level: number;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  element,
  isSelected,
  isVisible,
  isLocked,
  level,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onRename,
  onDuplicate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(element.properties.name || `${element.type}-${element.id.slice(-4)}`);
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getElementIcon = (type: CanvasElement['type']) => {
    switch (type) {
      case 'text': return 'Type';
      case 'image': return 'Image';
      case 'button': return 'MousePointer';
      case 'container': return 'Square';
      case 'hero': return 'Layout';
      case 'form': return 'Mail';
      case 'stats-card': return 'BarChart3';
      case 'trainer-card': return 'User';
      case 'routine-card': return 'Activity';
      case 'class-schedule': return 'Calendar';
      case 'member-profile': return 'UserCheck';
      case 'quick-action': return 'Zap';
      case 'kpi-dashboard': return 'TrendingUp';
      case 'checkin-form': return 'CheckSquare';
      case 'music-player': return 'Music';
      case 'playlist-player': return 'ListMusic';
      case 'radio-player': return 'Radio';
      case 'ambient-player': return 'Volume2';
      default: return 'Square';
    }
  };

  const handleNameSubmit = () => {
    onRename(element.id, editName);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditName(element.properties.name || `${element.type}-${element.id.slice(-4)}`);
      setIsEditing(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        className={cn(
          "layer-item relative group",
          isSelected && "selected",
          isDragging && "opacity-50",
          !isVisible && "hidden"
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => onSelect(element.id)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      >
        {/* Manejador de arrastre */}
        <div
          {...listeners}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 cursor-grab hover:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Icon name="GripVertical" className="w-3 h-3 text-gray-500" />
        </div>

        {/* Icono y nombre del elemento */}
        <div className="flex items-center flex-1 min-w-0">
          <Icon
            name={getElementIcon(element.type) as any}
            className={cn(
              "w-4 h-4 mr-2 shrink-0",
              isSelected ? "text-primary" : "text-gray-400"
            )}
          />

          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent text-sm text-white border-b border-primary focus:outline-none"
              autoFocus
            />
          ) : (
            <span
              className={cn(
                "flex-1 text-sm truncate cursor-pointer",
                isSelected ? "text-white font-medium" : "text-gray-300"
              )}
              onDoubleClick={() => setIsEditing(true)}
            >
              {element.properties.name || `${element.type}-${element.id.slice(-4)}`}
            </span>
          )}
        </div>

        {/* Controles de capa */}
        <div className={cn(
          "flex items-center gap-1 ml-2",
          showActions ? "opacity-100" : "opacity-0",
          "transition-opacity"
        )}>
          {/* Alternar visibilidad */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(element.id);
            }}
            className={cn(
              "p-1 rounded hover:bg-gray-700 transition-colors",
              isVisible ? "text-gray-400" : "text-gray-600"
            )}
            title={isVisible ? "Ocultar capa" : "Mostrar capa"}
          >
            <Icon name={isVisible ? "Eye" : "EyeOff"} className="w-3 h-3" />
          </button>

          {/* Alternar bloqueo */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock(element.id);
            }}
            className={cn(
              "p-1 rounded hover:bg-gray-700 transition-colors",
              isLocked ? "text-yellow-400" : "text-gray-400"
            )}
            title={isLocked ? "Desbloquear capa" : "Bloquear capa"}
          >
            <Icon name={isLocked ? "Lock" : "Unlock"} className="w-3 h-3" />
          </button>

          {/* Más acciones */}
          <div className="relative">
            <button className="p-1 rounded hover:bg-gray-700 transition-colors text-gray-400">
              <Icon name="MoreHorizontal" className="w-3 h-3" />
            </button>

            {/* El menú contextual iría aquí */}
          </div>
        </div>

        {/* Menú desplegable de acciones de capa */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              className="absolute right-0 top-8 bg-secondary border border-gray-700 rounded-lg shadow-xl z-50 py-1"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              style={{ display: 'none' }} // Oculto por ahora, se podría alternar
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(element.id);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Icon name="Copy" className="w-3 h-3" />
                Duplicar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Icon name="Edit" className="w-3 h-3" />
                Renombrar
              </button>
              <div className="border-t border-gray-700 my-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-900/20"
              >
                <Icon name="Trash2" className="w-3 h-3" />
                Eliminar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

interface LayerPanelProps {
  elements: CanvasElement[];
  selectedElementId?: string;
  hiddenElements: Set<string>;
  lockedElements: Set<string>;
  onElementsReorder: (elements: CanvasElement[]) => void;
  onElementSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onRenameElement: (id: string, name: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  elements,
  selectedElementId,
  hiddenElements,
  lockedElements,
  onElementsReorder,
  onElementSelect,
  onToggleVisibility,
  onToggleLock,
  onRenameElement,
  onDuplicateElement,
  onDeleteElement
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Ordenar elementos por zIndex (el zIndex más alto aparece primero en la lista)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sortedElements.findIndex(el => el.id === active.id);
    const newIndex = sortedElements.findIndex(el => el.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Reordenar elementos y actualizar zIndex
    const newElements = [...sortedElements];
    const [movedElement] = newElements.splice(oldIndex, 1);
    newElements.splice(newIndex, 0, movedElement);

    // Actualizar zIndex basado en la nueva posición
    const updatedElements = newElements.map((element, index) => ({
      ...element,
      zIndex: newElements.length - index
    }));

    onElementsReorder(updatedElements);
  };

  const renderLayerGroup = (groupElements: CanvasElement[], level = 0) => {
    return groupElements.map(element => {
      const isSelected = selectedElementId === element.id;
      const isVisible = !hiddenElements.has(element.id);
      const isLocked = lockedElements.has(element.id);

      return (
        <div key={element.id}>
          <LayerItem
            element={element}
            isSelected={isSelected}
            isVisible={isVisible}
            isLocked={isLocked}
            level={level}
            onSelect={onElementSelect}
            onToggleVisibility={onToggleVisibility}
            onToggleLock={onToggleLock}
            onRename={onRenameElement}
            onDuplicate={onDuplicateElement}
            onDelete={onDeleteElement}
          />

          {/* Renderizar hijos si los hay */}
          {element.children && element.children.length > 0 && (
            <AnimatePresence>
              {expandedGroups.has(element.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderLayerGroup(element.children, level + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  return (
    <motion.div
      className="w-56 h-full bg-white border-l border-gray-200 flex flex-col shadow-sm"
      initial={{ x: 224 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      {/* Encabezado */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="Layers" className="w-3 h-3 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Capas</h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {elements.length}
          </span>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <button
            className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 px-2 py-1.5 rounded transition-colors"
            title="Nuevo grupo"
          >
            <Icon name="Plus" className="w-3 h-3" />
            <span className="hidden sm:inline">Grupo</span>
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
            title="Buscar"
          >
            <Icon name="Search" className="w-3 h-3" />
          </button>
          <button
            className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
            title="Filtrar"
          >
            <Icon name="Filter" className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Lista de capas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Icon name="Layers" className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-xs text-gray-500 mb-1">Sin capas</p>
            <p className="text-xs text-gray-600">
              Arrastra elementos del toolbox
            </p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedElements.map(el => el.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="py-1">
                <AnimatePresence>
                  {renderLayerGroup(sortedElements)}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Estadísticas de capas */}
      <div className="border-t border-gray-800 p-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-semibold text-white">{elements.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{hiddenElements.size}</div>
            <div className="text-xs text-gray-500">Ocultos</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{lockedElements.size}</div>
            <div className="text-xs text-gray-500">Bloqueados</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LayerPanel;