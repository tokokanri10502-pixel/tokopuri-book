const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const authHeaders = {
  "Content-Type": "application/json",
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  Prefer: "return=representation",
};

function buildQuery(params: Record<string, string>): string {
  // select=* はそのまま渡す（URLSearchParams だと %2A になるため手動で構築）
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&")
    .replace(/%2A/g, "*"); // * は encoded しない
}

export async function dbSelect<T>(
  table: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  const query = buildQuery({ select: "*", ...params });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: authHeaders,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function dbInsert<T>(table: string, row: object): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function dbUpdate(
  table: string,
  row: object,
  filters: Record<string, string>
): Promise<void> {
  const query = Object.entries(filters)
    .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
    .join("&");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function dbDelete(
  table: string,
  filters: Record<string, string>
): Promise<void> {
  const query = Object.entries(filters)
    .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
    .join("&");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "DELETE",
    headers: { ...authHeaders, Prefer: "return=minimal" },
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function dbCount(
  table: string,
  filters: Record<string, string> = {}
): Promise<number> {
  const query = Object.entries(filters)
    .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
    .join("&");
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query ? query + "&" : ""}select=id`;
  const res = await fetch(url, {
    headers: {
      ...authHeaders,
      Prefer: "count=exact",
      "Range-Unit": "items",
      Range: "0-0",
    },
    cache: "no-store",
  });
  const contentRange = res.headers.get("content-range") || "0/0";
  return parseInt(contentRange.split("/")[1] || "0", 10);
}
