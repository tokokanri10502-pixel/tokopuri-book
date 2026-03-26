import { Book, BookStatus } from './types';
import { dbSelect, dbInsert, dbUpdate, dbDelete, dbCount } from './supabase';

export const DEMO_USER_ID = 'om-user-001';

export async function getBooks(): Promise<Book[]> {
  return dbSelect<Book>('books', {
    user_id: `eq.${DEMO_USER_ID}`,
    order: 'created_at.desc',
  });
}

export async function getBook(id: string): Promise<Book | null> {
  const rows = await dbSelect<Book>('books', {
    id: `eq.${id}`,
    user_id: `eq.${DEMO_USER_ID}`,
  });
  return rows[0] ?? null;
}

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
  return dbInsert<Book>('books', {
    ...bookData,
    user_id: DEMO_USER_ID,
    updated_at: new Date().toISOString(),
  });
}

export async function updateBook(
  id: string,
  updates: { status?: BookStatus; review?: string; rating?: number }
): Promise<void> {
  return dbUpdate(
    'books',
    { ...updates, updated_at: new Date().toISOString() },
    { id, user_id: DEMO_USER_ID }
  );
}

export async function deleteBook(id: string): Promise<void> {
  return dbDelete('books', { id, user_id: DEMO_USER_ID });
}

export async function getBooksCount(): Promise<number> {
  return dbCount('books', { user_id: DEMO_USER_ID });
}
