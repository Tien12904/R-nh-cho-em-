import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles, Volume2, VolumeX, Eye } from 'lucide-react';
import { FlowerTypeInfo } from '../data/flowerData';
import { romanticAudio } from '../utils/audioPlayer';

interface FloralVideoShowcaseProps {
  flowerInfo: FlowerTypeInfo;
}

export const FloralVideoShowcase: React.FC<FloralVideoShowcaseProps> = ({ flowerInfo }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [bloomPhase, setBloomPhase] = useState<'bud' | 'blooming' | 'full'>('full');

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBloomPhase((prev) => {
        if (prev === 'bud') return 'blooming';
        if (prev === 'blooming') return 'full';
        return 'bud';
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleSound = () => {
    const active = romanticAudio.toggle();
    setIsAudioActive(active);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-rose-200/80 bg-stone-900 group">
      {/* Visual Canvas / Frame */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden flex items-center justify-center">
        {/* Real flower photograph with smooth cinematographic zoom & sway */}
        <img
          src={flowerInfo.image}
          alt={flowerInfo.name}
          className={`w-full h-full object-cover transition-all duration-[3000ms] ease-in-out ${
            isPlaying ? 'scale-110 saturate-110 brightness-105' : 'scale-100'
          }`}
          style={{
            filter:
              bloomPhase === 'bud'
                ? 'saturate(0.7) brightness(0.9)'
                : bloomPhase === 'blooming'
                ? 'saturate(1.05) brightness(1.02)'
                : 'saturate(1.2) brightness(1.08)',
          }}
        />

        {/* Ambient video-style vignette and cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

        {/* Floating light particles / bokeh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-400/20 via-transparent to-transparent pointer-events-none" />

        {/* Center bloom indicator badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs border border-white/20">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="font-serif italic">
              {bloomPhase === 'bud' ? 'Hạt mầm ấp ủ' : bloomPhase === 'blooming' ? 'Cánh hoa đang nở' : 'Nở rộ rạng ngời'}
            </span>
          </span>
        </div>

        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-colors"
            title={isAudioActive ? 'Tắt âm thanh' : 'Bật giai điệu lãng mạn'}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 text-rose-300" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-colors"
            title={isPlaying ? 'Tạm dừng chuyển động' : 'Tiếp tục chuyển động'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Caption & Meaning */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl sm:text-2xl font-serif tracking-wide">{flowerInfo.name}</h3>
            <span className="text-xs text-rose-200 font-serif italic">{flowerInfo.subtitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-1 font-light leading-relaxed">
            {flowerInfo.meaning}
          </p>
        </div>
      </div>
    </div>
  );
};
