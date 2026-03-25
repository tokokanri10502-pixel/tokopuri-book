import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json(); // base64 image data

    if (!image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Prepare content for Gemini
    const prompt = `
      Extract information from this book cover image. 
      Respond ONLY with a JSON object in the following format:
      {
        "title": "string",
        "author": "string",
        "publisher": "string",
        "genre": "string",
        "summary": "string"
      }
      If you can't find some information, use an empty string. Japanese is preferred for text.
    `;

    // Extract base64 part and mimeType from data URL
    const [header, base64Data] = image.split(",");
    const mimeTypeMatch = header.match(/data:([^;]+);/);
    const mimeType = (mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg") as
      | "image/jpeg"
      | "image/png"
      | "image/webp"
      | "image/heic";

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
    
    // Clean JSON text (sometimes AI adds ```json ... ```)
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);

    // Optional: Fetch cover image URL from Google Books API using the title/author
    let coverUrl = image; // Default to user's photo
    try {
       const booksRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(data.title)}+inauthor:${encodeURIComponent(data.author)}&maxResults=1`);
       const booksData = await booksRes.json();
       if (booksData.items && booksData.items[0]) {
          const item = booksData.items[0].volumeInfo;
          data.description = item.description || data.summary;
          coverUrl = item.imageLinks?.thumbnail?.replace("http:", "https:") || coverUrl;
          data.isbn = item.industryIdentifiers?.[0]?.identifier || "";
       }
    } catch (e) {
       console.error("Google Books API error:", e);
    }

    return NextResponse.json({ ...data, cover_url: coverUrl });
  } catch (error: any) {
    console.error("Gemini Scan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
