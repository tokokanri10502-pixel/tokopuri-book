export type BookStatus = 'reading' | 'done' | 'plan';

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  genre?: string;
  isbn?: string;
  description?: string;
  cover_url: string;
  status: BookStatus;
  review?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface LibraryState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
}
