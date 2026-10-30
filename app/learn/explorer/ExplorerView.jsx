"use client";
import Link from "next/link";
import { useProgress, saveStore } from "@/lib/progress";
import { REGIONS, TOPICS } from "@/lib/content";
import Plate from "@/components/Plate";

export const BRAIN_SVG = '<svg class="brain-svg" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Outline of the human brain with marked regions"><path d="M14,46 C10,36 16,26 28,20 C38,15 52,13 62,17 C74,20 86,26 88,36 C90,45 84,52 74,55 C70,63 60,68 50,66 C44,70 34,68 30,62 C20,60 12,54 14,46 Z" fill="#dcd8ca" stroke="#1c1914" stroke-width="0.7"/><path d="M28,20 C36,26 40,34 38,44 M48,14 C50,24 48,36 44,48 M62,17 C60,28 62,40 58,52 M76,24 C72,34 74,44 70,54" fill="none" stroke="#1f5c46" stroke-width="0.55" opacity=".7"/><path d="M30,60 C34,58 40,60 44,63 M52,65 C58,63 64,60 68,58" fill="none" stroke="#1f5c46" stroke-width="0.55" opacity=".7"/></svg>';

export function regionData(r) {
  const lessons = (r.lessons || []).map((lid) => {
    const t = TOPICS.find((x) => x.id === lid);
    return t ? { id: lid, title: t.title } : null;
  }).filter(Boolean);
  return { lessons };
}

export default function ExplorerView() {
  const store = useProgress();
  function visit(r) {
    store.regionSeen[r.id] = Date.now();
    saveStore();
  }
  return (
    <>
      <h1 className="h1">Brain Explorer</h1>
      <p className="sub">{REGIONS.length} structures of the brain. Tap a point to inspect it. Each card links back to the lessons that cover it.</p>
      <div className="explorer-grid">
        <div>
          <div className="brain-wrap">
            <div dangerouslySetInnerHTML={{ __html: BRAIN_SVG }} />
            {REGIONS.map((r) => (
              <Link
                key={r.id}
                className={"hotspot" + (store.regionSeen[r.id] ? " seen" : "")}
                style={{ left: r.x + "%", top: r.y + "%" }}
                href={"/learn/explorer/" + r.id}
                title={r.name}
                onClick={() => visit(r)}
              >
                <span className="pulse-ring" />
              </Link>
            ))}
          </div>
        </div>
        <div className="card region-panel">
          <h3 className="h3">Pick a region</h3>
          <p className="hint">Twelve structures are marked on the map, from the wrinkled outer cortex to the fist-sized cerebellum at the back.</p>
          <Plate k="gray" />
          <div className="tp">
            {REGIONS.map((r) => (
              <Link key={r.id} className="chip small" href={"/learn/explorer/" + r.id}>{r.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
