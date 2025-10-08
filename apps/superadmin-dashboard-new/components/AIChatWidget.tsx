import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/ui/Icon';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: '¡Hola! 👋 Soy tu asistente IA de Entrenatech. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    '¿Cómo crear una rutina?',
    'Consejos de nutrición',
    'Gestionar miembros',
    'Analytics del gym',
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-pulse"
      >
        <Icon name="MessageCircle" className="w-8 h-8 text-white" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background flex items-center justify-center">
          <span className="text-xs font-bold text-white">IA</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-secondary border-2 border-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Icon name="Bot" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Asistente IA</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-white/80">En línea</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
          <Icon name="X" className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-secondary-light border-b border-gray-800">
        <p className="text-xs text-gray-500 mb-2">Preguntas rápidas:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => setInput(action)}
              className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'ai'
                  ? 'bg-gradient-to-br from-primary to-accent'
                  : 'bg-gray-700'
              }`}
            >
              <Icon
                name={message.role === 'ai' ? 'Bot' : 'User'}
                className="w-5 h-5 text-white"
              />
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === 'ai'
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-primary text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString('es', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Icon name="Bot" className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gray-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-secondary-light border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Send" className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Generador de respuestas IA
function generateAIResponse(userInput: string): string {
  const lower = userInput.toLowerCase();

  if (lower.includes('rutina')) {
    return `💪 Para crear rutinas en Entrenatech:

1. Ve a la sección "Rutinas"
2. Click en "Crear Nueva Rutina"
3. Usa el asistente paso a paso
4. Puedes usar el **Generador IA** para rutinas automáticas personalizadas

¿Quieres que te explique cómo usar el generador IA?`;
  }

  if (lower.includes('nutrición') || lower.includes('nutricion')) {
    return `🥗 Consejos de nutrición para tus miembros:

**Proteína:** 1.8-2.2g por kg de peso
**Carbos:** Ajustar según objetivo
**Grasas:** 0.8-1g por kg de peso

Próximamente tendremos un **generador de planes nutricionales con IA** que calculará macros automáticamente según los objetivos de cada miembro.

¿Te gustaría más información?`;
  }

  if (lower.includes('miembro')) {
    return `👥 Para gestionar miembros:

• **Agregar:** Usa el botón "+ Nuevo Miembro"
• **Editar:** Click en el miembro
• **Rutinas:** Asigna rutinas desde la sección Rutinas
• **Analytics:** Ve su progreso en la sección Analytics

La IA puede ayudarte a predecir qué miembros están en riesgo de cancelar su membresía. ¿Te interesa?`;
  }

  if (lower.includes('analytics') || lower.includes('analíticas')) {
    return `📊 Analytics con IA:

Nuestro sistema puede analizar:
• Tasa de asistencia
• Predicción de deserción
• Ingresos y tendencias
• Clases más populares
• Recomendaciones automáticas

Ve a la sección **Analíticas** para ver todos los insights. 📈`;
  }

  // Respuesta genérica
  return `Entiendo tu pregunta sobre "${userInput}".

Puedo ayudarte con:
• 🏋️ Creación de rutinas
• 👥 Gestión de miembros
• 📊 Analytics del gimnasio
• 🎓 Gestión de entrenadores
• 📅 Organización de clases

¿Sobre qué te gustaría saber más?`;
}

export default AIChatWidget;