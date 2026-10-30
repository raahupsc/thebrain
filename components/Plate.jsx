import { PLATES } from "@/lib/content";

export default function Plate({ k, className = "" }) {
  const p = PLATES[k];
  if (!p) return null;
  return (
    <figure className={"plate " + className}>
      <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" />
      <figcaption>{p.cap}</figcaption>
    </figure>
  );
}