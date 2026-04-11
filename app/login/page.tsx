"use client";

import React, { useState, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import { motion, AnimatePresence } from "framer-motion";

type Step = "email" | "code" | "success";

// ステップごとのキャラクター設定
const STEP_CONFIG: Record<Step, { gif: string; line: string }> = {
  email:   { gif: "/characters/tokopuri_walk.gif",    line: "まってるよ！ほわ。" },
  code:    { gif: "/characters/tokopuri_wink.gif",    line: "コードをにゅうりょくしてね。ほわ。" },
  success: { gif: "/characters/tokopuri_smile.gif",   line: "やったー！ほわ。" },
};

// ランダムで裏プリンを出没させる（20%の確率）
function getCharConfig(step: Step) {
  if (step === "email" && Math.random() < 0.2) {
    return { gif: "/characters/ura_purin_front.gif", line: "メールアドレスですよ。ほわ。" };
  }
  return STEP_CONFIG[step];
}

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const supabase = createClient();

    // Hydration対策: 初期値は固定、マウント後にランダム判定
  const [stepChar, setStepChar] = useState(STEP_CONFIG.email);
  React.useEffect(() => {
    setStepChar(getCharConfig("email"));
  }, []);

  const handleSendEmail = async () => {
    if (!email) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError("おくれませんでした。もういちどためしてね。");
    } else {
      setStepChar(STEP_CONFIG.code);
      setStep("code");
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    if (digit && index < 7) inputRefs.current[index + 1]?.focus();
    if (newCode.every((d) => d !== "") && newCode.join("").length === 8) {
      handleVerify(newCode.join(""));
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pasted) return;
    const newCode = [...code];
    pasted.split("").forEach((d, i) => { newCode[i] = d; });
    setCode(newCode);
    inputRefs.current[Math.min(pasted.length, 7)]?.focus();
    if (pasted.length === 8) handleVerify(pasted);
  };

  const handleVerify = async (token: string) => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
    setLoading(false);
    if (error) {
      setError("コードがちがうよ。もういちどためしてね。");
      setCode(["", "", "", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      setStepChar(STEP_CONFIG.success);
      setStep("success");
      setTimeout(() => { window.location.href = "/"; }, 1200);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 gap-6"
      style={{ background: "linear-gradient(160deg, #FFFDF0 0%, #FFF8D6 50%, #FFFDF0 100%)" }}
    >
      {/* ---- タイトル ---- */}
      <div className="flex flex-col items-center gap-1 text-center mt-10">
        <p className="font-rounded font-bold text-tokopuri-magenta text-base tracking-widest uppercase">
          📖 とこぷりブック 📖
        </p>
        <h1 className="font-rounded font-black text-4xl text-tokopuri-black leading-tight">
          たいせつなほんを<br />
          <span className="text-tokopuri-yellow">きろく</span>しよう
        </h1>
      </div>

      {/* ---- キャラクター & 吹き出し ---- */}
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.img
            key={stepChar.gif}
            src={stepChar.gif}
            alt="トコプリ"
            className="w-44 h-44 object-contain drop-shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={stepChar.line}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative bg-white rounded-3xl px-5 py-3 shadow-md border-2 border-tokopuri-yellow/30 max-w-[220px] text-center"
          >
            <div
              className="absolute -top-2.5 left-1/2 -translate-x-1/2"
              style={{
                width: 0, height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: "12px solid white",
              }}
            />
            <p className="font-rounded font-bold text-tokopuri-black text-sm">{stepChar.line}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- フォームエリア ---- */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <AnimatePresence mode="wait">

          {/* STEP 1: メール入力 */}
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col gap-3"
            >
              <p className="font-rounded text-tokopuri-black/60 text-sm text-center">
                メールアドレスを入力してね
              </p>
              <input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                className="w-full bg-white border-2 border-tokopuri-yellow/40 rounded-3xl py-4 px-5 text-tokopuri-black placeholder:text-tokopuri-black/30 focus:outline-none focus:border-tokopuri-yellow font-rounded text-base text-center"
              />
              <button
                onClick={handleSendEmail}
                disabled={loading || !email}
                className="btn-kids-primary w-full disabled:opacity-50"
              >
                {loading ? "おくってるよ…" : "コードをおくる"}
              </button>
            </motion.div>
          )}

          {/* STEP 2: コード入力 */}
          {step === "code" && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="text-center">
                <p className="font-rounded font-bold text-tokopuri-black text-base">
                  メールをチェックしてね！
                </p>
                <p className="font-rounded text-tokopuri-black/50 text-sm mt-1">
                  <span className="text-tokopuri-magenta font-bold">{email}</span> に<br />
                  8けたのコードをおくったよ
                </p>
              </div>

              {/* 8桁入力 */}
              <div className="flex gap-1.5">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="w-9 h-12 bg-white border-2 border-tokopuri-yellow/40 rounded-xl text-tokopuri-black text-lg font-rounded font-black text-center focus:outline-none focus:border-tokopuri-yellow"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {loading && (
                <p className="font-rounded text-tokopuri-black/50 text-sm">かくにん中…</p>
              )}

              <button
                onClick={() => { setStep("email"); setCode(["","","","","","","",""]); setError(""); setStepChar(STEP_CONFIG.email); }}
                className="font-rounded text-tokopuri-black/40 text-sm"
              >
                メールアドレスをかえる
              </button>
            </motion.div>
          )}

          {/* STEP 3: 成功 */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <p className="font-rounded font-black text-tokopuri-black text-2xl">ログイン成功！</p>
              <p className="font-rounded text-tokopuri-black/50 text-sm">いどうするよ…</p>
            </motion.div>
          )}

        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-rounded text-tokopuri-magenta text-sm text-center font-bold"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* ---- フッター ---- */}
      <p className="font-rounded text-tokopuri-black/30 text-xs text-center">
        ログインすることで、あなた専用の<br />ほんだながつくられます。
      </p>

      {/* 裏プリンのランダム背景装飾 */}
      <div className="fixed bottom-4 right-4 opacity-10 pointer-events-none">
        <img src="/characters/ura_purin_back.gif" alt="" className="w-16 h-16 object-contain" />
      </div>
    </div>
  );
}
