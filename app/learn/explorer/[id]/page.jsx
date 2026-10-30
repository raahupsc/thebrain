import { notFound } from "next/navigation";
import { REGIONS } from "@/lib/content";
import RegionView from "./RegionView";

export function generateStaticParams() {
  return REGIONS.map((r) => ({ id: r.id }));
}

export default function RegionPage({ params }) {
  const r = REGIONS.find((x) => x.id === params.id);
  if (!r) notFound();
  return <RegionView id={params.id} />;
}
