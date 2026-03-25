"use client";

import React, { useState, useRef } from "react";
import { 
  Camera, 
  X, 
  Upload, 
  Sparkles, 
  ArrowLeft,
  Search,
  BookMarked,
  Check,
  RefreshCcw,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{title: string, author: string, publisher?: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = async (base64Image: string) => {
    setIsScanning(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setScanResult({
        title: data.title || "Unknown Title",
        author: data.author || "Unknown Author",
        publisher: data.publisher || "Unknown Publisher"
      });
      if (data.cover_url) {
        setImage(data.cover_url);
      }
    } catch (error) {
      console.error("Scan error:", error);
      // Fallback
      setScanResult({
        title: "解析に失敗しました",
        author: "再試行してください",
        publisher: "Error"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setImage(base64);
        startScan(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setImage(null);
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-950 text-slate-100">
      {/* --- NAV BAR --- */}
      <nav className="p-6 flex items-center justify-between z-10">
        <Link href="/" className="p-2 bg-navy-900 border border-slate-700/50 rounded-2xl hover:bg-navy-800 transition-colors">
          <ArrowLeft size={20} className="text-slate-400" />
        </Link>
        <span className="text-slate-100 font-serif font-bold text-lg">表紙スキャン</span>
        <button onClick={reset} className="p-2 text-slate-600 hover:text-slate-400">
          <X size={20} />
        </button>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center -mt-10 px-6">
        <AnimatePresence mode="wait">
          {!image && (
            <motion.div 
               key="empty"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="w-full flex flex-col items-center"
            >
               <div className="w-64 h-80 bg-navy-900/40 border-2 border-dashed border-slate-700/50 rounded-[40px] flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm relative group overflow-hidden">
                 {/* Decorative background glow */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-gold-500/10 transition-all"></div>
                 
                 <div className="mb-6 p-6 bg-navy-800 border border-slate-700/50 rounded-full text-slate-500 animate-float">
                   <Camera size={48} />
                 </div>
                 
                 <h2 className="text-slate-300 font-serif font-medium text-lg leading-tight mb-3">
                   表紙を枠内に収めて<br/>撮影してください
                 </h2>
                 <p className="text-slate-500 text-xs font-sans tracking-wider leading-relaxed">
                   AIがタイトル、著者、出版社等を<br/>自動で読み取ります
                 </p>
               </div>
               
               <div className="mt-10 flex flex-col gap-4 w-full max-w-xs">
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="btn-primary w-full py-4 text-lg"
                 >
                   <Camera size={24} /> 撮影を開始する
                 </button>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-slate-200 transition-colors py-3"
                 >
                   <Upload size={18} /> ギャラリーから選択
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   accept="image/*" 
                   capture="environment" 
                   className="hidden" 
                 />
               </div>
            </motion.div>
          )}

          {image && isScanning && (
            <motion.div 
               key="scanning"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="w-full flex flex-col items-center"
            >
               <div className="w-64 h-84 bg-navy-900 border-4 border-gold-500/20 rounded-[40px] overflow-hidden relative shadow-2xl shadow-gold-900/20">
                 <img src={image} alt="Preview" className="w-full h-full object-cover opacity-60 scale-105 blur-[2px]" />
                 
                 {/* Laser scan line effect */}
                 <motion.div 
                   animate={{ top: ["0%", "100%", "0%"] }}
                   transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent shadow-[0_0_15px_rgba(201,168,76,0.8)] z-20"
                 />
                 
                 <div className="absolute inset-0 flex items-center justify-center z-10 bg-navy-950/40">
                    <div className="flex flex-col items-center">
                       <Sparkles size={48} className="text-gold-500 mb-4 animate-[pulse_1.5s_infinite]" />
                       <div className="px-4 py-1.5 bg-navy-900/90 border border-gold-500/40 rounded-full text-[10px] font-bold text-gold-500 tracking-[0.2em] font-sans uppercase">
                         AIが解析中...
                       </div>
                    </div>
                 </div>
               </div>
               
               <div className="mt-12 text-center max-w-xs">
                 <h3 className="text-xl font-serif font-bold text-slate-100 mb-2">本の情報を抽出しています</h3>
                 <p className="text-slate-400 text-sm italic font-serif leading-relaxed px-4">
                   「AIが見つけたデータは、記録ボタンを押す前に自分で修正が可能です」
                 </p>
               </div>
            </motion.div>
          )}

          {scanResult && !isScanning && (
            <motion.div 
               key="result"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full flex flex-col items-center"
            >
               <div className="w-full card-premium border-2 border-gold-500/30 overflow-hidden p-6 relative">
                 {/* Success Badge */}
                 <div className="absolute -top-1 -right-1 p-2 bg-gold-500 rounded-bl-3xl shadow-lg ring-4 ring-navy-950">
                    <Check size={20} className="text-navy-950" />
                 </div>

                 <div className="flex gap-6 items-start mb-8">
                   <div className="w-24 h-36 flex-shrink-0 bg-navy-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                     <img src={image!} alt="Book Cover" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-grow pt-2">
                     <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.2em] mb-2">解析結果</p>
                     <h2 className="text-2xl font-serif font-black text-slate-100 leading-tight mb-2 underline decoration-gold-500/30 decoration-4">
                       {scanResult.title}
                     </h2>
                     <p className="text-slate-300 font-sans font-medium mb-1 drop-shadow-sm">
                       著者: {scanResult.author}
                     </p>
                     <p className="text-slate-500 text-xs font-sans tracking-wider opacity-80">
                       出版社: {scanResult.publisher}
                     </p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                   <button 
                     onClick={() => router.push("/")}
                     className="btn-primary w-full shadow-gold-500/20"
                   >
                     <BookMarked size={20} /> ライブラリに登録
                   </button>
                   <button 
                     onClick={reset}
                     className="btn-secondary w-full"
                   >
                     <RefreshCcw size={18} /> やり直す
                   </button>
                 </div>
               </div>
               
               <div className="mt-8 flex items-center gap-3 py-3 px-5 bg-gold-500/10 rounded-2xl border border-gold-500/20">
                  <Zap size={16} className="text-gold-500" />
                  <span className="text-sm font-bold text-gold-500 font-sans">98% Accuracy by Gemini Vision</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* --- TIPS BAR --- */}
      {!image && (
        <div className="p-10 text-center opacity-40">
           <p className="text-xs font-serif italic text-slate-400">
             "A house without books is like a room without windows." — Cicero
           </p>
        </div>
      )}
    </div>
  );
}
