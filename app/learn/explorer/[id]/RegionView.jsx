"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useProgress, saveStore } from "@/lib/progress";
import { regionById, REGIONS } from "@/lib/content";
import ExplorerView, { regionData } from "../ExplorerView";

export default function RegionView({ id }) {
  const store = useProgress();
  const r = regionById(id);
  useEffect(() => {
    if (r && !store.regionSeen[r.id]) { store.regionSeen[r.id] = Date.now(); saveStore(); }
  }, [r]);
  if (!r) return null;
  const { lessons } = regionData(r);
  return (
    <>
      <div className="breadcrumb">
        <Link className="crumb" href="/learn">Dashboard</Link> <span className="crumb-sep">›</span>{" "}
        <Link className="crumb" href="/learn/explorer">Brain Explorer</Link> <span className="crumb-sep">›</span>{" "}
        <span>{r.name}</span>
      </div>
      <h1 className="h1">{r.name}</h1>
      {r.latin ? <p className="hint">{r.latin}</p> : null}
      <p><strong>Location.</strong> {r.location}</p>
      <p><strong>Anatomy.</strong> {r.anatomy}</p>
      <p><strong>Function.</strong> {r.function}</p>
      {r.connected && r.connected.length ? <p><strong>Works with.</strong> {r.connected.join("; ")}</p> : null}
      {r.processes && r.processes.length ? <p><strong>Processes.</strong> {r.processes.join(", ")}</p> : null}
      {r.disorders && r.disorders.length ? <p><strong>When it goes wrong.</strong> {r.disorders.join("; ")}</p> : null}
      {lessons.length ? (
        <>
          <p className="label">Lessons</p>
          <div className="tp">{lessons.map((l) => <Link key={l.id} className="chip small" href={"/learn/topic/" + l.id}>{l.title}</Link>)}</div>
        </>
      ) : null}
      <div className="meta-row" style={{ marginTop: 18 }}>
        <Link className="btn ghost" href="/learn/explorer">Back to map</Link>
      </div>
      <div className="meta-row" style={{ marginTop: 10 }}>
        {REGIONS.filter((x) => x.id !== r.id).slice(0, 6).map((x) => (
          <Link key={x.id} className="chip small" href={"/learn/explorer/" + x.id}>{x.name}</Link>
        ))}
      </div>
    </>
  );
}
