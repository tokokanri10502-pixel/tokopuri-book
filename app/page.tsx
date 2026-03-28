import { createClient } from "@/lib/supabase-server";
import BookListClient from "@/components/BookListClient";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const books = user
    ? (await supabase
        .from("books")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })).data ?? []
    : [];

  return <BookListClient books={books} />;
}
