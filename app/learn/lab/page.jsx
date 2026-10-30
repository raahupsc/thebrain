"use client";
import Link from "next/link";
import { useProgress } from "@/lib/progress";
import { SIMS, chById } from "@/lib/content";

export default function Lab() {
  const store = useProgress();
  return (
    <>
      <h1 className="h1">Neuroscience Laboratory</h1>
      <p className="sub">{SIMS.length} step-by-step simulations of the processes the book describes. Step through each one and watch the sequence unfold.</p>
      <div className="grid three">
        {SIMS.map((s) => {
          const c = chById(s.chapter);
          return (
            <div className="card" key={s.id}>
              <h3 className="h3">{s.title}</h3>
              <span className="page-ref">{c ? "Ch. " + c.num : ""}</span>
              <p className="hint">{s.desc}</p>
              <div className="meta-row">
                {store.simDone[s.id] ? <span className="done-badge">✓ Completed</span> : null}
                <Link className="btn small" href={"/learn/sim/" + s.id}>Run</Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
