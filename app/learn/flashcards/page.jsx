"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { CHAPTERS, allFlash, totalFlash } from "@/lib/content";

export default function Flashcards() {
  const store = useProgress();
  return (
    <>
      <h1 className="h1">Flashcards</h1>
      <p className="sub">{totalFlash} cards drawn from every lesson, each answer carrying its page reference.</p>
      <div className="card">
        <h3 className="h3">Pick a deck</h3>
        <div className="chapter-grid">
          {CHAPTERS.map((c) => {
            const n = (c.topics || []).reduce((s, t) => s + (t.flashcards || []).length, 0);
            if (!n) return null;
            return (
              <div className="card" key={c.id}>
                <h3 className="h3">Ch {c.num}. {c.title}</h3>
                <p className="hint">{n} cards</p>
                <div className="meta-row">
                  <Link className="btn small" href={"/learn/flashcards/" + c.id}>Study chapter</Link>
                </div>
                <div className="tp">
                  {(c.topics || []).filter((t) => (t.flashcards || []).length).map((t) => (
                    <Link key={t.id} className="chip small" href={"/learn/flashcards/" + t.id}>{t.title}</Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="meta-row">
        <Link className="btn" href="/learn/flashcards/all">Study everything ({totalFlash} cards)</Link>
      </div>
    </>
  );
}
