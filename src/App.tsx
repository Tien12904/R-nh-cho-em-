import React, { useState, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  Flower2,
  Music2,
  VolumeX,
  Volume2,
  Send,
  Gift,
  RefreshCw,
  Share2,
  Check,
  Download,
  Eye,
  Camera,
  BookOpen,
  ArrowRight,
  Clock,
  Quote,
} from 'lucide-react';
import {
  FLOWER_CATALOG,
  RECIPIENT_OPTIONS,
  FlowerTypeInfo,
  PlantedMessage,
  GiftCardData,
  romanticBouquetImage,
  INSPIRING_POEMS,
} from './data/flowerData';
import { PetalCanvas } from './components/PetalCanvas';
import { FlowerCard } from './components/FlowerCard';
import { BouquetShowcase } from './components/BouquetShowcase';
import { EnvelopeGiftModal } from './components/EnvelopeGiftModal';
import { MessageDetailModal } from './components/MessageDetailModal';
import { PromptSuggestionsModal } from './components/PromptSuggestionsModal';
import { RecipientView } from './components/RecipientView';
import { FloralVideoShowcase } from './components/FloralVideoShowcase';
import { exportGiftAsHtml, encodeGiftToHash, decodeGiftFromHash } from './utils/cardExport';
import { romanticAudio } from './utils/audioPlayer';

