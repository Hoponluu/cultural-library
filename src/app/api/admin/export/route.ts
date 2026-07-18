import { getBooks, getCategories } from "@/lib/db";
import { booksToCsv } from "@/lib/csv";

export async function GET() {
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);
  const csv = booksToCsv(books, categories);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="books-export-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
