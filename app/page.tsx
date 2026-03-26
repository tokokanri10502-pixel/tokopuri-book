import { getBooks } from "@/lib/books";
import BookListClient from "@/components/BookListClient";

export default async function Dashboard() {
  const books = await getBooks();
  return <BookListClient books={books} />;
}
