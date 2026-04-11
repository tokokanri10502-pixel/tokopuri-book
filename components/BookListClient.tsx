"use client";

import React, { useState, useMemo } from "react";
import {
  Camera,
  BookOpen,
  CheckCircle2,
  Clock,
  Search,
  X,
  BarChart3,
  ChevronRight,
  Plus,
  Bookmark,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Book, BookStatus } from "@/lib/types";

type SortKey = "newest" | "oldest" | "title";

export default function BookListClient({ books }: { books: Book[] }) {
  const [filter, setFilter] = useState<BookStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filteredBooks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books
      .filter((b) => filter === "all" || b.status === filter)
      .filter(
        (b) =>
          !q ||
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sort === "title")  return a.title.localeCompare(b.title, "ja");
        return 0;
      });
  }, [books, filter, search, sort]);

  const doneCount = books.filter((b) => b.status === "done").length;

  return (
    <div className="flex flex-col pb-28 min-h-screen bg-tokopuri-cream">

      {/* ---- ヘッダー ---- */}
      <header className="px-5 pt-8 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-tokopuri-magenta font-rounded font-bold text-xs tracking-widest uppercase">
              とこぷりブック
            </p>
            <h1 className="text-3xl font-rounded font-black text-tokopuri-black leading-tight">
              ほんだな
              <span className="text-tokopuri-yellow">📚</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href="/help" className="flex flex-col items-center gap-0.5 p-2">
              <HelpCircle size={22} className="text-tokopuri-black/40" />
              <span className="text-[9px] font-rounded font-bold text-tokopuri-black/40">つかいかた</span>
            </Link>
            <Link href="/analysis" className="flex flex-col items-center gap-0.5 p-2">
              <BarChart3 size={22} className="text-tokopuri-cyan" />
              <span className="text-[9px] font-rounded font-bold text-tokopuri-cyan">きろく</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ---- よんだ冊数バナー ---- */}
      <section className="px-5 mb-5">
        <div className="rounded-4xl bg-tokopuri-yellow/20 border-2 border-tokopuri-yellow px-5 py-4 flex items-center gap-4">
          <img
            src="/characters/tokopuri_back.gif"
            alt="トコプリ"
            className="w-24 h-24 object-contain flex-shrink-0"
          />
          <div>
            <p className="font-rounded font-bold text-tokopuri-black text-sm">
              {doneCount === 0
                ? "さいしょの1さつを よもう！ほわ。"
                : `${doneCount}さつ よみました！ほわ。`}
            </p>
            {doneCount > 0 && (
              <p className="font-rounded text-tokopuri-black/50 text-xs mt-0.5">
                つぎは {Math.ceil(doneCount / 3) * 3} さつ めざそう！
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---- 統計カード ---- */}
      <section className="px-5 grid grid-cols-3 gap-3 mb-6">
        <StatsCard
          icon={<CheckCircle2 size={20} />}
          count={books.filter((b) => b.status === "done").length}
          label="よんだ"
          bg="bg-tokopuri-yellow/20"
          iconColor="text-tokopuri-yellow"
        />
        <StatsCard
          icon={<BookOpen size={20} />}
          count={books.filter((b) => b.status === "reading").length}
          label="よんでる"
          bg="bg-tokopuri-cyan/15"
          iconColor="text-tokopuri-cyan"
        />
        <StatsCard
          icon={<Clock size={20} />}
          count={books.filter((b) => b.status === "plan").length}
          label="よみたい"
          bg="bg-tokopuri-magenta/10"
          iconColor="text-tokopuri-magenta"
        />
      </section>

      {/* ---- ウェルカムメッセージ（初回）---- */}
      {books.length === 0 && (
        <section className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-kids text-center py-8"
          >
            <img
              src="/characters/tokopuri_wink.gif"
              alt="トコプリ"
              className="w-24 h-24 object-contain mx-auto mb-4"
            />
            <p className="font-rounded font-black text-xl text-tokopuri-black mb-2">
              よんだ本をきろくしよう！
            </p>
            <p className="font-rounded text-tokopuri-black/60 text-sm leading-relaxed">
              みぎしたのカメラボタンをおして<br />
              えほんのひょうしをさつえいしてね。
            </p>
          </motion.div>
        </section>
      )}

      {/* ---- フィルタータブ ---- */}
      <section className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterTab active={filter === "all"}     onClick={() => setFilter("all")}     label="ぜんぶ"    color="yellow" />
          <FilterTab active={filter === "done"}    onClick={() => setFilter("done")}    label="よんだ"    color="yellow" />
          <FilterTab active={filter === "reading"} onClick={() => setFilter("reading")} label="よんでる"  color="cyan" />
          <FilterTab active={filter === "plan"}    onClick={() => setFilter("plan")}    label="よみたい"  color="magenta" />
        </div>
      </section>

      {/* ---- 検索 ---- */}
      <section className="px-5 mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-tokopuri-black/30 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトル・著者でさがす..."
            className="w-full bg-white border-2 border-tokopuri-yellow/30 rounded-3xl pl-10 pr-10 py-3 text-base text-tokopuri-black placeholder:text-tokopuri-black/30 focus:outline-none focus:border-tokopuri-yellow font-rounded transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-tokopuri-black/30 hover:text-tokopuri-black/60"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* ---- 本リスト ---- */}
      <section className="px-5">
        <AnimatePresence mode="popLayout">
          {filteredBooks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredBooks.map((book, idx) => (
                <Link key={book.id} href={`/book/${book.id}`}>
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.04 }}
                    className="card-kids flex gap-4 items-center active:scale-[0.98] transition-transform"
                  >
                    {/* 表紙 */}
                    <div className="w-14 h-20 flex-shrink-0 bg-tokopuri-yellow/10 rounded-2xl overflow-hidden shadow-md border-2 border-tokopuri-yellow/20 relative">
                      {book.cover_url ? (
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
                      )}
                      {/* ステータスバッジ */}
                      <StatusDot status={book.status} />
                    </div>

                    <div className="flex-grow min-w-0">
                      <StatusLabel status={book.status} />
                      <h4 className="text-tokopuri-black font-rounded font-black text-base leading-tight truncate mt-0.5">
                        {book.title}
                      </h4>
                      <p className="text-tokopuri-black/50 text-sm font-rounded truncate mt-0.5">
                        {book.author}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-tokopuri-yellow flex-shrink-0" />
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 flex flex-col items-center gap-4 opacity-50"
            >
              <Bookmark size={48} className="text-tokopuri-yellow" />
              <p className="font-rounded font-bold text-tokopuri-black text-center">
                {search ? `「${search}」はまだないよ` : "まだきろくがないよ"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---- スキャンボタン（FAB）---- */}
      <Link href="/scan" className="fixed bottom-6 right-5 z-40">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="w-18 h-18 bg-tokopuri-yellow rounded-full flex items-center justify-center shadow-xl shadow-tokopuri-yellow/40 border-4 border-white relative"
          style={{ width: 72, height: 72 }}
        >
          <Camera size={30} className="text-tokopuri-black" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-tokopuri-magenta rounded-full flex items-center justify-center border-2 border-white">
            <Plus size={14} className="text-white" />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

// ---- サブコンポーネント ----

function StatsCard({
  icon, count, label, bg, iconColor,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  bg: string;
  iconColor: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-4 rounded-3xl ${bg} border border-white/60`}>
      <div className={`mb-1 ${iconColor}`}>{icon}</div>
      <span className="text-2xl font-rounded font-black text-tokopuri-black">{count}</span>
      <span className="text-[11px] font-rounded font-bold text-tokopuri-black/60 mt-0.5">{label}</span>
    </div>
  );
}

function FilterTab({
  active, label, onClick, color,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  color: "yellow" | "cyan" | "magenta";
}) {
  const colorMap = {
    yellow:  { active: "bg-tokopuri-yellow text-tokopuri-black border-tokopuri-yellow",   inactive: "bg-white border-tokopuri-yellow/30 text-tokopuri-black/50" },
    cyan:    { active: "bg-tokopuri-cyan text-white border-tokopuri-cyan",               inactive: "bg-white border-tokopuri-cyan/30 text-tokopuri-black/50" },
    magenta: { active: "bg-tokopuri-magenta text-white border-tokopuri-magenta",         inactive: "bg-white border-tokopuri-magenta/30 text-tokopuri-black/50" },
  };
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-rounded font-bold border-2 whitespace-nowrap transition-all active:scale-95 ${
        active ? colorMap[color].active : colorMap[color].inactive
      }`}
    >
      {label}
    </button>
  );
}

function StatusDot({ status }: { status: BookStatus }) {
  if (status === "reading") return <div className="absolute top-1 left-1 w-3 h-3 bg-tokopuri-cyan rounded-full ring-2 ring-white" />;
  if (status === "done")    return <div className="absolute top-1 left-1 w-3 h-3 bg-tokopuri-yellow rounded-full ring-2 ring-white" />;
  return null;
}

function StatusLabel({ status }: { status: BookStatus }) {
  const map: Record<BookStatus, { label: string; color: string }> = {
    done:    { label: "よんだ",   color: "text-tokopuri-yellow" },
    reading: { label: "よんでる", color: "text-tokopuri-cyan" },
    plan:    { label: "よみたい", color: "text-tokopuri-magenta" },
  };
  return (
    <span className={`text-[11px] font-rounded font-bold ${map[status].color}`}>
      {map[status].label}
    </span>
  );
}
