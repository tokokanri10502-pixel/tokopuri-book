import Link from "next/link";
import { ArrowLeft } from "lucide-react";


const steps = [
  {
    emoji: "📸",
    title: "ほんをとうろくする",
    desc: "みぎしたのカメラボタンをおして、ほんのひょうしをさつえいしよう。AIがタイトルやちょしゃを よみとってくれるよ！かくにんして「ほんだなにとうろく！」をおしてね。",
  },
  {
    emoji: "✅",
    title: "どうだったか えらぶ",
    desc: "「よんだ」「よんでる」「よみたい」の3つからえらべるよ。あとからかえることもできるよ。",
  },
  {
    emoji: "⭐",
    title: "かんそうをかく",
    desc: "ほんのくわしいページで、ほしの★ひょうかと かんそうをメモできるよ。「きろくをほぞんする」をおすと ほぞんされるよ。",
  },
  {
    emoji: "🔍",
    title: "ほんをさがす",
    desc: "ほんだな画面のけんさくバーから、タイトルやちょしゃで さがせるよ。「よんだ」「よんでる」「よみたい」でしぼりこむこともできるよ。",
  },
  {
    emoji: "📊",
    title: "よんだきろくをみる",
    desc: "したのナビバーから「きろく」をひらくと、よんだほんのかず・ジャンル・つきごとのきろくがみられるよ。",
  },
  {
    emoji: "📤",
    title: "SNSにシェアする",
    desc: "ほんのくわしいページをしたにスクロールすると「シェアする」ボタンがあるよ。タイトルや かんそうを SNSや LINE にとうこうできるよ。",
  },
];

const tips = [
  "さつえいがうまくいかないときは、アルバムからひょうし画ぞうをえらべるよ",
  "AIのよみとりけっかは、とうろくまえになおせるよ",
  "とうろくしたほんはあなただけのほんだなにほぞんされるよ（ほかのひとにはみえないよ）",
  "3さつよむごとに、トコプリがおいわいしてくれるよ！ほわ。",
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen pb-16 pt-8 bg-tokopuri-cream">

      {/* ---- ヘッダー ---- */}
      <header className="px-5 mb-6 flex items-center gap-4">
        <Link
          href="/"
          className="p-3 bg-white border-2 border-tokopuri-yellow/40 rounded-2xl"
          style={{ touchAction: "manipulation" }}
        >
          <ArrowLeft size={20} className="text-tokopuri-black" />
        </Link>
        <h1 className="font-rounded font-black text-xl text-tokopuri-black">
          つかいかたガイド
        </h1>
      </header>

      {/* ---- トコプリ案内バナー ---- */}
      <section className="px-5 mb-6">
        <div className="rounded-4xl bg-tokopuri-yellow/20 border-2 border-tokopuri-yellow px-5 py-4 flex items-center gap-4">
          <img
            src="/characters/tokopuri_wink.gif"
            alt="トコプリ"
            className="w-20 h-20 object-contain flex-shrink-0"
          />
          <div>
            <p className="font-rounded font-black text-tokopuri-black text-base leading-snug">
              とこぷりブックの<br />つかいかただよ！ほわ。
            </p>
            <p className="font-rounded text-tokopuri-black/50 text-sm mt-1">
              ひょうしをさつえいするだけで<br />かんたんにきろくできるよ。
            </p>
          </div>
        </div>
      </section>

      {/* ---- ステップ ---- */}
      <section className="px-5 space-y-3 mb-6">
        {steps.map((step, i) => (
          <div key={i} className="card-kids flex gap-4 items-start">
            <div className="w-12 h-12 flex-shrink-0 bg-tokopuri-yellow/15 rounded-2xl flex items-center justify-center text-2xl border border-tokopuri-yellow/20">
              {step.emoji}
            </div>
            <div>
              <h2 className="font-rounded font-black text-tokopuri-black text-base mb-1">
                {`${i + 1}. ${step.title}`}
              </h2>
              <p className="font-rounded text-tokopuri-black/60 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ---- Tips ---- */}
      <section className="px-5">
        <div className="card-kids border-2 border-tokopuri-cyan/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">💡</span>
            <h2 className="font-rounded font-black text-tokopuri-black text-base">Tips</h2>
          </div>
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-tokopuri-yellow font-black mt-0.5">•</span>
                <p className="font-rounded text-tokopuri-black/70 text-sm leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  );
}
