// Đưa dữ liệu mẫu trong data/*.json vào Supabase. Chạy một lần sau khi đã tạo
// project + bảng (supabase/schema.sql) và set SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.
//
//   node --env-file=.env.local scripts/seed-supabase.mjs

import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

const categories = JSON.parse(await readFile(new URL("../data/categories.json", import.meta.url)));
const books = JSON.parse(await readFile(new URL("../data/books.json", import.meta.url)));

const { error: categoriesError } = await supabase.from("categories").upsert(categories);
if (categoriesError) {
  console.error("Lỗi khi seed categories:", categoriesError.message);
  process.exit(1);
}
console.log(`Đã seed ${categories.length} category.`);

const bookRows = books.map((b) => ({
  id: b.id,
  title: b.title,
  author: b.author,
  publisher: b.publisher,
  thumbnail: b.thumbnail,
  description: b.description,
  link: b.link,
  category_ids: b.categoryIds,
  created_at: b.createdAt,
}));

const { error: booksError } = await supabase.from("books").upsert(bookRows);
if (booksError) {
  console.error("Lỗi khi seed books:", booksError.message);
  process.exit(1);
}
console.log(`Đã seed ${books.length} sách.`);
