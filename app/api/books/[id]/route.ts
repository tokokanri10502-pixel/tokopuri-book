import { NextRequest, NextResponse } from "next/server";
import { deleteBook, updateBook } from "@/lib/books";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteBook(params.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Delete error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await updateBook(params.id, body);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Update error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
