import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Icon from '@/ui/Icon';
import { CanvasElement } from './Canvas';

interface ElementTemplate {
  id: string;
  type: CanvasElement['type'];
  name: string;
  icon: string;
  description: string;
  category: 'layout' | 'content' | 'media' | 'forms' | 'navigation' | 'entrenatech';
  preview: React.ReactNode;
  defaultProps: Partial<CanvasElement>;
}

const elementTemplates: ElementTemplate[] = [
  // Elementos de Diseño
  {
    id: 'container',
    type: 'container',
    name: 'Contenedor',
    icon: 'Square',
    description: 'Contenedor flexible para agrupar elementos',
    category: 'layout',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded border border-blue-200 flex items-center justify-center">
          <Icon name="Square" className="w-6 h-6 text-slate-400" />
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 300, height: 200 },
      properties: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 20,
      }
    }
  },
  {
    id: 'hero',
    type: 'hero',
    name: 'Sección Hero',
    icon: 'Layout',
    description: 'Banner principal llamativo para captar atención',
    category: 'layout',
    preview: (
      <div className="w-full h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg flex flex-col items-center justify-center text-white text-center p-3">
        <div className="text-xs font-bold mb-1">Tu Título</div>
        <div className="text-xs opacity-80">Subtítulo descriptivo</div>
      </div>
    ),
    defaultProps: {
      size: { width: 600, height: 400 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #2196F3, #1976D2)',
        borderRadius: 16,
        textColor: '#ffffff',
        padding: 40,
        title: 'Bienvenido a Nuestro Gym',
        subtitle: 'Transforma tu cuerpo, eleva tu mente'
      }
    }
  },

  // Elementos de Contenido
  {
    id: 'text',
    type: 'text',
    name: 'Texto',
    icon: 'Type',
    description: 'Bloque de texto editable para contenido',
    category: 'content',
    preview: (
      <div className="w-full h-20 bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col justify-center">
        <div className="w-3/4 h-2 bg-gray-800 rounded mb-2"></div>
        <div className="w-full h-2 bg-gray-600 rounded mb-1"></div>
        <div className="w-1/2 h-2 bg-gray-400 rounded"></div>
      </div>
    ),
    defaultProps: {
      size: { width: 200, height: 60 },
      properties: {
        text: 'Tu texto aquí',
        fontSize: 16,
        fontWeight: '400',
        textColor: '#ffffff',
        padding: 12,
      }
    }
  },
  {
    id: 'heading',
    type: 'text',
    name: 'Título',
    icon: 'Heading',
    description: 'Título grande y destacado',
    category: 'content',
    preview: (
      <div className="w-full h-20 bg-gray-50 rounded-lg border border-gray-200 p-3 flex items-center justify-center">
        <div className="text-lg font-bold text-gray-800">Tu Título</div>
      </div>
    ),
    defaultProps: {
      size: { width: 300, height: 80 },
      properties: {
        text: 'Tu Título',
        fontSize: 32,
        fontWeight: 'bold',
        textColor: '#ffffff',
        padding: 16,
      }
    }
  },
  {
    id: 'button',
    type: 'button',
    name: 'Botón',
    icon: 'MousePointer',
    description: 'Botón interactivo para acciones',
    category: 'content',
    preview: (
      <div className="w-full h-20 bg-gray-50 rounded-lg border border-gray-200 p-3 flex items-center justify-center">
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
          Hacer Clic
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 140, height: 44 },
      properties: {
        text: 'Hacer Clic',
        backgroundColor: '#2196F3',
        textColor: '#ffffff',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: '600',
      }
    }
  },

  // Elementos Multimedia
  {
    id: 'image',
    type: 'image',
    name: 'Imagen',
    icon: 'Image',
    description: 'Foto o gráfico visual',
    category: 'media',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <Icon name="Image" className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 250, height: 180 },
      properties: {
        borderRadius: 8,
        src: '/placeholder-image.jpg',
        alt: 'Imagen de marcador'
      }
    }
  },

  // Formularios
  {
    id: 'form',
    type: 'form',
    name: 'Formulario',
    icon: 'Mail',
    description: 'Formulario de contacto para leads',
    category: 'forms',
    preview: (
      <div className="w-full h-20 bg-white rounded-lg border border-gray-200 p-3 space-y-2">
        <div className="flex space-x-2">
          <div className="flex-1 h-3 bg-gray-100 rounded border"></div>
          <div className="flex-1 h-3 bg-gray-100 rounded border"></div>
        </div>
        <div className="h-3 bg-gray-100 rounded border"></div>
        <div className="w-1/3 h-3 bg-blue-500 rounded ml-auto"></div>
      </div>
    ),
    defaultProps: {
      size: { width: 350, height: 280 },
      properties: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 24,
        fields: ['name', 'email', 'message']
      }
    }
  },

  // Elementos Premium Entrenatech
  {
    id: 'stats-card',
    type: 'stats-card',
    name: 'Estadística Premium',
    icon: 'BarChart3',
    description: 'Tarjeta de métricas con tendencias e iconos',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 p-3 flex items-center">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
          <Icon name="Users" className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-400">Miembros Activos</div>
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-bold text-white">1,247</div>
            <div className="text-xs text-green-400 font-semibold">+12%</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 240, height: 80 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: 8,
        border: '1px solid rgba(75, 85, 99, 0.3)',
        padding: 12,
        title: 'Miembros Activos',
        value: '1,247',
        change: '+12%',
        icon: 'Users',
        iconColor: '#3b82f6'
      }
    }
  },
  {
    id: 'trainer-card',
    type: 'trainer-card',
    name: 'Tarjeta de Entrenador',
    icon: 'User',
    description: 'Perfil completo de entrenador con especialidades',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">ET</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">Elena Torres</div>
            <div className="text-xs text-gray-400">Yoga • Flexibilidad</div>
            <div className="flex gap-1 mt-1">
              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">Activo</span>
            </div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 260, height: 320 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: 8,
        border: '1px solid rgba(75, 85, 99, 0.3)',
        padding: 16,
        trainerName: 'Elena Torres',
        trainerEmail: 'elena.t@entrenatech.com',
        trainerAvatar: 'ET',
        specialties: ['Yoga', 'Flexibilidad', 'Movilidad'],
        status: 'active',
        classesTaught: 12,
        activeMembers: 45
      }
    }
  },

  // Más Elementos Premium Entrenatech
  {
    id: 'routine-card',
    type: 'routine-card',
    name: 'Tarjeta de Rutina',
    icon: 'Dumbbell',
    description: 'Rutina de entrenamiento con dificultad y estadísticas',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 p-3">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">FUERZA</span>
          <div className="flex">
            {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i <= 3 ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>)}
          </div>
        </div>
        <div className="text-sm font-bold text-white truncate">Fuerza Total</div>
        <div className="text-xs text-gray-400">45 min • 8 ejercicios</div>
      </div>
    ),
    defaultProps: {
      size: { width: 280, height: 200 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: 8,
        border: '1px solid rgba(75, 85, 99, 0.3)',
        padding: 16,
        routineName: 'Fuerza Total para Principiantes',
        category: 'strength',
        difficulty: 3,
        duration: 45,
        exerciseCount: 8,
        assignedMembers: 23
      }
    }
  },
  {
    id: 'class-schedule',
    type: 'class-schedule',
    name: 'Horario de Clases',
    icon: 'Calendar',
    description: 'Widget de horarios con disponibilidad en tiempo real',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 p-3">
        <div className="text-sm font-bold text-white mb-2">Próximas Clases</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-400">18:00 Yoga</span>
            <span className="text-gray-400">18/20</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-400">19:00 CrossFit</span>
            <span className="text-red-400">15/15</span>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 280, height: 160 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: 8,
        border: '1px solid rgba(75, 85, 99, 0.3)',
        padding: 16,
        showToday: true,
        maxClasses: 5
      }
    }
  },
  {
    id: 'member-profile',
    type: 'member-profile',
    name: 'Perfil de Miembro',
    icon: 'UserCircle',
    description: 'Tarjeta de miembro con plan y estado',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">CS</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white">Carlos Santana</div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">VIP</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">Activo</span>
            </div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 260, height: 120 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: 8,
        border: '1px solid rgba(75, 85, 99, 0.3)',
        padding: 16,
        memberName: 'Carlos Santana',
        memberEmail: 'c.santana@example.com',
        memberAvatar: 'CS',
        plan: 'vip',
        status: 'active',
        joinDate: '2023-01-15'
      }
    }
  },
  {
    id: 'quick-action',
    type: 'quick-action',
    name: 'Acción Rápida Premium',
    icon: 'Zap',
    description: 'Botón de acción con gradientes y badges premium',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 relative overflow-hidden">
        <div className="absolute top-2 right-2 text-xs bg-black/30 text-white px-2 py-0.5 rounded-full font-bold">NEW</div>
        <div className="flex items-center justify-between h-full">
          <div>
            <div className="text-sm font-bold text-white">Crear Portal Premium</div>
            <div className="text-xs text-white/70">Editor visual avanzado</div>
          </div>
          <Icon name="ArrowRight" className="w-4 h-4 text-white/70" />
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 300, height: 80 },
      properties: {
        backgroundColor: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
        borderRadius: 8,
        padding: 16,
        title: 'Crear Portal Premium',
        description: 'Editor visual avanzado',
        badge: 'NEW',
        icon: 'Globe'
      }
    }
  },
  {
    id: 'kpi-dashboard',
    type: 'kpi-dashboard',
    name: 'Dashboard KPI',
    icon: 'BarChart',
    description: 'Grid de 4 métricas clave con iconos coloridos',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700 p-2">
        <div className="grid grid-cols-2 gap-1 h-full">
          <div className="bg-gray-800 rounded p-1">
            <div className="text-xs text-gray-400">Revenue</div>
            <div className="text-sm font-bold text-white">$24.5K</div>
          </div>
          <div className="bg-gray-800 rounded p-1">
            <div className="text-xs text-gray-400">Miembros</div>
            <div className="text-sm font-bold text-white">1,247</div>
          </div>
          <div className="bg-gray-800 rounded p-1">
            <div className="text-xs text-gray-400">Ocupación</div>
            <div className="text-sm font-bold text-white">82%</div>
          </div>
          <div className="bg-gray-800 rounded p-1">
            <div className="text-xs text-gray-400">LTV</div>
            <div className="text-sm font-bold text-white">$1.25K</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 320, height: 200 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: 8,
        border: '1px solid rgba(75, 85, 99, 0.3)',
        padding: 16,
        showGrid: true,
        kpis: [
          { label: 'Ingresos Totales', value: '$24,500', icon: 'DollarSign' },
          { label: 'Crecimiento', value: '+42', icon: 'TrendingUp' },
          { label: 'Ocupación', value: '82%', icon: 'CalendarCheck' },
          { label: 'LTV', value: '$1,250', icon: 'Coins' }
        ]
      }
    }
  },
  {
    id: 'checkin-form',
    type: 'checkin-form',
    name: 'Check-in WiFi',
    icon: 'Wifi',
    description: 'Formulario de acceso WiFi con código QR',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-white rounded-lg border border-gray-200 p-3">
        <div className="flex items-center gap-3 h-full">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded grid grid-cols-3 gap-0.5">
              {[...Array(9)].map((_, i) => <div key={i} className={`bg-gray-800 ${Math.random() > 0.4 ? '' : 'opacity-0'}`}></div>)}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">WiFi Gratuito</div>
            <div className="text-xs text-gray-500">Escanea o ingresa código</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 280, height: 200 },
      properties: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        padding: 16,
        title: 'WiFi Gratuito',
        subtitle: 'Acceso a internet de alta velocidad',
        showQR: true,
        wifiName: 'GYM_PREMIUM'
      }
    }
  },

  // Reproductores de Música 🎵
  {
    id: 'music-player',
    type: 'music-player',
    name: 'Reproductor Básico',
    icon: 'Music',
    description: 'Reproductor de música simple con controles básicos',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg border border-purple-700 p-3">
        <div className="flex items-center gap-3 h-full">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Icon name="Music" className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white truncate">Energía Total Mix</div>
            <div className="text-xs text-purple-300">BPM 128 • Motivacional</div>
          </div>
          <div className="flex gap-1">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Play" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 320, height: 120 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #581c87, #3730a3)',
        borderRadius: 12,
        border: '1px solid rgba(147, 51, 234, 0.5)',
        padding: 16,
        currentSong: 'Energía Total Mix',
        artist: 'Gym Beats',
        isPlaying: false,
        volume: 75
      }
    }
  },
  {
    id: 'playlist-player',
    type: 'playlist-player',
    name: 'Reproductor Playlist',
    icon: 'ListMusic',
    description: 'Reproductor con lista de canciones para entrenamientos',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-emerald-900 to-teal-900 rounded-lg border border-emerald-700 p-3">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-white">Workout Hits</div>
            <div className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">12 tracks</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <Icon name="Play" className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 text-xs text-emerald-300 truncate">Eye of the Tiger • Survivor</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 300, height: 180 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #064e3b, #0f766e)',
        borderRadius: 12,
        border: '1px solid rgba(16, 185, 129, 0.5)',
        padding: 16,
        playlistName: 'Workout Hits Premium',
        totalTracks: 12,
        currentTrack: 1,
        tracks: [
          'Eye of the Tiger • Survivor',
          'Stronger • Kanye West',
          'Thunder • Imagine Dragons'
        ]
      }
    }
  },
  {
    id: 'radio-player',
    type: 'radio-player',
    name: 'Radio En Vivo',
    icon: 'Radio',
    description: 'Radio streaming en vivo para ambiente del gym',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-red-900 to-orange-900 rounded-lg border border-red-700 p-3">
        <div className="flex items-center gap-3 h-full">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <Icon name="Radio" className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-red-900 animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Energy FM 105.7</div>
            <div className="text-xs text-red-300">🔴 EN VIVO • Hits Energéticos</div>
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 280, height: 100 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #7f1d1d, #ea580c)',
        borderRadius: 12,
        border: '1px solid rgba(239, 68, 68, 0.5)',
        padding: 16,
        stationName: 'Energy FM 105.7',
        isLive: true,
        currentShow: 'Hits Energéticos 24/7',
        listeners: 1247
      }
    }
  },
  {
    id: 'ambient-player',
    type: 'ambient-player',
    name: 'Música Ambiente',
    icon: 'Volume2',
    description: 'Reproductor de música ambiental y relajante',
    category: 'entrenatech',
    preview: (
      <div className="w-full h-20 bg-gradient-to-br from-blue-900 to-cyan-900 rounded-lg border border-blue-700 p-3">
        <div className="flex items-center gap-3 h-full">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Icon name="Volume2" className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Zona Chill</div>
            <div className="text-xs text-blue-300">Relajación • Estiramiento</div>
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4].map(i => (
              <div key={i} className={`w-1 bg-cyan-400 rounded-full ${i <= 2 ? 'h-4' : i === 3 ? 'h-6' : 'h-3'}`}></div>
            ))}
          </div>
        </div>
      </div>
    ),
    defaultProps: {
      size: { width: 280, height: 100 },
      properties: {
        backgroundColor: 'linear-gradient(135deg, #1e3a8a, #0891b2)',
        borderRadius: 12,
        border: '1px solid rgba(59, 130, 246, 0.5)',
        padding: 16,
        ambientType: 'Zona Chill',
        mood: 'Relajación y Estiramiento',
        volume: 30
      }
    }
  }
];

