import Link from "next/link";
import { ArrowLeft, Camera, BookOpen, Search, Share2, BarChart3, Star, Edit3 } from "lucide-react";

const steps = [
  {
    icon: <Camera size={20} />,
    title: "① 本を登録する",
    desc: "ホーム右下のカメラボタンをタップ。本の表紙を撮影すると、AIがタイトル・著者・ジャンルを自動で読み取ります。内容を確認・修正してから「ライブラリに登録」を押してください。",
  },
  {
    icon: <BookOpen size={20} />,
    title: "② 読書ステータスを設定する",
    desc: "登録時またはあとから「読書中 / 読了 / 積読」を選べます。本棚の上部に集計が表示されます。",
  },
  {
    icon: <Star size={20} />,
    title: "③ 評価・感想を記録する",
    desc: "本の詳細画面で1〜5の星評価と自由なメモを入力できます。「記録を保存する」を押すと保存されます。",
  },
  {
    icon: <Search size={20} />,
    title: "④ 本を探す",
    desc: "ホーム画面の検索バーでタイトル・著者名から絞り込めます。フィルター（読書中・読了・積読）やソート（新着・タイトル・評価順）も使えます。右端のアイコンでリスト↔グリッド表示を切り替えられます。",
  },
  {
    icon: <Share2 size={20} />,
    title: "⑤ SNS にシェアする",
    desc: "本の詳細画面を下にスクロールすると「この本をシェアする」ボタンがあります。タイトル・評価・感想を含めた文章をSNSや LINE に投稿できます。",
  },
  {
    icon: <BarChart3 size={20} />,
    title: "⑥ 読書記録を分析する",
    desc: "下のナビバーから「分析」を開くと、登録冊数・ジャンル構成・月ごとの読書推移が確認できます。",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen pb-16 pt-8 bg-navy-950">
      {/* Header */}
      <header className="px-6 mb-8 flex items-center gap-4">
        <Link
          href="/"
          className="p-2 bg-navy-900 border border-slate-700/50 rounded-2xl"
          style={{ touchAction: "manipulation" }}
        >
          <ArrowLeft size={20} className="text-slate-400" />
        </Link>
        <h1 className="text-xl font-serif font-bold text-slate-100 italic">使い方ガイド</h1>
      </header>

      {/* Intro */}
      <section className="px-6 mb-8">
        <div className="bg-gold-500/10 border border-gold-500/30 rounded-3xl p-5">
          <p className="text-gold-400 text-[10px] font-bold uppercase tracking-widest mb-2">BOOK MEMORIES</p>
          <p className="text-slate-300 text-sm leading-relaxed font-serif">
            本の表紙を撮るだけで、AIが書籍情報を自動で登録します。読書の記録・感想・評価をかんたんに残しましょう。
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="bg-navy-900/60 border border-slate-700/50 rounded-3xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gold-500/10 rounded-xl text-gold-500 border border-gold-500/20">
                {step.icon}
              </div>
              <h2 className="text-slate-100 font-serif font-bold text-base">{step.title}</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </section>

      {/* Tips */}
      <section className="px-6 mt-8">
        <div className="bg-navy-900/60 border border-slate-700/50 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Edit3 size={16} className="text-slate-400" />
            <h2 className="text-slate-300 font-bold text-sm uppercase tracking-widest">Tips</h2>
          </div>
          <ul className="space-y-2 text-slate-400 text-sm leading-relaxed list-disc list-inside">
            <li>撮影がうまくいかない場合はギャラリーから表紙画像を選択できます</li>
            <li>AIの読み取り結果は登録前に修正できます</li>
            <li>登録した本はあなた専用のライブラリに保存されます（他の人には見えません）</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
