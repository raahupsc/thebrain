"use client";
import { useEffect, useState } from "react";

const KEY = "thebrain.progress.v2";
const EMPTY = { read: {}, quiz: {}, flashKnown: {}, simDone: {}, regionSeen: {}, streak: { last: null, count: 0 } };
let store = { ...EMPTY, read: {}, quiz: {}, flashKnown: {}, simDone: {}, regionSeen: {}, streak: { last: null, count: 0 } };
let loaded = false;
const subs = new Set();

function freshEmpty() {
  return { read: {}, quiz: {}, flashKnown: {}, simDone: {}, regionSeen: {}, streak: { last: null, count: 0 } };
}

export function loadStore() {
  if (loaded || typeof window === "undefined") return;
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s) store = { ...freshEmpty(), ...s };
  } catch (e) {}
  loaded = true;
}
export function saveStore() {
  try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  subs.forEach((f) => f());
}
function todayKey() { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
export function bumpStreak() {
  const t = todayKey();
  if (store.streak.last !== t) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    const yt = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
    store.streak.count = store.streak.last === yt ? store.streak.count + 1 : 1;
    store.streak.last = t;
    saveStore();
  }
}
export function markRead(id) { store.read[id] = Date.now(); saveStore(); bumpStreak(); }
export function recordQuiz(key, result) { store.quiz[key] = { ...result, ts: Date.now() }; saveStore(); }
export function resetProgress() { store = freshEmpty(); saveStore(); }
export function getStore() { return store; }

export function useProgress() {
  const [, tick] = useState(0);
  useEffect(() => {
    loadStore();
    const f = () => tick((x) => x + 1);
    subs.add(f);
    tick((x) => x + 1);
    return () => { subs.delete(f); };
  }, []);
  return store;
}
