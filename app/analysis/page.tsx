"use client";

import React from "react";
import { 
  BarChart3, 
  ArrowLeft, 
  Sparkles, 
  PieChart as PieChartIcon, 
  BookOpen, 
  TrendingUp, 
  ChevronRight,
  Lightbulb,
  Zap,
  Target
} from "lucide-react";
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
  YAxis
} from "recharts";

const GENRE_DATA = [
  { name: "文学・小説", value: 35, color: "#c9a84c" },
  { name: "ビジネス", value: 25, color: "#4e83cc" },
  { name: "自己啓発", value: 20, color: "#4fcc91" },
  { name: "その他", value: 20, color: "#64748b" },
];

const MONTHLY_DATA = [
  { name: "1月", books: 2 },
  { name: "2月", books: 5 },
  { name: "3月", books: 3 },
  { name: "4月", books: 4 },
];

export default function AnalysisPage() {
  return (
    <div className="flex flex-col min-h-screen pb-32 pt-8">
      {/* --- HEADER --- */}
      <header className="px-6 mb-8 flex items-center justify-between">
        <Link href="/" className="p-2 bg-navy-900 border border-slate-700/50 rounded-2xl hover:bg-navy-800 transition-colors">
          <ArrowLeft size={20} className="text-slate-400" />
        </Link>
        <h1 className="text-xl font-serif font-bold text-slate-100 italic">読書分析</h1>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      {/* --- AI CONCIERGE REPORT --- */}
      <section className="px-6 mb-10">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="card-premium relative overflow-hidden group shadow-gold-900/10 border-gold-500/20"
        >
           <div className="absolute top-4 right-4 text-gold-500 animate-pulse">
              <Sparkles size={24} />
           </div>
           
           <div className="flex items-center gap-2 mb-4">
              <div className="p-1 px-3 bg-gold-500/10 rounded-full border border-gold-500/30">
                 <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Growth Phase</span>
              </div>
           </div>
           
           <h3 className="text-2xl font-serif font-black text-slate-100 leading-tight mb-4 pr-10">
              「知性の幅が、<br/>着実に広がっています。」
           </h3>
           
           <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
              今月は『文学・小説』に深い洞察が集まっていますね。共感性の高い読書をされています。
              次は少し毛色の違う『歴史』や『教養』に触れると、さらに新しい発見があるかもしれません。
           </p>

           <div className="p-4 bg-navy-950/40 rounded-2xl border border-slate-700/50 flex items-center justify-between hover:bg-navy-950 transition-colors group cursor-pointer active:scale-95">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-gold-500/10 rounded-xl text-gold-500 shadow-lg shadow-gold-500/5 ring-1 ring-gold-500/20">
                    <Lightbulb size={20} />
                 </div>
                 <div>
                    <h4 className="text-slate-200 font-bold text-sm">次なる一冊のおすすめ</h4>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">新しい世界を広げましょう</p>
                 </div>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-gold-500 transition-colors" />
           </div>
        </motion.div>
      </section>

      {/* --- CHARTS --- */}
      <section className="px-6 mb-10 overflow-hidden">
        <h2 className="text-slate-300 font-serif font-bold text-lg mb-6 flex items-center gap-3">
           <PieChartIcon size={20} className="text-gold-500" />
           ジャンル構成
        </h2>
        
        <div className="card-premium p-6 flex flex-col items-center">
           <div className="w-full h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={GENRE_DATA}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={8}
                       dataKey="value"
                    >
                       {GENRE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" className="hover:opacity-80 transition-opacity" />
                       ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ 
                          backgroundColor: "#0f172a", 
                          borderRadius: "16px", 
                          border: "1px solid rgba(100, 116, 139, 0.5)",
                          color: "#f1f5f9"
                       }}
                       itemStyle={{ color: "#f1f5f9" }}
                    />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black text-slate-100 drop-shadow-lg">14</span>
                 <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] font-sans">冊</span>
              </div>
           </div>
           
           <div className="w-full mt-6 grid grid-cols-2 gap-4">
              {GENRE_DATA.map((g, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full opacity-60 shadow-lg shadow-black/20" style={{ backgroundColor: g.color }}></div>
                    <span className="text-xs text-slate-400 font-sans tracking-wide">{g.name}</span>
                    <span className="text-xs text-slate-500 font-bold ml-auto">{g.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- PROGRESS --- */}
      <section className="px-6 mb-10">
        <h2 className="text-slate-300 font-serif font-bold text-lg mb-6 flex items-center gap-3">
           <TrendingUp size={20} className="text-gold-500" />
           月次の推移
        </h2>
        
        <div className="card-premium p-6">
           <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={MONTHLY_DATA}>
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                       dy={10}
                    />
                    <Tooltip cursor={{ fill: 'rgba(201,168,76, 0.05)' }} contentStyle={{ display: "none" }} />
                    <Bar 
                       dataKey="books" 
                       fill="#c9a84c" 
                       radius={[10, 10, 0, 0]} 
                       barSize={32}
                    />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 flex items-center justify-between p-4 bg-gold-500/5 rounded-2xl border border-gold-500/10 ring-1 ring-gold-500/5">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-gold-500 rounded-xl">
                    <Zap size={18} className="text-navy-950" />
                 </div>
                 <div className="text-slate-200 font-bold text-sm">最長の継続日数</div>
              </div>
              <span className="text-gold-500 font-serif font-bold text-lg italic">12日</span>
           </div>
        </div>
      </section>

      {/* --- NEXT CHALLENGE --- */}
      <section className="px-6 mb-20">
         <div className="card-premium bg-gradient-to-br from-navy-900 to-navy-950 border-slate-700/30 flex flex-col items-center text-center p-8 space-y-4 shadow-xl">
            <div className="p-4 bg-navy-800 rounded-3xl border border-slate-700/50 shadow-inner group transition-transform hover:scale-110 active:scale-95 duration-500">
               <Target size={32} className="text-slate-500 group-hover:text-gold-500 transition-colors" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-100">目標を設定する</h3>
            <p className="text-slate-500 text-sm font-sans px-4">あと2冊で今月の目標を達成します</p>
         </div>
      </section>

      {/* --- BOTTOM NAV --- */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-20 bg-navy-950/80 backdrop-blur-2xl border-t border-slate-800/80 px-6 flex items-center justify-around z-50">
        <NavBtn href="/" icon={<BookOpen size={24} />} label="本棚" />
        <NavBtn href="/analysis" icon={<BarChart3 size={24} />} active label="分析" />
      </nav>
    </div>
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
