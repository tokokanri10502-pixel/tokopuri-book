"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  BookOpen,
  Trash2,
  Check,
  Edit3,
  Tag,
  Calendar,
  CheckCircle2,
  Bookmark,
  Loader2,
  Share2,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Book, BookStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function BookDetailClient({ book: initialBook }: { book: Book }) {
  const router = useRouter();
  const [book, setBook] = useState(initialBook);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<BookStatus>(initialBook.status);
  const [rating, setRating] = useState(initialBook.rating || 0);
  const [review, setReview] = useState(initialBook.review || "");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rating: rating || null, review }),
      });
      if (!res.ok) throw new Error("保存に失敗しました");
      setBook({ ...book, status, rating, review });
      router.refresh();
      alert("ほんのきろくをほぞんしたよ！");
    } catch (error) {
      console.error("Save error:", error);
      alert("ほぞんできなかったよ…もういちどためしてね");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`「${book.title}」をほんだなからけすの？`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      window.location.href = "/";
    } catch (error) {
      console.error("Delete error:", error);
      alert("けせなかったよ…もういちどためしてね");
      setIsDeleting(false);
    }
  };

  const buildShareText = () => {
    const stars = rating ? "⭐".repeat(rating) : "";
    const statusLabel =
      status === "done" ? "よんだ" : status === "reading" ? "よんでる" : "よみたい";
    const lines = [
      `📚 ${book.title}`,
      `✍️ ${book.author}`,
      stars,
      `【${statusLabel}】`,
      review ? `\n${review}` : "",
      "\n#とこぷりブック #読書記録",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // キャンセル時は何もしない
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ステータス設定
  const STATUS_CONFIG = {
    done:    { label: "よんだ",   icon: <CheckCircle2 size={20} />, bg: "bg-tokopuri-yellow/20",  border: "border-tokopuri-yellow",  text: "text-tokopuri-black" },
    reading: { label: "よんでる", icon: <BookOpen size={20} />,     bg: "bg-tokopuri-cyan/20",    border: "border-tokopuri-cyan",    text: "text-tokopuri-cyan" },
    plan:    { label: "よみたい", icon: <Bookmark size={20} />,     bg: "bg-tokopuri-magenta/20", border: "border-tokopuri-magenta", text: "text-tokopuri-magenta" },
  };

  return (
    <div className="min-h-screen font-rounded pb-24" style={{ background: "linear-gradient(160deg, #FFFDF0 0%, #FFF8D6 60%, #FFFDF0 100%)" }}>

      {/* ---- ヘッダー ---- */}
      <header className="px-5 pt-8 pb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2.5 bg-white rounded-2xl shadow-sm border border-tokopuri-yellow/30"
          style={{ touchAction: "manipulation" }}
        >
          <ArrowLeft size={20} className="text-tokopuri-black" />
        </button>
        <span className="font-rounded font-black text-tokopuri-black text-lg">
          ほんのきろく
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2.5 bg-white rounded-2xl shadow-sm border border-red-200 text-red-400 disabled:opacity-40"
        >
          {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
        </button>
      </header>

      {/* ---- 表紙 & 基本情報 ---- */}
      <section className="px-5 mb-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-40 h-56 rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-5 flex-shrink-0"
        >
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="text-center w-full max-w-xs">
          <h1 className="font-rounded font-black text-tokopuri-black text-2xl leading-tight mb-1">
            {book.title}
          </h1>
          <p className="text-tokopuri-black/60 font-rounded font-medium text-sm mb-3">
            {book.author}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {book.genre && (
              <span className="flex items-center gap-1 px-3 py-1 bg-tokopuri-cyan/20 rounded-full text-xs font-bold text-tokopuri-cyan font-rounded">
                <Tag size={11} /> {book.genre}
              </span>
            )}
            <span className="flex items-center gap-1 px-3 py-1 bg-tokopuri-yellow/30 rounded-full text-xs font-bold text-tokopuri-black font-rounded">
              <Calendar size={11} /> {formatDate(book.created_at)}
            </span>
          </div>
        </div>
      </section>

      {/* ---- ステータス選択 ---- */}
      <section className="px-5 mb-6">
        <p className="font-rounded font-bold text-tokopuri-black/50 text-xs mb-2 ml-1">いまどんなほん？</p>
        <div className="grid grid-cols-3 gap-3">
          {(["done", "reading", "plan"] as BookStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const active = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex flex-col items-center justify-center py-3 rounded-2xl border-2 transition-all active:scale-95 gap-1.5
                  ${active ? `${cfg.bg} ${cfg.border} ${cfg.text}` : "bg-white border-gray-200 text-gray-400"}`}
              >
                {cfg.icon}
                <span className="font-rounded font-black text-xs">{cfg.label}</span>
                {active && (
                  <motion.div layoutId="status-dot" className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ---- 評価 & レビュー ---- */}
      <section className="px-5 mb-6">
        <div className="bg-white rounded-4xl shadow-sm border border-tokopuri-yellow/20 p-5 space-y-5">

          {/* 星評価 */}
          <div>
            <p className="font-rounded font-bold text-tokopuri-black/50 text-xs mb-2">どのくらいよかった？</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  className={`transition-transform active:scale-90 ${s <= rating ? "text-tokopuri-yellow" : "text-gray-200"}`}
                >
                  <Star size={32} fill={s <= rating ? "currentColor" : "none"} strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>

          {/* 感想メモ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-rounded font-bold text-tokopuri-black/50 text-xs">かんそう・メモ</p>
              <Edit3 size={14} className="text-tokopuri-black/30" />
            </div>
            <textarea
              className="w-full bg-tokopuri-cream/50 border border-tokopuri-yellow/30 rounded-2xl p-4 font-rounded text-tokopuri-black text-sm leading-relaxed h-32 focus:outline-none focus:border-tokopuri-yellow transition-all placeholder:text-tokopuri-black/30 resize-none"
              placeholder="よんでどうだった？すきなところはどこ？"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 rounded-3xl font-rounded font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "#F5C842", color: "#333333" }}
          >
            {isSaving ? (
              <><Loader2 size={20} className="animate-spin" /> ほぞんちゅう…</>
            ) : (
              <><Check size={20} /> きろくをほぞんする</>
            )}
          </button>

          {/* シェアボタン */}
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-3xl font-rounded font-black text-base flex items-center justify-center gap-2 bg-white border-2 border-tokopuri-cyan text-tokopuri-cyan transition-all active:scale-95"
          >
            {copied ? (
              <><Copy size={18} /> コピーしたよ！</>
            ) : (
              <><Share2 size={18} /> このほんをシェアする</>
            )}
          </button>
        </div>
      </section>

      {/* ---- あらすじ ---- */}
      {book.description && (
        <section className="px-5">
          <p className="font-rounded font-bold text-tokopuri-black/50 text-xs mb-2 ml-1">このほんについて</p>
          <div className="bg-white rounded-4xl shadow-sm border border-tokopuri-yellow/20 p-5">
            <p className="font-rounded text-tokopuri-black/70 text-sm leading-relaxed">
              {book.description}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
