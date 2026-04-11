import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// とこぷり基本GIF（キャラクター画像のソース）
const CHAR_GIF = 'C:\\Users\\seisaku00\\Desktop\\デジタル\\GIF\\とこぷり基本.gif';

/**
 * 元サイズの画像で白背景を透過に変換してから、指定サイズにリサイズ
 * 色距離ベースで白ピクセルを検出（アンチエイリアスもフェード処理）
 */
async function loadCharWithoutBg(targetSize) {
  // GIF第1フレームをそのままRAWで読み込む（リサイズ前）
  const { data, info } = await sharp(CHAR_GIF, { animated: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const buf = Buffer.from(data);

  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];

    // 白との色距離（ユークリッド距離）
    const dist = Math.sqrt(
      (255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2
    );

    // 距離0〜40: 完全透明、40〜65: フェード、65以上: 不透明
    if (dist < 40) {
      buf[i + 3] = 0;
    } else if (dist < 65) {
      buf[i + 3] = Math.round(255 * (dist - 40) / 25);
    }
    // dist >= 65 → alpha はそのまま（不透明）
  }

  // 背景除去済みの画像を trim してからリサイズ（余白を削除して最大化）
  return sharp(buf, {
    raw: { width, height, channels: 4 },
  })
    .trim({ threshold: 10 })  // 透明ピクセルの余白を削除
    .resize(targetSize, targetSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function generateIcon(size, filename) {
  const radius = Math.round(size * 0.22);

  // ① 黄色背景
  const bgBuffer = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 245, g: 200, b: 66, alpha: 1 }, // #F5C842
    },
  })
    .png()
    .toBuffer();

  // ② 角丸マスク適用
  const roundedMaskSvg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`
  );
  const bgRounded = await sharp(bgBuffer)
    .composite([{ input: roundedMaskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // ③ キャラクター（白背景除去 + trim済み）
  const charArea = Math.round(size * 0.72);   // テキスト2行分の余白を残す
  const charTop  = Math.round(size * 0.02);
  const charLeft = Math.round((size - charArea) / 2);
  const charBuffer = await loadCharWithoutBg(charArea);

  // ④ テキストSVG（2行: とこぷり / ブック）
  const fs1 = Math.round(size * 0.115);
  const fs2 = Math.round(size * 0.098);
  const ty1 = Math.round(size * 0.845);
  const ty2 = Math.round(size * 0.965);
  const cx  = Math.round(size / 2);

  const textSvg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <text x="${cx}" y="${ty1}"
        font-family="sans-serif" font-size="${fs1}" font-weight="900"
        text-anchor="middle" fill="#333333">とこぷり</text>
      <text x="${cx}" y="${ty2}"
        font-family="sans-serif" font-size="${fs2}" font-weight="900"
        text-anchor="middle" fill="#333333">ブック</text>
    </svg>`
  );

  // ⑤ 合成
  await sharp(bgRounded)
    .composite([
      { input: charBuffer, top: charTop, left: charLeft },
      { input: textSvg,    top: 0,       left: 0 },
    ])
    .png()
    .toFile(join(publicDir, filename));

  console.log(`✓ ${filename} (${size}x${size})`);
}

// 全サイズ生成
await generateIcon(512, 'icon-512.png');
await generateIcon(192, 'icon-192.png');
await generateIcon(180, 'apple-touch-icon.png');
await generateIcon(32,  'favicon-32.png');

console.log('PWAアイコン生成完了！');
