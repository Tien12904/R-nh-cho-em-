import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';
import { PlantedMessage, FlowerTypeInfo } from '../data/flowerData';

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: PlantedMessage | null;
  flowerIndex: number;
  flowerInfo: FlowerTypeInfo;
  recipientName: string;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  isOpen,
  onClose,
  message,
  flowerIndex,
  flowerInfo,
  recipientName,
}) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        {/* Ambient background bloom */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-rose-200/40 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Flower image */}
        <div className="relative mx-auto my-3 w-28 h-28">
          <div className="absolute -inset-1 rounded-full bg-rose-300/40 blur-md animate-pulse" />
          <img
            src={flowerInfo.image}
            alt={flowerInfo.name}
            className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 p-1.5 bg-rose-600 text-white rounded-full shadow">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </div>
        </div>

        <div className="space-y-1 mt-3">
          <span className="text-xs uppercase tracking-widest text-rose-700 font-semibold">
            Bông hoa thứ {flowerIndex + 1}
          </span>
          <h3 className="text-xl font-serif text-[#372127]">{flowerInfo.name}</h3>
          <p className="text-xs text-[#8c747a] italic">"{flowerInfo.meaning}"</p>
        </div>

        {/* The Message Box */}
        <div className="my-5 p-4 sm:p-5 bg-[#fff8f9] border border-rose-100 rounded-2xl text-left text-sm text-[#463238] leading-relaxed shadow-inner">
          <p className="whitespace-pre-wrap">{message.body}</p>
          <div className="mt-3 pt-2 border-t border-rose-100 text-[10px] text-[#9a8087] flex items-center justify-between">
            <span>Dành cho {recipientName}</span>
            <span>{message.time}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-full text-xs font-medium transition-colors"
        >
          Trở lại vườn hoa
        </button>
      </div>
    </div>
  );
};
