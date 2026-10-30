"use client";
import Link from "next/link";
import { useState } from "react";
import { useProgress, markRead } from "@/lib/progress";
import { topicById, chById } from "@/lib/content";

const INTRO_KEYS = [["What it is", "what"], ["Why it matters", "why"], ["Where it happens", "where"], ["The puzzle", "problem"]];

export default function TopicView({ id }) {
  const store = useProgress();
  const [saved, setSaved] = useState(false);
  const t = topicById(id);
  if (!t) return null;
  const c = chById(t.chapterId);
  const read = !!store.read[t.id];
  return (
    <article className="reading">
      <div className="breadcrumb">
        <Link className="crumb" href="/learn">Dashboard</Link> <span className="crumb-sep">›</span>{" "}
        <Link className="crumb" href="/learn/library">Library</Link> <span className="crumb-sep">›</span>{" "}
        <Link className="crumb" href={"/learn/chapter/" + c.id}>Chapter {c.num}</Link> <span className="crumb-sep">›</span>{" "}
        <span>{t.title}</span>
      </div>
      <h1 className="h1">{t.title}</h1>
      <span className="page-ref">{t.pages}</span>
      {t.intro && (
        <div className="intro-grid">
          {INTRO_KEYS.map(([label, k]) => t.intro[k] ? (
            <div className="intro-item" key={k}><div className="label">{label}</div><p>{t.intro[k]}</p></div>
          ) : null)}
        </div>
      )}
      {t.explanation && <><h2 className="h2">The idea</h2><p>{t.explanation}</p></>}
      {t.mechanism && <><h2 className="h2">How it works</h2><div className="example-box"><p>{t.mechanism}</p></div></>}
      {t.components && t.components.length > 0 && (
        <><h2 className="h2">Key components</h2><ul className="fact-list">{t.components.map((x, i) => <li key={i}>{x}</li>)}</ul></>
      )}
      {t.examples && t.examples.length > 0 && (
        <><h2 className="h2">Examples</h2>
          {t.examples.map((e, i) => (
            <div className="example-box" key={i}>
              <strong>{e.title}</strong>
              <p>{e.text}</p>
              {e.mechanism ? <p className="note-sup">Mechanism: {e.mechanism}</p> : null}
            </div>
          ))}
        </>
      )}
      {t.connections && t.connections.length > 0 && (
        <><h2 className="h2">Connects to</h2><ul className="fact-list">{t.connections.map((x, i) => <li key={i}>{x}</li>)}</ul></>
      )}
      {t.takeaways && t.takeaways.length > 0 && (
        <div className="takeaways">
          <h3 className="h3">Takeaways</h3>
          <ul className="fact-list">{t.takeaways.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      )}
      {t.glossary && t.glossary.length > 0 && (
        <><h2 className="h2">Terms in this lesson</h2>
          <div className="tp">{t.glossary.map((g, i) => <Link className="chip small" href="/learn/glossary" key={i}>{typeof g === "string" ? g : g.term}</Link>)}</div>
        </>
      )}
      <div className="lesson-foot">
        <button className="btn" onClick={() => { markRead(t.id); setSaved(true); }}>
          {saved || read ? "✓ Saved to your progress" : "Mark lesson as read"}
        </button>{" "}
        {t.quiz && t.quiz.length > 0 && <Link className="btn ghost" href={"/learn/quiz/" + t.id}>Take the quiz ({t.quiz.length} questions)</Link>}
        <Link className="btn ghost" href={"/learn/flashcards/" + t.id}>Flashcards</Link>
      </div>
    </article>
  );
}
