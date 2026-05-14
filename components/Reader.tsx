"use client";

import { useState, useMemo, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import type { Book } from "@/lib/types";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap";

type TipState =
  | { kind: "single"; theme: string; x: number; y: number }
  | { kind: "passage"; themes: string[]; x: number; y: number }
  | null;

export default function Reader({ book }: { book: Book }) {
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [legendOpen, setLegendOpen] = useState(true);
  const [plainMode, setPlainMode] = useState(false);
  const [tip, setTip] = useState<TipState>(null);

  useEffect(() => {
    if (!document.getElementById("themes-fonts")) {
      const l = document.createElement("link");
      l.id = "themes-fonts";
      l.rel = "stylesheet";
      l.href = FONT_URL;
      document.head.appendChild(l);
    }
  }, []);

  const TAGS = book.themes;
  const showMarker = !!book.features?.marker;
  const maxMarkerLen = useMemo(
    () =>
      book.pericopes.reduce((m, p) => Math.max(m, p.marker?.length ?? 0), 0),
    [book]
  );
  const markerColWidth = maxMarkerLen > 1 ? 64 : 28;
  const markerFontSize = maxMarkerLen > 1 ? 13 : 22;

  const activeChapterSet = useMemo(() => {
    if (activeTags.size === 0) return null;
    const set = new Set<number>();
    book.pericopes.forEach((p) => {
      if (p.tags.some((t) => activeTags.has(t))) set.add(p.ch);
    });
    return set;
  }, [book, activeTags]);

  const singleActiveTheme =
    activeTags.size === 1 ? Array.from(activeTags)[0] : null;
  const tintTheme = singleActiveTheme ? TAGS[singleActiveTheme] : null;

  const chapters = useMemo(
    () => [...new Set(book.pericopes.map((p) => p.ch))].sort((a, b) => a - b),
    [book]
  );

  const visiblePassages = useMemo(() => {
    let p = book.pericopes.filter((x) => x.text.length > 0);
    if (activeChapter !== null) p = p.filter((x) => x.ch === activeChapter);
    return p;
  }, [book, activeChapter]);

  const toggleTag = (k: string) => {
    setActiveTags((prev) => {
      const n = new Set(prev);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });
  };

  const getHighlightStyle = (tags: string[]): CSSProperties => {
    if (plainMode) return {};
    const relevant =
      activeTags.size > 0 ? tags.filter((t) => activeTags.has(t)) : tags;

    if (relevant.length === 0 && activeTags.size > 0) {
      return { opacity: 0.25, transition: "opacity 0.3s" };
    }

    const primary = relevant[0];
    const secondary = relevant.slice(1);
    const isHovered = hoveredTag !== null && relevant.includes(hoveredTag);
    const tagData = TAGS[primary];

    const style: CSSProperties = {
      backgroundColor: isHovered ? tagData?.bgStrong : tagData?.bg,
      borderRadius: 3,
      padding: "2px 1px",
      transition: "all 0.3s ease",
      position: "relative",
      display: "inline",
    };

    if (secondary.length === 1) {
      style.borderBottom = `3px solid ${TAGS[secondary[0]]?.color}`;
    } else if (secondary.length === 2) {
      style.borderBottom = `3px solid ${TAGS[secondary[0]]?.color}`;
      style.borderTop = `3px solid ${TAGS[secondary[1]]?.color}`;
    } else if (secondary.length >= 3) {
      style.borderBottom = `3px solid ${TAGS[secondary[0]]?.color}`;
      style.borderTop = `3px solid ${TAGS[secondary[1]]?.color}`;
      style.borderLeft = `4px solid ${TAGS[secondary[2]]?.color}`;
    }

    return style;
  };

  const onPassageEnter = (e: React.MouseEvent, tags: string[]) => {
    setTip({ kind: "passage", themes: tags, x: e.clientX, y: e.clientY });
  };
  const onDotEnter = (e: React.MouseEvent, theme: string) => {
    e.stopPropagation();
    setTip({ kind: "single", theme, x: e.clientX, y: e.clientY });
  };
  const onLeave = () => setTip(null);

  const grouped = useMemo(() => {
    const map: Record<number, typeof book.pericopes> = {};
    visiblePassages.forEach((p) => {
      if (!map[p.ch]) map[p.ch] = [];
      map[p.ch].push(p);
    });
    return Object.entries(map).sort(([a], [b]) => +a - +b);
  }, [visiblePassages, book.pericopes]);

  return (
    <div style={S.root}>
      <style>{`
        .themes-passage:hover { background: rgba(201,185,154,0.08) !important; }
        .themes-home-link:hover { color: #f5f0e8 !important; }
        .themes-tag-btn:hover { transform: translateX(1px); }
        .themes-ch-btn:hover { background: rgba(92,64,51,0.12) !important; }
        @media (max-width: 800px) {
          .themes-layout { flex-direction: column !important; }
          .themes-sidebar { position: relative !important; width: 100% !important; max-height: none !important; border-right: none !important; border-bottom: 1px solid #d4c9b5 !important; }
          .themes-main { padding: 20px 16px !important; }
        }
      `}</style>

      <header style={S.header}>
        <Link href="/" className="themes-home-link" style={S.homeLink}>
          ← LOCI
        </Link>
        <div style={S.headerOrnament}>— ✦ —</div>
        <h1 style={S.title}>{book.name.toUpperCase()}</h1>
        <div style={S.titleRule} />
        {book.subtitle && <p style={S.subtitle}>{book.subtitle}</p>}
        <p style={S.credit}>{book.translation}</p>
      </header>

      <div className="themes-layout" style={S.layout}>
        <aside className="themes-sidebar" style={S.sidebar}>
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            style={S.legendToggle}
          >
            {legendOpen ? "▾" : "▸"} Theme Legend
          </button>

          {legendOpen && (
            <div style={S.tagList}>
              {Object.entries(TAGS).map(([key, tag]) => {
                const active = activeTags.has(key);
                const count = book.pericopes.filter((p) =>
                  p.tags.includes(key)
                ).length;
                return (
                  <button
                    key={key}
                    className="themes-tag-btn"
                    onClick={() => toggleTag(key)}
                    onMouseEnter={() => setHoveredTag(key)}
                    onMouseLeave={() => setHoveredTag(null)}
                    style={{
                      ...S.tagBtn,
                      backgroundColor: active ? tag.bg : "transparent",
                      borderLeft: `4px solid ${active ? tag.color : "transparent"}`,
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    <span
                      style={{
                        ...S.tagSwatch,
                        backgroundColor: tag.bg,
                        border: `2px solid ${tag.color}`,
                      }}
                    />
                    <span
                      style={{ flex: 1, color: active ? tag.color : "#4a3d30" }}
                    >
                      {tag.label}
                    </span>
                    <span style={{ ...S.tagCount, color: tag.color }}>
                      {count}
                    </span>
                  </button>
                );
              })}

              {activeTags.size > 0 && (
                <button
                  onClick={() => setActiveTags(new Set())}
                  style={S.clearBtn}
                >
                  Show all themes
                </button>
              )}
            </div>
          )}

          <div style={S.modeRow}>
            <button
              onClick={() => setPlainMode(!plainMode)}
              style={{
                ...S.modeBtn,
                background: plainMode ? "#4a3d30" : "transparent",
                color: plainMode ? "#f5f0e8" : "#4a3d30",
              }}
            >
              {plainMode ? "Show highlights" : "Hide highlights"}
            </button>
          </div>

          <div style={S.chapterNav}>
            <div style={S.chapterLabel}>Chapters</div>
            <div style={S.chapterGrid}>
              {chapters.map((ch) => {
                const isActive = activeChapter === ch;
                const hasText = book.pericopes.some(
                  (p) => p.ch === ch && p.text.length > 0
                );
                const inActiveSet =
                  activeChapterSet === null || activeChapterSet.has(ch);
                const faded = activeChapterSet !== null && !inActiveSet;

                let bg = "transparent";
                let color = hasText ? "#4a3d30" : "#c0b8a8";
                let borderColor = hasText ? "#c9b99a" : "#e0dbd0";

                if (isActive) {
                  bg = "#4a3d30";
                  color = "#f5f0e8";
                  borderColor = "#4a3d30";
                } else if (faded) {
                  color = "#c8bfae";
                  borderColor = "#e8e0d0";
                } else if (tintTheme && hasText) {
                  bg = tintTheme.bg;
                  color = tintTheme.color;
                  borderColor = tintTheme.color;
                }

                return (
                  <button
                    key={ch}
                    className="themes-ch-btn"
                    onClick={() =>
                      setActiveChapter(activeChapter === ch ? null : ch)
                    }
                    style={{
                      ...S.chBtn,
                      backgroundColor: bg,
                      color,
                      borderColor,
                      opacity: faded ? 0.4 : 1,
                      fontWeight: !isActive && inActiveSet && tintTheme ? 600 : 500,
                    }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
            {activeChapter && (
              <button
                onClick={() => setActiveChapter(null)}
                style={S.clearBtn}
              >
                Show all chapters
              </button>
            )}
          </div>

          {book.howToRead && (
            <div style={S.howTo}>{book.howToRead}</div>
          )}
        </aside>

        <main className="themes-main" style={S.main}>
          {grouped.map(([ch, passages]) => (
            <div key={ch} style={S.chapterBlock}>
              <div style={S.chapterHead}>
                <span style={S.chapterNum}>Chapter {ch}</span>
              </div>

              {passages.map((p) => (
                <div
                  key={p.id}
                  className="themes-passage"
                  style={S.passage}
                >
                  <div style={S.refLine}>
                    {showMarker && (
                      <span
                        style={{
                          ...S.marker,
                          width: markerColWidth,
                          fontSize: markerFontSize,
                          fontStyle: maxMarkerLen > 1 ? "italic" : "normal",
                          opacity: p.marker ? 1 : 0,
                          textAlign: maxMarkerLen > 1 ? "right" : "center",
                          paddingRight: maxMarkerLen > 1 ? 8 : 0,
                        }}
                        aria-hidden={!p.marker}
                      >
                        {p.marker || "·"}
                      </span>
                    )}
                    <span style={S.refText}>{p.ref}</span>
                    <span style={S.refSpacer} />
                    <span style={S.refDots}>
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          onMouseEnter={(e) => onDotEnter(e, t)}
                          onMouseLeave={onLeave}
                          onClick={() => toggleTag(t)}
                          style={{
                            ...S.dot,
                            backgroundColor: TAGS[t]?.color,
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </span>
                  </div>
                  <p
                    onMouseEnter={(e) => onPassageEnter(e, p.tags)}
                    onMouseLeave={onLeave}
                    style={{ ...S.scriptureText, ...getHighlightStyle(p.tags) }}
                  >
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          ))}

          {visiblePassages.length === 0 && (
            <div style={S.empty}>
              {activeChapter
                ? `Chapter ${activeChapter} text not yet loaded.`
                : "No passages to display."}
            </div>
          )}
        </main>
      </div>

      <footer style={S.footer}>
        Scripture: {book.translation} · Thematic annotations for study
      </footer>

      {tip && (
        <div
          style={{
            ...S.tooltip,
            left: Math.min(tip.x + 16, (typeof window !== "undefined" ? window.innerWidth : 1200) - 320),
            top: tip.y + 18,
          }}
        >
          {(tip.kind === "single" ? [tip.theme] : tip.themes).map((k) => {
            const t = TAGS[k];
            if (!t) return null;
            return (
              <div key={k} style={S.tooltipRow}>
                <span
                  style={{
                    ...S.tooltipSwatch,
                    backgroundColor: t.bgStrong,
                    border: `2px solid ${t.color}`,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...S.tooltipLabel, color: t.color }}>{t.label}</div>
                  {t.description && (
                    <div style={S.tooltipDesc}>{t.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const S: Record<string, CSSProperties> = {
  root: {
    fontFamily: "'Crimson Pro', 'Georgia', serif",
    background: "#f5f0e8",
    minHeight: "100vh",
    color: "#2c2418",
  },
  header: {
    background: "#2c2418",
    padding: "44px 24px 36px",
    textAlign: "center",
    position: "relative",
  },
  homeLink: {
    position: "absolute",
    top: 20,
    left: 24,
    color: "#c9a96e",
    textDecoration: "none",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 3,
    transition: "color 0.15s",
  },
  headerOrnament: {
    color: "#c9a96e",
    fontSize: 16,
    letterSpacing: 12,
    marginBottom: 12,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 52,
    fontWeight: 700,
    color: "#f5f0e8",
    margin: 0,
    letterSpacing: 14,
  },
  titleRule: {
    width: 80,
    height: 1,
    backgroundColor: "#c9a96e",
    margin: "14px auto",
  },
  subtitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 19,
    color: "#c9a96e",
    margin: 0,
    fontStyle: "italic",
    letterSpacing: 2,
  },
  credit: {
    fontSize: 11,
    color: "#7a6e60",
    margin: "10px 0 0",
    letterSpacing: 1.5,
  },
  layout: { display: "flex", maxWidth: 1100, margin: "0 auto" },
  sidebar: {
    width: 260,
    flexShrink: 0,
    padding: "20px 16px",
    borderRight: "1px solid #d4c9b5",
    background: "#eee9df",
    position: "sticky",
    top: 0,
    maxHeight: "100vh",
    overflowY: "auto",
  },
  legendToggle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 15,
    fontWeight: 600,
    color: "#4a3d30",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    letterSpacing: 1,
    textTransform: "uppercase",
    width: "100%",
    textAlign: "left",
    marginBottom: 10,
  },
  tagList: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 },
  tagBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 8px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
    fontSize: 13.5,
    transition: "all 0.15s ease",
    textAlign: "left",
  },
  tagSwatch: { width: 12, height: 12, borderRadius: 3, flexShrink: 0 },
  tagCount: { fontSize: 11, fontWeight: 600, opacity: 0.7 },
  clearBtn: {
    marginTop: 8,
    padding: "5px 12px",
    border: "none",
    borderRadius: 4,
    background: "rgba(74,61,48,0.08)",
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
    fontSize: 12,
    color: "#8a7a6a",
    width: "100%",
    textAlign: "center",
  },
  modeRow: { marginBottom: 14 },
  modeBtn: {
    width: "100%",
    padding: "7px 10px",
    border: "1px solid #c9b99a",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
    transition: "all 0.15s",
  },
  chapterNav: {
    borderTop: "1px solid #d4c9b5",
    paddingTop: 14,
    marginTop: 8,
  },
  chapterLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#4a3d30",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  chapterGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 },
  chBtn: {
    padding: "4px 0",
    border: "1px solid #c9b99a",
    borderRadius: 3,
    cursor: "pointer",
    fontFamily: "'Crimson Pro', serif",
    fontSize: 12,
    fontWeight: 500,
    textAlign: "center",
    transition: "all 0.15s",
    background: "transparent",
  },
  howTo: {
    marginTop: 16,
    padding: 12,
    background: "rgba(201,169,110,0.1)",
    borderRadius: 6,
    fontSize: 12,
    lineHeight: 1.6,
    color: "#6b5d4e",
    borderLeft: "3px solid #c9a96e",
  },
  main: { flex: 1, padding: "32px 40px", minWidth: 0 },
  chapterBlock: { marginBottom: 40 },
  chapterHead: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid #d4c9b5",
  },
  chapterNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 24,
    fontWeight: 600,
    color: "#4a3d30",
    letterSpacing: 2,
  },
  passage: {
    marginBottom: 20,
    padding: "8px 12px",
    borderRadius: 6,
    transition: "background 0.2s",
  },
  refLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  marker: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 600,
    color: "#8a7a6a",
    width: 28,
    textAlign: "center",
    flexShrink: 0,
    lineHeight: 1,
  },
  refText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#8a7a6a",
    letterSpacing: 1,
    flexShrink: 0,
  },
  refSpacer: { flex: 1 },
  refDots: { display: "flex", gap: 4, flexShrink: 0 },
  dot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  tooltip: {
    position: "fixed",
    zIndex: 100,
    background: "#fdfaf2",
    border: "1px solid #d4c9b5",
    borderRadius: 8,
    padding: "10px 12px",
    maxWidth: 300,
    boxShadow: "0 8px 24px rgba(44,36,24,0.18), 0 2px 4px rgba(44,36,24,0.10)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    pointerEvents: "none",
    fontFamily: "'Crimson Pro', Georgia, serif",
  },
  tooltipRow: { display: "flex", alignItems: "flex-start", gap: 10 },
  tooltipSwatch: {
    width: 14,
    height: 14,
    borderRadius: 3,
    flexShrink: 0,
    marginTop: 3,
  },
  tooltipLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.5,
    lineHeight: 1.2,
  },
  tooltipDesc: {
    fontSize: 12.5,
    color: "#5a4e40",
    marginTop: 3,
    lineHeight: 1.45,
  },
  scriptureText: {
    fontSize: 17,
    lineHeight: 1.85,
    color: "#2c2418",
    margin: 0,
    fontFamily: "'Crimson Pro', serif",
    fontWeight: 300,
  },
  empty: {
    textAlign: "center",
    padding: "80px 24px",
    color: "#a09080",
    fontStyle: "italic",
    fontSize: 16,
  },
  footer: {
    textAlign: "center",
    padding: "20px",
    borderTop: "1px solid #d4c9b5",
    fontSize: 11,
    color: "#a09080",
    letterSpacing: 0.5,
    background: "#eee9df",
  },
};
