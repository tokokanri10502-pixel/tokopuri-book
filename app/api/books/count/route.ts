import { NextResponse } from "next/server";
import { getBooksCount } from "@/lib/books";

export async function GET() {
  try {
    const count = await getBooksCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
