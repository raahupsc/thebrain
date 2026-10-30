"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { CHAPTERS, TOPICS } from "@/lib/content";

export default function Practice() {
  const store = useProgress();
  return (
    <>
      <h1 className="h1">Practice Centre</h1>
      <p className="sub">Every quiz in one place. Take a lesson quiz or a whole-chapter test.</p>
      <h2 className="h2">Chapter tests</h2>
      <div className="chapter-grid">
        {CHAPTERS.map((c) => {
          const qs = (c.topics || []).flatMap((t) => (t.quiz || []).map((q) => ({ ...q, topic: t.id })));
          const best = store.quiz[c.id + ".test"];
          return (
            <div className="card" key={c.id}>
              <h3 className="h3">Ch {c.num}. {c.title}</h3>
              <p className="hint">{qs.length} questions from this chapter</p>
              <div className="meta-row">
                {best ? <span className="done-badge">best {best.score}/{best.total}</span> : null}
                <Link className="btn small" href={"/learn/practice/test/" + c.id}>Take test</Link>
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="h2">Lesson quizzes</h2>
      {TOPICS.filter((t) => (t.quiz || []).length > 0).map((t) => {
        const best = store.quiz[t.id + ".quiz"];
        return (
          <div className="topic-row" key={t.id}>
            <Link className="t-main" href={"/learn/quiz/" + t.id}>
              <span className="t-idx">{t.title}</span>
            </Link>
            <span className="page-ref">{t.pages}</span>
            {best ? <span className="done-badge">best {best.score}/{best.total}</span> : null}
          </div>
        );
      })}
    </>
  );
}
