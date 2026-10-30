import { notFound } from "next/navigation";
import { CHAPTERS, chapterPlates } from "@/lib/content";
import ChapterView from "./ChapterView";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: c.id }));
}

export default function ChapterPage({ params }) {
  const c = CHAPTERS.find((x) => x.id === params.id);
  if (!c) notFound();
  return <ChapterView id={params.id} />;
}
