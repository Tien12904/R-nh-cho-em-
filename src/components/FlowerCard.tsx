import React from 'react';
import { Sparkles, MessageCircleHeart, Check } from 'lucide-react';
import { FlowerTypeInfo, PlantedMessage } from '../data/flowerData';

interface FlowerCardProps {
  index: number;
  totalFlowers: number;
  flowerInfo: FlowerTypeInfo;
  message?: PlantedMessage;
  isCurrent: boolean;
  onOpenMessage?: (message: PlantedMessage, index: number) => void;
  onSelectForWatering?: () => void;
}

export const FlowerCard: React.FC<FlowerCardProps> = ({
  index,
  totalFlowers,
  flowerInfo,
  message,
  isCurrent,
  onOpenMessage,
  onSelectForWatering,
}) => {
  const isBloomed = !!message;

  return (
    <div
      onClick={() => {
        if (isBloomed && message && onOpenMessage) {
          onOpenMessage(message, index);
        } else if (isCurrent && onSelectForWatering) {
          onSelectForWatering();
        }
      }}
      className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl transition-all duration-300 border text-center ${
        isBloomed
          ? 'bg-gradient-to-b from-white to-[#fff5f7] border-rose-200/90 shadow-md hover:shadow-xl hover:-translate-y-1.5 cursor-pointer ring-1 ring-rose-100'
          : isCurrent
          ? 'bg-gradient-to-b from-[#fffbf8] to-white border-dashed border-rose-300 ring-2 ring-rose-200/60 shadow-sm animate-pulse cursor-pointer'
          : 'bg-white/60 border-neutral-200/70 opacity-60 cursor-default'
      }`}
    >
      {/* Top indicator */}
      <div className="w-full flex items-center justify-between text-[11px] text-[#8e767c]">
        <span className="font-serif italic font-medium">Bông {index + 1}</span>
        {isBloomed ? (
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <Check className="w-3 h-3" /> Đã nở
          </span>
        ) : isCurrent ? (
          <span className="text-rose-600 font-medium animate-bounce">Đang đợi</span>
        ) : (
          <span>Chờ hoa nở</span>
        )}
      </div>

      {/* Flower visual container */}
      <div className="relative my-3 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
        {isBloomed ? (
          <div className="relative w-full h-full">
            {/* Glowing petal aura */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-rose-400/20 via-pink-300/30 to-amber-200/20 blur-sm animate-pulse" />
            <img
              src={flowerInfo.image}
              alt={`${flowerInfo.name} đang nở`}
              className="relative w-full h-full object-cover rounded-full shadow-lg border-2 border-white animate-bloom-sprout group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow border border-rose-100 text-rose-500">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        ) : isCurrent ? (
          <div className="w-16 h-16 rounded-full bg-rose-50/80 border border-dashed border-rose-300 flex items-center justify-center text-2xl shadow-inner animate-soft-pulse">
            🌱
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl grayscale opacity-75">
            🌰
          </div>
        )}
      </div>

      {/* Title & subtitle */}
      <div className="w-full space-y-1">
        <h4 className="text-xs md:text-sm font-medium text-[#3b272d] truncate">
          {isBloomed ? flowerInfo.name : `Hạt mầm số ${index + 1}`}
        </h4>
        <p className="text-[11px] text-[#8e767c] line-clamp-1">
          {isBloomed ? (
            <span className="text-rose-600 font-serif italic">Chạm để đọc lời thương</span>
          ) : isCurrent ? (
            'Tưới bằng lời chúc'
          ) : (
            'Chưa gieo hạt'
          )}
        </p>
      </div>

      {/* Hover message action badge */}
      {isBloomed && (
        <div className="mt-2 pt-2 border-t border-rose-100/70 w-full flex items-center justify-center gap-1.5 text-[11px] text-rose-700 font-medium">
          <MessageCircleHeart className="w-3.5 h-3.5" />
          <span>Xem lời nhắn</span>
        </div>
      )}
    </div>
  );
};
