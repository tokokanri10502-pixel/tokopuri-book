"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  BookOpen,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Plus,
  ArrowLeft,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Book, BookStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getBooks } from "@/lib/books";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<BookStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) => {
    const matchesFilter = filter === "all" || b.status === filter;
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen pb-32 pt-8 bg-navy-950">
      {/* --- HEADER --- */}
      <header className="px-6 mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="p-2 bg-navy-900 border border-slate-700/50 rounded-2xl hover:bg-navy-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-400" />
        </Link>
        <h1 className="text-xl font-serif font-black text-slate-100 tracking-tight">
          蔵書ライブラリ
        </h1>
        <Link
          href="/scan"
          className="p-2 bg-gold-500/10 border border-gold-500/30 rounded-2xl hover:bg-gold-500/20 text-gold-500 transition-all"
        >
          <Plus size={20} />
        </Link>
      </header>

      {/* --- SEARCH BOX --- */}
      <section className="px-6 mb-8">
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-hover:text-gold-500"
          />
          <input
            type="text"
            placeholder="タイトル、著者、キーワード..."
            className="w-full bg-navy-900/40 border border-slate-800 rounded-3xl py-4 pl-12 pr-12 focus:outline-none focus:border-gold-500/30 text-slate-100 placeholder:text-slate-700 font-sans tracking-wide transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-800 rounded-full text-slate-400 hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </section>

      {/* --- FILTER CHIPS --- */}
      <section className="px-6 mb-8 overflow-x-auto no-scrollbar pb-2">
        <div className="flex gap-3">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="すべて"
            icon={<Filter size={14} />}
          />
          <FilterChip
            active={filter === "reading"}
            onClick={() => setFilter("reading")}
            label="読書中"
            icon={<BookOpen size={14} />}
          />
          <FilterChip
            active={filter === "done"}
            onClick={() => setFilter("done")}
            label="読了"
            icon={<CheckCircle2 size={14} />}
          />
          <FilterChip
            active={filter === "plan"}
            onClick={() => setFilter("plan")}
            label="積読"
            icon={<Bookmark size={14} />}
          />
        </div>
      </section>

      {/* --- GRID --- */}
      <section className="px-6 flex-grow">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4 opacity-40">
            <Loader2 size={40} className="text-gold-500 animate-spin" />
            <p className="text-slate-400 font-serif italic">読み込み中...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredBooks.map((book, idx) => (
                  <motion.div
                    key={book.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Link href={`/book/${book.id}`} className="block">
                      <div className="w-full aspect-[2/3] bg-navy-900 rounded-[30px] overflow-hidden shadow-xl border border-slate-700/50 relative mb-3 ring-4 ring-transparent group-hover:ring-gold-500/10 transition-all duration-500">
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div
                          className={`absolute top-4 right-4 p-1.5 rounded-xl shadow-lg ring-2 ring-navy-950/50 backdrop-blur-md ${
                            book.status === "reading"
                              ? "bg-emerald-500 text-navy-950"
                              : book.status === "done"
                              ? "bg-gold-500 text-navy-950"
                              : "bg-slate-700 text-slate-100"
                          }`}
                        >
                          {book.status === "reading" ? (
                            <BookOpen size={12} />
                          ) : book.status === "done" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Bookmark size={12} />
                          )}
                        </div>
                      </div>
                      <div className="px-1 text-center relative">
                        <h3 className="text-slate-100 font-serif font-bold text-sm leading-snug truncate mb-0.5 pr-1 group-hover:text-gold-400 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-sans tracking-widest truncate uppercase opacity-60 mb-1">
                          {book.author}
                        </p>
                        <div className="flex items-center justify-center gap-1 text-[9px] text-slate-600 font-sans tracking-tighter opacity-80">
                          <Clock size={10} />
                          <span>{formatDate(book.created_at)}</span>
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight size={14} className="text-gold-500" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 flex flex-col items-center justify-center text-center opacity-30"
              >
                <Search size={48} className="mb-4 text-slate-500" />
                <p className="text-slate-400 font-serif italic text-lg">
                  一致する記録が見つかりませんでした。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </div>
  );
}

function FilterChip({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap border shadow-sm ${
        active
          ? "bg-gold-500 text-navy-950 border-gold-400 shadow-gold-500/20 ring-4 ring-gold-500/10 scale-105"
          : "bg-navy-900 border-slate-800 text-slate-500 hover:text-slate-300 active:scale-95"
      }`}
    >
      <span className={active ? "scale-110" : "opacity-60"}>{icon}</span>
      {label}
    </button>
  );
}
