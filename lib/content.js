import data from "./data.json";

export const META = data.meta;
export const CHAPTERS = data.chapters;
export const REGIONS = data.brainRegions;
export const SIMS = data.sims;
export const GLOSSARY = data.glossary;

export const TOPICS = CHAPTERS.flatMap((c) =>
  (c.topics || []).map((t) => ({ ...t, chapterId: c.id, chapterNum: c.num, chapterTitle: c.title }))
);
export const topicById = (id) => TOPICS.find((t) => t.id === id);
export const chById = (id) => CHAPTERS.find((c) => c.id === id);
export const regionById = (id) => REGIONS.find((r) => r.id === id);
export const simById = (id) => SIMS.find((s) => s.id === id);
export const allFlash = TOPICS.flatMap((t) =>
  (t.flashcards || []).map((f) => ({ ...f, topic: t.id, topicTitle: t.title }))
);
export const partName = (p) =>
  p === "Biology" ? "Part I: The Biology of the Brain" :
  p === "Psychology" ? "Part II: The Psychology of the Brain" : p;
export const totalQuestions = TOPICS.reduce((n, t) => n + (t.quiz || []).length, 0);
export const totalFlash = allFlash.length;

export const PLATES = {
  purkinje: { src: "/thebrain/archives/purkinje-cajal.png", alt: "Purkinje cells of the cerebellum, drawing by Santiago Ramon y Cajal", cap: "Purkinje cells of the cerebellum, drawn by Santiago Ramon y Cajal. Public domain, via Wikimedia Commons.", w: 359, h: 500 },
  cerebellum: { src: "/thebrain/archives/cajal-cerebellum.jpg", alt: "Cajal's drawing of cerebellar cortex", cap: "Cerebellar cortex, drawn by Santiago Ramon y Cajal. Public domain, via Wikimedia Commons.", w: 350, h: 205 },
  gray: { src: "/thebrain/archives/gray728-brain.png", alt: "Lateral surface of the human cerebral hemisphere, from Gray's Anatomy", cap: "Lateral surface of the cerebral hemisphere, from Gray's Anatomy (1918). Public domain, via Wikimedia Commons.", w: 500, h: 348 },
  gage: { src: "/thebrain/archives/gage-daguerreotype.jpg", alt: "Daguerreotype portrait of Phineas Gage", cap: "Phineas Gage, whose injury reshaped what medicine knew about the frontal lobes. CC BY-SA 3.0, via Wikimedia Commons.", w: 216, h: 282 },
  brodmann: { src: "/thebrain/archives/brodmann-frontal.png", alt: "Brodmann areas mapped on the lateral frontal lobe", cap: "Brodmann areas of the lateral frontal lobe. CC BY 4.0, via Wikimedia Commons.", w: 873, h: 667 },
  neuron: { src: "/thebrain/archives/neuron-diagram.png", alt: "Labelled diagram of a neuron", cap: "The structure of a neuron. Public domain, via Wikimedia Commons.", w: 1920, h: 1398 },
};
export const chapterPlates = ["purkinje", "brodmann", "gage", "cerebellum"];
