"use client";
import Link from "next/link";
import BarChart from "@/components/BarChart";
import { CHAPTERS, TOPICS } from "@/lib/content";

function pagesNum(p) {
  if (!p) return 0;
  let m = String(p).match(/(\d+)\s*[–\-—]\s*(\d+)/);
  if (m) return +m[2] - +m[1] + 1;
  m = String(p).match(/p+\.\s*(\d+)/);
  return m ? 1 : 0;
}

export default function Visuals() {
  const perCh = CHAPTERS.map((c) => ["Ch " + c.num, pagesNum(c.pages)]);
  const parts = {};
  TOPICS.forEach((t) => { const c = CHAPTERS.find((x) => x.id === t.chapterId); if (c) parts[c.part] = (parts[c.part] || 0) + 1; });
  const prac = CHAPTERS.map((c) => {
    let q = 0, f = 0;
    (c.topics || []).forEach((t) => { q += (t.quiz || []).length; f += (t.flashcards || []).length; });
    return ["Ch " + c.num, q + f];
  });
  return (
    <>
      <h1 className="h1">Visual Knowledge Library</h1>
      <p className="sub">The book&rsquo;s data as diagrams, drawn from the lessons you have read.</p>
      <div className="card">
        <h3 className="h3">Where the book spends its pages</h3>
        <p className="hint">Pages per chapter across the two parts.</p>
        <BarChart rows={perCh} unit=" pp" />
      </div>
      <div className="card">
        <h3 className="h3">Lessons per part</h3>
        <BarChart rows={Object.entries(parts)} unit=" lessons" />
      </div>
      <div className="card">
        <h3 className="h3">Coverage map</h3>
        <p className="hint">Every chapter and its page span, colour-coded by part.</p>
        <div className="wtable">
          {CHAPTERS.map((c) => (
            <div className="wrow" key={c.id}>
              <span className="wcell k">Ch {c.num}</span>
              <span className="wcell g"><Link href={"/learn/chapter/" + c.id}>{c.title}</Link></span>
              <span className="wcell">{c.pages}</span>
              <span className={"wcell tag " + (c.part === "Biology" ? "tB" : "tP")}>{c.part}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="h3">Practice density</h3>
        <p className="hint">Questions and flashcards behind each chapter.</p>
        <BarChart rows={prac} unit=" cards" />
      </div>
    </>
  );
}
