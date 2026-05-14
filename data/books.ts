import type { Book } from "@/lib/types";
import leviticus from "./leviticus.json";
import numbers from "./numbers.json";
import ecclesiastes from "./ecclesiastes.json";
import song from "./song.json";
import lamentations from "./lamentations.json";
import ezekiel from "./ezekiel.json";

export const BOOKS: Book[] = [
  leviticus as Book,
  numbers as Book,
  ecclesiastes as Book,
  song as Book,
  lamentations as Book,
  ezekiel as Book,
];

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}
