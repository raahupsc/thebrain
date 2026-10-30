import { notFound } from "next/navigation";
import { SIMS } from "@/lib/content";
import SimView from "./SimView";

export function generateStaticParams() {
  return SIMS.map((s) => ({ id: s.id }));
}

export default function SimPage({ params }) {
  const s = SIMS.find((x) => x.id === params.id);
  if (!s) notFound();
  return <SimView id={params.id} />;
}
