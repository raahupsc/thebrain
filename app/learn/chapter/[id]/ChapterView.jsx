"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { chById, chapterPlates } from "@/lib/content";
import Plate from "@/components/Plate";

export default function ChapterView({ id }) {
  const store = useProgress();
  const c = chById(id);
  if (!c) return null;
  const plateKey = chapterPlates[(c.num - 1) % 4];
  return (
    <>
      <h1 className="h1">Chapter {c.num}. {c.title}</h1>
      <span className="page-ref">{c.pages}</span>
      <p className="sub">{c.intro}</p>
      <Plate k={plateKey} className="chapter-plate" />
      {c.objectives && c.objectives.length > 0 && (
        <div className="card">
          <h3 className="h3">What you will learn</h3>
          <ul className="fact-list">{c.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
        </div>
      )}
      <h2 className="h2">Lessons in this chapter</h2>
      {(c.topics || []).map((t, ti) => (
        <div className={"card topic-card" + (store.read[t.id] ? " done" : "")} key={t.id}>
          <div className="t-head">
            <span className="t-idx">{c.num}.{ti + 1}</span>
            <h3 className="h3"><Link href={"/learn/topic/" + t.id}>{t.title}</Link></h3>
            <span className="page-ref">{t.pages}</span>
          </div>
          <p className="hint">{(t.intro && t.intro.what) || ""}</p>
          <div className="meta-row">
            <span className="chip small">{(t.quiz || []).length} questions</span>
            <span className="chip small">{(t.flashcards || []).length} flashcards</span>
            {store.read[t.id] ? <span className="done-badge">✓ read</span> : null}
          </div>
        </div>
      ))}
    </>
  );
}
