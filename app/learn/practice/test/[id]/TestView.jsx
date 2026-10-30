"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { chById } from "@/lib/content";
import Quiz from "@/components/Quiz";

export default function TestView({ id }) {
  const store = useProgress();
  const c = chById(id);
  if (!c) return null;
  const qs = (c.topics || []).flatMap((t) => (t.quiz || []).map((q) => ({ ...q, topic: t.id })));
  const best = store.quiz[c.id + ".test"];
  return (
    <>
      <div className="breadcrumb">
        <Link className="crumb" href="/learn">Dashboard</Link> <span className="crumb-sep">›</span>{" "}
        <Link className="crumb" href="/learn/practice">Practice Centre</Link> <span className="crumb-sep">›</span>{" "}
        <span>Test: {c.title}</span>
      </div>
      <h1 className="h1">Chapter {c.num} test: {c.title}</h1>
      <span className="page-ref">{c.pages}</span>
      {best ? (
        <div className="card"><h3 className="h3">Best attempt: {best.score}/{best.total}</h3></div>
      ) : null}
      <Quiz questions={qs} storeKey={c.id + ".test"} backLabel="Back to chapter" backHref={"/learn/chapter/" + c.id} />
    </>
  );
}
