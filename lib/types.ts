export type Theme = {
  label: string;
  color: string;
  bg: string;
  bgStrong: string;
  description?: string;
};

export type Pericope = {
  id: string;
  ch: number;
  ref: string;
  tags: string[];
  text: string;
  marker?: string;
  parallel?: { ref: string; text: string };
};

export type ChapterSection = {
  label: string;
  from: number;
  to: number;
};

export type Book = {
  slug: string;
  name: string;
  subtitle?: string;
  translation: string;
  themes: Record<string, Theme>;
  pericopes: Pericope[];
  features?: {
    marker?: boolean;
  };
  howToRead?: string;
  chapterSections?: ChapterSection[];
};
