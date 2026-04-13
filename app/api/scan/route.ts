import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// base64 文字列の上限: 約 2MB（圧縮後）
const MAX_BASE64_LENGTH = 3 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 認証チェック
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { image } = await req.json(); // base64 data URL

    if (!image) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    // 画像サイズ制限
    if (image.length > MAX_BASE64_LENGTH) {
      return NextResponse.json(
        { error: "Image too large" },
        { status: 413 }
      );
    }

    // Extract base64 part and mimeType from data URL
    const [header, base64Data] = image.split(",");
    if (!base64Data) {
      return NextResponse.json(
        { error: "Invalid image data format" },
        { status: 400 }
      );
    }

    const mimeTypeMatch = header.match(/data:([^;]+);/);
    const mimeType = (mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg") as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/heic";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        // @ts-ignore — thinkingConfig は型定義に未反映だが有効なオプション
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const prompt = `あなたは書籍情報の抽出専門家です。この画像に写っている本の表紙から情報を読み取ってください。

画像が本の表紙でない場合や文字が読み取れない場合でも、できる限り推測して回答してください。

必ず以下のJSON形式のみで応答してください（他のテキストは一切含めないこと）:
{
  "title": "本のタイトル（表紙の文字をそのまま）",
  "author": "著者名（表紙の文字をそのまま）",
  "publisher": "出版社名（読み取れた場合、なければ空文字）",
  "genre": "ジャンル（小説・ビジネス・技術書・漫画・自己啓発・実用書・絵本・その他から選択）",
  "summary": "この本の内容の簡単な説明（タイトルや著者から推測してよい、50文字程度）"
}

重要なルール:
- 表紙の文字を優先して正確に読み取ること
- タイトルや著者が少しでも読み取れたら必ず入力すること
- 読み取れない項目のみ空文字列 "" にすること
- 日本語の本は日本語で、英語の本は英語で回答すること`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse JSON — responseMimeType should give clean JSON,
    // but add fallback cleanup just in case
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      const jsonStr = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      data = JSON.parse(jsonStr);
    }

    // Fetch cover image URL from Google Books API
    let coverUrl = ""; // base64は保存しない
    if (data.title) {
      try {
        const query = [
          data.title ? `intitle:${data.title}` : "",
          data.author ? `inauthor:${data.author}` : "",
        ]
          .filter(Boolean)
          .join("+");

        const booksRes = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&langRestrict=ja`
        );
        const booksData = await booksRes.json();

        if (booksData.items && booksData.items[0]) {
          const item = booksData.items[0].volumeInfo;
          data.description = item.description || data.summary;
          coverUrl =
            item.imageLinks?.thumbnail?.replace("http:", "https:") || coverUrl;
          data.isbn = item.industryIdentifiers?.[0]?.identifier || "";
        }
      } catch (e) {
        console.error("Google Books API error:", e);
      }
    }

    return NextResponse.json({ ...data, cover_url: coverUrl });
  } catch (error: any) {
    console.error("Gemini Scan Error:", error?.message || error);
    return NextResponse.json(
      { error: "スキャンに失敗しました" },
      { status: 500 }
    );
  }
}
