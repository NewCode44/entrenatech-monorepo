import React, { useState, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Icon from '@/ui/Icon';
import { CanvasElement } from './Canvas';

interface PropertyGroup {
  id: string;
  name: string;
  icon: string;
  properties: PropertyField[];
}

interface PropertyField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select' | 'slider' | 'toggle' | 'textarea';
  value: any;
  options?: { value: any; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-400 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded border-2 border-gray-700 hover:border-primary transition-colors overflow-hidden"
          style={{ backgroundColor: color }}
        >
          {!color && (
            <div className="w-full h-full bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />
          )}
        </button>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-secondary-light border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
          placeholder="#000000"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-2 z-50 bg-secondary border border-gray-700 rounded-lg p-3 shadow-xl"
          >
            <HexColorPicker color={color} onChange={onChange} />

            <div className="flex flex-wrap gap-1 mt-3">
              {[
                '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                '#FFFF00', '#FF00FF', '#00FFFF', '#FF8000', '#8000FF'
              ].map(presetColor => (
                <button
                  key={presetColor}
                  onClick={() => onChange(presetColor)}
                  className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-3 bg-primary hover:bg-primary-dark text-white text-xs py-2 rounded transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SliderInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  unit = ''
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-400">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 bg-secondary-light border border-gray-700 rounded px-2 py-1 text-xs text-white text-center focus:border-primary focus:outline-none"
            min={min}
            max={max}
            step={step}
          />
          {unit && <span className="text-xs text-gray-500">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
};

interface PropertyPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (elementId: string, properties: Partial<CanvasElement>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedElement,
  onElementUpdate
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['appearance', 'layout']));

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const updateProperty = useCallback((key: string, value: any) => {
    if (!selectedElement) return;

    const newProperties = {
      ...selectedElement.properties,
      [key]: value
    };

    onElementUpdate(selectedElement.id, { properties: newProperties });
  }, [selectedElement, onElementUpdate]);

  const updatePosition = useCallback((axis: 'x' | 'y', value: number) => {
    if (!selectedElement) return;

    const newPosition = {
      ...selectedElement.position,
      [axis]: value
    };

    onElementUpdate(selectedElement.id, { position: newPosition });
  }, [selectedElement, onElementUpdate]);

  const updateSize = useCallback((dimension: 'width' | 'height', value: number) => {
    if (!selectedElement) return;

    const newSize = {
      ...selectedElement.size,
      [dimension]: Math.max(1, value)
    };

    onElementUpdate(selectedElement.id, { size: newSize });
  }, [selectedElement, onElementUpdate]);

  const getPropertyGroups = (): PropertyGroup[] => {
    if (!selectedElement) return [];

    const commonGroups: PropertyGroup[] = [
      {
        id: 'layout',
        name: 'Posición',
        icon: 'Move',
        properties: [
          {
            key: 'x',
            label: 'Posición X',
            type: 'number',
            value: selectedElement.position.x,
            unit: 'px'
          },
          {
            key: 'y',
            label: 'Posición Y',
            type: 'number',
            value: selectedElement.position.y,
            unit: 'px'
          },
          {
            key: 'width',
            label: 'Ancho',
            type: 'number',
            value: selectedElement.size.width,
            min: 1,
            unit: 'px'
          },
          {
            key: 'height',
            label: 'Alto',
            type: 'number',
            value: selectedElement.size.height,
            min: 1,
            unit: 'px'
          }
        ]
      },
      {
        id: 'appearance',
        name: 'Apariencia',
        icon: 'Palette',
        properties: [
          {
            key: 'backgroundColor',
            label: 'Fondo',
            type: 'color',
            value: selectedElement.properties.backgroundColor || '#000000'
          },
          {
            key: 'borderRadius',
            label: 'Bordes redondeados',
            type: 'slider',
            value: selectedElement.properties.borderRadius || 0,
            min: 0,
            max: 50,
            step: 1,
            unit: 'px'
          },
          {
            key: 'padding',
            label: 'Relleno interno',
            type: 'slider',
            value: selectedElement.properties.padding || 0,
            min: 0,
            max: 100,
            step: 1,
            unit: 'px'
          }
        ]
      }
    ];

    // Añadir propiedades específicas del tipo
    switch (selectedElement.type) {
      case 'text':
      case 'button':
        commonGroups.push({
          id: 'typography',
          name: 'Tipografía',
          icon: 'Type',
          properties: [
            {
              key: 'text',
              label: selectedElement.type === 'button' ? 'Texto del botón' : 'Contenido del texto',
              type: selectedElement.type === 'text' ? 'textarea' : 'text',
              value: selectedElement.properties.text || ''
            },
            {
              key: 'fontSize',
              label: 'Tamaño de fuente',
              type: 'slider',
              value: selectedElement.properties.fontSize || 16,
              min: 8,
              max: 72,
              step: 1,
              unit: 'px'
            },
            {
              key: 'fontWeight',
              label: 'Peso de fuente',
              type: 'select',
              value: selectedElement.properties.fontWeight || 'normal',
              options: [
                { value: '300', label: 'Ligera' },
                { value: 'normal', label: 'Normal' },
                { value: '500', label: 'Media' },
                { value: 'bold', label: 'Negrita' },
                { value: '900', label: 'Extra Negrita' }
              ]
            },
            {
              key: 'textColor',
              label: 'Color del texto',
              type: 'color',
              value: selectedElement.properties.textColor || '#ffffff'
            }
          ]
        });
        break;

      case 'hero':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'title',
              label: 'Título principal',
              type: 'text',
              value: selectedElement.properties.title || ''
            },
            {
              key: 'subtitle',
              label: 'Subtítulo',
              type: 'textarea',
              value: selectedElement.properties.subtitle || ''
            },
            {
              key: 'textColor',
              label: 'Color del texto',
              type: 'color',
              value: selectedElement.properties.textColor || '#ffffff'
            }
          ]
        });
        break;

      case 'image':
        commonGroups.push({
          id: 'image',
          name: 'Imagen',
          icon: 'Image',
          properties: [
            {
              key: 'src',
              label: 'URL de la imagen',
              type: 'text',
              value: selectedElement.properties.src || ''
            },
            {
              key: 'alt',
              label: 'Texto alternativo',
              type: 'text',
              value: selectedElement.properties.alt || ''
            }
          ]
        });
        break;

      case 'stats-card':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'title',
              label: 'Título',
              type: 'text',
              value: selectedElement.properties.title || ''
            },
            {
              key: 'value',
              label: 'Valor',
              type: 'text',
              value: selectedElement.properties.value || ''
            },
            {
              key: 'change',
              label: 'Cambio (%)',
              type: 'text',
              value: selectedElement.properties.change || ''
            },
            {
              key: 'icon',
              label: 'Icono',
              type: 'select',
              value: selectedElement.properties.icon || 'Users',
              options: [
                { value: 'Users', label: 'Usuarios' },
                { value: 'TrendingUp', label: 'Tendencia' },
                { value: 'DollarSign', label: 'Dinero' },
                { value: 'Activity', label: 'Actividad' },
                { value: 'Clock', label: 'Reloj' },
                { value: 'Target', label: 'Objetivo' }
              ]
            }
          ]
        });
        break;

      case 'trainer-card':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'name',
              label: 'Nombre',
              type: 'text',
              value: selectedElement.properties.name || ''
            },
            {
              key: 'specialty',
              label: 'Especialidad',
              type: 'text',
              value: selectedElement.properties.specialty || ''
            },
            {
              key: 'experience',
              label: 'Experiencia (años)',
              type: 'number',
              value: selectedElement.properties.experience || 0,
              min: 0,
              max: 50
            },
            {
              key: 'rating',
              label: 'Calificación',
              type: 'slider',
              value: selectedElement.properties.rating || 4.5,
              min: 0,
              max: 5,
              step: 0.1
            },
            {
              key: 'avatarUrl',
              label: 'URL del Avatar',
              type: 'text',
              value: selectedElement.properties.avatarUrl || ''
            }
          ]
        });
        break;

      case 'routine-card':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'name',
              label: 'Nombre',
              type: 'text',
              value: selectedElement.properties.name || ''
            },
            {
              key: 'category',
              label: 'Categoría',
              type: 'select',
              value: selectedElement.properties.category || 'strength',
              options: [
                { value: 'strength', label: 'Fuerza' },
                { value: 'cardio', label: 'Cardio' },
                { value: 'hiit', label: 'HIIT' },
                { value: 'flexibility', label: 'Flexibilidad' },
                { value: 'custom', label: 'Personalizada' }
              ]
            },
            {
              key: 'difficulty',
              label: 'Dificultad',
              type: 'slider',
              value: selectedElement.properties.difficulty || 3,
              min: 1,
              max: 5,
              step: 1
            },
            {
              key: 'duration',
              label: 'Duración (min)',
              type: 'number',
              value: selectedElement.properties.duration || 30,
              min: 5,
              max: 120
            },
            {
              key: 'exercises',
              label: 'Número de ejercicios',
              type: 'number',
              value: selectedElement.properties.exercises || 8,
              min: 1,
              max: 50
            }
          ]
        });
        break;

      case 'class-schedule':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'title',
              label: 'Título de la clase',
              type: 'text',
              value: selectedElement.properties.title || ''
            },
            {
              key: 'instructor',
              label: 'Instructor',
              type: 'text',
              value: selectedElement.properties.instructor || ''
            },
            {
              key: 'time',
              label: 'Horario',
              type: 'text',
              value: selectedElement.properties.time || ''
            },
            {
              key: 'duration',
              label: 'Duración (min)',
              type: 'number',
              value: selectedElement.properties.duration || 60,
              min: 15,
              max: 180
            },
            {
              key: 'participants',
              label: 'Participantes actuales',
              type: 'number',
              value: selectedElement.properties.participants || 12,
              min: 0,
              max: 100
            },
            {
              key: 'maxParticipants',
              label: 'Máximo de participantes',
              type: 'number',
              value: selectedElement.properties.maxParticipants || 20,
              min: 1,
              max: 100
            }
          ]
        });
        break;

      case 'member-profile':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'name',
              label: 'Nombre',
              type: 'text',
              value: selectedElement.properties.name || ''
            },
            {
              key: 'membershipType',
              label: 'Tipo de membresía',
              type: 'select',
              value: selectedElement.properties.membershipType || 'Premium',
              options: [
                { value: 'Basic', label: 'Básica' },
                { value: 'Premium', label: 'Premium' },
                { value: 'VIP', label: 'VIP' },
                { value: 'Student', label: 'Estudiante' }
              ]
            },
            {
              key: 'joinDate',
              label: 'Fecha de ingreso',
              type: 'text',
              value: selectedElement.properties.joinDate || ''
            },
            {
              key: 'avatarUrl',
              label: 'URL del Avatar',
              type: 'text',
              value: selectedElement.properties.avatarUrl || ''
            },
            {
              key: 'status',
              label: 'Estado',
              type: 'select',
              value: selectedElement.properties.status || 'active',
              options: [
                { value: 'active', label: 'Activo' },
                { value: 'inactive', label: 'Inactivo' },
                { value: 'suspended', label: 'Suspendido' }
              ]
            }
          ]
        });
        break;

      case 'quick-action':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'title',
              label: 'Título',
              type: 'text',
              value: selectedElement.properties.title || ''
            },
            {
              key: 'description',
              label: 'Descripción',
              type: 'textarea',
              value: selectedElement.properties.description || ''
            },
            {
              key: 'icon',
              label: 'Icono',
              type: 'select',
              value: selectedElement.properties.icon || 'Zap',
              options: [
                { value: 'Zap', label: 'Rayo' },
                { value: 'Plus', label: 'Más' },
                { value: 'Edit', label: 'Editar' },
                { value: 'Calendar', label: 'Calendario' },
                { value: 'Users', label: 'Usuarios' },
                { value: 'Settings', label: 'Configuración' }
              ]
            }
          ]
        });
        break;

      case 'kpi-dashboard':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'title',
              label: 'Título del Dashboard',
              type: 'text',
              value: selectedElement.properties.title || ''
            }
          ]
        });
        break;

      case 'checkin-form':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'title',
              label: 'Título del formulario',
              type: 'text',
              value: selectedElement.properties.title || ''
            }
          ]
        });
        break;

      case 'music-player':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'currentSong',
              label: 'Canción actual',
              type: 'text',
              value: selectedElement.properties.currentSong || ''
            },
            {
              key: 'artist',
              label: 'Artista',
              type: 'text',
              value: selectedElement.properties.artist || ''
            },
            {
              key: 'isPlaying',
              label: 'Reproduciendo',
              type: 'toggle',
              value: selectedElement.properties.isPlaying || false
            },
            {
              key: 'volume',
              label: 'Volumen',
              type: 'slider',
              value: selectedElement.properties.volume || 75,
              min: 0,
              max: 100,
              step: 1
            }
          ]
        });
        break;

      case 'playlist-player':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'playlistName',
              label: 'Nombre de playlist',
              type: 'text',
              value: selectedElement.properties.playlistName || ''
            },
            {
              key: 'totalTracks',
              label: 'Total de canciones',
              type: 'number',
              value: selectedElement.properties.totalTracks || 12,
              min: 1,
              max: 100
            },
            {
              key: 'currentTrack',
              label: 'Canción actual',
              type: 'number',
              value: selectedElement.properties.currentTrack || 1,
              min: 1,
              max: selectedElement.properties.totalTracks || 12
            }
          ]
        });
        break;

      case 'radio-player':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'stationName',
              label: 'Nombre de la estación',
              type: 'text',
              value: selectedElement.properties.stationName || ''
            },
            {
              key: 'currentShow',
              label: 'Programa actual',
              type: 'text',
              value: selectedElement.properties.currentShow || ''
            },
            {
              key: 'isLive',
              label: 'En vivo',
              type: 'toggle',
              value: selectedElement.properties.isLive || true
            },
            {
              key: 'listeners',
              label: 'Oyentes',
              type: 'number',
              value: selectedElement.properties.listeners || 0,
              min: 0,
              max: 10000
            }
          ]
        });
        break;

      case 'ambient-player':
        commonGroups.push({
          id: 'content',
          name: 'Contenido',
          icon: 'FileText',
          properties: [
            {
              key: 'ambientType',
              label: 'Tipo de ambiente',
              type: 'text',
              value: selectedElement.properties.ambientType || ''
            },
            {
              key: 'mood',
              label: 'Estado de ánimo',
              type: 'text',
              value: selectedElement.properties.mood || ''
            },
            {
              key: 'volume',
              label: 'Volumen',
              type: 'slider',
              value: selectedElement.properties.volume || 30,
              min: 0,
              max: 100,
              step: 1
            }
          ]
        });
        break;
    }

    return commonGroups;
  };

  const renderPropertyField = (property: PropertyField) => {
    const handleChange = (value: any) => {
      if (property.key === 'x' || property.key === 'y') {
        updatePosition(property.key, value);
      } else if (property.key === 'width' || property.key === 'height') {
        updateSize(property.key, value);
      } else {
        updateProperty(property.key, value);
      }
    };

    switch (property.type) {
      case 'text':
        return (
          <div key={property.key}>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              {property.label}
            </label>
            <input
              type="text"
              value={property.value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full bg-secondary-light border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              placeholder={property.label}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={property.key}>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              {property.label}
            </label>
            <textarea
              value={property.value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full bg-secondary-light border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none resize-none"
              rows={3}
              placeholder={property.label}
            />
          </div>
        );

      case 'number':
        return (
          <div key={property.key}>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              {property.label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={property.value}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="flex-1 bg-secondary-light border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
                min={property.min}
                max={property.max}
                step={property.step}
              />
              {property.unit && (
                <span className="text-xs text-gray-500">{property.unit}</span>
              )}
            </div>
          </div>
        );

      case 'color':
        return (
          <ColorPicker
            key={property.key}
            color={property.value}
            onChange={handleChange}
            label={property.label}
          />
        );

      case 'slider':
        return (
          <SliderInput
            key={property.key}
            value={property.value}
            onChange={handleChange}
            min={property.min || 0}
            max={property.max || 100}
            step={property.step || 1}
            label={property.label}
            unit={property.unit}
          />
        );

      case 'select':
        return (
          <div key={property.key}>
            <label className="block text-xs font-medium text-gray-400 mb-2">
              {property.label}
            </label>
            <select
              value={property.value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full bg-secondary-light border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none appearance-none cursor-pointer"
            >
              {property.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'toggle':
        return (
          <div key={property.key} className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-400">
              {property.label}
            </label>
            <button
              onClick={() => handleChange(!property.value)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                property.value ? "bg-primary" : "bg-gray-700"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                  property.value ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!selectedElement) {
    return (
      <motion.div
        className="w-64 h-full bg-secondary border-l border-gray-800 flex flex-col"
        initial={{ x: 256 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-700 rounded-lg flex items-center justify-center">
              <Icon name="Settings" className="w-3 h-3 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-white">Propiedades</h3>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <Icon name="MousePointer" className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Ningún elemento seleccionado</p>
            <p className="text-xs text-gray-600">
              Selecciona un elemento para editar
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const propertyGroups = getPropertyGroups();

  return (
    <motion.div
      className="w-64 h-full bg-white border-l border-gray-200 flex flex-col shadow-sm"
      initial={{ x: 256 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      {/* Encabezado */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="Settings" className="w-3 h-3 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Propiedades</h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
            {selectedElement.type === 'text' ? 'Texto' :
             selectedElement.type === 'image' ? 'Imagen' :
             selectedElement.type === 'button' ? 'Botón' :
             selectedElement.type === 'container' ? 'Contenedor' :
             selectedElement.type === 'hero' ? 'Hero' :
             selectedElement.type === 'form' ? 'Formulario' :
             selectedElement.type === 'stats-card' ? 'Estadística' :
             selectedElement.type === 'trainer-card' ? 'Entrenador' :
             selectedElement.type === 'routine-card' ? 'Rutina' :
             selectedElement.type === 'class-schedule' ? 'Clase' :
             selectedElement.type === 'member-profile' ? 'Miembro' :
             selectedElement.type === 'quick-action' ? 'Acción' :
             selectedElement.type === 'kpi-dashboard' ? 'KPI' :
             selectedElement.type === 'checkin-form' ? 'Check-in' :
             selectedElement.type === 'music-player' ? 'Música' :
             selectedElement.type === 'playlist-player' ? 'Playlist' :
             selectedElement.type === 'radio-player' ? 'Radio' :
             selectedElement.type === 'ambient-player' ? 'Ambiente' : selectedElement.type}
          </span>
        </div>
      </div>

      {/* Información del elemento */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon
              name={selectedElement.type === 'text' ? 'Type' :
                   selectedElement.type === 'image' ? 'Image' :
                   selectedElement.type === 'button' ? 'MousePointer' :
                   selectedElement.type === 'container' ? 'Square' :
                   selectedElement.type === 'hero' ? 'Layout' :
                   selectedElement.type === 'stats-card' ? 'BarChart3' :
                   selectedElement.type === 'trainer-card' ? 'User' :
                   selectedElement.type === 'routine-card' ? 'Activity' :
                   selectedElement.type === 'class-schedule' ? 'Calendar' :
                   selectedElement.type === 'member-profile' ? 'UserCheck' :
                   selectedElement.type === 'quick-action' ? 'Zap' :
                   selectedElement.type === 'kpi-dashboard' ? 'TrendingUp' :
                   selectedElement.type === 'checkin-form' ? 'CheckSquare' :
                   selectedElement.type === 'music-player' ? 'Music' :
                   selectedElement.type === 'playlist-player' ? 'ListMusic' :
                   selectedElement.type === 'radio-player' ? 'Radio' :
                   selectedElement.type === 'ambient-player' ? 'Volume2' : 'Square'}
              className="w-3 h-3 text-blue-600"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {selectedElement.properties.name || `${selectedElement.type}-${selectedElement.id.slice(-4)}`}
            </p>
            <p className="text-xs text-gray-500">
              ID: {selectedElement.id.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Grupos de propiedades */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {propertyGroups.map(group => (
          <motion.div
            key={group.id}
            className="border-b border-gray-800 last:border-b-0"
            initial={false}
          >
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full p-3 flex items-center justify-between hover:bg-secondary-light transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Icon name={group.icon as any} className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-white">{group.name}</span>
              </div>
              <Icon
                name="ChevronDown"
                className={cn(
                  "w-3 h-3 text-gray-400 transition-transform",
                  expandedGroups.has(group.id) ? "rotate-180" : ""
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {expandedGroups.has(group.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 space-y-3 bg-secondary-light/30">
                    {group.properties.map(renderPropertyField)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PropertyPanel;