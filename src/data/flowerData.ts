// High-fidelity floral images generated specifically for Dành Cho Em
import heroRoseImage from '@/src/assets/images/hero_blooming_roses_1792497110070.jpg';
import tulipImage from '@/src/assets/images/flower_tulips_bloom_1792497129016.jpg';
import sunflowerImage from '@/src/assets/images/flower_sunflowers_warm_1792497129693.jpg';
import daisyImage from '@/src/assets/images/flower_daisies_chamomile_1792497128924.jpg';
import peonyImage from '@/src/assets/images/flower_peonies_delicate_1792497147312.jpg';
import romanticBouquetImage from '@/src/assets/images/bouquet_gift_romantic_1792497147170.jpg';

export { heroRoseImage, tulipImage, sunflowerImage, daisyImage, peonyImage, romanticBouquetImage };

export interface FlowerTypeInfo {
  id: string;
  name: string;
  subtitle: string;
  meaning: string;
  colorName: string;
  badgeColor: string;
  gradient: string;
  image: string;
  samplePrompts: string[];
}

export const FLOWER_CATALOG: Record<string, FlowerTypeInfo> = {
  roses: {
    id: 'roses',
    name: 'Hoa Hồng Đỏ',
    subtitle: 'Nồng Nàn & Chung Thủy',
    meaning: 'Biểu tượng của tình cảm sâu sắc, sự chân thành và những rung động vĩnh cửu.',
    colorName: 'Hồng Đỏ Rực Rỡ',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
    gradient: 'from-rose-500/20 to-pink-500/10',
    image: heroRoseImage,
    samplePrompts: [
      'Cảm ơn em vì đã đến và làm cuộc sống của anh trở nên rực rỡ hơn.',
      'Dù có bao nhiêu mùa hoa đi qua, trong mắt anh em vẫn luôn là điều tuyệt vời nhất.',
      'Mỗi ngày được nhìn thấy nụ cười của em là một ngày trọn vẹn bình yên.',
      'Anh yêu từng điều nhỏ bé ở em, từ cách em cười đến ánh mắt dịu dàng.',
      'Nếu được chọn lại một ngàn lần, anh vẫn sẽ chọn nắm lấy tay em.',
    ],
  },
  tulips: {
    id: 'tulips',
    name: 'Hoa Tulip',
    subtitle: 'Dịu Dàng & Thanh Khiết',
    meaning: 'Lời ước nguyện cho tình yêu nhẹ nhàng, bình an và tràn ngập sự chở che.',
    colorName: 'Hồng Pastel Dịu Ngọt',
    badgeColor: 'text-pink-700 bg-pink-50 border-pink-200',
    gradient: 'from-pink-400/20 to-purple-400/10',
    image: tulipImage,
    samplePrompts: [
      'Mong em những ngày tới luôn bình an, không còn những muộn phiền giấu kín.',
      'Ở bên em, thế giới ồn ào ngoài kia bỗng trở nên thật hiền hòa.',
      'Em như đóa tulip mùa xuân, dịu dàng sưởi ấm những ngày gió lạnh.',
      'Cảm ơn vì đã luôn bao dung và lắng nghe những điều vụn vặt của anh.',
      'Mong đôi mắt em chỉ rơi nước mắt vì những niềm hạnh phúc ngập tràn.',
    ],
  },
  sunflowers: {
    id: 'sunflowers',
    name: 'Hoa Hướng Dương',
    subtitle: 'Rạng Rỡ & Ấm Áp',
    meaning: 'Luôn hướng về mặt trời, biểu trưng cho sự lạc quan, niềm hy vọng và sự kiên định.',
    colorName: 'Vàng Nắng Ấm Áp',
    badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
    gradient: 'from-amber-400/20 to-yellow-400/10',
    image: sunflowerImage,
    samplePrompts: [
      'Em chính là ánh mặt trời xua tan mọi mây mù trong lòng anh.',
      'Dù cuộc sống có mỏi mệt thế nào, nhìn thấy em anh lại có thêm dũng khí.',
      'Chúc em luôn giữ nụ cười tỏa nắng và một trái tim kiên cường, ấm áp.',
      'Cảm ơn nguồn năng lượng tích cực và sự chân thành mà em trao cho mọi người.',
      'Hãy luôn tự tin bước về phía trước, vì phía sau luôn có anh dõi theo em.',
    ],
  },
  daisies: {
    id: 'daisies',
    name: 'Hoa Cúc Họa Mi',
    subtitle: 'Trong Trẻo & Tinh Khôi',
    meaning: 'Nét đẹp mộc mạc, bình dị nhưng bền bỉ và thủy chung giữa dòng đời tấp nập.',
    colorName: 'Trắng Sữa Thuần Khiết',
    badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    gradient: 'from-emerald-400/20 to-teal-400/10',
    image: daisyImage,
    samplePrompts: [
      'Thương em từ những điều giản đơn nhất, không cần hoa mỹ hay cầu kỳ.',
      'Chúc em một đời an yên, tìm thấy niềm vui trong những nhành cỏ và giọt sương mai.',
      'Em như nhành cúc đầu đông, mộc mạc mà khiến lòng người lưu luyến không quên.',
      'Cảm ơn vì đã cùng anh đi qua những ngày tháng bình dị mà quý giá này.',
      'Mong em luôn giữ được nét hồn nhiên, vô tư trong ánh mắt.',
    ],
  },
  peonies: {
    id: 'peonies',
    name: 'Hoa Mẫu Đơn',
    subtitle: 'Kiêu Sa & Quý Giá',
    meaning: 'Nữ hoàng của muôn hoa, gửi gắm sự trân trọng tột cùng và lời chúc hạnh phúc viên mãn.',
    colorName: 'Hồng Phấn Quý Phái',
    badgeColor: 'text-purple-800 bg-purple-50 border-purple-200',
    gradient: 'from-purple-400/20 to-rose-400/10',
    image: peonyImage,
    samplePrompts: [
      'Em xứng đáng nhận được tất cả những điều dịu dàng và trân quý nhất trần đời.',
      'Trong mắt anh, em luôn là điều lộng lẫy và hoàn hảo nhất.',
      'Cảm ơn sự hy sinh và tình yêu thương vô điều kiện mà em đã dành cho anh.',
      'Mong người phụ nữ tuyệt vời của anh luôn rạng ngời và được nâng niu.',
      'Cảm ơn em vì đã là chỗ dựa dịu dàng và bình yên nhất.',
    ],
  },
  mixed: {
    id: 'mixed',
    name: 'Bó Hoa Muôn Sắc',
    subtitle: 'Giao Hưởng Yêu Thương',
    meaning: 'Kết tinh từ tất cả những sắc màu hoa đẹp nhất, tượng trưng cho tình cảm đa chiều đong đầy.',
    colorName: 'Đa Sắc Rực Rỡ',
    badgeColor: 'text-rose-800 bg-rose-50 border-rose-200',
    gradient: 'from-rose-400/20 via-amber-400/15 to-purple-400/20',
    image: romanticBouquetImage,
    samplePrompts: [
      'Mỗi bông hoa là một mảnh ghép của tấm lòng anh gửi trao.',
      'Gom hết dịu dàng của trời đất để gói lại thành món quà dành tặng em.',
      'Dù là ngày vui hay ngày buồn, hãy nhớ rằng luôn có một người thương em vô bờ.',
      'Từng cánh hoa thay lời cảm ơn vì em đã luôn là phiên bản tuyệt vời nhất.',
      'Chúc em một đời bình an, được yêu và yêu say đắm.',
    ],
  },
};

