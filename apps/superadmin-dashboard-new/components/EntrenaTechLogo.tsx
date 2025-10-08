import React from 'react';
import { Dumbbell, Zap, Activity } from 'lucide-react';

interface EntrenaTechLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  theme?: 'light' | 'dark';
}

const EntrenaTechLogo: React.FC<EntrenaTechLogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'dark'
}) => {
  const sizes = {
    sm: { icon: 'h-7 w-7', text: 'text-lg', container: 'gap-2.5', accent: 'h-2.5 w-2.5' },
    md: { icon: 'h-9 w-9', text: 'text-2xl', container: 'gap-3', accent: 'h-3 w-3' },
    lg: { icon: 'h-14 w-14', text: 'text-4xl', container: 'gap-4', accent: 'h-4 w-4' },
    xl: { icon: 'h-20 w-20', text: 'text-6xl', container: 'gap-5', accent: 'h-5 w-5' }
  };

  const iconSize = sizes[size].icon;
  const textSize = sizes[size].text;
  const containerGap = sizes[size].container;
  const accentSize = sizes[size].accent;

  const textColor = theme === 'dark' ? 'text-white' : 'text-zinc-900';
  const accentColor = theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600';

  if (variant === 'icon') {
    return (
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-300" />

        {/* Icon container - Hexagonal shape */}
        <div className={`relative ${iconSize} flex items-center justify-center`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-700 rotate-0 group-hover:rotate-6 transition-transform duration-300" />
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500" />
          <div className="absolute inset-1 rounded-xl bg-zinc-900/90 backdrop-blur-sm" />

          {/* Icon content */}
          <div className="relative flex items-center justify-center h-full w-full">
            <Dumbbell className="h-1/2 w-1/2 text-cyan-400" strokeWidth={2.5} />
            <div className="absolute -top-0.5 -right-0.5">
              <Zap className={`${accentSize} text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]`} fill="currentColor" />
            </div>
            <div className="absolute -bottom-0.5 -left-0.5">
              <Activity className={`${accentSize} text-blue-400`} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="flex items-baseline">
        <span className={`font-black ${textSize} ${textColor} tracking-tight`}>
          ENTRENA
        </span>
        <span className={`font-black ${textSize} ${accentColor} tracking-tight`}>
          TECH
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${containerGap}`}>
      {/* Icon */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-300" />

        {/* Icon container */}
        <div className={`relative ${iconSize} flex items-center justify-center`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-cyan-700 rotate-0 group-hover:rotate-6 transition-transform duration-300" />
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500" />
          <div className={`absolute ${size === 'sm' ? 'inset-0.5' : 'inset-1'} rounded-xl ${theme === 'dark' ? 'bg-zinc-900/90' : 'bg-white/90'} backdrop-blur-sm`} />

          {/* Icon content */}
          <div className="relative flex items-center justify-center h-full w-full">
            <Dumbbell className={`${size === 'sm' ? 'h-3/5 w-3/5' : 'h-1/2 w-1/2'} text-cyan-400`} strokeWidth={2.5} />
            <div className="absolute -top-0.5 -right-0.5">
              <Zap className={`${accentSize} text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]`} fill="currentColor" />
            </div>
            <div className="absolute -bottom-0.5 -left-0.5">
              <Activity className={`${accentSize} text-blue-400`} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="flex items-baseline">
        <span className={`font-black ${textSize} ${textColor} tracking-tight`}>
          ENTRENA
        </span>
        <span className={`font-black ${textSize} ${accentColor} tracking-tight`}>
          TECH
        </span>
      </div>
    </div>
  );
};

export default EntrenaTechLogo;
