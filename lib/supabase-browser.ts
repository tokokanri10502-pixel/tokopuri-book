import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // 30日間セッションを維持
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        secure: true,
      },
    }
  );
}
