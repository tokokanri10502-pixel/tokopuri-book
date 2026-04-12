"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Camera,
  X,
  Upload,
  ArrowLeft,
  BookMarked,
  Check,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookStatus } from "@/lib/types";
import { CharacterAnimation, AnimationType } from "@/components/CharacterAnimation";

type ScanResult = {
  title: string;
  author: string;
  publisher?: string;
  genre?: string;
  isbn?: string;
  description?: string;
  cover_url: string;
};

// 3の倍数達成時：50%で通常プリン/裏プリン分岐
function getMilestoneType(): AnimationType {
  return Math.random() < 0.5 ? "milestone_normal" : "milestone_ura";
}

// 通常登録：ウィンク/笑顔ランダム
function getNormalType(): AnimationType {
  return Math.random() < 0.5 ? "wink" : "smile";
}

export default function ScanPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BookStatus>("done");
  const [animation, setAnimation] = useState<{ show: boolean; type: AnimationType }>({
    show: false,
    type: "wink",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const startScan = async (base64Image: string) => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setScanResult({
        title:       data.title       || "タイトル不明",
        author:      data.author      || "著者不明",
        publisher:   data.publisher   || "",
        genre:       data.genre       || "",
        isbn:        data.isbn        || "",
        description: data.description || data.summary || "",
        cover_url:   data.cover_url   || base64Image,
      });
      if (data.cover_url) setImage(data.cover_url);
    } catch (err) {
      console.error("Scan error:", err);
      setScanResult({
        title: "よみとれなかったよ…",
        author: "もういちどためしてね",
        publisher: "",
        cover_url: base64Image,
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1600;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL("image/jpeg", 0.92);
      URL.revokeObjectURL(objectUrl);
      setImage(compressed);
      startScan(compressed);
    };
    img.src = objectUrl;
  };

  const handleRegister = async () => {
    if (!scanResult) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       scanResult.title,
          author:      scanResult.author,
          publisher:   scanResult.publisher,
          genre:       scanResult.genre,
          isbn:        scanResult.isbn,
          description: scanResult.description,
          cover_url:   scanResult.cover_url,
          status:      selectedStatus,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "登録に失敗しました");

      // ---- MilestoneChecker ----
      const countRes = await fetch("/api/books/count");
      const { count } = await countRes.json();

      const type: AnimationType =
        count % 3 === 0 ? getMilestoneType() : getNormalType();

      setAnimation({ show: true, type });
    } catch (err: unknown) {
      console.error("Register error:", err);
      const msg = err instanceof Error ? err.message : "登録に失敗しました";
      alert(`登録に失敗しました: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnimationClose = useCallback(() => {
    setAnimation((prev) => ({ ...prev, show: false }));
    window.location.href = "/";
  }, []);

  const reset = () => {
    setImage(null);
    setScanResult(null);
    setIsScanning(false);
    setSelectedStatus("done");
  };

  return (
    <div className="flex flex-col min-h-screen bg-tokopuri-cream text-tokopuri-black">

      {/* キャラクター演出 */}
      <CharacterAnimation
        type={animation.type}
        show={animation.show}
        onClose={handleAnimationClose}
      />

      {/* ---- ナビ ---- */}
      <nav className="px-5 pt-6 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="p-3 bg-white border-2 border-tokopuri-yellow/40 rounded-2xl"
          style={{ touchAction: "manipulation" }}
        >
          <ArrowLeft size={20} className="text-tokopuri-black" />
        </Link>
        <span className="font-rounded font-black text-xl text-tokopuri-black">
          ほんをとうろく
        </span>
        <button onClick={reset} className="p-3 text-tokopuri-black/30 hover:text-tokopuri-black/60">
          <X size={20} />
        </button>
      </nav>

      <main className="flex-grow flex flex-col items-center px-5 pt-4">
        <AnimatePresence mode="wait">

          {/* ---- 初期状態 ---- */}
          {!image && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center"
            >
              {/* トコプリのヒント */}
              <div className="flex flex-col items-center mb-6 text-center">
                <img
                  src="/characters/tokopuri_walk.gif"
                  alt="トコプリ"
                  className="w-36 h-36 object-contain mb-3"
                />
                <p className="font-rounded font-bold text-tokopuri-black text-lg">
                  ひょうしをさつえいしてね！
                </p>
                <p className="font-rounded text-tokopuri-black/50 text-sm mt-1">
                  AIがほんのなまえをよみとるよ。ほわ。
                </p>
              </div>

              {/* 撮影エリア */}
              <div className="w-52 h-64 bg-white border-4 border-dashed border-tokopuri-yellow/50 rounded-4xl flex flex-col items-center justify-center mb-8 relative overflow-hidden">
                <div className="p-5 bg-tokopuri-yellow/10 rounded-full mb-3 animate-float">
                  <Camera size={48} className="text-tokopuri-yellow" />
                </div>
                <p className="font-rounded text-tokopuri-black/40 text-sm text-center px-4">
                  ここにひょうしを<br />うつしてね
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-kids-primary w-full"
                >
                  <Camera size={24} /> さつえいする
                </button>
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 py-3 text-tokopuri-cyan font-rounded font-bold text-base"
                >
                  <Upload size={18} /> アルバムからえらぶ
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>
            </motion.div>
          )}

          {/* ---- スキャン中 ---- */}
          {image && isScanning && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-52 h-64 bg-white rounded-4xl overflow-hidden border-4 border-tokopuri-yellow relative shadow-xl">
                <img src={image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1.5 bg-tokopuri-yellow/80 shadow-[0_0_12px_rgba(245,200,66,0.9)] z-20"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                  <div className="flex flex-col items-center gap-3">
                    <img src="/characters/tokopuri_walk.gif" alt="よみとり中" className="w-16 h-16 object-contain" />
                    <span className="font-rounded font-bold text-tokopuri-black text-sm bg-white/80 px-4 py-1.5 rounded-full">
                      よみとり中…ほわ。
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-6 font-rounded font-bold text-tokopuri-black/60 text-center">
                ほんのじょうほうをさがしているよ
              </p>
            </motion.div>
          )}

          {/* ---- スキャン結果 ---- */}
          {scanResult && !isScanning && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="w-full card-kids border-2 border-tokopuri-yellow/40 overflow-hidden relative mb-4">
                {/* 成功バッジ */}
                <div className="absolute -top-1 -right-1 p-2.5 bg-tokopuri-yellow rounded-bl-3xl shadow ring-4 ring-tokopuri-cream">
                  <Check size={18} className="text-tokopuri-black" />
                </div>

                <div className="flex gap-4 items-start mb-5">
                  <div className="w-20 h-28 flex-shrink-0 bg-tokopuri-yellow/10 rounded-2xl overflow-hidden shadow border-2 border-tokopuri-yellow/20">
                    {scanResult.cover_url ? (
                      <img src={image!} alt="表紙" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">📖</div>
                    )}
                  </div>
                  <div className="flex-grow pt-1">
                    <p className="text-[10px] text-tokopuri-magenta font-rounded font-bold uppercase tracking-wider mb-2">
                      よみとれたよ！
                    </p>
                    <input
                      value={scanResult.title}
                      onChange={(e) => setScanResult({ ...scanResult, title: e.target.value })}
                      className="w-full bg-transparent text-lg font-rounded font-black text-tokopuri-black leading-tight mb-1.5 border-b-2 border-tokopuri-yellow/30 focus:border-tokopuri-yellow focus:outline-none transition-colors"
                    />
                    <input
                      value={scanResult.author}
                      onChange={(e) => setScanResult({ ...scanResult, author: e.target.value })}
                      className="w-full bg-transparent text-sm font-rounded text-tokopuri-black/60 border-b border-tokopuri-yellow/20 focus:border-tokopuri-yellow focus:outline-none transition-colors"
                      placeholder="著者名"
                    />
                  </div>
                </div>

                {/* ---- ステータス選択 ---- */}
                <div className="mb-5">
                  <p className="text-xs text-tokopuri-black/40 font-rounded font-bold mb-3">
                    どうだった？
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <StatusBtn
                      active={selectedStatus === "done"}
                      onClick={() => setSelectedStatus("done")}
                      emoji="✅"
                      label="よんだ"
                      color="yellow"
                    />
                    <StatusBtn
                      active={selectedStatus === "reading"}
                      onClick={() => setSelectedStatus("reading")}
                      emoji="📖"
                      label="よんでる"
                      color="cyan"
                    />
                    <StatusBtn
                      active={selectedStatus === "plan"}
                      onClick={() => setSelectedStatus("plan")}
                      emoji="🔖"
                      label="よみたい"
                      color="magenta"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleRegister}
                    disabled={isSaving}
                    className="btn-kids-primary w-full disabled:opacity-60"
                  >
                    {isSaving ? (
                      <><Loader2 size={22} className="animate-spin" /> とうろく中…</>
                    ) : (
                      <><BookMarked size={22} /> ほんだなにとうろく！</>
                    )}
                  </button>
                  <button onClick={reset} className="btn-kids-secondary w-full">
                    <RefreshCcw size={18} /> やりなおす
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StatusBtn({
  active, onClick, emoji, label, color,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  color: "yellow" | "cyan" | "magenta";
}) {
  const colorMap = {
    yellow:  { active: "bg-tokopuri-yellow border-tokopuri-yellow text-tokopuri-black",   inactive: "bg-white border-tokopuri-yellow/30 text-tokopuri-black/50" },
    cyan:    { active: "bg-tokopuri-cyan border-tokopuri-cyan text-white",               inactive: "bg-white border-tokopuri-cyan/30 text-tokopuri-black/50" },
    magenta: { active: "bg-tokopuri-magenta border-tokopuri-magenta text-white",         inactive: "bg-white border-tokopuri-magenta/30 text-tokopuri-black/50" },
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 py-3 rounded-3xl border-2 font-rounded font-bold text-sm transition-all active:scale-95 ${
        active ? colorMap[color].active : colorMap[color].inactive
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      {label}
    </button>
  );
}