const categories = [
  { id: 'all', name: 'Todos', icon: 'Grid3X3' },
  { id: 'layout', name: 'Diseño', icon: 'Layout' },
  { id: 'content', name: 'Contenido', icon: 'Type' },
  { id: 'media', name: 'Multimedia', icon: 'Image' },
  { id: 'forms', name: 'Formularios', icon: 'Mail' },
  { id: 'entrenatech', name: 'Premium', icon: 'Crown' },
];

interface DraggableElementProps {
  template: ElementTemplate;
  onAddElement: (template: ElementTemplate) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ template, onAddElement }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `template-${template.id}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "relative group cursor-pointer",
        isDragging && "opacity-50 scale-105 shadow-2xl z-50"
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onAddElement(template)}
    >
      {/* Contenedor de la tarjeta */}
      <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-3 group-hover:shadow-blue-100/50">
        {/* Vista previa */}
        <div className="mb-3 relative overflow-hidden rounded-lg">
          {template.preview}
        </div>

        {/* Información del elemento */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
              <Icon name={template.icon as any} className="w-2.5 h-2.5 text-gray-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {template.name}
            </h3>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Superposición al pasar el ratón */}
        <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Botón de añadir al pasar el ratón */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
            <Icon name="Plus" className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface ToolboxProps {
  onAddElement: (elementType: CanvasElement['type'], properties?: any) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({ onAddElement }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = elementTemplates.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddElement = (template: ElementTemplate) => {
    const newElement: Partial<CanvasElement> = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      position: { x: 100, y: 100 }, // Será sobrescrito por la posición de soltado
      zIndex: Date.now(), // Asegurarse de que los nuevos elementos estén en la parte superior
      ...template.defaultProps
    };

    onAddElement(template.type, newElement);
  };

  return (
    <motion.div
      className="w-80 h-full bg-gray-50 border-r border-gray-200 flex flex-col"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      {/* Encabezado */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="Palette" className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Elementos</h2>
              <p className="text-sm text-gray-500">Arrastra para agregar</p>
            </div>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {filteredTemplates.length}
          </span>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar elementos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Pestañas de categorías */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeCategory === category.id
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Icon name={category.icon as any} className="w-4 h-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cuadrícula de elementos */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {filteredTemplates.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Icon name="Search" className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              No se encontraron elementos
            </h3>
            <p className="text-xs text-gray-500">
              Intenta ajustar tu búsqueda o filtro de categoría
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3"
            layout
            initial={false}
          >
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DraggableElement
                  template={template}
                  onAddElement={handleAddElement}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Acciones de pie de página */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
            <Icon name="Upload" className="w-4 h-4" />
            <span className="text-sm">Importar</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            <Icon name="Zap" className="w-4 h-4" />
            <span className="text-sm">IA</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Toolbox;