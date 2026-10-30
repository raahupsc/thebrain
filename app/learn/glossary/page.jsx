"use client";
import Link from "next/link";
import { useState } from "react";
import { GLOSSARY } from "@/lib/content";

export default function Glossary() {
  const [q, setQ] = useState("");
  const v = q.toLowerCase();
  return (
    <>
      <h1 className="h1">Glossary</h1>
      <p className="sub">{GLOSSARY.length} terms from across the book, each linked to its chapter and page.</p>
      <input className="gl-input" type="search" placeholder="Filter terms…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="chapter-grid">
        {GLOSSARY.filter((g) => (g.term + " " + g.def).toLowerCase().includes(v)).map((g) => (
          <div className="card gl-card" key={g.term}>
            <h3 className="h3">{g.term}</h3>
            <p>{g.def}</p>
            <div className="meta-row">
              <span className="page-ref">{g.page}</span>
              <Link className="chip small" href={"/learn/chapter/" + g.chapter}>{g.chapter_title || g.chapter}</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