export default function App() {
  // Recipient / Gift URL Mode Check
  const [recipientModeGift, setRecipientModeGift] = useState<GiftCardData | null>(null);

  // Setup state
  const [recipient, setRecipient] = useState<string>('Bạn gái');
  const [customRecipientName, setCustomRecipientName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [flowerType, setFlowerType] = useState<string>('roses');
  const [flowerCount, setFlowerCount] = useState<number>(5);

  // App Workflow Step: 'setup' | 'garden' | 'gift'
  const [step, setStep] = useState<'setup' | 'garden' | 'gift'>('setup');

  // Messages in Garden
  const [messages, setMessages] = useState<PlantedMessage[]>([]);
  const [currentMessageInput, setCurrentMessageInput] = useState<string>('');
  const [isWriting, setIsWriting] = useState<boolean>(false);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(120);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Gift Card Details
  const [cardTitle, setCardTitle] = useState<string>('');
  const [cardMessage, setCardMessage] = useState<string>('');
  const [cardSign, setCardSign] = useState<string>('');
  const [photoData, setPhotoData] = useState<string>('');

  // Modals & UI States
  const [selectedMessageForModal, setSelectedMessageForModal] = useState<{
    msg: PlantedMessage;
    index: number;
  } | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [isEnvelopeModalOpen, setIsEnvelopeModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Current Flower Info
  const currentFlowerInfo: FlowerTypeInfo = FLOWER_CATALOG[flowerType] || FLOWER_CATALOG.roses;
  const activeRecipientName = customRecipientName.trim() || recipient;

  // Check URL hash for recipient view on mount
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#gift=')) {
        const decoded = decodeGiftFromHash(hash);
        if (decoded) {
          setRecipientModeGift(decoded);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Timer effect for writing
  useEffect(() => {
    let interval: number;
    if (timerActive && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      showToast('Thời gian viết đã hết — bạn hãy hoàn thiện hoặc gửi lời thương nhé.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const toggleMusic = () => {
    const active = romanticAudio.toggle();
    setIsPlayingMusic(active);
  };

  // Start Garden
  const handleStartGarden = () => {
    setMessages([]);
    setIsWriting(false);
    setStep('garden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Bắt đầu chăm sóc khu vườn ${currentFlowerInfo.name} cho ${activeRecipientName} 🌷`);
  };

  // Begin writing for next flower
  const handleStartWatering = () => {
    if (messages.length >= flowerCount) return;
    setIsWriting(true);
    setCurrentMessageInput('');
    setTimerSeconds(120);
    setTimerActive(true);

    setTimeout(() => {
      const el = document.getElementById('writingSection');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Submit message to bloom flower
  const handleSubmitMessage = () => {
    const trimmed = currentMessageInput.trim();
    if (trimmed.length < 3) {
      showToast('Hãy viết ít nhất vài từ chân thành để tưới bông hoa nhé.');
      return;
    }

    const newMessage: PlantedMessage = {
      id: `msg-${Date.now()}-${messages.length}`,
      body: trimmed,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      flowerIndex: messages.length,
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsWriting(false);
    setTimerActive(false);
    setCurrentMessageInput('');

    romanticAudio.playBloomSound();
    showToast(`Đóa hoa thứ ${messages.length + 1} đã nở rộ tuyệt đẹp! 🌸`);
  };

  // Photo file upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Ảnh quá lớn, vui lòng chọn ảnh dưới 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 900;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setPhotoData(canvas.toDataURL('image/jpeg', 0.8));
        showToast('Đã đính kèm ảnh kỷ niệm thành công!');
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Construct current Gift Data
  const currentGiftData: GiftCardData = {
    recipient: activeRecipientName,
    recipientCustomName: customRecipientName.trim() || undefined,
    senderName: senderName.trim(),
    flowerType,
    flowerCount,
    messages,
    cardTitle: cardTitle.trim() || `Gửi ${activeRecipientName} yêu thương`,
    cardMessage:
      cardMessage.trim() ||
      'Mong những ngày của em luôn có điều dịu dàng để mong đợi, có vòng tay để trở về và có thật nhiều lý do để mỉm cười.',
    cardSign: cardSign.trim() || (senderName ? `Thương em, ${senderName}.` : 'Thương em, thật nhiều.'),
    photoUrl: photoData || undefined,
    envelopeColor: 'rose',
    createdAt: new Date().toLocaleDateString('vi-VN'),
  };

  // Copy shareable link
  const handleCopyShareLink = async () => {
    const hash = encodeGiftToHash(currentGiftData);
    const url = `${window.location.origin}${window.location.pathname}#gift=${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast('Đã sao chép đường link thiệp gửi cho người thương! ♡');
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      prompt('Sao chép đường link này để gửi:', url);
    }
  };

  // Recipient Mode View
  if (recipientModeGift) {
    return (
      <RecipientView
        giftData={recipientModeGift}
        onResetToCreator={() => {
          window.location.hash = '';
          setRecipientModeGift(null);
        }}
      />
    );
  }

  const isGardenFinished = messages.length >= flowerCount && flowerCount > 0;

  return (
    <div className="relative min-h-screen text-[#3e2930]">
      {/* Background Falling Petals Canvas */}
      <PetalCanvas active={true} />

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <header className="sticky top-0 z-30 bg-[#fffbf9]/85 backdrop-blur-md border-b border-[#f3dbe1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setStep('setup');
            }}
            className="text-lg font-serif font-bold tracking-wider text-rose-950 whitespace-nowrap shrink-0 hover:text-rose-700 transition-colors"
          >
            DÀNH CHO EM
          </a>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#7a6068]">
            <button
              onClick={() => {
                setStep('setup');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-rose-800 transition-colors whitespace-nowrap shrink-0"
            >
              Chọn Hoa
            </button>
            <button
              onClick={() => {
                if (messages.length > 0) setStep('garden');
                else setStep('setup');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-rose-800 transition-colors whitespace-nowrap shrink-0"
            >
              Khu Vườn
            </button>
            <button
              onClick={() => {
                if (isGardenFinished) setStep('gift');
                else showToast('Hãy tưới đủ hoa trong vườn trước khi gói thiệp nhé.');
              }}
              className="hover:text-rose-800 transition-colors whitespace-nowrap shrink-0"
            >
              Tấm Thiệp
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleMusic}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                isPlayingMusic
                  ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  : 'bg-white text-stone-700 border-rose-200 hover:bg-rose-50'
              }`}
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 text-rose-600" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlayingMusic ? 'Nhạc êm dịu' : 'Bật nhạc'}</span>
            </button>

            {isGardenFinished ? (
              <button
                onClick={() => setIsEnvelopeModalOpen(true)}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Mở Thiệp</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setStep('setup');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 text-xs font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-colors whitespace-nowrap shrink-0"
              >
                Trồng Hoa Ngay
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10 space-y-12">
        {/* ================= HERO SECTION ================= */}
        {step === 'setup' && (
          <section className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="text-xs font-semibold tracking-widest uppercase text-rose-700">
                Một chút dịu dàng · Dành riêng cho người thương
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif text-[#321c23] leading-[1.1] tracking-tight">
                Hoa sẽ nở từ <br />
                <span className="italic text-rose-700">những lời yêu thương.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#725a62] leading-relaxed">
                Không cần món quà thật lớn. Hãy dành thời gian gửi gắm từng lời nhắn, tưới tắm
                cho khu vườn nhỏ và gom những điều chưa kịp nói thành một bó hoa ngát hương.
              </p>
            </div>

            {/* Split Hero: Video & Floral Motion Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <FloralVideoShowcase flowerInfo={currentFlowerInfo} />
              </div>
              <div className="lg:col-span-5 space-y-5">
                <div className="card-glass rounded-2xl p-6 border border-rose-200/80 shadow-md space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-serif italic text-sm">
                    <Quote className="w-4 h-4 text-rose-500" />
                    <span>Thông điệp từ hoa</span>
                  </div>
                  <h3 className="text-xl font-serif text-[#372127]">
                    {currentFlowerInfo.name} — {currentFlowerInfo.subtitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6d545c] leading-relaxed">
                    {currentFlowerInfo.meaning}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-[#8f747c]">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>Mỗi lời bạn viết là một giọt nước làm hoa bừng nở.</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#fff7f8] border border-rose-100 text-xs sm:text-sm text-[#745760] space-y-2">
                  <div className="font-semibold text-rose-800 uppercase tracking-wider text-[11px]">
                    Các bước giản đơn
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                    <span>Chọn người thương và loài hoa bạn muốn tặng.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                    <span>Viết từng lời nhắn chân thành để từng bông hoa nở rộ.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                    <span>Gói ghém thành tấm thiệp mở nắp sáp trang trọng và gửi tặng người ấy.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Setup Form Panel */}
            <div className="card-glass rounded-3xl p-6 sm:p-10 border border-rose-200/80 shadow-xl space-y-8">
              <div className="border-b border-rose-100 pb-5">
                <span className="text-xs font-semibold uppercase tracking-widest text-rose-700">
                  Bước 01 / Người Nhận & Loài Hoa
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#351e25] mt-1">
                  Khu vườn hoa này dành cho ai?
                </h2>
                <p className="text-xs sm:text-sm text-[#7b6169] mt-1">
                  Mỗi người thương, một cách gọi và một sắc hoa thật riêng.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recipient Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#70565e]">
                    Bạn muốn gửi đến ai?
                  </label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d]"
                  >
                    {RECIPIENT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {recipient === 'Khác' && (
                    <input
                      type="text"
                      placeholder="Nhập tên riêng (ví dụ: Bé Heo, Vy, My...)"
                      value={customRecipientName}
                      onChange={(e) => setCustomRecipientName(e.target.value)}
                      className="w-full mt-2 px-4 py-2.5 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  )}
                </div>

                {/* Sender Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#70565e]">
                    Tên người trồng hoa (không bắt buộc)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Người luôn nghĩ về em, Anh, Con..."
                    value={senderName}
                    maxLength={40}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d]"
                  />
                </div>

                {/* Flower Type Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#70565e]">
                    Loài hoa muốn gửi tặng
                  </label>
                  <select
                    value={flowerType}
                    onChange={(e) => setFlowerType(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d]"
                  >
                    {Object.values(FLOWER_CATALOG).map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.subtitle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Flower Count */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#70565e]">
                    Số đóa hoa muốn tưới trồng
                  </label>
                  <select
                    value={flowerCount}
                    onChange={(e) => setFlowerCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d]"
                  >
                    <option value={5}>5 đóa hoa (Ngắn gọn & sâu sắc)</option>
                    <option value={6}>6 đóa hoa (Trọn vẹn yêu thương)</option>
                    <option value={7}>7 đóa hoa (Bảy sắc cầu vồng)</option>
                    <option value={8}>8 đóa hoa (Đong đầy trọn vẹn)</option>
                    <option value={9}>9 đóa hoa (Vĩnh cửu lâu bền)</option>
                    <option value={10}>10 đóa hoa (Hoàn hảo tuyệt đối)</option>
                  </select>
                </div>
              </div>

              {/* Start Garden Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-rose-100">
                <span className="text-xs text-[#7b6169]">
                  Mỗi đóa hoa cần một lời thương để hé nở. Bạn có thể sử dụng các câu gợi ý có sẵn bất kỳ lúc nào.
                </span>
                <button
                  onClick={handleStartGarden}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium rounded-full shadow-lg hover:shadow-rose-500/25 transition-all text-sm flex items-center justify-center gap-2 group"
                >
                  <span>Bắt đầu trồng hoa cho {activeRecipientName}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ================= GARDEN STAGE ================= */}
        {step === 'garden' && (
          <section className="space-y-8">
            <div className="card-glass rounded-3xl p-6 sm:p-10 border border-rose-200/80 shadow-xl space-y-6">
              {/* Garden Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-rose-100 pb-5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-700">
                    Bước 02 / Chăm chút từng đóa hoa
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-serif text-[#371f26] mt-1">
                    Khu vườn của <span className="italic text-rose-700">{activeRecipientName}</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#785f67]">
                    Đã nở <strong className="text-rose-700 text-sm">{messages.length}</strong> / {flowerCount} bông
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-rose-100/70 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-full transition-all duration-500 shadow"
                    style={{ width: `${Math.round((messages.length / flowerCount) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#8e747c]">
                  <span>Hạt mầm đầu tiên</span>
                  <span>{Math.round((messages.length / flowerCount) * 100)}% hoàn thành</span>
                  <span>Bó hoa trọn vẹn</span>
                </div>
              </div>

              {/* Flower Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 my-6">
                {Array.from({ length: flowerCount }, (_, i) => (
                  <FlowerCard
                    key={i}
                    index={i}
                    totalFlowers={flowerCount}
                    flowerInfo={currentFlowerInfo}
                    message={messages[i]}
                    isCurrent={i === messages.length}
                    onOpenMessage={(msg, idx) => setSelectedMessageForModal({ msg, index: idx })}
                    onSelectForWatering={handleStartWatering}
                  />
                ))}
              </div>

              {/* Garden Bottom Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-rose-100">
                <div className="text-xs text-[#785f67] max-w-md">
                  {messages.length < flowerCount
                    ? `Hãy tưới bông hoa thứ ${messages.length + 1} bằng một lời chúc chân thành từ trái tim.`
                    : 'Toàn bộ hoa trong khu vườn đã nở rộ ngát hương! Bạn có thể gói ghém thành thiệp ngay.'}
                </div>

                {messages.length < flowerCount ? (
                  <button
                    onClick={handleStartWatering}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Tưới bông hoa thứ {messages.length + 1} ♡</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setStep('gift');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Gói ghém thành Tấm Thiệp Tình Yêu 💌</span>
                  </button>
                )}
              </div>

              {/* Writing Area Drawer */}
              {isWriting && (
                <div
                  id="writingSection"
                  className="mt-8 pt-6 border-t-2 border-dashed border-rose-200 space-y-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-rose-700">
                        Lời nhắn số {messages.length + 1} / {flowerCount}
                      </span>
                      <h3 className="text-lg sm:text-xl font-serif text-[#371f26]">
                        Nếu được nói một điều với {activeRecipientName} lúc này…
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPromptModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-medium border border-rose-200 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                        <span>Gợi ý lời thương</span>
                      </button>

                      {timerActive && (
                        <div className="flex items-center gap-1 text-xs text-rose-700 font-mono bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:
                            {String(timerSeconds % 60).padStart(2, '0')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={currentMessageInput}
                      onChange={(e) => setCurrentMessageInput(e.target.value)}
                      maxLength={600}
                      rows={4}
                      placeholder="Có thể là một lời cảm ơn, một kỷ niệm ấm áp, một lời chúc bình an, hoặc đơn giản là câu 'hôm nay em nhớ ăn uống đủ bữa nhé'…"
                      className="w-full p-4 bg-white border border-rose-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d] placeholder:text-stone-400"
                    />
                    <div className="flex items-center justify-between text-xs text-[#8d737a]">
                      <span>{currentMessageInput.length} / 600 ký tự</span>
                      <span>Hãy viết bằng tất cả sự chân thành của bạn</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setIsWriting(false)}
                      className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
                    >
                      Để lát nữa viết
                    </button>
                    <button
                      onClick={handleSubmitMessage}
                      className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium rounded-full shadow-md transition-colors flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi lời nhắn & làm hoa nở 🌷</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* When Bouquet is completely bloomed: Showcase banner */}
            {isGardenFinished && (
              <BouquetShowcase
                recipient={activeRecipientName}
                senderName={senderName}
                flowerInfo={currentFlowerInfo}
                flowerCount={flowerCount}
                messages={messages}
                onOpenGiftSetup={() => {
                  setStep('gift');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenMessageModal={(msg, idx) => setSelectedMessageForModal({ msg, index: idx })}
              />
            )}
          </section>
        )}

        {/* ================= GIFT CARD SETUP STAGE ================= */}
        {step === 'gift' && (
          <section className="space-y-8 animate-fade-in">
            <div className="card-glass rounded-3xl p-6 sm:p-10 border border-rose-200/80 shadow-xl space-y-8">
              <div className="border-b border-rose-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-700">
                    Bước 03 / Tấm Thiệp Tình Yêu
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-serif text-[#361e25] mt-1">
                    Gói ghém thành món quà cho {activeRecipientName}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#785f67] mt-1">
                    Viết thêm một bức thư nhỏ và đính kèm bức ảnh kỷ niệm của hai người.
                  </p>
                </div>

                <button
                  onClick={() => setIsEnvelopeModalOpen(true)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-medium shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Mở xem thử thiệp</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Inputs column */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#735961]">
                      Tiêu đề tấm thiệp
                    </label>
                    <input
                      type="text"
                      value={cardTitle}
                      placeholder={`Gửi ${activeRecipientName} yêu thương…`}
                      maxLength={80}
                      onChange={(e) => setCardTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#735961]">
                      Bức thư / Lời chúc trong thiệp
                    </label>
                    <textarea
                      value={cardMessage}
                      rows={5}
                      maxLength={1500}
                      placeholder="Có những điều đôi khi thật khó nói thành lời… Cảm ơn em vì đã luôn ở bên, cảm ơn những dịu dàng em dành cho anh. Mong những ngày tháng tới chúng ta vẫn luôn cùng nhau ngắm muôn mùa hoa nở…"
                      onChange={(e) => setCardMessage(e.target.value)}
                      className="w-full p-4 bg-white border border-rose-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#735961]">
                      Lời ký tên
                    </label>
                    <input
                      type="text"
                      value={cardSign}
                      placeholder={senderName ? `Thương em, ${senderName}.` : 'Thương em, thật nhiều.'}
                      maxLength={50}
                      onChange={(e) => setCardSign(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 text-[#3b272d]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#735961]">
                      Đính kèm bức ảnh kỷ niệm
                    </label>
                    <label className="flex items-center justify-center gap-2 p-4 bg-white border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl cursor-pointer transition-colors text-xs text-[#735961]">
                      <Camera className="w-4 h-4 text-rose-500" />
                      <span>{photoData ? 'Thay đổi bức ảnh khác' : 'Tải lên một bức ảnh kỷ niệm (tuỳ chọn)'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Card Live Preview */}
                <div className="bg-[#fff9fa] border border-rose-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-rose-700">
                      Bản xem trước tấm thiệp
                    </span>
                    <h3 className="text-2xl font-serif text-[#361e25]">
                      {cardTitle || `Gửi ${activeRecipientName} yêu thương`}
                    </h3>
                  </div>

                  <div className="p-4 bg-white/90 border border-rose-100 rounded-2xl text-xs sm:text-sm text-[#463137] leading-relaxed whitespace-pre-wrap font-serif">
                    {cardMessage ||
                      'Mong những ngày của em luôn có điều dịu dàng để mong đợi, có vòng tay để trở về và có thật nhiều lý do để mỉm cười.'}
                  </div>

                  {photoData ? (
                    <div className="rounded-xl overflow-hidden border-2 border-white shadow-md max-h-56">
                      <img src={photoData} alt="Ảnh kỷ niệm" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-rose-200 shadow-sm max-h-48">
                      <img
                        src={currentFlowerInfo.image}
                        alt="Đóa hoa kỷ niệm"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="text-right text-sm font-serif italic text-rose-800">
                    {cardSign || (senderName ? `Thương em, ${senderName}.` : 'Thương em, thật nhiều.')}
                  </div>
                </div>
              </div>

              {/* Share & Download Strip */}
              <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setStep('garden')}
                  className="px-5 py-2.5 text-stone-600 hover:bg-stone-100 rounded-full text-xs font-medium transition-colors"
                >
                  ← Trở lại khu vườn hoa
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleCopyShareLink}
                    className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-full text-xs font-medium transition-colors shadow-sm"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'Đã chép link thiệp!' : 'Sao chép link gửi thiệp'}</span>
                  </button>

                  <button
                    onClick={() => exportGiftAsHtml(currentGiftData)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-medium transition-colors shadow-sm"
                    title="Tải tệp HTML giữ làm kỷ niệm lâu dài"
                  >
                    <Download className="w-4 h-4" />
                    <span>Lưu bản thiệp (.html)</span>
                  </button>

                  <button
                    onClick={() => setIsEnvelopeModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-medium shadow-lg transition-colors"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Mở Thiệp Với Nắp Sáp 💌</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#f1d7de] py-8 text-center text-xs text-[#967d84] space-y-2">
        <p className="font-serif tracking-wider">
          DÀNH CHO EM · MỘT VƯỜN HOA TỪ NHỮNG LỜI THƯƠNG ♡
        </p>
        <p className="text-[11px] text-[#b39da4]">
          Được vun trồng bằng sự chân thành, gửi gắm trọn vẹn yêu thương.
        </p>
      </footer>

      {/* Modals */}
      <EnvelopeGiftModal
        isOpen={isEnvelopeModalOpen}
        onClose={() => setIsEnvelopeModalOpen(false)}
        giftData={currentGiftData}
      />

      <PromptSuggestionsModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onSelectPrompt={(text) => setCurrentMessageInput((prev) => (prev ? `${prev} ${text}` : text))}
        flowerName={currentFlowerInfo.name}
      />

      <MessageDetailModal
        isOpen={!!selectedMessageForModal}
        onClose={() => setSelectedMessageForModal(null)}
        message={selectedMessageForModal?.msg || null}
        flowerIndex={selectedMessageForModal?.index ?? 0}
        flowerInfo={currentFlowerInfo}
        recipientName={activeRecipientName}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#3c242b] text-white text-xs sm:text-sm font-medium shadow-2xl border border-rose-300/30 flex items-center gap-2 animate-bounce">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
