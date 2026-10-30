"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { CHAPTERS } from "@/lib/content";

export default function Library() {
  const store = useProgress();
  return (
    <>
      <h1 className="h1">Learning Library</h1>
      <p className="sub">All {CHAPTERS.length} chapters of the book, each broken into short lessons. Green = every lesson read.</p>
      <div className="chapter-grid">
        {CHAPTERS.map((c) => {
          const ts = c.topics || [];
          const done = ts.length && ts.every((t) => store.read[t.id]);
          return (
            <div className={"card chapter-card" + (done ? " done" : "")} key={c.id}>
              <h3 className="h3"><Link href={"/learn/chapter/" + c.id}>Chapter {c.num}. {c.title}</Link></h3>
              <span className="page-ref">{c.pages}</span>
              <p className="hint">{(c.intro || "").slice(0, 140)}{(c.intro || "").length > 140 ? "…" : ""}</p>
              <div className="meta-row">
                <span className="chip small">{c.part}</span>
                <span className="chip small">{ts.length} lessons</span>
                {done ? <span className="done-badge">✓ read</span> : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
