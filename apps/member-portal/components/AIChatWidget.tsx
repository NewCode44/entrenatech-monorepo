import React, { useState } from 'react';

const AIChatWidgetSimple: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  console.log('AIChatWidget - isOpen:', isOpen);
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'ai',
      content: '¡Hola! 👋 Soy tu asistente IA de Entrenatech. ¿En qué puedo ayudarte?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }]);

    const userInput = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let response = '';
      if (userInput.includes('rutina')) {
        response = '💪 Para crear rutinas:\n1. Ve a "Rutinas"\n2. Click "Crear Nueva"\n3. Usa el Generador IA ✨';
      } else if (userInput.includes('nutrición')) {
        response = '🥗 Consejos de nutrición:\n- Proteína: 1.8-2.2g/kg\n- Carbos según objetivo\n- Usa nuestra Calculadora IA en Miembros';
      } else {
        response = 'Puedo ayudarte con:\n🏋️ Rutinas\n👥 Miembros\n📊 Analytics\n🥗 Nutrición';
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: response
      }]);
    }, 800);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #2196F3 0%, #03DAC6 100%)',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s',
          animation: 'pulse 2s infinite'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '32px' }}>💬</span>
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '24px',
          height: '24px',
          background: '#4CAF50',
          borderRadius: '50%',
          border: '2px solid #0F0F23',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          IA
        </div>
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '384px',
      height: '600px',
      background: '#1A1A2E',
      border: '2px solid #2D3748',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2196F3 0%, #03DAC6 100%)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🤖
          </div>
          <div>
            <h3 style={{ fontWeight: 'bold', color: 'white', margin: 0 }}>Asistente IA</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#4CAF50',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>En línea</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '12px'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: msg.role === 'ai'
                ? 'linear-gradient(135deg, #2196F3, #03DAC6)'
                : '#4A5568',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '16px'
            }}>
              {msg.role === 'ai' ? '🤖' : '👤'}
            </div>
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: '16px',
              background: msg.role === 'ai' ? '#2D3748' : '#2196F3',
              color: 'white',
              fontSize: '14px',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        background: '#16213E',
        borderTop: '1px solid #2D3748'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu pregunta..."
            style={{
              flex: 1,
              background: '#2D3748',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #2196F3, #03DAC6)',
              border: 'none',
              borderRadius: '8px',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              opacity: input.trim() ? 1 : 0.5,
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatWidgetSimple;