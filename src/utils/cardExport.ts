import { GiftCardData, FLOWER_CATALOG } from '../data/flowerData';

export function encodeGiftToHash(data: GiftCardData): string {
  try {
    // Clone data to avoid mutating original
    const payload = { ...data };
    // If photo is too large for URL hash (>100KB), omit from URL hash to avoid URL size limit,
    // but the photo remains in full resolution in state and in downloaded HTML file!
    if (payload.photoUrl && payload.photoUrl.length > 80000) {
      payload.photoUrl = ''; // Omit from URL string to prevent browser 414 / URI too long
    }

    const jsonStr = JSON.stringify(payload);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode gift hash:', err);
    return '';
  }
}

export function decodeGiftFromHash(hash: string): GiftCardData | null {
  try {
    let clean = hash.replace(/^#gift=/, '').replace(/^gift=/, '');
    clean = clean.replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4) {
      clean += '=';
    }
    const binary = atob(clean);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr) as GiftCardData;
  } catch (err) {
    console.error('Failed to decode gift hash:', err);
    return null;
  }
}

export function exportGiftAsHtml(data: GiftCardData): void {
  const flowerInfo = FLOWER_CATALOG[data.flowerType] || FLOWER_CATALOG.roses;
  const recipientName = data.recipientCustomName || data.recipient;

  const messagesHtml = data.messages
    .map(
      (m, i) => `
      <div style="background: #ffffff; border: 1px solid #f3dce2; border-radius: 16px; padding: 18px 22px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(186, 109, 122, 0.06);">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #a25268; font-weight: 600; margin-bottom: 6px;">
          Bông hoa ${i + 1} · Lời nhắn yêu thương
        </div>
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #3d2b31;">${escapeHtml(m.body).replace(/\n/g, '<br>')}</p>
        <div style="font-size: 11px; color: #a48e94; margin-top: 8px;">Gửi lúc: ${escapeHtml(m.time)}</div>
      </div>
    `
    )
    .join('');

  const photoHtml = data.photoUrl
    ? `
      <div style="margin: 25px auto; max-width: 520px; text-align: center;">
        <img src="${data.photoUrl}" alt="Ảnh kỷ niệm" style="width: 100%; max-height: 440px; object-fit: contain; border-radius: 18px; box-shadow: 0 12px 30px rgba(186, 109, 122, 0.15); border: 4px solid #fff;" />
      </div>
    `
    : '';

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.cardTitle)} — Dành Cho Em</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 30px 15px 60px;
      background: radial-gradient(circle at 10% 10%, #fff 0, transparent 40%), linear-gradient(135deg, #fff9f6 0%, #fdeef1 100%);
      color: #3d2c31;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      min-height: 100vh;
    }
    .container {
      max-width: 780px;
      margin: 0 auto;
    }
    .card-wrap {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid #f2dde2;
      border-radius: 28px;
      padding: 40px 32px;
      box-shadow: 0 25px 60px -10px rgba(186, 109, 122, 0.16);
      backdrop-filter: blur(10px);
    }
    h1, h2 {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 500;
    }
    .header-badge {
      display: inline-block;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #a25268;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .flower-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: #fff5f7;
      border: 1px solid #f3dce2;
      border-radius: 999px;
      font-size: 13px;
      color: #98435b;
      margin-bottom: 24px;
    }
    .letter-body {
      font-size: 16px;
      line-height: 1.85;
      color: #4a363d;
      white-space: pre-wrap;
      margin: 25px 0;
    }
    .signature {
      text-align: right;
      font-style: italic;
      color: #98435b;
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 18px;
      margin-top: 30px;
    }
    .divider {
      border: 0;
      border-top: 1px dashed #f0d4db;
      margin: 40px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #9c848b;
      margin-top: 35px;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card-wrap">
      <div style="text-align: center; margin-bottom: 25px;">
        <span class="header-badge">Dành riêng cho ${escapeHtml(recipientName)}</span>
        <h1 style="font-size: 34px; margin: 8px 0 16px; color: #352127;">${escapeHtml(data.cardTitle)}</h1>
        <div class="flower-tag">
          🌸 ${escapeHtml(flowerInfo.name)} (${data.flowerCount} đóa hoa yêu thương)
        </div>
      </div>

      <div class="letter-body">${escapeHtml(data.cardMessage)}</div>

      ${photoHtml}

      <div class="signature">
        ${escapeHtml(data.cardSign || 'Thương em, thật nhiều.')}
      </div>

      <hr class="divider">

      <div>
        <h2 style="font-size: 22px; margin-bottom: 20px; color: #432b32; text-align: center;">
          Những lời nhắn gửi trong khu vườn hoa
        </h2>
        <div>${messagesHtml}</div>
      </div>
    </div>

    <div class="footer">
      DÀNH CHO EM · MỘT VƯỜN HOA TỪ NHỮNG LỜI THƯƠNG
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thiep-danh-cho-${recipientName.toLowerCase().replace(/\s+/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text ?? '').replace(/[&<>"']/g, (m) => map[m]);
}
