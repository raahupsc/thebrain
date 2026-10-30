import { notFound } from "next/navigation";
import { CHAPTERS } from "@/lib/content";
import TestView from "./TestView";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ id: c.id }));
}

export default function TestPage({ params }) {
  const c = CHAPTERS.find((x) => x.id === params.id);
  if (!c) notFound();
  return <TestView id={params.id} />;
}
