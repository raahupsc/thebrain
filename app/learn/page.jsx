"use client";
import Link from "next/link";
import { useProgress, markRead, bumpStreak } from "@/lib/progress";
import { CHAPTERS, TOPICS, REGIONS, SIMS, totalQuestions, PLATES } from "@/lib/content";
import Plate from "@/components/Plate";

export default function Dashboard() {
  const store = useProgress();
  const readCount = TOPICS.filter((t) => store.read[t.id]).length;
  const quizDone = Object.keys(store.quiz).length;
  const regSeen = Object.keys(store.regionSeen).length;
  const next = TOPICS.find((t) => !store.read[t.id]);
  const parts = [
    ["Biology", "The physical brain: neurons, senses, sleep and fear.", "Book pages 5\u201345"],
    ["Psychology", "The thinking brain: emotions, lying, learning and illusions.", "Book pages 59\u201396"],
  ];
  return (
    <>
      <div className="hero">
        <div>
          <h1 className="h1">Your brain, decoded.</h1>
          <p className="sub">
            A complete interactive course built from <em>Understanding The Brain</em> (Future PLC, 100 pages):{" "}
            {CHAPTERS.length} chapters, {TOPICS.length} lessons, {REGIONS.length} brain structures,{" "}
            {SIMS.length} simulations and {totalQuestions} practice questions.
          </p>
          <div className="meta-row">
            <Link className="btn" href={next ? "/learn/topic/" + next.id : "/learn/library"}>
              {next ? "Continue where you left off" : "Start the course"}
            </Link>
            <Link className="btn ghost" href="/learn/practice">Practice Centre</Link>
          </div>
        </div>
        <Plate k="neuron" className="hero-plate" />
      </div>
      <div className="stats">
        <div className="stat"><div className="big-num">{readCount}/{TOPICS.length}</div><div className="lbl">Lessons read</div></div>
        <div className="stat"><div className="big-num">{quizDone}</div><div className="lbl">Quizzes taken</div></div>
        <div className="stat"><div className="big-num">{regSeen}/{REGIONS.length}</div><div className="lbl">Regions explored</div></div>
        <div className="stat"><div className="big-num">{store.streak.count}</div><div className="lbl">Day streak</div></div>
      </div>
      <div className="grid two">
        <div className="card">
          <h3 className="h3">Start where you left off</h3>
          {next ? (
            <>
              <p className="hint">Next unread lesson:</p>
              <Link className="btn" href={"/learn/topic/" + next.id}>{next.title}</Link>{" "}
              <span className="page-ref">{next.pages}</span>
            </>
          ) : (
            <>
              <p className="done-badge">✓ Every lesson read. Try the Practice Centre for chapter tests.</p>
              <Link className="btn ghost" href="/learn/practice">Open Practice Centre</Link>
            </>
          )}
        </div>
        <div className="card">
          <h3 className="h3">Jump into</h3>
          <div className="jump-grid">
            <Link className="chip" href="/learn/explorer">Brain Explorer</Link>
            <Link className="chip" href="/learn/lab">Laboratory</Link>
            <Link className="chip" href="/learn/flashcards">Flashcards</Link>
            <Link className="chip" href="/learn/visuals">Visual Library</Link>
          </div>
        </div>
      </div>
      <h2 className="h2">The two parts of the course</h2>
      <div className="grid two">
        {parts.map(([name, desc, pages]) => (
          <div className="card" key={name}>
            <h3 className="h3">{name}</h3>
            <p className="hint">{desc}</p>
            <p className="small gray">{pages} &middot; {CHAPTERS.filter((c) => c.part === name).length} chapters</p>
            {CHAPTERS.filter((c) => c.part === name).map((c) => (
              <div className="topic-row" key={c.id}>
                <Link className="t-main" href={"/learn/chapter/" + c.id}>
                  <span className="t-idx">Ch {c.num}</span>{" "}{c.title}
                </Link>
                <span className="page-ref">{c.pages}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <h2 className="h2">From the archives</h2>
      <p className="sub">The drawings that built this science, a century before imaging. The Brain Explorer maps these structures on the brain itself.</p>
      <div className="plate-strip">
        <Plate k="purkinje" /><Plate k="cerebellum" /><Plate k="gray" />
      </div>
      <p className="foot-note">Historical imagery: Santiago Ram&oacute;n y Cajal, Henry Gray and others, via Wikimedia Commons (public domain and Creative Commons licences). Course content from <em>Understanding The Brain</em>, Future PLC.</p>
    </>
  );
}
