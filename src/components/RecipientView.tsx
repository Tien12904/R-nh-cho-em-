import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Music2, Download, Flower2, RefreshCw } from 'lucide-react';
import { GiftCardData, FLOWER_CATALOG, romanticBouquetImage } from '../data/flowerData';
import { exportGiftAsHtml } from '../utils/cardExport';
import { romanticAudio } from '../utils/audioPlayer';
import { PetalCanvas } from './PetalCanvas';

interface RecipientViewProps {
  giftData: GiftCardData;
  onResetToCreator: () => void;
}

export const RecipientView: React.FC<RecipientViewProps> = ({ giftData, onResetToCreator }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{ index: number; body: string; time: string } | null>(null);

  const flowerInfo = FLOWER_CATALOG[giftData.flowerType] || FLOWER_CATALOG.roses;
  const recipientName = giftData.recipientCustomName || giftData.recipient;

  const handleOpenGift = () => {
    setIsOpened(true);
    romanticAudio.playBloomSound();
    romanticAudio.play();
    setIsPlayingMusic(true);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fef08a', '#e9d5ff'],
      });
    } catch {
      // ignore
    }
  };

  const toggleMusic = () => {
    const active = romanticAudio.toggle();
    setIsPlayingMusic(active);
  };

  return (
    <div className="relative min-h-screen pb-20 pt-8 px-4 sm:px-6">
      <PetalCanvas active={true} />

      {/* Top Floating Controls */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-serif text-sm shadow">
            D
          </div>
          <span className="font-serif text-base font-medium tracking-wide text-[#3d2a30]">
            DÀNH CHO EM
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isPlayingMusic
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                : 'bg-white/90 text-stone-700 border-rose-200 hover:bg-rose-50'
            }`}
          >
            <Music2 className="w-3.5 h-3.5 text-rose-600" />
            <span>{isPlayingMusic ? 'Nhạc êm dịu ♪' : 'Phát nhạc thiệp'}</span>
          </button>

          <button
            onClick={onResetToCreator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 text-stone-700 border border-stone-200 hover:bg-stone-100 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tạo vườn hoa mới</span>
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto relative z-10">
        {!isOpened ? (
          /* ================= SEALED ENVELOPE STAGE ================= */
          <div className="card-glass rounded-3xl p-8 sm:p-14 text-center envelope-shadow border border-rose-200/90 my-8 space-y-6 animate-bloom-sprout">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-rose-700">
              Một món quà bí mật
            </span>

            <h1 className="text-3xl sm:text-5xl font-serif text-[#392229] leading-tight">
              Dành riêng cho <span className="italic text-rose-700">{recipientName}</span>
            </h1>

            <p className="text-sm sm:text-base text-[#745e65] max-w-md mx-auto leading-relaxed">
              {giftData.senderName
                ? `${giftData.senderName} đã tự tay chăm sóc từng đóa hoa và viết từng lời nhắn gửi dành riêng cho bạn.`
                : 'Một người thương đã chăm sóc khu vườn và gói ghém từng lời nhắn gửi dành riêng cho bạn.'}
            </p>

            <div className="pt-6">
              <button
                onClick={handleOpenGift}
                className="group relative inline-flex flex-col items-center justify-center focus:outline-none"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-700 via-rose-600 to-[#7d1c33] shadow-2xl border-4 border-rose-200 flex items-center justify-center transform group-hover:scale-110 group-active:scale-95 transition-all duration-300 ring-8 ring-rose-300/30">
                  <Heart className="w-11 h-11 text-rose-100 fill-rose-100 group-hover:scale-110 transition-transform" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-rose-800">
                  <Sparkles className="w-4 h-4" />
                  <span>Chạm để mở món quà của bạn</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* ================= UNBOXED GIFT CARD STAGE ================= */
          <div className="space-y-8 animate-fade-in">
            {/* The Greeting Letter */}
            <div className="card-glass rounded-3xl p-6 sm:p-10 envelope-shadow border border-rose-200/90">
              <div className="text-center space-y-2 mb-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-rose-700">
                  Thư gửi {recipientName}
                </span>
                <h1 className="text-2xl sm:text-4xl font-serif text-[#362127]">
                  {giftData.cardTitle || `Gửi ${recipientName} yêu thương`}
                </h1>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-medium border border-rose-200">
                  <Flower2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    Bó {flowerInfo.name} ({giftData.flowerCount} đóa hoa kết nối)
                  </span>
                </div>
              </div>

              {/* Main Letter Body */}
              <div className="my-6 p-5 sm:p-8 bg-[#fffbf9] border border-rose-100 rounded-2xl shadow-inner font-serif text-sm sm:text-base text-[#463137] leading-relaxed whitespace-pre-wrap">
                {giftData.cardMessage ||
                  'Mong những ngày của em luôn có điều dịu dàng để mong đợi, có vòng tay để trở về và có thật nhiều lý do để mỉm cười.'}
              </div>

              {/* Photo Showcase */}
              <div className="my-6 text-center">
                <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <img
                    src={giftData.photoUrl || flowerInfo.image || romanticBouquetImage}
                    alt="Ảnh kỷ niệm"
                    className="w-full max-h-80 object-cover object-center"
                  />
                </div>
              </div>

              {/* Sign */}
              <div className="text-right text-[#88364f] font-serif italic text-lg sm:text-xl my-4">
                {giftData.cardSign || (giftData.senderName ? `Thương em, ${giftData.senderName}.` : 'Thương em, thật nhiều.')}
              </div>

              <div className="mt-8 pt-4 border-t border-rose-100 flex items-center justify-end">
                <button
                  onClick={() => exportGiftAsHtml(giftData)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-medium border border-rose-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Lưu tấm thiệp về máy (.html)</span>
                </button>
              </div>
            </div>

            {/* The Garden Bouquet & Flower Cards */}
            <div className="card-glass rounded-3xl p-6 sm:p-10 envelope-shadow border border-rose-200/90 space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-rose-700">
                  Vườn hoa nở từ lời thương
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#372127]">
                  Từng lời nhắn gửi đến bạn
                </h2>
                <p className="text-xs sm:text-sm text-[#79636a]">
                  Mỗi bông hoa là một mảnh tâm tư người gửi đã trân trọng viết cho bạn.
                </p>
              </div>

              {/* Flower Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 pt-4">
                {giftData.messages.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMessage({ index: idx, body: m.body, time: m.time })}
                    className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white/90 border border-rose-200/80 hover:border-rose-400 hover:shadow-lg transition-all text-center"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-md mb-2 group-hover:scale-105 transition-transform">
                      <img
                        src={flowerInfo.image}
                        alt={`Bông hoa ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-serif font-medium text-[#3b272d]">
                      Bông hoa {idx + 1}
                    </span>
                    <span className="text-[11px] text-rose-600 line-clamp-1 mt-1 font-serif italic">
                      "{m.body}"
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Message Modal for Recipient */}
            {selectedMessage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-rose-200 shadow-md mb-3">
                    <img
                      src={flowerInfo.image}
                      alt="Bông hoa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                    Bông hoa thứ {selectedMessage.index + 1}
                  </span>
                  <div className="my-4 p-4 bg-rose-50/60 rounded-2xl text-sm text-[#432f35] leading-relaxed text-left font-serif">
                    {selectedMessage.body}
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-medium transition-colors"
                  >
                    Đóng lại
                  </button>
                </div>
              </div>
            )}

            {/* Footer with reciprocity */}
            <div className="text-center pt-6 space-y-3">
              <button
                onClick={onResetToCreator}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium rounded-full shadow-lg text-sm transition-all"
              >
                Trồng một vườn hoa đáp lại người thương ♡
              </button>
              <p className="text-xs text-[#9b8289]">
                DÀNH CHO EM · MỘT VƯỜN HOA TỪ NHỮNG LỜI THƯƠNG
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
