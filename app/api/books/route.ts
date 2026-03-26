import { NextRequest, NextResponse } from "next/server";
import { insertBook } from "@/lib/books";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await insertBook({
      title: body.title,
      author: body.author,
      publisher: body.publisher,
      genre: body.genre,
      isbn: body.isbn,
      description: body.description,
      cover_url: body.cover_url || "",
      status: body.status,
    });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Books POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