export const RECIPIENT_OPTIONS = [
  { id: 'Bạn gái', label: 'Bạn gái', pronoun: 'em', addressDefault: 'Gửi người con gái anh yêu' },
  { id: 'Vợ', label: 'Vợ yêu', pronoun: 'em', addressDefault: 'Gửi người vợ tuyệt vời của anh' },
  { id: 'Người thương', label: 'Người thương / Crush', pronoun: 'cậu / em', addressDefault: 'Gửi người luôn trong tâm trí' },
  { id: 'Mẹ', label: 'Mẹ kính yêu', pronoun: 'mẹ', addressDefault: 'Gửi Mẹ yêu dấu của con' },
  { id: 'Bà', label: 'Bà kính yêu', pronoun: 'bà', addressDefault: 'Kính gửi Bà kính yêu của con cháu' },
  { id: 'Chị gái', label: 'Chị gái', pronoun: 'chị', addressDefault: 'Gửi chị gái tuyệt vời' },
  { id: 'Em gái', label: 'Em gái', pronoun: 'em', addressDefault: 'Gửi em gái bé nhỏ' },
  { id: 'Bạn thân', label: 'Bạn thân', pronoun: 'mày / bạn', addressDefault: 'Gửi đứa bạn thân nhất trần đời' },
  { id: 'Khác', label: 'Tự nhập tên riêng...', pronoun: 'em', addressDefault: 'Gửi người đặc biệt' },
];

export interface PlantedMessage {
  id: string;
  body: string;
  time: string;
  flowerIndex: number;
}

export interface GiftCardData {
  recipient: string;
  recipientCustomName?: string;
  senderName: string;
  flowerType: string;
  flowerCount: number;
  messages: PlantedMessage[];
  cardTitle: string;
  cardMessage: string;
  cardSign: string;
  photoUrl?: string;
  envelopeColor: 'rose' | 'cream' | 'wine' | 'emerald';
  createdAt: string;
}

export const INSPIRING_POEMS = [
  {
    quote: 'Mỗi bông hoa nở là một nụ cười của đất trời. Mỗi lời nhắn gửi là một nhịp đập của trái tim.',
    author: 'Dành Cho Em',
  },
  {
    quote: 'Không cần món quà thật lớn, chỉ cần một chút dịu dàng đủ để sưởi ấm những ngày mưa.',
    author: 'Vườn Hoa Yêu Thương',
  },
  {
    quote: 'Em có thấy hoa nở không? Đó là bởi vì hôm nay có người đã nhắc tên em bằng tất cả chân thành.',
    author: 'Lời của hoa',
  },
];
