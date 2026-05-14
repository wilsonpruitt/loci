import Link from "next/link";
import { BOOKS, getBook } from "@/data/books";
import LandingExample from "@/components/LandingExample";

export default function Home() {
  const leviticus = getBook("leviticus");
  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", color: "#2c2418" }}>
      <header
        style={{
          background: "#2c2418",
          color: "#f5f0e8",
          padding: "64px 24px 56px",
          textAlign: "center",
        }}
      >
        <div style={{ color: "#c9a96e", letterSpacing: 12, marginBottom: 14, fontSize: 14 }}>
          — ✦ —
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 72,
            fontWeight: 700,
            margin: 0,
            letterSpacing: 18,
          }}
        >
          LOCI
        </h1>
        <div
          style={{
            width: 80,
            height: 1,
            background: "#c9a96e",
            margin: "16px auto",
          }}
        />
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            color: "#c9a96e",
            fontSize: 19,
            letterSpacing: 2,
            margin: 0,
          }}
        >
          Each book, its own lens
        </p>
      </header>

      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "48px 24px 80px",
          fontFamily: "'Crimson Pro', Georgia, serif",
        }}
      >
        <p style={{ fontSize: 17, lineHeight: 1.75, color: "#4a3d30" }}>
          A small Wroot Press project. <em>Loci</em> — Latin for the places, or
          topics, of a book — are the threads each scriptural book holds. We
          take books readers skip for being strange, dense, or distant, and we
          read them through themes drawn from the book itself, not imported from
          elsewhere. Themes appear as colors inline with the scripture. Overlap
          shows where the text holds more than one thing at once.
        </p>

        {leviticus && <LandingExample book={leviticus} pericopeId="5.1" />}

        <h2
          style={{
            marginTop: 48,
            marginBottom: 16,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#8a7a6a",
          }}
        >
          The Books
        </h2>

        <div style={{ display: "grid", gap: 16 }}>
          {BOOKS.map((b) => (
            <Link
              key={b.slug}
              href={`/${b.slug}`}
              style={{
                display: "block",
                padding: "20px 24px",
                background: "#eee9df",
                border: "1px solid #d4c9b5",
                borderRadius: 6,
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: 4,
                  color: "#2c2418",
                }}
              >
                {b.name.toUpperCase()}
              </div>
              {b.subtitle && (
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    color: "#8a7a6a",
                    fontSize: 15,
                    marginTop: 4,
                    letterSpacing: 1,
                  }}
                >
                  {b.subtitle}
                </div>
              )}
            </Link>
          ))}
        </div>

        <p
          style={{
            marginTop: 48,
            fontSize: 12,
            color: "#8a7a6a",
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Scripture: World English Bible · Public Domain · Wroot Press
        </p>
      </main>
    </div>
  );
}
