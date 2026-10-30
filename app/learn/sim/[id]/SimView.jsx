"use client";
import Link from "next/link";
import { useState } from "react";
import { useProgress, saveStore, bumpStreak } from "@/lib/progress";
import { simById, chById, CHAPTERS } from "@/lib/content";

export default function SimView({ id }) {
  const store = useProgress();
  const s = simById(id);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  if (!s) return null;
  const ch = chById(s.chapter);
  const firstTopic = ch && ch.topics && ch.topics.length ? ch.topics[0].id : null;
  const last = step === s.steps.length - 1;

  function finish() {
    store.simDone[s.id] = Date.now();
    saveStore();
    bumpStreak();
    setDone(true);
  }

  return (
    <>
      <div className="breadcrumb">
        <Link className="crumb" href="/learn">Dashboard</Link> <span className="crumb-sep">›</span>{" "}
        <Link className="crumb" href="/learn/lab">Laboratory</Link> <span className="crumb-sep">›</span>{" "}
        <span>{s.title}</span>
      </div>
      <h1 className="h1">{s.title}</h1>
      {ch ? <span className="page-ref">Chapter {ch.num}</span> : null}
      <p className="sub">{s.desc}</p>
      {done ? (
        <div className="card">
          <h3 className="h3">Simulation complete ✓</h3>
          <p className="hint">{s.title} now shows as completed in the Laboratory.</p>
          <div className="meta-row">
            <Link className="btn" href="/learn/lab">Back to the Laboratory</Link>
            {firstTopic ? <Link className="btn ghost" href={"/learn/topic/" + firstTopic}>Read the chapter behind this sim</Link> : null}
          </div>
        </div>
      ) : (
        <>
          <div className="sim-stage">
            <div className="sim-visual">
              <div className={"sim-circle" + (step === 0 ? " idle" : " fired")}>{step === 0 ? "○" : last ? "✓" : "●"}</div>
            </div>
            <div className="sim-caption">
              <strong>Step {step + 1} of {s.steps.length}</strong>
              <p>{s.steps[step]}</p>
            </div>
          </div>
          <div className="sim-controls">
            <button className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
            <button className="btn" onClick={() => last ? finish() : setStep(step + 1)}>{last ? "Finish" : "Next step"}</button>
          </div>
          <div className="sim-steps">
            {s.steps.map((st, i) => (
              <div className={"sim-step" + (i === step ? " open" : "") + (i < step ? " past" : "")} key={i}>
                <span className="q-idx">{i + 1}</span> {st}
              </div>
            ))}
          </div>
          {firstTopic ? <Link className="btn ghost" href={"/learn/topic/" + firstTopic}>Read the chapter behind this sim</Link> : null}
        </>
      )}
    </>
  );
}
