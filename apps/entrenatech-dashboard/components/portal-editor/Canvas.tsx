import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Icon from '@/ui/Icon';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'hero' | 'form' | 'stats-card' | 'trainer-card' | 'routine-card' | 'class-schedule' | 'member-profile' | 'quick-action' | 'kpi-dashboard' | 'checkin-form' | 'music-player' | 'playlist-player' | 'radio-player' | 'ambient-player';
  position: { x: number; y: number };
  size: { width: number; height: number };
  properties: {
    text?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontWeight?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    border?: string;
    boxShadow?: string;
    [key: string]: any;
  };
  children?: CanvasElement[];
  zIndex: number;
}

interface CanvasProps {
  elements: CanvasElement[];
  onElementsChange: (elements: CanvasElement[]) => void;
  selectedElementId?: string;
  onElementSelect: (elementId: string | null) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  onElementsChange,
  selectedElementId,
  onElementSelect,
  zoom,
  onZoomChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<CanvasElement | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

  // Manejar el zoom con la rueda del ratón
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(0.1, zoom + delta), 5);
      onZoomChange(newZoom);
    }
  }, [zoom, onZoomChange]);

  // Manejar el paneo
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Botón central del ratón o Alt+Click
      e.preventDefault();
      setIsPanning(true);
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    } else if (e.button === 0 && !e.target?.closest('.canvas-element')) {
      // Iniciar cuadro de selección
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setIsSelecting(true);
        setSelectionBox({
          x: (e.clientX - rect.left - panOffset.x) / zoom,
          y: (e.clientY - rect.top - panOffset.y) / zoom,
          width: 0,
          height: 0
        });
      }
    }
  }, [panOffset, zoom]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPosition.x;
      const deltaY = e.clientY - lastPanPosition.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPosition({ x: e.clientX, y: e.clientY });
    } else if (isSelecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - panOffset.x) / zoom;
      const currentY = (e.clientY - rect.top - panOffset.y) / zoom;

      setSelectionBox(prev => ({
        ...prev,
        width: currentX - prev.x,
        height: currentY - prev.y
      }));
    }
  }, [isPanning, isSelecting, lastPanPosition, panOffset, zoom]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
    } else if (isSelecting) {
      setIsSelecting(false);
      // Seleccionar elements dentro del cuadro de selección
      const selectedElements = elements.filter(element => {
        const elementRight = element.position.x + element.size.width;
        const elementBottom = element.position.y + element.size.height;
        const selectionRight = selectionBox.x + Math.abs(selectionBox.width);
        const selectionBottom = selectionBox.y + Math.abs(selectionBox.height);
        const selectionLeft = Math.min(selectionBox.x, selectionBox.x + selectionBox.width);
        const selectionTop = Math.min(selectionBox.y, selectionBox.y + selectionBox.height);

        return element.position.x < selectionRight &&
               elementRight > selectionLeft &&
               element.position.y < selectionBottom &&
               elementBottom > selectionTop;
      });

      if (selectedElements.length === 1) {
        onElementSelect(selectedElements[0].id);
      } else if (selectedElements.length === 0) {
        onElementSelect(null);
      }
    }
  }, [isPanning, isSelecting, selectionBox, elements, onElementSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        canvas.removeEventListener('wheel', handleWheel);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  const handleDragStart = (event: DragStartEvent) => {
    const element = elements.find(el => el.id === event.active.id);
    setDraggedElement(element || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    if (!active.id || !delta) return;

    const updatedElements = elements.map(element => {
      if (element.id === active.id) {
        return {
          ...element,
          position: {
            x: element.position.x + delta.x / zoom,
            y: element.position.y + delta.y / zoom
          }
        };
      }
      return element;
    });

    onElementsChange(updatedElements);
    setDraggedElement(null);
  };

  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElementId === element.id;

    return (
      <motion.div
        key={element.id}
        layoutId={element.id}
        className={cn(
          "canvas-element absolute cursor-move select-none",
          isSelected && "selected",
          draggedElement?.id === element.id && "dragging"
        )}
        style={{
          left: element.position.x * zoom,
          top: element.position.y * zoom,
          width: element.size.width * zoom,
          height: element.size.height * zoom,
          zIndex: element.zIndex,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          ...element.properties
        }}
        onClick={(e) => {
          e.stopPropagation();
          onElementSelect(element.id);
        }}
        whileHover={{ scale: zoom * 1.02 }}
        whileTap={{ scale: zoom * 0.98 }}
      >
        {renderElementContent(element)}

        {isSelected && (
          <>
            {/* Manejadores de redimensionamiento */}
            {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(direction => (
              <div
                key={direction}
                className={cn("resize-handle", direction)}
              />
            ))}
          </>
        )}
      </motion.div>
    );
  };

  const renderElementContent = (element: CanvasElement) => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              fontSize: element.properties.fontSize || 16,
              fontWeight: element.properties.fontWeight || 'normal',
              color: element.properties.textColor || '#ffffff',
              padding: element.properties.padding || 8,
            }}
          >
            {element.properties.text || 'Text Element'}
          </div>
        );

      case 'button':
        return (
          <button
            className="w-full h-full flex items-center justify-center font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: element.properties.backgroundColor || '#2196F3',
              color: element.properties.textColor || '#ffffff',
              borderRadius: element.properties.borderRadius || 8,
              fontSize: element.properties.fontSize || 14,
            }}
          >
            {element.properties.text || 'Button'}
          </button>
        );

      case 'container':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.properties.backgroundColor || 'rgba(255, 255, 255, 0.1)',
              borderRadius: element.properties.borderRadius || 8,
              border: element.properties.border || '1px solid rgba(255, 255, 255, 0.2)',
              padding: element.properties.padding || 16,
            }}
          >
            {element.children?.map(child => renderElement(child))}
          </div>
        );

      case 'image':
        return (
          <div
            className="w-full h-full bg-gray-700 rounded flex items-center justify-center"
            style={{
              borderRadius: element.properties.borderRadius || 8,
            }}
          >
            <Icon name="Image" className="w-8 h-8 text-gray-400" />
            <span className="ml-2 text-sm text-gray-400">Image</span>
          </div>
        );

      case 'hero':
        return (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #2196F3, #1976D2)',
              borderRadius: element.properties.borderRadius || 16,
              color: element.properties.textColor || '#ffffff',
              padding: element.properties.padding || 32,
            }}
          >
            <h1 className="text-4xl font-bold mb-4">
              {element.properties.title || 'Hero Title'}
            </h1>
            <p className="text-lg opacity-90">
              {element.properties.subtitle || 'Hero subtitle text goes here'}
            </p>
          </div>
        );

      case 'form':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.properties.backgroundColor || 'rgba(255, 255, 255, 0.1)',
              borderRadius: element.properties.borderRadius || 8,
              padding: element.properties.padding || 16,
            }}
          >
            <div className="text-white text-sm font-medium mb-4">Contact Form</div>
            <div className="space-y-3">
              <div className="w-full h-8 bg-gray-700 rounded"></div>
              <div className="w-full h-8 bg-gray-700 rounded"></div>
              <div className="w-full h-16 bg-gray-700 rounded"></div>
              <div className="w-20 h-8 bg-blue-500 rounded ml-auto"></div>
            </div>
          </div>
        );

      case 'stats-card':
        return (
          <div
            className="w-full h-full flex items-center"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: element.properties.borderRadius || 12,
              border: element.properties.border || '1px solid rgba(75, 85, 99, 0.3)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
              <Icon name={element.properties.icon || 'BarChart3'} className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-400 mb-1">
                {element.properties.title || 'Metric Title'}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-white">
                  {element.properties.value || '0'}
                </div>
                <div className="text-sm text-green-400 font-semibold">
                  {element.properties.change || '+0%'}
                </div>
              </div>
            </div>
          </div>
        );

      case 'trainer-card':
        return (
          <div
            className="w-full h-full flex flex-col"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: element.properties.borderRadius || 12,
              border: element.properties.border || '1px solid rgba(75, 85, 99, 0.3)',
              padding: element.properties.padding || 20,
            }}
          >
            {/* Encabezado con Avatar */}
            <div className="flex items-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {element.properties.trainerAvatar || 'ET'}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                  element.properties.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-white">
                  {element.properties.trainerName || 'Trainer Name'}
                </h3>
                <p className="text-sm text-gray-400">
                  {element.properties.trainerEmail || 'trainer@gym.com'}
                </p>
              </div>
            </div>

            {/* Especialidades */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 mb-2">ESPECIALIDADES</p>
              <div className="flex flex-wrap gap-2">
                {(element.properties.specialties || ['Especialidad']).map((spec: string, index: number) => (
                  <span key={index} className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mt-auto pt-4 border-t border-gray-700 flex justify-around text-center">
              <div>
                <p className="text-xs text-gray-500">Clases</p>
                <p className="font-bold text-white flex items-center justify-center gap-1">
                  <Icon name="Calendar" className="w-4 h-4"/>
                  {element.properties.classesTaught || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Miembros</p>
                <p className="font-bold text-white flex items-center justify-center gap-1">
                  <Icon name="Users" className="w-4 h-4"/>
                  {element.properties.activeMembers || 0}
                </p>
              </div>
            </div>
          </div>
        );

      case 'routine-card':
        const categoryColors = {
          strength: 'bg-red-500/20 text-red-400',
          cardio: 'bg-blue-500/20 text-blue-400',
          hiit: 'bg-orange-500/20 text-orange-400',
          flexibility: 'bg-green-500/20 text-green-400',
          custom: 'bg-purple-500/20 text-purple-400'
        };
        return (
          <div
            className="w-full h-full flex flex-col"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: element.properties.borderRadius || 8,
              border: element.properties.border || '1px solid rgba(75, 85, 99, 0.3)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${categoryColors[element.properties.category] || categoryColors.custom}`}>
                {(element.properties.category || 'CUSTOM').toUpperCase()}
              </span>
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full mx-0.5 ${i <= (element.properties.difficulty || 1) ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
                ))}
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{element.properties.routineName || 'Routine Name'}</h3>
            <div className="mt-auto pt-3 border-t border-gray-700 flex justify-around text-center text-sm">
              <div>
                <span className="text-gray-400">{element.properties.duration || 0} min</span>
              </div>
              <div>
                <span className="text-gray-400">{element.properties.exerciseCount || 0} ejercicios</span>
              </div>
              <div>
                <span className="text-gray-400">{element.properties.assignedMembers || 0} miembros</span>
              </div>
            </div>
          </div>
        );

      case 'class-schedule':
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: element.properties.borderRadius || 8,
              border: element.properties.border || '1px solid rgba(75, 85, 99, 0.3)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Calendar" className="w-5 h-5 text-blue-400" />
              Próximas Clases
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-medium">18:00</span>
                  <span className="text-white">Yoga Vinyasa</span>
                </div>
                <span className="text-gray-400 text-sm">18/20</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-medium">19:00</span>
                  <span className="text-white">CrossFit WOD</span>
                </div>
                <span className="text-red-400 text-sm">15/15</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-medium">20:00</span>
                  <span className="text-white">Spinning</span>
                </div>
                <span className="text-gray-400 text-sm">22/25</span>
              </div>
            </div>
          </div>
        );

      case 'member-profile':
        const planColors = {
          vip: 'bg-yellow-500/20 text-yellow-400',
          premium: 'bg-blue-500/20 text-blue-400',
          basic: 'bg-gray-500/20 text-gray-400'
        };
        const statusColors = {
          active: 'bg-green-500/20 text-green-400',
          inactive: 'bg-gray-500/20 text-gray-400',
          suspended: 'bg-red-500/20 text-red-400'
        };
        return (
          <div
            className="w-full h-full flex items-center"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: element.properties.borderRadius || 8,
              border: element.properties.border || '1px solid rgba(75, 85, 99, 0.3)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-lg">
                {element.properties.memberAvatar || 'M'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                {element.properties.memberName || 'Member Name'}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${planColors[element.properties.plan] || planColors.basic}`}>
                  {(element.properties.plan || 'basic').toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[element.properties.status] || statusColors.active}`}>
                  {element.properties.status === 'active' ? 'Activo' :
                   element.properties.status === 'suspended' ? 'Suspendido' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'quick-action':
        return (
          <div
            className="w-full h-full relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              borderRadius: element.properties.borderRadius || 8,
              padding: element.properties.padding || 16,
            }}
          >
            {element.properties.badge && (
              <div className="absolute top-2 right-2 text-xs bg-black/30 text-white px-2 py-1 rounded-full font-bold">
                {element.properties.badge}
              </div>
            )}
            <div className="flex items-center justify-between h-full">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={element.properties.icon || 'Zap'} className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">
                    {element.properties.title || 'Action Title'}
                  </h3>
                </div>
                <p className="text-sm text-white/70">
                  {element.properties.description || 'Action description'}
                </p>
              </div>
              <Icon name="ArrowRight" className="w-5 h-5 text-white/70 ml-4" />
            </div>
          </div>
        );

      case 'kpi-dashboard':
        const kpis = element.properties.kpis || [
          { label: 'Ingresos', value: '$24.5K', icon: 'DollarSign' },
          { label: 'Miembros', value: '1,247', icon: 'Users' },
          { label: 'Ocupación', value: '82%', icon: 'CalendarCheck' },
          { label: 'LTV', value: '$1.25K', icon: 'Coins' }
        ];
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: element.properties.borderRadius || 8,
              border: element.properties.border || '1px solid rgba(75, 85, 99, 0.3)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="BarChart" className="w-5 h-5 text-blue-400" />
              Métricas Premium
            </div>
            <div className="grid grid-cols-2 gap-3 h-full">
              {kpis.slice(0, 4).map((kpi, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{kpi.label}</span>
                    <Icon name={kpi.icon} className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="text-xl font-bold text-white">{kpi.value}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'checkin-form':
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.properties.backgroundColor || '#ffffff',
              borderRadius: element.properties.borderRadius || 8,
              border: element.properties.border || '1px solid #e5e7eb',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Icon name="Wifi" className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {element.properties.title || 'WiFi Gratuito'}
              </h3>
              <p className="text-sm text-gray-600">
                {element.properties.subtitle || 'Acceso a internet de alta velocidad'}
              </p>
            </div>

            {element.properties.showQR && (
              <div className="w-24 h-24 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-300 rounded grid grid-cols-4 gap-0.5 p-1">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`bg-gray-800 ${Math.random() > 0.4 ? '' : 'opacity-0'}`}></div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Código de acceso"
                className="w-full p-2 border border-gray-300 rounded text-sm"
                readOnly
              />
              <button className="w-full bg-blue-500 text-white py-2 rounded font-medium text-sm">
                Conectar WiFi
              </button>
            </div>
          </div>
        );

      case 'music-player':
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #581c87, #3730a3)',
              borderRadius: element.properties.borderRadius || 12,
              border: element.properties.border || '1px solid rgba(147, 51, 234, 0.5)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="flex items-center gap-3 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Icon name="Music" className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">
                  {element.properties.currentSong || 'Energía Total Mix'}
                </div>
                <div className="text-xs text-purple-300">
                  {element.properties.artist || 'Gym Beats'} • BPM 128
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Icon name={element.properties.isPlaying ? "Pause" : "Play"} className="w-4 h-4 text-white" />
                </button>
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Icon name="Volume2" className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'playlist-player':
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #064e3b, #0f766e)',
              borderRadius: element.properties.borderRadius || 12,
              border: element.properties.border || '1px solid rgba(16, 185, 129, 0.5)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-bold text-white">
                  {element.properties.playlistName || 'Workout Hits Premium'}
                </div>
                <div className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  {element.properties.totalTracks || 12} tracks
                </div>
              </div>

              <div className="flex-1 space-y-2 overflow-hidden">
                {(element.properties.tracks || [
                  'Eye of the Tiger • Survivor',
                  'Stronger • Kanye West',
                  'Thunder • Imagine Dragons'
                ]).slice(0, 3).map((track, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${i === 0 ? 'bg-emerald-500' : 'bg-emerald-500/30'}`}>
                      <Icon name={i === 0 ? "Play" : "Music"} className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 text-xs text-emerald-300 truncate">{track}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  <button className="w-6 h-6 bg-emerald-500/30 rounded flex items-center justify-center hover:bg-emerald-500/50 transition-colors">
                    <Icon name="SkipBack" className="w-3 h-3 text-white" />
                  </button>
                  <button className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center hover:bg-emerald-600 transition-colors">
                    <Icon name="Play" className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-6 h-6 bg-emerald-500/30 rounded flex items-center justify-center hover:bg-emerald-500/50 transition-colors">
                    <Icon name="SkipForward" className="w-3 h-3 text-white" />
                  </button>
                </div>
                <div className="text-xs text-emerald-400">
                  {element.properties.currentTrack || 1}/{element.properties.totalTracks || 12}
                </div>
              </div>
            </div>
          </div>
        );

      case 'radio-player':
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #7f1d1d, #ea580c)',
              borderRadius: element.properties.borderRadius || 12,
              border: element.properties.border || '1px solid rgba(239, 68, 68, 0.5)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="flex items-center gap-3 h-full">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Icon name="Radio" className="w-6 h-6 text-white" />
                </div>
                {element.properties.isLive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-red-900 animate-pulse"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">
                  {element.properties.stationName || 'Energy FM 105.7'}
                </div>
                <div className="text-xs text-red-300">
                  {element.properties.isLive ? '🔴 EN VIVO' : '📻 GRABADO'} • {element.properties.currentShow || 'Hits Energéticos'}
                </div>
                {element.properties.listeners && (
                  <div className="text-xs text-red-400">
                    {element.properties.listeners} oyentes
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Icon name="Play" className="w-4 h-4 text-white" />
                </button>
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Icon name="Volume2" className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'ambient-player':
        return (
          <div
            className="w-full h-full"
            style={{
              background: element.properties.backgroundColor || 'linear-gradient(135deg, #1e3a8a, #0891b2)',
              borderRadius: element.properties.borderRadius || 12,
              border: element.properties.border || '1px solid rgba(59, 130, 246, 0.5)',
              padding: element.properties.padding || 16,
            }}
          >
            <div className="flex items-center gap-3 h-full">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Icon name="Volume2" className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">
                  {element.properties.ambientType || 'Zona Chill'}
                </div>
                <div className="text-xs text-blue-300">
                  {element.properties.mood || 'Relajación • Estiramiento'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div
                      key={i}
                      className={`w-1 bg-cyan-400 rounded-full transition-all duration-300 ${
                        i <= (element.properties.volume || 30) / 20 ? 'h-6' : 'h-2'
                      }`}
                    ></div>
                  ))}
                </div>
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Icon name="Play" className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
            <span className="text-sm text-gray-400">Unknown Element</span>
          </div>
        );
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        ref={canvasRef}
        className="canvas-editor relative w-full h-full overflow-hidden cursor-crosshair"
        onMouseDown={handleMouseDown}
        style={{ backgroundColor: '#0A0A0A' }}
      >
        {/* Fondo de cuadrícula */}
        <div
          className="canvas-grid absolute inset-0"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        />

        {/* Contenido del lienzo */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <AnimatePresence>
            {elements.map(renderElement)}
          </AnimatePresence>
        </div>

        {/* Cuadro de selección */}
        {isSelecting && (
          <div
            className="selection-box"
            style={{
              left: Math.min(selectionBox.x, selectionBox.x + selectionBox.width) * zoom + panOffset.x,
              top: Math.min(selectionBox.y, selectionBox.y + selectionBox.height) * zoom + panOffset.y,
              width: Math.abs(selectionBox.width) * zoom,
              height: Math.abs(selectionBox.height) * zoom,
            }}
          />
        )}

        {/* Controles de zoom */}
        <div className="zoom-controls">
          <button
            className="zoom-button"
            onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
          >
            <Icon name="Minus" className="w-4 h-4" />
          </button>
          <span className="px-2 text-sm font-medium">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="zoom-button"
            onClick={() => onZoomChange(Math.min(5, zoom + 0.1))}
          >
            <Icon name="Plus" className="w-4 h-4" />
          </button>
          <button
            className="zoom-button"
            onClick={() => onZoomChange(1)}
            title="Reset zoom"
          >
            <Icon name="RotateCcw" className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DragOverlay>
        {draggedElement && (
          <motion.div
            className="canvas-element dragging"
            style={{
              width: draggedElement.size.width,
              height: draggedElement.size.height,
              ...draggedElement.properties
            }}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1.05 }}
          >
            {renderElementContent(draggedElement)}
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Canvas;