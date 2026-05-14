import type { Book } from "@/lib/types";
import leviticus from "./leviticus.json";
import numbers from "./numbers.json";
import lamentations from "./lamentations.json";

export const BOOKS: Book[] = [leviticus as Book, numbers as Book, lamentations as Book];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
