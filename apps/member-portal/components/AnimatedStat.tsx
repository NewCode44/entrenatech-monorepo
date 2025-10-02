import React, { useEffect, useState } from 'react';

interface AnimatedStatProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({
  icon,
  label,
  value,
  color,
  unit = '',
  trend,
  trendValue,
  animate = true,
  size = 'medium'
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (animate && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1500;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(typeof value === 'number' ? value : 0);
    }
  }, [value, animate]);

  const sizes = {
    small: { padding: '16px', iconSize: '32px', valueSize: '20px', labelSize: '11px' },
    medium: { padding: '20px', iconSize: '40px', valueSize: '28px', labelSize: '13px' },
    large: { padding: '28px', iconSize: '56px', valueSize: '36px', labelSize: '14px' }
  };

  const currentSize = sizes[size];

  const getTrendColor = () => {
    if (trend === 'up') return '#4CAF50';
    if (trend === 'down') return '#FF6B6B';
    return 'rgba(255, 255, 255, 0.5)';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: currentSize.padding,
      border: `2px solid ${color}30`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isVisible ? 'scale(1)' : 'scale(0.9)',
      opacity: isVisible ? 1 : 0,
      boxShadow: `0 8px 32px ${color}20`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
      e.currentTarget.style.boxShadow = `0 12px 48px ${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1) translateY(0)';
      e.currentTarget.style.boxShadow = `0 8px 32px ${color}20`;
    }}
    >
      {/* Gradient orb background */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-20%',
        width: '120px',
        height: '120px',
        background: `radial-gradient(circle, ${color}30, transparent 70%)`,
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        opacity: 0.5
      }} />

      {/* Icon */}
      <div style={{
        fontSize: currentSize.iconSize,
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        <span style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          animation: animate ? 'bounce 2s ease-in-out infinite' : 'none'
        }}>
          {icon}
        </span>

        {trend && trendValue && (
          <div style={{
            background: `${getTrendColor()}20`,
            border: `1px solid ${getTrendColor()}`,
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            color: getTrendColor(),
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>{getTrendIcon()}</span>
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontSize: currentSize.valueSize,
        fontWeight: 'bold',
        color: color,
        marginBottom: '8px',
        position: 'relative',
        zIndex: 2,
        textShadow: `0 0 20px ${color}60`,
        fontVariantNumeric: 'tabular-nums'
      }}>
        {typeof value === 'number' ? displayValue : value}{unit}
      </div>

      {/* Label */}
      <div style={{
        fontSize: currentSize.labelSize,
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        position: 'relative',
        zIndex: 2
      }}>
        {label}
      </div>

      {/* Pulse ring animation */}
      {animate && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '40px',
          height: '40px',
          border: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'ripple 3s ease-out infinite',
          opacity: 0.3
        }} />
      )}
    </div>
  );
};

export default AnimatedStat;