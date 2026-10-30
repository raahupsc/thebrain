import { notFound } from "next/navigation";
import { TOPICS } from "@/lib/content";
import QuizPage from "./QuizPage";

export function generateStaticParams() {
  return TOPICS.filter((t) => (t.quiz || []).length > 0).map((t) => ({ id: t.id }));
}

export default function QuizRoute({ params }) {
  const t = TOPICS.find((x) => x.id === params.id);
  if (!t) notFound();
  return <QuizPage id={params.id} />;
}
