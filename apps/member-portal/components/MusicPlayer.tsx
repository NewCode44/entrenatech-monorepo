import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Music2, ChevronDown, ChevronUp } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [isMinimized, setIsMinimized] = useState(true);

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md cursor-pointer px-4 pb-16"
      >
        <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur-xl hover:border-cyan-300 hover:shadow-xl transition-all">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-zinc-900">Eye of the Tiger</p>
            <p className="truncate text-xs text-zinc-500">Survivor</p>
          </div>
          <ChevronUp className="h-5 w-5 text-zinc-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] mx-auto max-w-md px-4 pb-16">
      <div className="relative rounded-2xl border border-zinc-200 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
        {/* BOTÓN MINIMIZAR */}
        <div className="mb-3 flex justify-end">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-white shadow-lg hover:from-cyan-400 hover:to-blue-400 transition-all font-semibold text-sm active:scale-95"
            style={{ zIndex: 99999 }}
          >
            <ChevronDown className="h-5 w-5" />
            Minimizar
          </button>
        </div>

        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <Music2 className="h-5 w-5 text-cyan-600" />
          <h3 className="text-sm font-semibold text-zinc-900">Reproduciendo</h3>
        </div>

        {/* Album Art */}
        <div className="mb-4 overflow-hidden rounded-xl">
          <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-700">
            <Music2 className="h-20 w-20 text-white" />
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-4 text-center">
          <h4 className="mb-1 font-semibold text-zinc-900">Eye of the Tiger</h4>
          <p className="text-sm text-zinc-500">Survivor</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 h-1 overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>1:50</span>
            <span>4:04</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-4 flex items-center justify-center gap-4">
          <button className="text-zinc-400 hover:text-cyan-600 transition-colors">
            <Shuffle className="h-4 w-4" />
          </button>
          <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <SkipBack className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>
          <button className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <SkipForward className="h-6 w-6" />
          </button>
          <button className="text-zinc-400 hover:text-cyan-600 transition-colors">
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="mb-4 flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-zinc-400" />
          <div className="flex-1">
            <div className="h-1 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full w-3/4 bg-cyan-600" />
            </div>
          </div>
        </div>

        {/* Service Selector */}
        <div className="flex gap-2">
          {['Spotify', 'Apple Music', 'YouTube'].map((service) => (
            <button
              key={service}
              className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-xs font-medium text-zinc-600 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50 transition-colors"
            >
              {service}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
