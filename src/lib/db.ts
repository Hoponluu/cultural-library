import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Book, Category } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKS_FILE = path.join(DATA_DIR, "books.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export async function getBooks(): Promise<Book[]> {
  return readJson<Book[]>(BOOKS_FILE, []);
}

export async function saveBooks(books: Book[]): Promise<void> {
  await writeJson(BOOKS_FILE, books);
}

export async function getCategories(): Promise<Category[]> {
  return readJson<Category[]>(CATEGORIES_FILE, []);
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await writeJson(CATEGORIES_FILE, categories);
}
