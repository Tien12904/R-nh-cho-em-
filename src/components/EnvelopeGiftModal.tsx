import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, Download, Copy, Check, Music2, Share2, Flower2 } from 'lucide-react';
import { GiftCardData, FLOWER_CATALOG, romanticBouquetImage } from '../data/flowerData';
import { exportGiftAsHtml, encodeGiftToHash } from '../utils/cardExport';
import { romanticAudio } from '../utils/audioPlayer';

interface EnvelopeGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftData: GiftCardData;
}

export const EnvelopeGiftModal: React.FC<EnvelopeGiftModalProps> = ({
  isOpen,
  onClose,
  giftData,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  if (!isOpen) return null;

  const flowerInfo = FLOWER_CATALOG[giftData.flowerType] || FLOWER_CATALOG.roses;
  const recipientDisplay = giftData.recipientCustomName || giftData.recipient;

  const handleOpenEnvelope = () => {
    setIsOpened(true);
    romanticAudio.playBloomSound();
    romanticAudio.play();
    setIsPlayingMusic(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fef08a', '#fda4af'],
      });
    } catch {
      // ignore
    }
  };

  const handleCopyLink = async () => {
    const hash = encodeGiftToHash(giftData);
    const url = `${window.location.origin}${window.location.pathname}#gift=${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      prompt('Sao chép đường link này để gửi cho người nhận:', url);
    }
  };

  const toggleMusic = () => {
    const state = romanticAudio.toggle();
    setIsPlayingMusic(state);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
          aria-label="Đóng"
        >
          <X className="w-6 h-6" />
        </button>

        {!isOpened ? (
          /* ================= ENVELOPE CLOSED VIEW ================= */
          <div className="relative mx-auto w-full max-w-lg bg-[#fbf6f3] border border-[#ecd5dc] rounded-2xl p-8 sm:p-12 shadow-2xl envelope-shadow text-center overflow-hidden">
            {/* Top envelope flap simulation */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#f5e3e8] to-[#fbf6f3] border-b border-[#ebd2da]/60 [clip-path:polygon(0_0,100%_0,50%_100%)] pointer-events-none" />

            <div className="relative z-10 pt-16 pb-6 space-y-6">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-rose-700/80">
                Thư tình trao gửi
              </span>

              <h2 className="text-2xl sm:text-4xl font-serif text-[#3e272e] tracking-tight">
                Gửi riêng cho <span className="italic text-rose-700">{recipientDisplay}</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#796269] max-w-sm mx-auto leading-relaxed">
                Một món quà đong đầy tâm tư và một vườn hoa vừa hé nở đang chờ bạn mở ra...
              </p>

              {/* Wax Seal Button */}
              <div className="pt-6">
                <button
                  onClick={handleOpenEnvelope}
                  className="group relative inline-flex flex-col items-center justify-center focus:outline-none"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-700 via-rose-600 to-[#7d1c33] shadow-xl border-4 border-rose-200/90 flex items-center justify-center transform group-hover:scale-110 group-active:scale-95 transition-all duration-300 ring-4 ring-rose-300/40">
                    <Heart className="w-9 h-9 text-rose-100 fill-rose-100 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Chạm để mở thiệp</span>
                  </div>
                </button>
              </div>

              <div className="text-[11px] text-[#998188] pt-2">
                {giftData.senderName ? `Từ: ${giftData.senderName}` : 'Từ người luôn thầm thương em'}
              </div>
            </div>
          </div>
        ) : (
          /* ================= LETTER UNFOLDED VIEW ================= */
          <div className="relative bg-white border border-rose-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl envelope-shadow max-h-[90vh] overflow-y-auto animate-bloom-sprout">
            {/* Top action bar: Audio & Share */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
              <button
                onClick={toggleMusic}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isPlayingMusic
                    ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
                title="Bật/Tắt nhạc nền du dương"
              >
                <Music2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{isPlayingMusic ? 'Đang phát giai điệu ♪' : 'Phát nhạc thiệp'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép link!' : 'Sao chép link gửi'}</span>
                </button>

                <button
                  onClick={() => exportGiftAsHtml(giftData)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Tải tệp HTML giữ làm kỷ niệm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tải về (.html)</span>
                </button>
              </div>
            </div>

            {/* Letter Header */}
            <div className="text-center my-6 space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-rose-700">
                Dành riêng cho {recipientDisplay}
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif text-[#372127]">
                {giftData.cardTitle || `Gửi ${recipientDisplay} yêu thương`}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-medium border border-rose-100">
                <Flower2 className="w-3.5 h-3.5 text-rose-500" />
                <span>{flowerInfo.name} · {giftData.flowerCount} đóa hoa kết nối</span>
              </div>
            </div>

            {/* Main Letter Body */}
            <div className="my-6 p-5 sm:p-7 bg-[#fffbf9] border border-[#f5e3e7] rounded-2xl shadow-inner text-[#453137] text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-serif">
              {giftData.cardMessage ||
                'Mong những ngày của em luôn có điều dịu dàng để mong đợi, có vòng tay để trở về và có thật nhiều lý do để mỉm cười.'}
            </div>

            {/* Attached Photo or Default Romantic Bouquet Art */}
            <div className="my-6 text-center">
              <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-stone-50">
                <img
                  src={giftData.photoUrl || flowerInfo.image || romanticBouquetImage}
                  alt="Ảnh kỷ niệm đính kèm"
                  className="w-full max-h-72 object-cover object-center"
                />
              </div>
            </div>

            {/* Signature */}
            <div className="text-right my-4 text-[#8a3852] font-serif italic text-base sm:text-lg">
              {giftData.cardSign || (giftData.senderName ? `Thương em, ${giftData.senderName}.` : 'Thương em, thật nhiều.')}
            </div>

            <hr className="my-8 border-rose-100" />

            {/* Floral Message Cards in Bouquet */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-serif text-[#3a252b]">
                  Từng bông hoa trong khu vườn của bạn
                </h3>
                <p className="text-xs text-[#8c747a]">
                  Những lời chúc đã làm từng đóa hoa bừng nở
                </p>
              </div>

              <div className="grid gap-3 max-h-64 overflow-y-auto pr-1">
                {giftData.messages.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-3.5 bg-rose-50/50 border border-rose-100/90 rounded-xl text-left space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-rose-800 font-semibold tracking-wider uppercase">
                      <span>Bông hoa thứ {idx + 1}</span>
                      <span className="text-[10px] font-normal text-stone-400">{m.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#3b272d] leading-relaxed">
                      {m.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c747a]">
              <span>DÀNH CHO EM · MỘT VƯỜN HOA TỪ NHỮNG LỜI THƯƠNG</span>
              <button
                onClick={onClose}
                className="px-5 py-2 text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-full font-medium transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
