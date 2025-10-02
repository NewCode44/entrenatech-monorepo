import React, { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  gradient?: string;
  glowColor?: string;
  borderGradient?: boolean;
  animate?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  gradient = 'linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(156, 39, 176, 0.1))',
  glowColor = 'rgba(33, 150, 243, 0.3)',
  borderGradient = false,
  animate = false,
  hover = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: borderGradient
      ? 'rgba(26, 26, 46, 0.8)'
      : gradient,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    ...(borderGradient && {
      border: '2px solid transparent',
      backgroundImage: `${gradient}, linear-gradient(135deg, #2196F3, #03DAC6, #9C27B0, #FF6B6B)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box'
    }),
    ...(!borderGradient && {
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }),
    boxShadow: isHovered && hover
      ? `0 20px 60px ${glowColor}, 0 0 40px ${glowColor}`
      : `0 8px 32px rgba(0, 0, 0, 0.3)`,
    transform: isHovered && hover ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)'
  };

  return (
    <div
      style={baseStyle}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      onClick={onClick}
    >
      {/* Animated gradient overlay */}
      {animate && (
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
      )}

      {/* Shimmer effect on hover */}
      {hover && isHovered && (
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          animation: 'shimmer 1.5s ease-in-out',
          pointerEvents: 'none'
        }} />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* Floating particles effect */}
      {animate && (
        <>
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '4px',
            height: '4px',
            background: '#2196F3',
            borderRadius: '50%',
            animation: 'float 3s ease-in-out infinite',
            opacity: 0.6,
            boxShadow: '0 0 10px #2196F3'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '30%',
            left: '15%',
            width: '6px',
            height: '6px',
            background: '#9C27B0',
            borderRadius: '50%',
            animation: 'float 4s ease-in-out infinite',
            animationDelay: '1s',
            opacity: 0.6,
            boxShadow: '0 0 10px #9C27B0'
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '20%',
            width: '5px',
            height: '5px',
            background: '#03DAC6',
            borderRadius: '50%',
            animation: 'float 3.5s ease-in-out infinite',
            animationDelay: '2s',
            opacity: 0.6,
            boxShadow: '0 0 10px #03DAC6'
          }} />
        </>
      )}
    </div>
  );
};

export default PremiumCard;