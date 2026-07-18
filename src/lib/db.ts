import "server-only";
import { getSupabase } from "./supabase";
import type { Book, Category, SiteSettings } from "./types";

type BookRow = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  thumbnail: string;
  description: string;
  link: string;
  category_ids: string[];
  created_at: string;
};

function rowToBook(row: BookRow): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    publisher: row.publisher,
    thumbnail: row.thumbnail,
    description: row.description,
    link: row.link,
    categoryIds: row.category_ids,
    createdAt: row.created_at,
  };
}

function bookToRow(book: Book): BookRow {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    thumbnail: book.thumbnail,
    description: book.description,
    link: book.link,
    category_ids: book.categoryIds,
    created_at: book.createdAt,
  };
}

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await getSupabase()
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as BookRow[]).map(rowToBook);
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await getSupabase()
    .from("books")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToBook(data as BookRow) : null;
}

export async function createBook(book: Book): Promise<void> {
  const { error } = await getSupabase().from("books").insert(bookToRow(book));
  if (error) throw new Error(error.message);
}

export async function updateBook(
  id: string,
  patch: Omit<Book, "id" | "createdAt">
): Promise<void> {
  const { error } = await getSupabase()
    .from("books")
    .update({
      title: patch.title,
      author: patch.author,
      publisher: patch.publisher,
      thumbnail: patch.thumbnail,
      description: patch.description,
      link: patch.link,
      category_ids: patch.categoryIds,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await getSupabase().from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertBooks(books: Book[]): Promise<void> {
  if (books.length === 0) return;
  const { error } = await getSupabase().from("books").upsert(books.map(bookToRow));
  if (error) throw new Error(error.message);
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await getSupabase()
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return data as Category[];
}

export async function createCategory(category: Category): Promise<void> {
  const { error } = await getSupabase().from("categories").insert(category);
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error: rpcError } = await getSupabase().rpc(
    "remove_category_from_books",
    { cat_id: id }
  );
  if (rpcError) throw new Error(rpcError.message);

  const { error } = await getSupabase().from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function upsertCategories(categories: Category[]): Promise<void> {
  if (categories.length === 0) return;
  const { error } = await getSupabase().from("categories").upsert(categories);
  if (error) throw new Error(error.message);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabase()
    .from("site_settings")
    .select("header_image_url")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return { headerImageUrl: data?.header_image_url ?? "" };
}

export async function updateHeaderImage(url: string): Promise<void> {
  const { error } = await getSupabase()
    .from("site_settings")
    .upsert({ id: "default", header_image_url: url, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}
