import { notFound } from "next/navigation";
import { TOPICS } from "@/lib/content";
import TopicView from "./TopicView";

export function generateStaticParams() {
  return TOPICS.map((t) => ({ id: t.id }));
}

export default function TopicPage({ params }) {
  const t = TOPICS.find((x) => x.id === params.id);
  if (!t) notFound();
  return <TopicView id={params.id} />;
}
