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
  acrostic?: string;
};

export type Book = {
  slug: string;
  name: string;
  subtitle?: string;
  translation: string;
  themes: Record<string, Theme>;
  pericopes: Pericope[];
  features?: {
    acrostic?: boolean;
  };
  howToRead?: string;
};
