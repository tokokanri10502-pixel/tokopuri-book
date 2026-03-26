import { getBooks } from "@/lib/books";
import AnalysisClient from "@/components/AnalysisClient";

export default async function AnalysisPage() {
  const books = await getBooks();
  return <AnalysisClient books={books} />;
}
