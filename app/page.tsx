"use client";

import React, { useState } from "react";
import { 
  Camera, 
  BookOpen, 
  Library, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronRight, 
  Plus, 
  BarChart3,
  CheckCircle2,
  Clock,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Book, BookStatus } from "@/lib/types";

// Mock data (Phase 1 initially)
const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "星の声",
    author: "新海 誠",
    cover_url: "https://books.google.com/books/content?id=0Xo2DwAAQBAJ&printsec=frontcover&img=1&zoom=1",
    status: "reading",
    user_id: "user1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "嫌われる勇気",
    author: "岸見 一郎 / 古賀 史健",
    cover_url: "https://books.google.com/books/content?id=qK6eBAAAQBAJ&printsec=frontcover&img=1&zoom=1",
    status: "done",
    user_id: "user1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function Dashboard() {
  const [filter, setFilter] = useState<BookStatus | "all">("all");
  const filteredBooks = MOCK_BOOKS.filter(b => filter === "all" || b.status === filter);

  return (
    <div className="flex flex-col min-h-screen pb-32 pt-8">
      {/* --- HEADER --- */}
      <header className="px-6 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-slate-400 text-sm font-medium tracking-widest uppercase mb-1 drop-shadow-sm font-sans">
            Personal Library
          </h2>
          <h1 className="text-3xl font-serif font-bold text-slate-50 drop-shadow-md tracking-tight">
            BOOK <span className="text-gold-500">MEMORIES</span>
          </h1>
        </div>
        <div className="flex -space-x-3 mb-1">
          <div className="w-8 h-8 rounded-full border-2 border-navy-950 bg-gold-400 flex items-center justify-center text-[10px] font-bold text-navy-950">OM</div>
        </div>
      </header>

      {/* --- STATS SUMARY --- */}
      <section className="px-6 grid grid-cols-4 gap-3 mb-10">
        <StatsCard icon={<Library size={18} />} count={MOCK_BOOKS.length} label="合計" color="bg-slate-700/30" />
        <StatsCard icon={<BookOpen size={18} />} count={MOCK_BOOKS.filter(b => b.status === "reading").length} label="読書中" color="bg-emerald-500/10 text-emerald-400" />
        <StatsCard icon={<CheckCircle2 size={18} />} count={MOCK_BOOKS.filter(b => b.status === "done").length} label="読了" color="bg-gold-500/10 text-gold-500" />
        <StatsCard icon={<Clock size={18} />} count={MOCK_BOOKS.filter(b => b.status === "plan").length} label="積読" color="bg-slate-800/30" />
      </section>

      {/* --- AI CONCIERGE MESSAGE --- */}
      <section className="px-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium relative overflow-hidden group border-gold-500/20 shadow-gold-900/10"
        >
          {/* Subtle bg glow */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold-500/10 rounded-full blur-3xl group-hover:bg-gold-500/20 transition-all duration-700"></div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl shadow-lg ring-4 ring-gold-500/10 animate-float">
              <Sparkles size={22} className="text-navy-900" />
            </div>
            <div>
              <p className="text-gold-400 text-xs font-bold font-sans uppercase tracking-widest mb-1.5 opacity-80">AI Insight — 14 March</p>
              <h3 className="text-slate-100 font-serif font-semibold text-lg leading-snug mb-2">
                読書習慣の土台ができてきましたね。
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
                5冊登録まであと3冊です。過去の記録からは『自己啓発』への興味が見えます。
              </p>
            </div>
          </div>
          
          <button className="absolute top-4 right-4 text-slate-600 hover:text-slate-400 p-1">
             <ChevronRight size={20} />
          </button>
        </motion.div>
      </section>

      {/* --- FILTER TABS --- */}
      <section className="px-6 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
           <FilterTab active={filter === "all"} onClick={() => setFilter("all")} label="すべて" />
           <FilterTab active={filter === "reading"} onClick={() => setFilter("reading")} label="読書中" />
           <FilterTab active={filter === "done"} onClick={() => setFilter("done")} label="読了済" />
           <FilterTab active={filter === "plan"} onClick={() => setFilter("plan")} label="積読" />
        </div>
      </section>

      {/* --- BOOK LIST --- */}
      <section className="px-6 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredBooks.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredBooks.map((book, idx) => (
                <Link key={book.id} href={`/book/${book.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card-premium flex gap-4 items-center group active:scale-[0.98] transition-transform"
                  >
                    <div className="w-16 h-24 flex-shrink-0 bg-navy-800 rounded-xl overflow-hidden shadow-xl border border-slate-700/50 relative">
                       <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       {book.status === "reading" && (
                         <div className="absolute top-1 left-1 bg-emerald-500 w-2 h-2 rounded-full ring-2 ring-navy-900 shadow-lg shadow-emerald-500/40"></div>
                       )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] text-slate-500 font-sans uppercase tracking-[0.2em] mb-1">
                        {book.status === "reading" ? "現在読書中" : "ライブラリ"}
                      </p>
                      <h4 className="text-slate-100 font-serif font-bold text-lg leading-tight truncate mb-1">
                        {book.title}
                      </h4>
                      <p className="text-slate-400 text-sm font-sans opacity-80 truncate">
                        {book.author}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-slate-600 group-hover:text-gold-500 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-16 flex flex-col items-center justify-center opacity-40 text-center"
            >
               <Bookmark size={48} className="mb-4 text-slate-600" />
               <p className="text-slate-500 font-serif italic font-medium">まだ記録がありません</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- FLOATING SCAN BUTTON --- */}
      <Link href="/scan" className="fixed bottom-24 right-5 z-40">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-2xl shadow-gold-500/40 border-4 border-navy-950/20 relative"
        >
          <Camera size={28} className="text-navy-950" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-navy-900 rounded-full flex items-center justify-center border-2 border-gold-500 group">
             <Plus size={12} className="text-gold-500 group-hover:rotate-90 transition-transform" />
          </div>
        </motion.div>
      </Link>

      {/* --- BOTTOM NAV --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-navy-950/80 backdrop-blur-2xl border-t border-slate-800/80 px-6 flex items-center justify-around z-50">
        <NavBtn href="/" icon={<Library size={24} />} active label="ホーム" />
        <NavBtn href="/analysis" icon={<BarChart3 size={24} />} label="分析" />
      </nav>
    </div>
  );
}

function StatsCard({ icon, count, label, color }: { icon: React.ReactNode, count: number, label: string, color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl ${color} border border-slate-800/50 shadow-inner backdrop-blur-sm group hover:scale-105 transition-transform cursor-pointer`}>
      <div className="mb-1 opacity-60 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-xl font-bold font-sans tracking-tight">{count}</span>
      <span className="text-[10px] uppercase opacity-40 tracking-wider mt-0.5">{label}</span>
    </div>
  );
}

function FilterTab({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${active ? "bg-gold-500/10 border-gold-500/50 text-gold-500 shadow-lg shadow-gold-900/10" : "bg-navy-900/40 border-slate-800 text-slate-500 hover:text-slate-300"}`}
    >
      {label}
    </button>
  );
}

function NavBtn({ href, icon, active, label }: { href: string, icon: React.ReactNode, active?: boolean, label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 group">
      <div className={`p-2.5 rounded-2xl transition-all ${active ? "bg-gold-500/15 text-gold-500 shadow-md shadow-gold-500/10 ring-1 ring-gold-500/30" : "text-slate-600 hover:text-slate-400"}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold font-sans uppercase tracking-[0.2em] transition-colors ${active ? "text-gold-500" : "text-slate-600"}`}>
        {label}
      </span>
    </Link>
  );
}
