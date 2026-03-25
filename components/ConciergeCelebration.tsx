"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  Trophy, 
  BookMarked, 
  Heart, 
  Zap,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConciergeCelebrationProps {
  show: boolean;
  count: number;
  onClose: () => void;
}

export function ConciergeCelebration({ show, count, onClose }: ConciergeCelebrationProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-navy-950/80 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.8, y: 40, rotate: -2 }}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-sm card-premium relative border-2 border-gold-500/40 p-10 overflow-hidden shadow-[0_0_80px_rgba(201,168,76,0.2)]"
        >
          {/* Confetti-like elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent shadow-[0_0_20px_rgba(201,168,76,0.6)]" />
          
          {/* Back glows */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gold-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl" />

          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-2xl shadow-gold-900/40 border-4 border-navy-950 ring-8 ring-gold-500/10 mb-8 animate-float">
               <Trophy size={48} className="text-navy-950" />
            </div>

            <p className="text-[10px] font-bold text-gold-500 uppercase tracking-[0.4em] mb-3 font-sans opacity-80 ring-1 ring-gold-500/30 px-3 py-1 rounded-full">
               マイルストーン達成！
            </p>
            
            <h2 className="text-3xl font-serif font-black text-slate-100 leading-tight mb-6">
               祝！<span className="text-gold-500 underline decoration-gold-500/30 decoration-4 underline-offset-4">{count}冊目</span>を<br/>登録しました。
            </h2>

            <div className="space-y-4 mb-10 w-full">
               <div className="flex items-start gap-3 text-left p-4 bg-navy-950/60 rounded-2xl border border-slate-700/50 shadow-inner group hover:border-gold-500/30 transition-all">
                  <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400 flex-shrink-0">
                     <Heart size={18} fill="currentColor" className="opacity-80" />
                  </div>
                  <div>
                     <h4 className="text-slate-100 font-bold text-sm">AIコンシェルジュ</h4>
                     <p className="text-slate-400 text-xs leading-relaxed font-serif italic mt-1 group-hover:text-slate-300 transition-colors">
                        「素晴らしいペースですね。あなたの知的好奇心は、すでに図書館の小さな一角を埋めるほどに輝いています。」
                     </p>
                  </div>
               </div>
            </div>

            <button 
               onClick={onClose}
               className="btn-primary w-full py-4 text-lg group overflow-hidden relative shadow-gold-500/40"
            >
               <span className="relative z-10 flex items-center justify-center gap-2">
                  次への一歩を踏み出す <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </span>
               <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>
          
          <button 
             onClick={onClose}
             className="absolute top-4 right-4 text-slate-600 hover:text-slate-400 p-2 hover:bg-navy-900 rounded-full transition-all"
          >
             <X size={20} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
