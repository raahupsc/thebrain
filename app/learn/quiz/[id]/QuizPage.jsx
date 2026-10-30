"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { topicById } from "@/lib/content";
import Quiz from "@/components/Quiz";

export default function QuizPage({ id }) {
  const store = useProgress();
  const t = topicById(id);
  if (!t) return null;
  const best = store.quiz[t.id + ".quiz"];
  return (
    <>
      <div className="breadcrumb">
        <Link className="crumb" href="/learn">Dashboard</Link> <span className="crumb-sep">›</span>{" "}
        <Link className="crumb" href={"/learn/topic/" + t.id}>{t.title}</Link> <span className="crumb-sep">›</span>{" "}
        <span>Quiz</span>
      </div>
      <h1 className="h1">Quiz: {t.title}</h1>
      <span className="page-ref">{t.pages}</span>
      {best && (
        <div className="card">
          <h3 className="h3">Best attempt: {best.score}/{best.total}</h3>
          <Link className="btn ghost" href="/learn/practice">Practice Centre</Link>
        </div>
      )}
      <Quiz questions={t.quiz} storeKey={t.id + ".quiz"} backLabel="Back to lesson" backHref={"/learn/topic/" + t.id} />
    </>
  );
}
