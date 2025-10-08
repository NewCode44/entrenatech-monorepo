import React from 'react';

const TestAI: React.FC = () => {
  return (
    <>
      {/* Cuadro rojo de prueba */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'red',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        zIndex: 9999,
        fontWeight: 'bold'
      }}>
        ✅ IA ESTÁ CARGADA
      </div>

      {/* Botón simulado del chat IA */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #2196F3 0%, #03DAC6 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        zIndex: 9998,
        cursor: 'pointer',
        border: '3px solid yellow'
      }}>
        <span style={{ fontSize: '32px' }}>💬</span>
      </div>

      {/* Indicador extra */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '24px',
        background: 'blue',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        zIndex: 9997,
        fontSize: '12px'
      }}>
        👇 Chat IA debería estar aquí abajo
      </div>
    </>
  );
};

export default TestAI;