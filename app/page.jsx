import Link from "next/link";
import { CHAPTERS, TOPICS, REGIONS, SIMS, totalQuestions, totalFlash, PLATES, META } from "@/lib/content";
import Plate from "@/components/Plate";

function ChapterRows({ part }) {
  return CHAPTERS.filter((c) => c.part === part).map((c) => (
    <Link key={c.id} className="ch" href={"/learn/chapter/" + c.id}>
      <span className="ch-n">{c.num}</span>
      <span className="ch-t">{c.title}</span>
    </Link>
  ));
}

export default function Landing() {
  const stats = [
    [String(CHAPTERS.length), "Chapters"],
    [String(TOPICS.length), "Lessons"],
    [String(REGIONS.length), "Brain structures"],
    [String(SIMS.length), "Simulations"],
    [String(totalQuestions), "Practice questions"],
  ];
  return (
    <>
      <div className="landing-top">
        <Link className="brand" href="/"><span className="dot" />THE BRAIN</Link>
        <nav>
          <Link href="/learn/library">Library</Link>
          <Link href="/learn/explorer">Brain Explorer</Link>
          <Link href="/learn/practice">Practice</Link>
          <Link className="btn" href="/learn">Start learning</Link>
        </nav>
      </div>

      <section className="landing-hero">
        <div>
          <div className="eyebrow">An interactive course in neuroscience</div>
          <h1>Your brain, decoded.</h1>
          <p className="lede">
            A complete interactive course built from <em>{META.source}</em> (Future PLC, 100 pages):
            {CHAPTERS.length} chapters and {TOPICS.length} lessons, an explorer that maps the living brain,
            step-by-step simulations, {totalFlash} flashcards and {totalQuestions} practice questions.
          </p>
          <div className="landing-cta">
            <Link className="btn" href="/learn">Start learning</Link>
            <Link className="btn ghost" href="/learn/library">Browse the library</Link>
          </div>
        </div>
        <Plate k="gray" className="hero-plate" />
      </section>

      <div className="stat-band">
        <div className="inner">
          {stats.map(([n, l]) => (
            <div className="s" key={l}><b>{n}</b><span>{l}</span></div>
          ))}
        </div>
      </div>

      <section className="landing-sec">
        <div className="eyebrow">What&rsquo;s inside</div>
        <h2>Four ways in, one subject mastered.</h2>
        <p className="sec-sub">
          Every lesson comes straight from the book, with its page reference intact, and every feature
          feeds the same goal: actually understanding how the brain works.
        </p>
        <div className="feature-grid">
          <Link className="feature" href="/learn/library">
            <div className="f-num">01</div>
            <h3>Read the course</h3>
            <p>{CHAPTERS.length} chapters broken into {TOPICS.length} short lessons. Each one opens with the puzzle it answers, explains the mechanism, then closes with takeaways.</p>
            <span className="f-go">Open the library &rarr;</span>
          </Link>
          <Link className="feature" href="/learn/explorer">
            <div className="f-num">02</div>
            <h3>Explore the brain</h3>
            <p>Twelve structures mapped on an interactive brain, from the wrinkled cortex to the cerebellum, each linked back to the lessons that cover it.</p>
            <span className="f-go">Open the explorer &rarr;</span>
          </Link>
          <Link className="feature" href="/learn/lab">
            <div className="f-num">03</div>
            <h3>Run the machinery</h3>
            <p>{SIMS.length} step-by-step simulations of the processes the book describes: an action potential, a night of sleep, the fear response and more.</p>
            <span className="f-go">Enter the lab &rarr;</span>
          </Link>
          <Link className="feature" href="/learn/practice">
            <div className="f-num">04</div>
            <h3>Practice and remember</h3>
            <p>{totalQuestions} quiz questions, chapter tests, {totalFlash} flashcards with page references, and a progress page that keeps the score.</p>
            <span className="f-go">Practice &rarr;</span>
          </Link>
        </div>
      </section>

      <section className="landing-sec" style={{ paddingTop: 0 }}>
        <div className="eyebrow">The course</div>
        <h2>Twenty chapters, two parts.</h2>
        <p className="sec-sub">
          Part I builds the physical brain: neurons, senses, sleep and fear. Part II turns to the thinking
          brain: emotions, lying, learning and illusions.
        </p>
        <div className="parts-grid">
          <div className="part-col">
            <div className="p-kind">Part I</div>
            <h3>Biology</h3>
            <p className="p-desc">The physical brain: neurons, senses, sleep and fear.</p>
            <p className="p-meta">Book pages 5&ndash;45 &middot; 12 chapters</p>
            <ChapterRows part="Biology" />
          </div>
          <div className="part-col">
            <div className="p-kind">Part II</div>
            <h3>Psychology</h3>
            <p className="p-desc">The thinking brain: emotions, lying, learning and illusions.</p>
            <p className="p-meta">Book pages 59&ndash;96 &middot; 8 chapters</p>
            <ChapterRows part="Psychology" />
          </div>
        </div>
      </section>

      <section className="landing-sec" style={{ paddingTop: 0 }}>
        <div className="eyebrow">From the archives</div>
        <h2>Drawn before it could be photographed.</h2>
        <p className="sec-sub">
          The science in this course was built on drawings like these, made a century before brain imaging.
          The plates run through the lessons and the explorer.
        </p>
        <div className="plate-strip">
          <Plate k="purkinje" />
          <Plate k="cerebellum" />
          <Plate k="brodmann" />
        </div>
        <p className="foot-note">
          Historical imagery: Santiago Ram&oacute;n y Cajal, Henry Gray, Korbinian Brodmann and others, via
          Wikimedia Commons (public domain and Creative Commons licences). Course content from <em>{META.source}</em>, Future PLC.
        </p>
      </section>

      <section className="landing-cta-band">
        <div className="inner">
          <div>
            <h2>Start where the book starts.</h2>
            <p>Chapter 1: Your Brain Explained. Your progress keeps itself as you go.</p>
          </div>
          <Link className="btn on-ink" href="/learn">Begin the course</Link>
        </div>
      </section>

      <footer className="landing-foot">
        <span>THE BRAIN &mdash; an interactive course in neuroscience</span>
        <span>Content from {META.source}, Future PLC. Historical plates via Wikimedia Commons.</span>
      </footer>
    </>
  );
}
