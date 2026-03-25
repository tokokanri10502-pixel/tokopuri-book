import { supabase } from './supabase';
import { Book, BookStatus } from './types';

// 認証なしの場合の固定ユーザーID
export const DEMO_USER_ID = 'om-user-001';

/** 全書籍を取得 */
export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Book[];
}

/** IDで1冊取得 */
export async function getBook(id: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID)
    .single();

  if (error) return null;
  return data as Book;
}

/** 書籍を登録 */
export async function insertBook(bookData: {
  title: string;
  author: string;
  publisher?: string;
  genre?: string;
  isbn?: string;
  description?: string;
  cover_url: string;
  status: BookStatus;
}): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert({
      ...bookData,
      user_id: DEMO_USER_ID,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Book;
}

/** ステータス・評価・メモを更新 */
export async function updateBook(
  id: string,
  updates: {
    status?: BookStatus;
    review?: string;
    rating?: number;
  }
): Promise<void> {
  const { error } = await supabase
    .from('books')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID);

  if (error) throw error;
}

/** 書籍を削除 */
export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID);

  if (error) throw error;
}
