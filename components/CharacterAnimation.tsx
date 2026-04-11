"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AnimationType =
  | "wink"            // 通常登録（ウィンク）
  | "smile"           // 通常登録（笑顔）
  | "milestone_normal" // 3冊マイルストーン（通常プリン）
  | "milestone_ura"   // 3冊マイルストーン（裏プリン）
  | "idle";           // 待機（本棚画面）

interface Props {
  type: AnimationType;
  show: boolean;
  onClose: () => void;
}

// ---------- セリフ ----------
const LINES: Record<string, string[]> = {
  normal_register: [
    "よんだですね。ほわ。",
    "すごいですよ。ほわ。",
    "プリン大陸でも、本は大事ですよ。ほわ。",
  ],
  milestone_normal: [
    "3さつ、よみましたよ。ほわ。",
    "ぷるぷるしてしまいますよ。ほわ。",
  ],
  milestone_ura: [
    "どちらでもいいですよ。ほわ。",
    "いつも最後ですよ。ほわ。",
    "カラメルは、食べながら言いますよ。ほわ。",
  ],
};

// ---------- GIF ----------
const GIFS: Record<string, string[]> = {
  wink:             ["/characters/tokopuri_wink.gif"],
  smile:            ["/characters/tokopuri_smile.gif"],
  milestone_normal: ["/characters/tokopuri_purupuru.gif"],
  milestone_ura:    [
    "/characters/ura_purin_front.gif",
    "/characters/ura_purin_dish.gif",
    "/characters/ura_purin_purupuru.gif",
  ],
  idle:             ["/characters/tokopuri_walk.gif"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- アイドル用（本棚常駐）----------
export function CharacterIdle() {
  return (
    <div className="fixed bottom-28 left-3 z-30 pointer-events-none">
      <img
        src="/characters/tokopuri_walk.gif"
        alt="トコプリ"
        className="w-14 h-14 object-contain drop-shadow-md"
      />
    </div>
  );
}

// ---------- メイン演出モーダル ----------
export function CharacterAnimation({ type, show, onClose }: Props) {
  const gif = useMemo(
    () => pick(GIFS[type] ?? GIFS.wink),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [type, show]
  );

  const line = useMemo(() => {
    if (type === "wink" || type === "smile")    return pick(LINES.normal_register);
    if (type === "milestone_normal")            return pick(LINES.milestone_normal);
    if (type === "milestone_ura")               return pick(LINES.milestone_ura);
    return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, show]);

  // 3秒後に自動クローズ
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(245,200,66,0.35)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0, transition: { type: "spring", damping: 14, stiffness: 200 } }}
            exit={{ scale: 0.7, y: 40, opacity: 0 }}
            className="flex flex-col items-center gap-5 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* GIF */}
            <motion.img
              src={gif}
              alt="トコプリ"
              className="w-52 h-52 object-contain drop-shadow-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* 吹き出し */}
            {line && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative bg-white rounded-4xl px-6 py-4 shadow-xl max-w-[260px] text-center border-2 border-tokopuri-yellow/40"
              >
                {/* 三角 */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  style={{
                    width: 0, height: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderBottom: "14px solid white",
                  }}
                />
                <p className="font-rounded font-bold text-xl text-tokopuri-black leading-snug">
                  {line}
                </p>
              </motion.div>
            )}

            <p className="text-tokopuri-black/50 text-sm font-rounded">タップして次へ</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
