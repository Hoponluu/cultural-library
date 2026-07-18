import "server-only";
import Papa from "papaparse";
import { randomUUID } from "crypto";
import type { Book, Category } from "./types";
import { slugify } from "./slug";

export const CSV_COLUMNS = [
  "id",
  "title",
  "author",
  "publisher",
  "thumbnail",
  "description",
  "link",
  "categories",
] as const;

export function booksToCsv(books: Book[], categories: Category[]): string {
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  const rows = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    thumbnail: book.thumbnail,
    description: book.description,
    link: book.link,
    categories: book.categoryIds
      .map((id) => nameById.get(id))
      .filter(Boolean)
      .join("; "),
  }));

  return Papa.unparse(rows, { columns: [...CSV_COLUMNS] });
}

export type CsvImportResult = {
  books: Book[];
  categories: Category[];
  created: number;
  updated: number;
  errors: string[];
};

export function parseBooksCsv(
  csvText: string,
  existingBooks: Book[],
  existingCategories: Category[]
): CsvImportResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const books = [...existingBooks];
  const categories = [...existingCategories];
  const errors: string[] = [];
  let created = 0;
  let updated = 0;

  function resolveCategoryIds(rawValue: string): string[] {
    const names = rawValue
      .split(/[;,]/)
      .map((n) => n.trim())
      .filter(Boolean);

    return names.map((name) => {
      const existing = categories.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) return existing.id;

      const baseId = slugify(name) || "category";
      let id = baseId;
      let suffix = 2;
      while (categories.some((c) => c.id === id)) id = `${baseId}-${suffix++}`;
      categories.push({ id, name });
      return id;
    });
  }

  parsed.data.forEach((row, index) => {
    const title = (row.title ?? "").trim();
    if (!title) {
      errors.push(`Dòng ${index + 2}: thiếu tên sách, đã bỏ qua.`);
      return;
    }

    const categoryIds = resolveCategoryIds(row.categories ?? "");

    const fields = {
      title,
      author: (row.author ?? "").trim(),
      publisher: (row.publisher ?? "").trim(),
      thumbnail: (row.thumbnail ?? "").trim(),
      description: (row.description ?? "").trim(),
      link: (row.link ?? "").trim(),
      categoryIds,
    };

    const existingId = (row.id ?? "").trim();
    const existingIndex = existingId
      ? books.findIndex((b) => b.id === existingId)
      : -1;

    if (existingIndex !== -1) {
      books[existingIndex] = { ...books[existingIndex], ...fields };
      updated++;
    } else {
      books.push({
        id: existingId || randomUUID(),
        ...fields,
        createdAt: new Date().toISOString(),
      });
      created++;
    }
  });

  return { books, categories, created, updated, errors };
}
