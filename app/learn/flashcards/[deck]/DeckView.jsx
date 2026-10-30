"use client";
import Link from "next/link";
import { useState } from "react";
import { useProgress, saveStore, bumpStreak } from "@/lib/progress";
import { chById, topicById, allFlash } from "@/lib/content";

function buildDeck(deck) {
  if (deck === "all") return { cards: allFlash, title: "All flashcards (" + allFlash.length + ")", back: { label: "Deck list", href: "/learn/flashcards" } };
  const c = chById(deck);
  if (c) {
    const cards = (c.topics || []).flatMap((t) => (t.flashcards || []).map((f) => ({ ...f, topic: t.id })));
    if (cards.length) return { cards, title: "Chapter " + c.num + ": " + c.title, back: { label: "Back to chapter", href: "/learn/chapter/" + c.id } };
  }
  const t = topicById(deck);
  if (t && (t.flashcards || []).length) {
    return { cards: t.flashcards.map((f) => ({ ...f, topic: t.id })), title: "Lesson: " + t.title, back: { label: "Back to lesson", href: "/learn/topic/" + t.id } };
  }
  return null;
}

export default function DeckView({ deck }) {
  const store = useProgress();
  const built = buildDeck(deck);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  if (!built) return <div className="empty">No cards in this deck.</div>;
  const cards = built.cards;
  const card = cards[i];
  const tt = topicById(card.topic);

  function know() {
    store.flashKnown[(card.topic || "") + ":" + (card.front || "").slice(0, 40)] = Date.now();
    saveStore();
    bumpStreak();
    setKnown((k) => k + 1);
    setI((i + 1) % cards.length);
    setFlipped(false);
  }

  return (
    <>
      <div className="breadcrumb">
        <Link className="crumb" href="/learn">Dashboard</Link> <span className="crumb-sep">›</span>{" "}
        <Link className="crumb" href="/learn/flashcards">Flashcards</Link> <span className="crumb-sep">›</span>{" "}
        <span>{built.title}</span>
      </div>
      <h1 className="h1">{built.title}</h1>
      <p className="hint">{cards.length} cards. Click the card to flip it, then say whether you knew it.</p>
      <div className="flash-stage">
        <div className={"flashcard" + (flipped ? " flipped" : "")} onClick={() => setFlipped(!flipped)}>
          <div className="flash-inner">
            <div className="flash-face flash-front">
              <div className="q-idx">Card {i + 1} / {cards.length}</div>
              <div className="flash-q">{card.front}</div>
              <div className="hint">Tap to reveal</div>
            </div>
            <div className="flash-face flash-back">
              <div className="flash-q">{card.back}</div>
              {tt ? <div className="hint">from {tt.title}</div> : null}
            </div>
          </div>
        </div>
      </div>
      <div className="flash-nav">
        <button className="btn ghost" onClick={() => { setI((i - 1 + cards.length) % cards.length); setFlipped(false); }}>Back</button>
        <span className="hint">Card {i + 1} of {cards.length} &middot; {known} known this session</span>
        <button className="btn ghost" onClick={() => { setI((i + 1) % cards.length); setFlipped(false); }}>Next</button>
      </div>
      <div className="meta-row">
        <button className="btn ghost" onClick={() => { setI((i + 1) % cards.length); setFlipped(false); }}>Still learning</button>
        <button className="btn" onClick={know}>I knew it ✓</button>
      </div>
      <div className="meta-row">
        <Link className="btn ghost" href={built.back.href}>{built.back.label}</Link>
        <Link className="btn ghost" href="/learn/flashcards">All decks</Link>
      </div>
    </>
  );
}
