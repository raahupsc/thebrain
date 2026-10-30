"use client";
import { useState } from "react";
import { recordQuiz, bumpStreak } from "@/lib/progress";
import Link from "next/link";

const letters = ["A", "B", "C", "D", "E", "F"];

export default function Quiz({ questions, storeKey, backLabel = "Back", backHref = "#" }) {
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = questions[i];

  if (finished) {
    return (
      <div className="card q-result">
        <h3 className="h3">You scored {score} / {questions.length}</h3>
        <p className="hint">
          {score === questions.length ? "Perfect. This set is locked in." : "Good work. Re-read the lesson and try again any time."}
        </p>
        <div className="meta-row">
          <Link className="btn" href={backHref}>{backLabel}</Link>
          <button className="btn ghost" onClick={() => { setI(0); setAnswered(null); setScore(0); setFinished(false); }}>Retake</button>
        </div>
      </div>
    );
  }

  function pick(oi) {
    if (answered !== null) return;
    setAnswered(oi);
    if (oi === q.answer) setScore((s) => s + 1);
  }
  function next() {
    if (i < questions.length - 1) { setI(i + 1); setAnswered(null); }
    else {
      recordQuiz(storeKey, { score, total: questions.length });
      bumpStreak();
      setFinished(true);
    }
  }

  return (
    <div className="q-card">
      <div className="q-idx">Question {i + 1} of {questions.length}</div>
      <div className="q-text">{q.q}</div>
      <div className="opts">
        {q.options.map((o, oi) => (
          answered === null ? (
            <button key={oi} className="opt" onClick={() => pick(oi)}>
              {letters[oi]}. {o}
            </button>
          ) : (
            <div key={oi} className={"opt " + (oi === q.answer ? "correct" : oi === answered ? "wrong" : "")}>
              {letters[oi]}. {o}
              {oi === q.answer ? <span className="opt-tag">✓ correct</span> : oi === answered ? <span className="opt-tag">✗ your pick</span> : null}
            </div>
          )
        ))}
      </div>
      {answered !== null && (
        <div className="q-explain"><strong>Why:</strong> {q.explain}</div>
      )}
      {answered !== null && (
        <div className="q-nav">
          <button className="btn" onClick={next}>{i < questions.length - 1 ? "Next question" : "See result"}</button>
        </div>
      )}
    </div>
  );
}
