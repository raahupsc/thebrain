import { notFound } from "next/navigation";
import { CHAPTERS, TOPICS } from "@/lib/content";
import DeckView from "./DeckView";

export function generateStaticParams() {
  const params = [{ deck: "all" }];
  CHAPTERS.forEach((c) => {
    if ((c.topics || []).some((t) => (t.flashcards || []).length)) params.push({ deck: c.id });
  });
  TOPICS.forEach((t) => {
    if ((t.flashcards || []).length) params.push({ deck: t.id });
  });
  return params;
}

export default function DeckPage({ params }) {
  return <DeckView deck={params.deck} />;
}
