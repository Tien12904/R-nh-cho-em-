import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Gift, MessageSquareHeart } from 'lucide-react';
import { FlowerTypeInfo, PlantedMessage, romanticBouquetImage } from '../data/flowerData';

interface BouquetShowcaseProps {
  recipient: string;
  senderName: string;
  flowerInfo: FlowerTypeInfo;
  flowerCount: number;
  messages: PlantedMessage[];
  onOpenGiftSetup: () => void;
  onOpenMessageModal: (msg: PlantedMessage, index: number) => void;
}

export const BouquetShowcase: React.FC<BouquetShowcaseProps> = ({
  recipient,
  senderName,
  flowerInfo,
  flowerCount,
  messages,
  onOpenGiftSetup,
  onOpenMessageModal,
}) => {
  useEffect(() => {
    // Fire gentle celebratory confetti burst when bouquet opens
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f472b6', '#fb7185', '#fda4af', '#fef08a', '#e9d5ff'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="card-glass rounded-3xl p-6 md:p-10 shadow-xl border border-rose-200/80 my-8 text-center relative overflow-hidden">
      {/* Decorative ambient backdrop */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Khu vườn đã nở rộ trọn vẹn</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif text-[#372329] tracking-tight">
          Bó hoa dành riêng cho <span className="italic text-rose-700">{recipient}</span>
        </h2>

        <p className="text-sm md:text-base text-[#6f565e] max-w-xl mx-auto leading-relaxed">
          Từng cánh hoa là một điều ấp ủ, từng lời nhắn gửi là một mảnh chân thành được kết lại
          thành bó hoa ngát hương.
        </p>

        {/* Hero bouquet visual showcase */}
        <div className="relative my-8 mx-auto max-w-md group">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white">
            <img
              src={romanticBouquetImage}
              alt="Bó hoa tình yêu dành cho em"
              className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-left">
              <span className="text-xs uppercase tracking-widest text-rose-200 font-semibold">
                {flowerInfo.name} · {flowerCount} đóa hoa kết nối
              </span>
              <p className="text-sm font-serif italic text-white/90 mt-1">
                "{flowerInfo.meaning}"
              </p>
            </div>
          </div>
        </div>

        {/* Flower petals list / Touch to view each message */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8e6e76]">
            Chạm vào từng đóa hoa để đọc lại lời thương
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {messages.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => onOpenMessageModal(m, idx)}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/90 border border-rose-200/80 hover:border-rose-400 hover:shadow-md hover:bg-rose-50/50 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white shadow-sm">
                  <img
                    src={flowerInfo.image}
                    alt={`Bông hoa ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-[#3b272d] truncate">
                    Bông hoa {idx + 1}
                  </div>
                  <div className="text-[11px] text-[#8e767c] truncate flex items-center gap-1">
                    <MessageSquareHeart className="w-2.5 h-2.5 text-rose-500" />
                    <span>Xem lời nhắn</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA: Pack into gift card */}
        <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenGiftSetup}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium rounded-full shadow-lg hover:shadow-rose-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 text-sm md:text-base group"
          >
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Gói ghém thành Tấm Thiệp Tình Yêu 💌</span>
          </button>
        </div>
      </div>
    </div>
  );
};
