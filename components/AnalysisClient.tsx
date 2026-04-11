"use client";

import React from "react";
import { BarChart3, BookOpen, ArrowLeft, Camera } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
} from "recharts";
import { Book } from "@/lib/types";

// CMYKカラーパレット
const GENRE_COLORS = ["#F5C842", "#E8457A", "#4BBFCD", "#f5a623", "#a855f7", "#94a3b8"];

type GenreEntry = { name: string; value: number; color: string };
type MonthEntry = { name: string; books: number };

function buildGenreData(books: Book[]): GenreEntry[] {
  const map: Record<string, number> = {};
  books.forEach((b) => {
    const key = b.genre || "その他";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).map(([name, value], i) => ({
    name, value, color: GENRE_COLORS[i % GENRE_COLORS.length],
  }));
}

function buildMonthlyData(books: Book[]): MonthEntry[] {
  const now = new Date();
  const months: MonthEntry[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ name: `${d.getMonth() + 1}月`, books: 0 });
  }
  books.forEach((b) => {
    const d = new Date(b.created_at);
    for (let i = 0; i < 6; i++) {
      const ref = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      if (d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()) {
        months[i].books += 1;
        break;
      }
    }
  });
  return months;
}

export default function AnalysisClient({ books }: { books: Book[] }) {
  const genreData = buildGenreData(books);
  const monthlyData = buildMonthlyData(books);
  const doneCount    = books.filter((b) => b.status === "done").length;
  const readingCount = books.filter((b) => b.status === "reading").length;
  const planCount    = books.filter((b) => b.status === "plan").length;
  const thisMonth    = monthlyData[monthlyData.length - 1]?.books ?? 0;

  return (
    <div className="flex flex-col min-h-screen pb-28 bg-tokopuri-cream">

      {/* ---- ヘッダー ---- */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/"
          className="p-3 bg-white border-2 border-tokopuri-yellow/40 rounded-2xl"
          style={{ touchAction: "manipulation" }}
        >
          <ArrowLeft size={20} className="text-tokopuri-black" />
        </Link>
        <h1 className="font-rounded font-black text-xl text-tokopuri-black">
          よんだきろく
        </h1>
        <div className="w-12" />
      </header>

      {/* ---- トコプリバナー ---- */}
      <section className="px-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-4xl bg-tokopuri-yellow/20 border-2 border-tokopuri-yellow px-5 py-4 flex items-center gap-4"
        >
          <img
            src={books.length > 0 ? "/characters/tokopuri_smile.gif" : "/characters/tokopuri_walk.gif"}
            alt="トコプリ"
            className="w-24 h-24 object-contain flex-shrink-0"
          />
          <div>
            {books.length > 0 ? (
              <>
                <p className="font-rounded font-black text-tokopuri-black text-lg leading-snug">
                  {books.length}さつ きろくしたよ！ほわ。
                </p>
                <p className="font-rounded text-tokopuri-black/60 text-sm mt-0.5">
                  そのうち {doneCount}さつ よみました！
                </p>
              </>
            ) : (
              <>
                <p className="font-rounded font-black text-tokopuri-black text-base leading-snug">
                  ほんをとうろくすると<br />きろくがみえるよ！ほわ。
                </p>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* ---- 統計カード ---- */}
      <section className="px-5 mb-6 grid grid-cols-2 gap-3">
        <StatCard
          emoji="✅"
          label="よんだ"
          count={doneCount}
          bg="bg-tokopuri-yellow/15"
          accent="text-tokopuri-yellow"
          border="border-tokopuri-yellow/30"
        />
        <StatCard
          emoji="📖"
          label="よんでる"
          count={readingCount}
          bg="bg-tokopuri-cyan/10"
          accent="text-tokopuri-cyan"
          border="border-tokopuri-cyan/30"
        />
        <StatCard
          emoji="🔖"
          label="よみたい"
          count={planCount}
          bg="bg-tokopuri-magenta/10"
          accent="text-tokopuri-magenta"
          border="border-tokopuri-magenta/30"
        />
        <StatCard
          emoji="📅"
          label="こんげつ"
          count={thisMonth}
          bg="bg-white"
          accent="text-tokopuri-black"
          border="border-tokopuri-yellow/20"
        />
      </section>

      {/* ---- ジャンルグラフ ---- */}
      {genreData.length > 0 && (
        <section className="px-5 mb-6">
          <SectionTitle emoji="🍩" label="ジャンルべつ" />
          <div className="card-kids">
            <div className="w-full h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={75}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {genreData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFDF0",
                      borderRadius: "16px",
                      border: "2px solid #F5C842",
                      color: "#333333",
                      fontFamily: "var(--font-mplus-rounded)",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-rounded font-black text-3xl text-tokopuri-black">{books.length}</span>
                <span className="font-rounded font-bold text-tokopuri-black/50 text-xs">さつ</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {genreData.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                  <span className="font-rounded text-tokopuri-black/70 text-xs truncate">{g.name}</span>
                  <span className="font-rounded font-bold text-tokopuri-black/50 text-xs ml-auto">{g.value}さつ</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- 月次グラフ ---- */}
      <section className="px-5 mb-6">
        <SectionTitle emoji="📊" label="つきごとのきろく" />
        <div className="card-kids">
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barCategoryGap="30%">
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#333333", fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mplus-rounded)" }}
                  dy={8}
                />
                <Tooltip
                  cursor={{ fill: "rgba(245,200,66,0.1)" }}
                  contentStyle={{
                    backgroundColor: "#FFFDF0",
                    borderRadius: "16px",
                    border: "2px solid #F5C842",
                    color: "#333333",
                    fontFamily: "var(--font-mplus-rounded)",
                    fontWeight: "bold",
                  }}
                  formatter={(v) => [`${v}さつ`, "きろく"]}
                />
                <Bar dataKey="books" fill="#F5C842" radius={[10, 10, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-3 bg-tokopuri-yellow/15 rounded-3xl px-4 py-3 border border-tokopuri-yellow/30">
            <span className="text-2xl">🌟</span>
            <div>
              <p className="font-rounded font-bold text-tokopuri-black text-sm">こんげつのきろく</p>
              <p className="font-rounded font-black text-tokopuri-yellow text-lg">{thisMonth}さつ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- ほん追加ボタン ---- */}
      {books.length === 0 && (
        <section className="px-5 mb-6">
          <Link href="/scan">
            <div className="card-kids flex items-center gap-4 active:scale-[0.98] transition-transform border-2 border-tokopuri-yellow/40">
              <div className="p-3 bg-tokopuri-yellow/20 rounded-2xl">
                <Camera size={24} className="text-tokopuri-yellow" />
              </div>
              <div>
                <p className="font-rounded font-black text-tokopuri-black text-base">ほんをとうろくする</p>
                <p className="font-rounded text-tokopuri-black/50 text-sm">ひょうしをさつえいしてね</p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ---- ボトムナビ ---- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-tokopuri-cream/90 backdrop-blur-xl border-t-2 border-tokopuri-yellow/20 px-6 flex items-center justify-around z-50">
        <NavBtn href="/"         icon={<BookOpen  size={24} />} label="ほんだな" />
        <NavBtn href="/analysis" icon={<BarChart3 size={24} />} label="きろく"  active />
      </nav>
    </div>
  );
}

// ---- サブコンポーネント ----

function StatCard({
  emoji, label, count, bg, accent, border,
}: {
  emoji: string;
  label: string;
  count: number;
  bg: string;
  accent: string;
  border: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-5 rounded-4xl ${bg} border-2 ${border}`}>
      <span className="text-3xl mb-1">{emoji}</span>
      <span className={`font-rounded font-black text-3xl ${accent}`}>{count}</span>
      <span className="font-rounded font-bold text-tokopuri-black/60 text-sm mt-0.5">{label}</span>
    </div>
  );
}

function SectionTitle({ emoji, label }: { emoji: string; label: string }) {
  return (
    <h2 className="font-rounded font-black text-tokopuri-black text-lg mb-3 flex items-center gap-2">
      <span>{emoji}</span> {label}
    </h2>
  );
}

function NavBtn({ href, icon, active, label }: { href: string; icon: React.ReactNode; active?: boolean; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1" style={{ touchAction: "manipulation" }}>
      <div className={`p-2.5 rounded-2xl transition-all ${active
        ? "bg-tokopuri-yellow/20 text-tokopuri-yellow ring-2 ring-tokopuri-yellow/40"
        : "text-tokopuri-black/40"
      }`}>
        {icon}
      </div>
      <span className={`text-[11px] font-rounded font-bold transition-colors ${active ? "text-tokopuri-yellow" : "text-tokopuri-black/40"}`}>
        {label}
      </span>
    </Link>
  );
}
