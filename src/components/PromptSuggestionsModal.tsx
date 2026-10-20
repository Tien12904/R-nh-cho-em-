import React from 'react';
import { X, Sparkles, Heart } from 'lucide-react';

interface PromptSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (text: string) => void;
  flowerName: string;
}

const CATEGORIES = [
  {
    name: 'Lời Cảm Ơn Chân Thành',
    prompts: [
      'Cảm ơn em vì đã luôn ở bên, bao dung và chia sẻ cùng anh mọi điều nhỏ bé trong cuộc sống.',
      'Cảm ơn vì mỗi ngày thức dậy, điều đầu tiên anh nghĩ đến và mỉm cười luôn là em.',
      'Cảm ơn em vì đã đến và biến những tháng ngày bình thường trở nên thật ý nghĩa.',
      'Biết ơn vì trong hàng tỷ người trên thế giới này, anh may mắn được gặp và yêu em.',
    ],
  },
  {
    name: 'Dịu Dàng & Yêu Thương',
    prompts: [
      'Dù ngoài kia thế giới có hối hả thế nào, mong em luôn nhớ rằng ở đây luôn có một nơi bình yên cho em tựa vào.',
      'Anh yêu ánh mắt của em khi cười, yêu cả những lúc em giận dỗi đáng yêu.',
      'Em không cần phải gồng mình trở nên hoàn hảo, bởi vì em là chính em đã là điều tuyệt vời nhất.',
      'Mỗi nhánh hoa nở hôm nay đều mang theo một lời chúc bình an và nụ cười dành cho em.',
    ],
  },
  {
    name: 'Kỷ Niệm & Gắn Kết',
    prompts: [
      'Nhớ lần đầu tiên mình trò chuyện, anh đã biết trái tim mình đã thuộc về nơi này.',
      'Mỗi chuyến đi, mỗi tách cà phê cùng em đều là những ký ức anh trân quý nhất.',
      'Cảm ơn những lần em nắm tay anh qua những ngày mưa bão, tiếp thêm cho anh sức mạnh.',
    ],
  },
  {
    name: 'Lời Chúc Tương Lai',
    prompts: [
      'Chúc em một đời an nhiên, có hoa thơm đón bước, có nắng ấm che đầu và có anh cùng sánh bước.',
      'Mong cho mọi ước mơ của em đều dần trở thành hiện thực, anh sẽ luôn là người đứng sau cổ vũ em.',
      'Hy vọng chúng mình sẽ cùng nhau già đi, cùng nhau ngắm muôn mùa hoa nở.',
    ],
  },
];

export const PromptSuggestionsModal: React.FC<PromptSuggestionsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
  flowerName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#fffaf8] border border-[#f3dce2] rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#f3dce2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-full">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-[#3f2b32]">Gợi ý lời thương</h3>
              <p className="text-xs text-[#8c747a]">
                Chọn một câu để bắt đầu, bạn có thể chỉnh sửa thêm theo cảm xúc của riêng mình
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8c747a] hover:text-[#3f2b32] hover:bg-rose-50 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {CATEGORIES.map((cat, idx) => (
            <div key={idx} className="space-y-2.5">
              <div className="text-xs font-semibold tracking-wider uppercase text-rose-800">
                {cat.name}
              </div>
              <div className="grid gap-2">
                {cat.prompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      onSelectPrompt(prompt);
                      onClose();
                    }}
                    className="group flex items-start gap-3 p-3.5 text-left bg-white border border-[#f0dee3] hover:border-rose-400 hover:bg-rose-50/40 rounded-xl transition-all duration-200"
                  >
                    <Heart className="w-4 h-4 mt-0.5 text-rose-400 group-hover:text-rose-600 shrink-0 transition-colors" />
                    <span className="text-sm text-[#463339] group-hover:text-[#2d1e23] leading-relaxed">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#f3dce2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-[#7d505c] hover:bg-rose-100/50 rounded-full transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
