import type { CSSProperties } from "react";
import type { Book, Pericope } from "@/lib/types";

export default function LandingExample({
  book,
  pericopeId,
}: {
  book: Book;
  pericopeId: string;
}) {
  const p = book.pericopes.find((x) => x.id === pericopeId);
  if (!p) return null;

  const primary = p.tags[0];
  const secondary = p.tags.slice(1);
  const primaryTheme = book.themes[primary];

  const textStyle: CSSProperties = {
    fontSize: 17,
    lineHeight: 1.85,
    color: "#2c2418",
    margin: 0,
    fontFamily: "'Crimson Pro', Georgia, serif",
    fontWeight: 300,
    backgroundColor: primaryTheme?.bg,
    borderRadius: 3,
    padding: "2px 1px",
    display: "inline",
  };

  if (secondary[0]) {
    textStyle.borderBottom = `3px solid ${book.themes[secondary[0]]?.color}`;
  }
  if (secondary[1]) {
    textStyle.borderTop = `3px solid ${book.themes[secondary[1]]?.color}`;
  }
  if (secondary[2]) {
    textStyle.borderLeft = `4px solid ${book.themes[secondary[2]]?.color}`;
  }

  return (
    <div style={S.wrap}>
      <div style={S.caption}>
        How it works · {book.name} {p.ref} holds three themes at once
      </div>

      <div style={S.card}>
        <div style={S.refLine}>
          <span style={S.refText}>{p.ref}</span>
          <span style={S.refSpacer} />
          <span style={S.refDots}>
            {p.tags.map((t) => (
              <span
                key={t}
                style={{
                  ...S.dot,
                  backgroundColor: book.themes[t]?.color,
                }}
              />
            ))}
          </span>
        </div>
        <p style={textStyle}>{p.text}</p>
      </div>

      <div style={S.legend}>
        {p.tags.map((t) => {
          const th = book.themes[t];
          if (!th) return null;
          return (
            <div key={t} style={S.legendRow}>
              <span
                style={{
                  ...S.legendSwatch,
                  backgroundColor: th.bgStrong,
                  border: `2px solid ${th.color}`,
                }}
              />
              <div>
                <div style={{ ...S.legendLabel, color: th.color }}>
                  {th.label}
                </div>
                {th.description && (
                  <div style={S.legendDesc}>{th.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={S.hint}>
        The first theme tints the background; the others stack as borders —
        underline, overline, left edge. The dots in the corner match.
      </div>
    </div>
  );
}

const S: Record<string, CSSProperties> = {
  wrap: { marginTop: 40 },
  caption: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#8a7a6a",
    marginBottom: 14,
  },
  card: {
    background: "#eee9df",
    border: "1px solid #d4c9b5",
    borderRadius: 8,
    padding: "20px 24px 24px",
  },
  refLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  refText: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#8a7a6a",
    letterSpacing: 1,
  },
  refSpacer: { flex: 1 },
  refDots: { display: "flex", gap: 4 },
  dot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  legend: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "0 4px",
  },
  legendRow: { display: "flex", alignItems: "flex-start", gap: 12 },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 3,
    flexShrink: 0,
    marginTop: 3,
  },
  legendLabel: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.5,
    lineHeight: 1.2,
  },
  legendDesc: {
    fontSize: 13,
    color: "#5a4e40",
    marginTop: 2,
    lineHeight: 1.45,
    fontFamily: "'Crimson Pro', Georgia, serif",
  },
  hint: {
    marginTop: 18,
    padding: "12px 16px",
    background: "rgba(201,169,110,0.1)",
    borderLeft: "3px solid #c9a96e",
    borderRadius: 4,
    fontSize: 13,
    lineHeight: 1.6,
    color: "#6b5d4e",
    fontFamily: "'Crimson Pro', Georgia, serif",
    fontStyle: "italic",
  },
};
