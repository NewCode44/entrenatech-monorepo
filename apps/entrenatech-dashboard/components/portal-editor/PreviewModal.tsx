import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Icon from '@/ui/Icon';
import { CanvasElement, CanvasDesign } from './CanvasEditor';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: CanvasDesign | null;
  elements: CanvasElement[];
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DevicePreset {
  name: string;
  width: number;
  height: number;
  scale: number;
}

const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: { name: 'Desktop', width: 1920, height: 1080, scale: 0.4 },
  tablet: { name: 'Tablet', width: 768, height: 1024, scale: 0.6 },
  mobile: { name: 'Mobile', width: 375, height: 667, scale: 0.8 }
};

const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  design,
  elements
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Manejar atajos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case '1':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSelectedDevice('desktop');
          }
          break;
        case '2':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSelectedDevice('tablet');
          }
          break;
        case '3':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setSelectedDevice('mobile');
          }
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, isFullscreen, onClose]);

  const renderElement = (element: CanvasElement): React.ReactNode => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      zIndex: element.zIndex,
      ...element.properties
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              fontSize: element.properties.fontSize || 16,
              fontWeight: element.properties.fontWeight || 'normal',
              color: element.properties.textColor || '#ffffff',
              padding: element.properties.padding || 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {element.properties.text || 'Text Element'}
          </div>
        );

      case 'button':
        return (
          <button
            key={element.id}
            style={style}
            className="flex items-center justify-center font-medium rounded-lg transition-colors hover:opacity-90 cursor-pointer"
          >
            {element.properties.text || 'Button'}
          </button>
        );

      case 'container':
        return (
          <div
            key={element.id}
            style={style}
            className="overflow-hidden"
          >
            {element.children?.map(child => renderElement(child))}
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gray-300 rounded flex items-center justify-center overflow-hidden"
          >
            {element.properties.src ? (
              <img
                src={element.properties.src}
                alt={element.properties.alt || 'Image'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-600">
                <Icon name="Image" className="w-8 h-8 mb-2" />
                <span className="text-sm">Image Placeholder</span>
              </div>
            )}
          </div>
        );

      case 'hero':
        return (
          <div
            key={element.id}
            style={style}
            className="flex flex-col items-center justify-center text-center text-white"
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
            key={element.id}
            style={style}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Contact Form</h3>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70"
              readOnly
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70"
              readOnly
            />
            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 resize-none"
              rows={3}
              readOnly
            />
            <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
              Send Message
            </button>
          </div>
        );

      default:
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gray-400 rounded flex items-center justify-center"
          >
            <span className="text-sm text-gray-700">Unknown Element</span>
          </div>
        );
    }
  };

  const currentDevice = devicePresets[selectedDevice];

  if (!isOpen || !design) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          isFullscreen ? "bg-black" : "bg-black/80 backdrop-blur-sm"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!isFullscreen ? onClose : undefined}
      >
        <motion.div
          className={cn(
            "bg-secondary border border-gray-800 shadow-2xl",
            isFullscreen ? "w-full h-full" : "rounded-2xl max-w-7xl max-h-[90vh] w-full mx-4"
          )}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado */}
          {!isFullscreen && (
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-white">Preview</h2>
                <span className="text-sm text-gray-400">{design.name}</span>
              </div>

              {/* Selector de dispositivo */}
              <div className="flex items-center gap-2">
                {Object.entries(devicePresets).map(([key, device]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDevice(key as DeviceType)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedDevice === key
                        ? "bg-primary text-white"
                        : "bg-secondary-light text-gray-400 hover:text-white hover:bg-gray-700"
                    )}
                  >
                    <Icon
                      name={key === 'desktop' ? 'Monitor' : key === 'tablet' ? 'Tablet' : 'Smartphone'}
                      className="w-4 h-4"
                    />
                    {device.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 rounded-lg bg-secondary-light hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                  title="Fullscreen (Ctrl+F)"
                >
                  <Icon name="Maximize" className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-secondary-light hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="X" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Contenido de la vista previa */}
          <div className={cn(
            "flex items-center justify-center overflow-auto",
            isFullscreen ? "h-full" : "min-h-[600px] p-6"
          )}>
            {/* Marco del dispositivo */}
            <div
              className={cn(
                "relative transition-all duration-300",
                !isFullscreen && "preview-device-frame"
              )}
              style={{
                width: currentDevice.width * currentDevice.scale,
                height: currentDevice.height * currentDevice.scale,
                maxWidth: '100%',
                maxHeight: isFullscreen ? '100vh' : '70vh'
              }}
            >
              {/* Ventana de vista previa */}
              <div
                ref={previewRef}
                className="relative w-full h-full overflow-hidden preview-window"
                style={{
                  backgroundColor: design.settings.backgroundColor,
                  transform: `scale(${currentDevice.scale})`,
                  transformOrigin: 'top left',
                  width: currentDevice.width / currentDevice.scale,
                  height: currentDevice.height / currentDevice.scale
                }}
              >
                {/* Renderizar todos los elementos */}
                {elements.map(renderElement)}

                {/* Superposición para demostración interactiva */}
                <div className="absolute inset-0 pointer-events-none" />
              </div>

              {/* Información del dispositivo */}
              {!isFullscreen && (
                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <span className="text-xs text-gray-500">
                    {currentDevice.width} × {currentDevice.height} at {Math.round(currentDevice.scale * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Controles de pantalla completa */}
          {isFullscreen && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 rounded-lg p-2">
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                title="Exit fullscreen"
              >
                <Icon name="Minimize" className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                title="Close preview"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Información de atajos de teclado */}
          {!isFullscreen && (
            <div className="border-t border-gray-800 px-6 py-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-6">
                  <span><kbd className="kbd">1/2/3</kbd> Change device</span>
                  <span><kbd className="kbd">Ctrl+F</kbd> Fullscreen</span>
                  <span><kbd className="kbd">Esc</kbd> Close</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Live Preview</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreviewModal;