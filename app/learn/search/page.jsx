"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TOPICS, CHAPTERS, REGIONS, GLOSSARY, SIMS } from "@/lib/content";

function Results() {
  const sp = useSearchParams();
  const raw = (sp.get("q") || "").toLowerCase().trim();
  if (!raw) return <p className="hint">Type a search in the bar above.</p>;
  const out = [];
  TOPICS.forEach((t) => {
    const c = CHAPTERS.find((x) => x.id === t.chapterId);
    const hay = (t.title + " " + t.pages + " " + ((t.intro && Object.values(t.intro).join(" ")) || "") + " " + (t.explanation || "") + " " + (c ? c.title : "")).toLowerCase();
    if (hay.indexOf(raw) >= 0) out.push({ type: "Lesson", title: t.title, sub: (c ? c.title + " · " : "") + t.pages, href: "/learn/topic/" + t.id });
  });
  REGIONS.forEach((r) => {
    if ((r.name + " " + r.function).toLowerCase().indexOf(raw) >= 0) out.push({ type: "Brain region", title: r.name, sub: r.function.slice(0, 80), href: "/learn/explorer/" + r.id });
  });
  GLOSSARY.forEach((g) => {
    if ((g.term + " " + g.def).toLowerCase().indexOf(raw) >= 0) out.push({ type: "Glossary", title: g.term, sub: g.def.slice(0, 80), href: "/learn/glossary" });
  });
  SIMS.forEach((s) => {
    if ((s.title + " " + s.desc).toLowerCase().indexOf(raw) >= 0) out.push({ type: "Simulation", title: s.title, sub: s.desc.slice(0, 80), href: "/learn/sim/" + s.id });
  });
  const hits = out.slice(0, 12);
  return (
    <>
      <p className="sub">{hits.length ? hits.length + " results for \u201C" + raw + "\u201D" : "Nothing found for \u201C" + raw + "\u201D. Try a shorter word, like \u201Cneuron\u201D or \u201Csleep\u201D."}</p>
      {hits.map((r, i) => (
        <div className="topic-row" key={i}>
          <Link className="t-main" href={r.href}>
            <span className="t-idx">{r.type}</span>{" "}{r.title}
          </Link>
          <span className="hint">{r.sub}</span>
        </div>
      ))}
    </>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<p className="hint">Searching…</p>}>
      <h1 className="h1">Search</h1>
      <Results />
    </Suspense>
  );
}
