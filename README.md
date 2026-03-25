# BOOK MARKERS (v2) - 「撮るだけ登録、AIと育む読書体験」

本の表紙を撮るだけでAIが蔵書を自動登録。習慣化をサポートする「AIコンシェルジュ」を搭載した、プレミアムな読書管理アプリです。

## 🚀 立ち上げ手順

1.  **環境変数の設定**
    `.env.local` を開き、以下の API キーを入力してください：
    - `GEMINI_API_KEY`: Google AI Studio から取得。
    - `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY`: Supabase プロジェクト設定から取得。

2.  **依存関係のインストール**
    ```bash
    npm install
    ```

3.  **開発サーバーの起動**
    ```bash
    npm run dev
    ```
    ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## ✨ 主要機能

- **AI Cover Scan**: Gemini Vision API を使用して、表紙画像からタイトル、著者、出版社を瞬時に抽出。
- **Library Management**: 読書ステータス（読書中、読了、積読）の管理。
- **AI Concierge**: 読書傾向に基づいた称賛メッセージと、次に読むべき一冊のレコメンド。
- **Insights**: Recharts を活用したジャンル構成比の可視化。

## 🛠 技術スタック

- **Frontend**: Next.js 14, React, Tailwind CSS
- **AI**: Google Gemini 1.5 Flash (Vision + Text)
- **Database**: Supabase
- **Visuals**: Lucide React, Framer Motion, Recharts

## 💡 今後の拡張 (Phase 2+)

- 読書メモへの AI 要約機能。
- 読了後の SNS シェア画像の自動生成機能（AI 活用）。
