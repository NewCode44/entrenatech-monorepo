import React, { useState } from 'react';

interface ExerciseMediaProps {
  exerciseName: string;
  videoUrl?: string;
  gifUrl?: string;
}

type ViewAngle = 'front' | 'side' | 'top';

const ExerciseMedia: React.FC<ExerciseMediaProps> = ({ exerciseName, videoUrl, gifUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [activeAngle, setActiveAngle] = useState<ViewAngle>('front');
  const [showFormTips, setShowFormTips] = useState(true);

  const angles: { id: ViewAngle; label: string; icon: string }[] = [
    { id: 'front', label: 'Frontal', icon: '👤' },
    { id: 'side', label: 'Lateral', icon: '↔️' },
    { id: 'top', label: 'Superior', icon: '⬆️' }
  ];

  const formTips = [
    { position: { top: '20%', left: '15%' }, text: 'Espalda recta', color: '#2196F3' },
    { position: { top: '45%', left: '10%' }, text: 'Abdomen contraído', color: '#FF9800' },
    { position: { top: '70%', left: '20%' }, text: 'Rodillas alineadas', color: '#4CAF50' }
  ];

  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '20px',
      border: '2px solid rgba(33, 150, 243, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #2196F3, #03DAC6, #9C27B0, #FF6B6B, #2196F3)',
        backgroundSize: '200% 100%',
        animation: 'gradientShift 3s linear infinite'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0
        }}>
          {exerciseName}
        </h3>
        <button
          onClick={() => setShowFormTips(!showFormTips)}
          style={{
            background: showFormTips ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: showFormTips ? '1px solid #2196F3' : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            color: showFormTips ? '#2196F3' : 'rgba(255, 255, 255, 0.6)',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          💡 Tips
        </button>
      </div>

      {/* View Angle Selector */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px'
      }}>
        {angles.map((angle) => (
          <button
            key={angle.id}
            onClick={() => setActiveAngle(angle.id)}
            style={{
              flex: 1,
              background: activeAngle === angle.id
                ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.3), rgba(156, 39, 176, 0.3))'
                : 'rgba(255, 255, 255, 0.05)',
              border: activeAngle === angle.id ? '2px solid #2196F3' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px 8px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              color: activeAngle === angle.id ? '#2196F3' : 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
              transform: activeAngle === angle.id ? 'scale(1.05)' : 'scale(1)',
              boxShadow: activeAngle === angle.id ? '0 4px 20px rgba(33, 150, 243, 0.3)' : 'none'
            }}
          >
            <span style={{ fontSize: '16px' }}>{angle.icon}</span>
            {angle.label}
          </button>
        ))}
      </div>

      {/* Video/GIF Container */}
      <div style={{
        position: 'relative',
        aspectRatio: '16/9',
        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(156, 39, 176, 0.1))',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Placeholder media */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          background: 'radial-gradient(circle at center, rgba(33, 150, 243, 0.15), transparent)',
          position: 'relative'
        }}>
          {/* Placeholder icon */}
          <div style={{
            fontSize: '64px',
            animation: isPlaying ? 'bounce 1s ease-in-out infinite' : 'none'
          }}>
            🏋️
          </div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center'
          }}>
            {videoUrl ? 'Video demonstration' : gifUrl ? 'GIF demonstration' : 'No media available'}
          </div>

          {/* Form Tips Overlay */}
          {showFormTips && formTips.map((tip, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                ...tip.position,
                animation: 'pulse 2s ease-in-out infinite',
                animationDelay: `${index * 0.3}s`
              }}
            >
              {/* Callout pointer */}
              <div style={{
                width: '12px',
                height: '12px',
                background: tip.color,
                borderRadius: '50%',
                boxShadow: `0 0 20px ${tip.color}80`,
                position: 'relative'
              }}>
                {/* Ripple effect */}
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '-4px',
                  width: '20px',
                  height: '20px',
                  border: `2px solid ${tip.color}`,
                  borderRadius: '50%',
                  animation: 'ripple 2s ease-out infinite',
                  animationDelay: `${index * 0.3}s`
                }} />
              </div>
              {/* Tip text */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: '20px',
                background: `${tip.color}20`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${tip.color}`,
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: tip.color,
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 12px ${tip.color}40`
              }}>
                {tip.text}
              </div>
            </div>
          ))}
        </div>

        {/* Play/Pause Overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(33, 150, 243, 0.9)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            fontSize: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.6)',
            opacity: isPlaying ? 0.3 : 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            e.currentTarget.style.opacity = isPlaying ? '0.3' : '1';
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setIsSlowMotion(!isSlowMotion)}
          style={{
            flex: 1,
            background: isSlowMotion
              ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 107, 107, 0.2))'
              : 'rgba(255, 255, 255, 0.05)',
            border: isSlowMotion ? '2px solid #FF9800' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            color: isSlowMotion ? '#FF9800' : 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s',
            boxShadow: isSlowMotion ? '0 4px 20px rgba(255, 152, 0, 0.3)' : 'none'
          }}
        >
          <span style={{ fontSize: '18px' }}>🐢</span>
          Slow-Mo
        </button>

        <button
          onClick={() => setIsLooping(!isLooping)}
          style={{
            flex: 1,
            background: isLooping
              ? 'linear-gradient(135deg, rgba(3, 218, 198, 0.2), rgba(33, 150, 243, 0.2))'
              : 'rgba(255, 255, 255, 0.05)',
            border: isLooping ? '2px solid #03DAC6' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            color: isLooping ? '#03DAC6' : 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s',
            boxShadow: isLooping ? '0 4px 20px rgba(3, 218, 198, 0.3)' : 'none'
          }}
        >
          <span style={{ fontSize: '18px' }}>🔁</span>
          Loop
        </button>

        <button
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(156, 39, 176, 0.2)';
            e.currentTarget.style.borderColor = '#9C27B0';
            e.currentTarget.style.color = '#9C27B0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
          }}
        >
          <span style={{ fontSize: '18px' }}>📹</span>
          Record
        </button>
      </div>
    </div>
  );
};

export default ExerciseMedia;