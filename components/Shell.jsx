"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useProgress } from "@/lib/progress";
import { META } from "@/lib/content";

const NAV = [
  ["Dashboard", "/learn"],
  ["Learning Library", "/learn/library"],
  ["Brain Explorer", "/learn/explorer"],
  ["Laboratory", "/learn/lab"],
  ["Visual Library", "/learn/visuals"],
  ["Practice Centre", "/learn/practice"],
  ["Flashcards", "/learn/flashcards"],
  ["Glossary", "/learn/glossary"],
  ["My Progress", "/learn/progress"],
];

export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const store = useProgress();

  function submit(e) {
    e.preventDefault();
    if (q.trim()) { router.push("/learn/search?q=" + encodeURIComponent(q.trim())); setQ(""); }
  }
  const isActive = (href) => href === "/learn" ? pathname === "/learn" : pathname.startsWith(href);

  return (
    <>
      <header className="topbar">
        <button className="menu-btn" onClick={() => setNavOpen(!navOpen)}>MENU</button>
        <Link className="brand" href="/learn"><span className="dot" />THE BRAIN</Link>
        <form className="search" onSubmit={submit}>
          <input type="search" placeholder="Search lessons, terms, structures…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <span className="streak">Streak <b>{store.streak.count}</b></span>
      </header>
      <div className="app-body">
        <nav className={"sidenav" + (navOpen ? " show" : "")}>
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={"nav-item" + (isActive(href) ? " active" : "")} onClick={() => setNavOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="side-foot">
            Content source:<br /><em>{META.source}</em>, Future PLC (100 pp)
          </div>
        </nav>
        {navOpen && <div className="overlay show" onClick={() => setNavOpen(false)} />}
        <main className="main">{children}</main>
      </div>
    </>
  );
}
