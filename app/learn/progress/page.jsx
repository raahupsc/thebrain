"use client";
import Link from "next/link";
import { useProgress, resetProgress } from "@/lib/progress";
import { CHAPTERS, TOPICS, SIMS } from "@/lib/content";

export default function Progress() {
  const store = useProgress();
  const read = TOPICS.filter((t) => store.read[t.id]).length;
  const q = Object.values(store.quiz);
  const qAvg = q.length ? Math.round(q.reduce((a, b) => a + b.score / b.total, 0) / q.length * 100) : 0;
  return (
    <>
      <h1 className="h1">My Progress</h1>
      <div className="stats">
        <div className="stat"><div className="big-num">{Math.round(read / TOPICS.length * 100)}%</div><div className="lbl">Course read</div></div>
        <div className="stat"><div className="big-num">{qAvg}%</div><div className="lbl">Average quiz score</div></div>
        <div className="stat"><div className="big-num">{Object.keys(store.simDone).length}/{SIMS.length}</div><div className="lbl">Simulations run</div></div>
        <div className="stat"><div className="big-num">{store.streak.count}</div><div className="lbl">Day streak</div></div>
      </div>
      <div className="card">
        <h3 className="h3">Lessons read, chapter by chapter</h3>
        <div className="wtable">
          {CHAPTERS.map((c) => {
            const ts = c.topics || [];
            const d = ts.filter((t) => store.read[t.id]).length;
            const pct = ts.length ? Math.round(d / ts.length * 100) : 0;
            return (
              <div className="wrow" key={c.id}>
                <span className="wcell k">Ch {c.num}</span>
                <span className="wcell g"><Link href={"/learn/chapter/" + c.id}>{c.title}</Link></span>
                <span className="wcell hbar-t"><span className="hbar-f" style={{ width: pct + "%" }} /></span>
                <span className="wcell">{d}/{ts.length}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <h3 className="h3">Quiz history</h3>
        {q.length === 0 ? (
          <p className="hint">No quizzes taken yet. Start at the <Link href="/learn/practice">Practice Centre</Link>.</p>
        ) : (
          <div className="wtable">
            {Object.entries(store.quiz).map(([k, v]) => {
              const t = k.split(".")[0];
              const tt = TOPICS.find((x) => x.id === t) || CHAPTERS.find((x) => x.id === t);
              return (
                <div className="wrow" key={k}>
                  <span className="wcell g">{tt ? tt.title : t}</span>
                  <span className="wcell">{v.score}/{v.total}</span>
                  <span className="wcell gray">{new Date(v.ts).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="card">
        <h3 className="h3">Flashcards known</h3>
        <p className="hint">{Object.keys(store.flashKnown).length} cards marked as known.</p>
      </div>
      <div className="meta-row">
        <button className="btn ghost" onClick={() => { if (confirm("Erase all reading, quiz, flashcard and streak progress?")) resetProgress(); }}>
          Reset all progress
        </button>
      </div>
    </>
  );
}
