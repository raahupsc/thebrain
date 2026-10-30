/* THE BRAIN - Interactive Learning Hub. Content: Understanding The Brain (Future PLC). */
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const P=(o)=>Object.assign({},o);
/* ---------- progress store ---------- */
const STORE_KEY="thebrain.progress.v1";
let store={read:{},quiz:{},flashKnown:{},simDone:{},regionSeen:{},streak:{last:null,count:0}};
function loadStore(){try{const s=JSON.parse(localStorage.getItem(STORE_KEY));if(s)store=Object.assign(store,s);}catch(e){}}
function saveStore(){try{localStorage.setItem(STORE_KEY,JSON.stringify(store));}catch(e){}}
function todayKey(){const d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();}
function bumpStreak(){const t=todayKey();if(store.streak.last!==t){const y=new Date();y.setDate(y.getDate()-1);const yt=y.getFullYear()+"-"+(y.getMonth()+1)+"-"+y.getDate();store.streak.count=(store.streak.last===yt)?store.streak.count+1:1;store.streak.last=t;saveStore();}$("#streakCount").textContent=store.streak.count;}
function markRead(topicId){store.read[topicId]=Date.now();saveStore();bumpStreak();}
/* ---------- data helpers ---------- */
const CH=()=>DATA.chapters, TOPICS=()=>{const a=[];CH().forEach(c=>(c.topics||[]).forEach(t=>a.push(t)));return a;};
const topicById=id=>TOPICS().find(t=>t.id===id), chById=id=>CH().find(c=>c.id===id);
const regionById=id=>DATA.brainRegions.find(r=>r.id===id), simById=id=>DATA.sims.find(s=>s.id===id);
const allFlash=()=>TOPICS().flatMap(t=>(t.flashcards||[]).map(f=>Object.assign({topic:t.id,topicTitle:t.title},f)));
const partName=p=>p==="Biology"?"Part I: The Biology of the Brain":p==="Psychology"?"Part II: The Psychology of the Brain":p;
/* ---------- router ---------- */
const routes={};
function go(h){location.hash=h;}
function route(){const h=location.hash.replace(/^#\/?/,"")||"dashboard";const r=h.split("/")[0];const arg=h.slice(r.length+1);const fn=routes[r]||routes.dashboard;$$("#sidenav .nav-item").forEach(n=>n.classList.toggle("active",n.dataset.route===r));$("#main").innerHTML="";fn(arg);window.scrollTo(0,0);closeNav();}
function reg(name,fn){routes[name]=fn;}
function h(html){const m=$("#main");m.innerHTML=html;}
function crumbs(items){return '<div class="breadcrumb">'+items.map(i=>i[1]?'<a href="#/'+i[1]+'" class="crumb">'+esc(i[0])+"</a>":'<span>'+esc(i[0])+"</span>").join(' <span class="crumb-sep">›</span> ')+"</div>";}
/* ---------- shared UI ---------- */
function pageRef(txt){return txt?'<span class="page-ref" title="Page in the source book">'+esc(txt)+"</span>":"";}
function quizCard(q,i,total,onAnswer,answered){let html='<div class="q-card"><div class="q-idx">Question '+(i+1)+" of "+total+'</div><div class="q-text">'+esc(q.q)+"</div>";
 if(answered===null){html+='<div class="opts">'+q.options.map((o,oi)=>'<button class="opt" data-oi="'+oi+'">'+String.fromCharCode(65+oi)+". "+esc(o)+"</button>").join("")+"</div>";}
 else{html+='<div class="opts">'+q.options.map((o,oi)=>'<div class="opt '+(oi===q.answer?"correct":oi===answered?"wrong":"")+'">'+String.fromCharCode(65+oi)+". "+esc(o)+(oi===q.answer?' <span class="opt-tag">✓ correct</span>':oi===answered?' <span class="opt-tag">✗ your pick</span>':"")+"</div>").join("")+'<div class="q-explain"><strong>Why:</strong> '+esc(q.explain)+"</div>";}
 return html+"</div>";}
function bindQuiz(container,qs,storeKey,onDone){let i=0,answered=null,score=0;const render=()=>{container.innerHTML=quizCard(qs[i],i,qs.length,0,answered);if(answered===null){$$(".opt",container).forEach(b=>b.onclick=()=>{answered=+b.dataset.oi;if(answered===qs[i].answer)score++;render();});}else{const nav=document.createElement("div");nav.className="q-nav";const btn=document.createElement("button");btn.className="btn";btn.textContent=(i<qs.length-1)?"Next question":"See result";btn.onclick=()=>{if(i<qs.length-1){i++;answered=null;render();}else{store.quiz[storeKey]={score:score,total:qs.length,ts:Date.now()};saveStore();onDone&&onDone(score,qs.length);}};nav.appendChild(btn);container.appendChild(nav);}};render();}
/* ---------- DASHBOARD ---------- */
reg("dashboard",()=>{
 const chs=CH(),topics=TOPICS();
 const readCount=topics.filter(t=>store.read[t.id]).length;
 const quizDone=Object.keys(store.quiz).length;
 const regSeen=Object.keys(store.regionSeen).length;
 const totalQ=topics.reduce((n,t)=>n+(t.quiz||[]).length,0);
 let html=crumbs([["Dashboard"]]);
 html+='<h1 class="h1">Your brain, decoded.</h1><p class="sub">A complete interactive course built from <em>Understanding The Brain</em> (Future PLC, 100 pages): '+chs.length+" chapters, "+topics.length+" lessons, "+DATA.brainRegions.length+" brain structures, "+DATA.sims.length+" simulations and "+totalQ+" practice questions.</p>";
 html+='<div class="stats"><div class="stat"><div class="big-num">'+readCount+"/"+topics.length+'</div><div class="lbl">Lessons read</div></div><div class="stat"><div class="big-num">'+quizDone+'</div><div class="lbl">Quizzes taken</div></div><div class="stat"><div class="big-num">'+regSeen+"/"+DATA.brainRegions.length+'</div><div class="lbl">Regions explored</div></div><div class="stat"><div class="big-num">🔥 '+store.streak.count+'</div><div class="lbl">Day streak</div></div></div>';
 html+='<div class="grid two"><div class="card"><h3 class="h3">Start where you left off</h3>';
 const next=topics.find(t=>!store.read[t.id]);
 html+=next?'<p class="hint">Next unread lesson:</p><a class="btn" href="#/topic/'+next.id+'">'+esc(next.title)+"</a>"+pageRef(next.pages):'<p class="done-badge">✔ Every lesson read. Try the Practice Centre for chapter tests.</p><a class="btn ghost" href="#/practice">Open Practice Centre</a>';
 html+='</div><div class="card"><h3 class="h3">Jump into</h3><div class="jump-grid"><a class="chip" href="#/explorer">🧠 Brain Explorer</a><a class="chip" href="#/lab">🔬 Laboratory</a><a class="chip" href="#/flashcards">🃏 Flashcards</a><a class="chip" href="#/visuals">📊 Visual Library</a></div></div></div>';
 html+='<h2 class="h2">The two parts of the course</h2><div class="grid two">';
 [["Biology","The physical brain: neurons, senses, sleep and fear.",5,45],["Psychology","The thinking brain: emotions, lying, learning and illusions.",59,96]].forEach(p=>{
  const ps=chs.filter(c=>c.part===p[0]);
  html+='<div class="card"><h3 class="h3">'+p[0]+"</h3><p class=\"hint\">"+p[1]+'</p><p class="small gray">Book pages '+p[2]+"–"+p[3]+" · "+ps.length+" chapters</p>";
  html+=ps.map(c=>'<div class="topic-row"><a class="t-main" href="#/chapter/'+c.id+'"><span class="t-idx">Ch '+c.num+"</span>"+esc(c.title)+"</a>"+pageRef(c.pages)+"</div>").join("")+"</div>";});
 html+="</div>";h(html);});
/* ---------- LIBRARY ---------- */
reg("library",()=>{
 const chs=CH();
 let html=crumbs([["Dashboard","dashboard"],["Learning Library"]])+'<h1 class="h1">Learning Library</h1><p class="sub">All '+chs.length+' chapters of the book, each broken into short lessons. Green = every lesson read.</p><div class="chapter-grid">';
 chs.forEach(c=>{const ts=c.topics||[],done=ts.length&&ts.every(t=>store.read[t.id]);
  html+='<div class="card chapter-card'+(done?" done":"")+'"><div class="ch-num">Chapter '+c.num+'</div><h3 class="h3"><a href="#/chapter/'+c.id+'">'+esc(c.title)+"</a></h3>"+pageRef(c.pages)+'<p class="hint">'+esc((c.intro||"").slice(0,140))+(c.intro&&c.intro.length>140?"…":"")+'</p><div class="meta-row"><span class="chip small">'+(c.part==="Biology"?"Biology":"Psychology")+'</span><span class="chip small">'+ts.length+' lessons</span>'+(done?'<span class="done-badge">✔ read</span>':"")+'</div></div>';});
 h(html+"</div>");});
reg("chapter",id=>{
 const c=chById(id);if(!c){h('<div class="empty">Chapter not found.</div>');return;}
 let html=crumbs([["Dashboard","dashboard"],["Library","library"],["Chapter "+c.num+" · "+c.title]])+'<h1 class="h1">Chapter '+c.num+". "+esc(c.title)+"</h1>"+pageRef(c.pages)+'<p class="sub">'+esc(c.intro||"")+"</p>";
 if(c.objectives&&c.objectives.length)html+='<div class="card"><h3 class="h3">What you will learn</h3><ul class="fact-list">'+c.objectives.map(o=>"<li>"+esc(o)+"</li>").join("")+"</ul></div>";
 html+='<h2 class="h2">Lessons in this chapter</h2>';
 (c.topics||[]).forEach((t,ti)=>{html+='<div class="card topic-card'+(store.read[t.id]?" done":"")+'"><div class="t-head"><span class="t-idx">'+(c.num)+"."+(ti+1)+"</span><h3 class=\"h3\"><a href=\"#/topic/"+t.id+'">'+esc(t.title)+"</a></h3>"+pageRef(t.pages)+"</div><p class=\"hint\">"+esc((t.intro&&t.intro.what)||"")+'</p><div class="meta-row"><span class="chip small">'+((t.quiz||[]).length)+' questions</span><span class="chip small">'+((t.flashcards||[]).length)+' flashcards</span>'+(store.read[t.id]?'<span class="done-badge">✔ read</span>':"")+"</div></div>";});
 h(html);});
reg("topic",id=>{
 const t=topicById(id);if(!t){h('<div class="empty">Lesson not found.</div>');return;}
 const c=chById(t.chapterId||t.id.slice(0,3));
 let html=crumbs([["Dashboard","dashboard"],["Library","library"],[c?"Chapter "+c.num:"","chapter/"+(c?c.id:"")],[t.title]]);
 html+='<article class="reading">';
 html+="<h1 class=\"h1\">"+esc(t.title)+"</h1>"+pageRef(t.pages);
 if(t.intro){html+='<div class="intro-grid">';
  [["What it is","what"],["Why it matters","why"],["Where it happens","where"],["The puzzle","problem"]].forEach(k=>{if(t.intro[k[1]])html+='<div class="intro-item"><div class="label">'+k[0]+"</div><p>"+esc(t.intro[k[1]])+"</p></div>";});
  html+="</div>";}
 if(t.explanation)html+='<h2 class="h2">The idea</h2><p>'+esc(t.explanation)+"</p>";
 if(t.mechanism)html+='<h2 class="h2">How it works</h2><div class="example-box"><p>'+esc(t.mechanism)+"</p></div>";
 if(t.components&&t.components.length)html+='<h2 class="h2">Key components</h2><ul class="fact-list">'+t.components.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>";
 if(t.examples&&t.examples.length)html+='<h2 class="h2">Examples</h2>'+t.examples.map(e=>'<div class="example-box"><strong>'+esc(e.title)+"</strong><p>"+esc(e.text)+"</p>"+(e.mechanism?'<p class="note-sup">Mechanism: '+esc(e.mechanism)+"</p>":"")+"</div>").join("");
 if(t.connections&&t.connections.length)html+='<h2 class="h2">Connects to</h2><ul class="fact-list">'+t.connections.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>";
 if(t.takeaways&&t.takeaways.length)html+='<div class="takeaways"><h3 class="h3">Takeaways</h3><ul class="fact-list">'+t.takeaways.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul></div>";
 if(t.glossary&&t.glossary.length)html+='<h2 class="h2">Terms in this lesson</h2><div class="tp">'+t.glossary.map(g=>'<a class="chip small" href="#/glossary">'+esc(g)+"</a>").join("")+"</div>";
 html+='<div class="lesson-foot"><button class="btn" id="markReadBtn">'+(store.read[t.id]?"✔ Already read":"Mark lesson as read")+"</button> ";
 if(t.quiz&&t.quiz.length)html+='<a class="btn ghost" href="#/topic/'+t.id+'/quiz">Take the quiz ('+t.quiz.length+" questions)</a>";
 html+='<a class="btn ghost" href="#/flashcards/'+t.id+'">Flashcards</a></div>';
 if(t.quiz&&t.quiz.length)html+='<div id="quizMount"></div>';
 html+="</article>";h(html);
 $("#markReadBtn").onclick=()=>{markRead(t.id);$("#markReadBtn").textContent="✔ Saved to your progress";};
 const m=$("#quizMount");if(m)bindQuiz(m,t.quiz,t.id+".quiz",()=>go("#/topic/"+t.id+"/quiz?done=1"));});
/* topic quiz sub-route */
routes.topicQuiz=function(arg){const qm=arg.indexOf("/quiz");const tid=qm>0?arg.slice(0,qm):arg;const t=topicById(tid);if(!t){h('<div class="empty">Lesson not found.</div>');return;}
 let html=crumbs([["Dashboard","dashboard"],["Library","library"],[t.title,"topic/"+t.id],["Quiz"]])+'<h1 class="h1">Quiz: '+esc(t.title)+"</h1>"+pageRef(t.pages)+'<div id="qzone"></div>';
 const done=store.quiz[t.id+".quiz"];
 html+='<div class="card" id="quizInfo"></div>';h(html);
 const z=$("#qzone");
 if(done){$("#quizInfo").innerHTML='<h3 class="h3">Best attempt: '+done.score+"/"+done.total+'</h3><a class="btn ghost" href="#/practice">Practice Centre</a>';}
 bindQuiz(z,t.quiz,t.id+".quiz",(s,n)=>{z.innerHTML='<div class="card q-result"><h3 class="h3">You scored '+s+" / "+n+"</h3><p class=\"hint\">"+(s===n?"Perfect. This lesson is locked in.":"Good work. Re-read the lesson and try again any time.")+'</p><div class="meta-row"><a class="btn" href="#/topic/'+t.id+'">Back to lesson</a><a class="btn ghost" href="#/practice">Practice Centre</a></div></div>';});};
/* ---------- BRAIN EXPLORER ---------- */
const BRAIN_SVG='<svg class="brain-svg" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#183c5a"/><stop offset="1" stop-color="#0e2440"/></linearGradient></defs><path d="M14,46 C10,36 16,26 28,20 C38,15 52,13 62,17 C74,20 86,26 88,36 C90,45 84,52 74,55 C70,63 60,68 50,66 C44,70 34,68 30,62 C20,60 12,54 14,46 Z" fill="url(#bg1)" stroke="#4fc3f7" stroke-width="0.8"/><path d="M28,20 C36,26 40,34 38,44 M48,14 C50,24 48,36 44,48 M62,17 C60,28 62,40 58,52 M76,24 C72,34 74,44 70,54" fill="none" stroke="#2a6f97" stroke-width="0.5"/><path d="M30,60 C34,58 40,60 44,63 M52,65 C58,63 64,60 68,58" fill="none" stroke="#2a6f97" stroke-width="0.5"/></svg>';
function brainWrap(){let w='<div class="brain-wrap">'+BRAIN_SVG;DATA.brainRegions.forEach(r=>{w+='<button class="hotspot'+(store.regionSeen[r.id]?" seen":"")+'" style="left:'+r.x+"%;top:"+r.y+'%" data-region="'+r.id+'" title="'+esc(r.name)+'"><span class="pulse-ring"></span></button>';});return w+"</div>";}
reg("explorer",id=>{
 let html=crumbs([["Dashboard","dashboard"],["Brain Explorer"]])+'<h1 class="h1">Brain Explorer</h1><p class="sub">'+DATA.brainRegions.length+' structures of the brain. Tap a point to inspect it. Each card links back to the lessons that cover it.</p><div class="explorer-grid"><div>'+brainWrap()+'</div><div class="card region-panel" id="regionPanel">';
 if(id&&regionById(id)){html+=regionHTML(regionById(id));}else{html+='<h3 class="h3">Pick a region</h3><p class="hint">Twelve structures are marked on the map, from the wrinkled outer cortex to the fist-sized cerebellum at the back.</p><div class="tp">'+DATA.brainRegions.map(r=>'<button class="chip small" data-goto="'+r.id+'">'+esc(r.name)+"</button>").join("")+"</div>";}
 html+="</div></div>";h(html);
 $$(".hotspot").forEach(b=>b.onclick=()=>{store.regionSeen[b.dataset.region]=Date.now();saveStore();go("#/explorer/"+b.dataset.region);});
 $$("[data-goto]").forEach(b=>b.onclick=()=>go("#/explorer/"+b.dataset.goto));});
function regionHTML(r){
 const l=(r.lessons||[]).map(lid=>{const t=topicById(lid);return t?'<a class="chip small" href="#/topic/'+lid+'">'+esc(t.title)+"</a>":"";}).filter(Boolean).join(" ");
 return '<h3 class="h3">'+esc(r.name)+'</h3><p class="hint">'+esc(r.latin||"")+"</p><p><strong>Location.</strong> "+esc(r.location)+"</p><p><strong>Anatomy.</strong> "+esc(r.anatomy)+"</p><p><strong>Function.</strong> "+esc(r.function)+"</p>"+(r.connected&&r.connected.length?'<p><strong>Works with.</strong> '+r.connected.map(esc).join("; ")+"</p>":"")+(r.processes&&r.processes.length?'<p><strong>Processes.</strong> '+r.processes.map(esc).join(", ")+"</p>":"")+(r.disorders&&r.disorders.length?'<p><strong>When it goes wrong.</strong> '+r.disorders.map(esc).join("; ")+"</p>":"")+(l?'<p class="label">Lessons</p><div class="tp">'+l+"</div>":"")+'<a class="btn ghost" href="#/explorer">Back to map</a>';}
/* ---------- LABORATORY ---------- */
reg("lab",()=>{
 let html=crumbs([["Dashboard","dashboard"],["Laboratory"]])+'<h1 class="h1">Neuroscience Laboratory</h1><p class="sub">'+DATA.sims.length+" step-by-step simulations of the processes the book describes. Step through each one and watch the sequence unfold.</p><div class=\"grid three\">";
 DATA.sims.forEach(s=>{const t=simById(s.id);html+='<div class="card"><h3 class="h3">'+esc(s.title)+"</h3>"+pageRef("Ch. "+(chById(s.chapter)?chById(s.chapter).num:s.chapter))+'<p class="hint">'+esc(s.desc)+'</p><div class="meta-row">'+(store.simDone[s.id]?'<span class="done-badge">✔ completed</span>':"")+'<a class="btn small" href="#/sim/'+s.id+'">Run</a></div></div>';});
 h(html+"</div>");});
reg("sim",id=>{
 const s=simById(id);if(!s){h('<div class="empty">Simulation not found.</div>');return;}
 const ch=chById(s.chapter);
 let html=crumbs([["Dashboard","dashboard"],["Laboratory","lab"],[s.title]])+'<h1 class="h1">'+esc(s.title)+"</h1>"+pageRef(ch?"Chapter "+ch.num:"")+'<p class="sub">'+esc(s.desc)+'</p><div class="sim-stage" id="stage"></div><div class="sim-controls"><button class="btn ghost" id="prevStep">Back</button><button class="btn" id="nextStep">Next step</button></div><div class="sim-steps" id="stepList"></div>';
 html+='<a class="btn ghost" href="#/topic/'+firstTopicOf(s.chapter)+'">Read the chapter behind this sim</a>';
 h(html);let step=0;
 const stage=$("#stage"),list=$("#stepList");
 const render=()=>{
  let dots='<div class="sim-visual"><div class="sim-circle'+(step===0?" idle":" fired")+'">'+(step===0?"⏸":step===s.steps.length-1?"✓":"⚡")+"</div></div>";
  dots+='<div class="sim-caption"><strong>Step '+(step+1)+" of "+s.steps.length+"</strong><p>"+esc(s.steps[step])+"</p></div>";
  stage.innerHTML=dots;
  list.innerHTML=s.steps.map((st,i)=>'<div class="sim-step'+(i===step?" open":"")+(i<step?" past":"")+'"><span class="q-idx">'+(i+1)+"</span> "+esc(st)+"</div>").join("");
  $("#prevStep").disabled=step===0;$("#nextStep").textContent=step<s.steps.length-1?"Next step":"Finish";};
 $("#prevStep").onclick=()=>{if(step>0){step--;render();}};
 $("#nextStep").onclick=()=>{if(step<s.steps.length-1){step++;render();}else{store.simDone[s.id]=Date.now();saveStore();stage.innerHTML='<div class="sim-caption"><h3 class="h3">Simulation complete ✔</h3><p class="hint">'+esc(s.title)+" now shows as completed in the Laboratory.</p></div>";$("#nextStep").disabled=true;}};
 render();});
function firstTopicOf(cid){const c=chById(cid);return c&&c.topics&&c.topics.length?c.topics[0].id:"library";}
/* ---------- VISUAL LIBRARY ---------- */
reg("visuals",()=>{
 const topics=TOPICS();
 let html=crumbs([["Dashboard","dashboard"],["Visual Knowledge Library"]])+'<h1 class="h1">Visual Knowledge Library</h1><p class="sub">The book\'s data as diagrams, drawn from the lessons you have read.</p>';
 html+='<div class="card"><h3 class="h3">Where the book spends its pages</h3><p class="hint">Pages per chapter across the two parts.</p><div id="chartPages"></div></div>';
 html+='<div class="card"><h3 class="h3">Lessons per part</h3><div id="chartParts"></div></div>';
 html+='<div class="card"><h3 class="h3">Coverage map</h3><p class="hint">Every chapter and its page span, colour-coded by part.</p><div class="wtable">'+CH().map(c=>'<div class="wrow"><span class="wcell k">Ch '+c.num+"</span><span class=\"wcell g\">"+esc(c.title)+"</span><span class=\"wcell\">"+esc(c.pages)+"</span><span class=\"wcell tag "+(c.part==="Biology"?"tB":"tP")+"\">"+c.part+"</span></div>").join("")+"</div></div>";
 html+='<div class="card"><h3 class="h3">Practice density</h3><p class="hint">Questions and flashcards behind each chapter.</p><div id="chartPractice"></div></div>';
 h(html);drawCharts();});
function barChart(mount,rows,unit){let mx=0;rows.forEach(r=>mx=Math.max(mx,r[1]));let htm="";rows.forEach(r=>{htm+='<div class="hbar"><span class="hbar-l">'+esc(r[0])+'</span><span class="hbar-t"><span class="hbar-f" style="width:'+Math.round(r[1]/mx*100)+'%"></span></span><span class="hbar-v">'+r[1]+unit+"</span></div>";});$(mount).innerHTML=htm;}
function drawCharts(){
 const chs=CH();const perCh=chs.map(c=>{const n=pagesNum(c.pages);return ["Ch "+c.num, n||0];});
 barChart("#chartPages",perCh," pp");
 const parts={};TOPICS().forEach(t=>{const c=chById(t.chapterId||t.id.slice(0,3));if(c)parts[c.part]=(parts[c.part]||0)+1;});
 barChart("#chartParts",Object.entries(parts)," lessons");
 const prac=chs.map(c=>{let q=0,f=0;(c.topics||[]).forEach(t=>{q+=(t.quiz||[]).length;f+=(t.flashcards||[]).length;});return ["Ch "+c.num,q+f];});
 barChart("#chartPractice",prac," cards");}
function pagesNum(p){if(!p)return 0;const m=String(p).match(/(\d+)\s*[–\-—]\s*(\d+)/);if(m)return +m[2]-+m[1]+1;m=String(p).match(/p+\.\s*(\d+)/);return m?1:0;}
/* ---------- FLASHCARDS ---------- */
function deckFrom(list){return list;}
reg("flashcards",id=>{
 const all=allFlash();
 if(id&&topicById(id)){const t=topicById(id);const deck=t.flashcards.map(f=>Object.assign({topic:t.id},f));return flashRunner(deck,"Lesson: "+t.title,'<a class="btn ghost" href="#/topic/'+t.id+'">Back to lesson</a>');}
 if(id&&id==="all"){return flashRunner(all,"All flashcards ("+all.length+")",'<a class="btn ghost" href="#/flashcards">Full deck list</a>');}
 let html=crumbs([["Dashboard","dashboard"],["Flashcards"]])+'<h1 class="h1">Flashcards</h1><p class="sub">'+all.length+' cards drawn from every lesson, each answer carrying its page reference.</p><div class="card"><h3 class="h3">Pick a deck</h3><div class="chapter-grid">';
 CH().forEach(c=>{const n=(c.topics||[]).reduce((s,t)=>s+(t.flashcards||[]).length,0);if(!n)return;
  html+='<div class="card"><h3 class="h3">Ch '+c.num+". "+esc(c.title)+'</h3><p class="hint">'+n+" cards</p>";
  html+='<div class="meta-row"><a class="btn small" href="#/flashcards/'+c.id+'">Study chapter</a></div>';
  html+='<div class="tp">'+(c.topics||[]).filter(t=>(t.flashcards||[]).length).map(t=>'<a class="chip small" href="#/flashcards/'+t.id+'">'+esc(t.title)+"</a>").join("")+"</div></div>";});
 html+="</div></div><div class=\"meta-row\"><a class=\"btn\" href=\"#/flashcards/all\">Study everything ("+all.length+" cards)</a></div>";
 h(html);});

function flashRunner(deck,title,backLink){
 if(!deck.length){h('<div class="empty">No cards in this deck.</div>');return;}
 let i=0,flipped=false,known=0;
 let html=crumbs([["Dashboard","dashboard"],["Flashcards","flashcards"],[title]])+'<h1 class="h1">'+esc(title)+"</h1>"+'<p class="hint">'+deck.length+' cards. Click the card to flip it, then say whether you knew it.</p><div class="flash-stage"><div class="flashcard" id="fc"><div class="flash-inner"><div class="flash-face flash-front" id="ff"></div><div class="flash-face flash-back" id="fb"></div></div></div></div><div class="flash-nav"><button class="btn ghost" id="fcPrev">◀</button><span class="hint" id="fcIdx"></span><button class="btn ghost" id="fcNext">▶</button></div><div class="meta-row" id="fcActions"><button class="btn ghost" id="fcAgain">Still learning</button><button class="btn" id="fcKnown">I knew it ✔</button></div><div class="meta-row">'+backLink+' <a class="btn ghost" href="#/flashcards">All decks</a></div>';
 h(html);
 const card=$("#fc");
 const render=()=>{flipped=false;card.classList.remove("flipped");
  $("#ff").innerHTML='<div class="q-idx">Card '+(i+1)+" / "+deck.length+'</div><div class="flash-q">'+esc(deck[i].front)+"</div><div class=\"hint\">Tap to reveal</div>";
  const tt=topicById(deck[i].topic);$("#fb").innerHTML='<div class="flash-q">'+esc(deck[i].back)+"</div>"+(tt?'<div class="hint">from '+esc(tt.title)+"</div>":"");
  $("#fcIdx").textContent="Card "+(i+1)+" of "+deck.length+" · "+known+" known this session";
  $("#fcAgain").disabled=false;$("#fcKnown").disabled=false;};
 card.onclick=()=>{flipped=!flipped;card.classList.toggle("flipped",flipped);};
 $("#fcPrev").onclick=()=>{i=(i-1+deck.length)%deck.length;render();};
 $("#fcNext").onclick=()=>{i=(i+1)%deck.length;render();};
 $("#fcKnown").onclick=()=>{known++;store.flashKnown[deck[i].topic+":"+(deck[i].front||"").slice(0,40)]=Date.now();saveStore();bumpStreak();i=(i+1)%deck.length;render();};
 $("#fcAgain").onclick=()=>{i=(i+1)%deck.length;render();};
 render();}
/* ---------- GLOSSARY ---------- */
reg("glossary",q=>{
 const items=DATA.glossary;
 let html=crumbs([["Dashboard","dashboard"],["Glossary"]])+'<h1 class="h1">Glossary</h1><p class="sub">'+items.length+' terms from across the book, each linked to its chapter and page.</p><input id="glFilter" class="gl-input" type="search" placeholder="Filter terms...">';
 html+='<div class="chapter-grid" id="glList">'+items.map((g,i)=>'<div class="card gl-card" data-s="'+esc((g.term+" "+g.def).toLowerCase())+'"><h3 class="h3">'+esc(g.term)+'</h3><p>'+esc(g.def)+'</p><div class="meta-row">'+pageRef(g.page)+'<a class="chip small" href="#/chapter/'+g.chapter+'">'+esc(g.chapter_title||g.chapter)+"</a></div></div>").join("")+"</div>";
 h(html);
 const f=$("#glFilter");f.oninput=()=>{const v=f.value.toLowerCase();$$("#glList .gl-card").forEach(c=>c.style.display=c.dataset.s.indexOf(v)>=0?"":"none");};});
/* ---------- PRACTICE CENTRE ---------- */
reg("practice",arg=>{
 let html=crumbs([["Dashboard","dashboard"],["Practice Centre"]])+'<h1 class="h1">Practice Centre</h1><p class="sub">Every quiz in one place. Take a lesson quiz or a whole-chapter test.</p>';
 if(arg==="test"){const cid=arg;return;}
 if(arg&&arg.indexOf("test-")===0){const c=chById(arg.slice(5));if(c)return chapterTest(c);}
 html+='<h2 class="h2">Chapter tests</h2><div class="chapter-grid">';
 CH().forEach(c=>{const qs=(c.topics||[]).flatMap(t=>(t.quiz||[]).map(q=>Object.assign({},q,{topic:t.id})));const best=store.quiz[c.id+".test"];
  html+='<div class="card"><h3 class="h3">Ch '+c.num+". "+esc(c.title)+'</h3><p class="hint">'+qs.length+' questions from this chapter</p><div class="meta-row">'+(best?'<span class="done-badge">best '+best.score+"/"+best.total+"</span>":"")+'<a class="btn small" href="#/practice/test-'+c.id+'">Take test</a></div></div>';});
 html+="</div><h2 class=\"h2\">Lesson quizzes</h2>";
 TOPICS().forEach(t=>{if(!(t.quiz||[]).length)return;const best=store.quiz[t.id+".quiz"];
  html+='<div class="topic-row"><a class="t-main" href="#/topic/'+t.id+'/quiz"><span class="t-idx">'+esc(t.title)+"</span></a>"+pageRef(t.pages)+(best?'<span class="done-badge">best '+best.score+"/"+best.total+"</span>":"")+"</div>";});
 h(html);});
function chapterTest(c){const qs=(c.topics||[]).flatMap(t=>(t.quiz||[]).map(q=>Object.assign({},q,{topic:t.id})));
 let html=crumbs([["Dashboard","dashboard"],["Practice","practice"],["Test: "+c.title]])+'<h1 class="h1">Chapter '+c.num+" test: "+esc(c.title)+"</h1>"+pageRef(c.pages)+'<div id="qzone"></div><div id="quizInfo" class="card"></div>';h(html);
 if(store.quiz[c.id+".test"])$("#quizInfo").innerHTML='<h3 class="h3">Best attempt: '+store.quiz[c.id+".test"].score+"/"+store.quiz[c.id+".test"].total+"</h3>";
 bindQuiz($("#qzone"),qs,c.id+".test",(s,n)=>{$("#qzone").innerHTML='<div class="card q-result"><h3 class="h3">Chapter test result: '+s+" / "+n+"</h3><p class=\"hint\">"+(s===n?"A perfect pass on Chapter "+c.num+".":"Review the lessons above and retake any time.")+'</p><div class="meta-row"><a class="btn" href="#/chapter/'+c.id+'">Back to chapter</a><a class="btn ghost" href="#/practice">Practice Centre</a></div></div>';});}
/* ---------- PROGRESS ---------- */
reg("progress",()=>{
 const topics=TOPICS();
 const read=topics.filter(t=>store.read[t.id]).length;
 const q=Object.values(store.quiz);const qAvg=q.length?Math.round(q.reduce((a,b)=>a+b.score/b.total,0)/q.length*100):0;
 let html=crumbs([["Dashboard","dashboard"],["My Progress"]])+'<h1 class="h1">My Progress</h1>';
 html+='<div class="stats"><div class="stat"><div class="big-num">'+Math.round(read/topics.length*100)+'%</div><div class="lbl">Course read</div></div><div class="stat"><div class="big-num">'+qAvg+'%</div><div class="lbl">Average quiz score</div></div><div class="stat"><div class="big-num">'+Object.keys(store.simDone).length+"/"+DATA.sims.length+'</div><div class="lbl">Simulations run</div></div><div class="stat"><div class="big-num">🔥 '+store.streak.count+'</div><div class="lbl">Day streak</div></div></div>';
 html+='<div class="card"><h3 class="h3">Lessons read, chapter by chapter</h3><div class="wtable">';
 CH().forEach(c=>{const ts=c.topics||[];const d=ts.filter(t=>store.read[t.id]).length;const pct=ts.length?Math.round(d/ts.length*100):0;
  html+='<div class="wrow"><span class="wcell k">Ch '+c.num+'</span><span class="wcell g">'+esc(c.title)+'</span><span class="wcell hbar-t"><span class="hbar-f" style="width:'+pct+'%"></span></span><span class="wcell">'+d+"/"+ts.length+"</span></div>";});
 html+="</div></div>";
 html+='<div class="card"><h3 class="h3">Quiz history</h3>';
 if(q.length===0)html+='<p class="hint">No quizzes taken yet. Start at the Practice Centre.</p>';
 else html+=Object.entries(store.quiz).map(([k,v])=>{const t=k.split(".")[0];const tt=topicById(t)||chById(t);return '<div class="wrow"><span class="wcell g">'+esc(tt?tt.title:t)+'</span><span class="wcell">'+v.score+"/"+v.total+"</span><span class=\"wcell gray\">"+new Date(v.ts).toLocaleDateString()+"</span></div>";}).join("");
 html+='</div><div class="card"><h3 class="h3">Flashcards known</h3><p class="hint">'+Object.keys(store.flashKnown).length+" cards marked as known.</p></div>";
 html+='<div class="meta-row"><button class="btn ghost" id="resetProg">Reset all progress</button></div>';h(html);
 $("#resetProg").onclick=()=>{if(confirm("Erase all reading, quiz, flashcard and streak progress?")){store={read:{},quiz:{},flashKnown:{},simDone:{},regionSeen:{},streak:{last:null,count:0}};saveStore();$("#streakCount").textContent=0;route();}};});
/* ---------- SEARCH ---------- */
function doSearch(qs){const q=qs.toLowerCase().trim();if(!q)return;
 const out=[];
 TOPICS().forEach(t=>{const c=chById(t.chapterId||t.id.slice(0,3));const hay=(t.title+" "+t.pages+" "+((t.intro&&Object.values(t.intro).join(" "))||"")+" "+(t.explanation||"")+" "+(c?c.title:"")).toLowerCase();
  if(hay.indexOf(q)>=0)out.push({type:"Lesson",title:t.title,sub:(c?c.title+" · ":"")+t.pages,href:"#/topic/"+t.id});});
 DATA.brainRegions.forEach(r=>{if((r.name+" "+r.function).toLowerCase().indexOf(q)>=0)out.push({type:"Brain region",title:r.name,sub:r.function.slice(0,80),href:"#/explorer/"+r.id});});
 DATA.glossary.forEach(g=>{if((g.term+" "+g.def).toLowerCase().indexOf(q)>=0)out.push({type:"Glossary",title:g.term,sub:g.def.slice(0,80),href:"#/glossary"});});
 DATA.sims.forEach(s=>{if((s.title+" "+s.desc).toLowerCase().indexOf(q)>=0)out.push({type:"Simulation",title:s.title,sub:s.desc.slice(0,80),href:"#/sim/"+s.id});});
 return out.slice(0,12);}
function closeNav(){$("#sidenav").classList.remove("show");$("#overlay").classList.remove("show");}
/* ---------- INIT ---------- */
loadStore();
CH().forEach(c=>(c.topics||[]).forEach(t=>t.chapterId=c.id));
function flashRoute(id){
 if(id==="all"){const all=allFlash();return flashRunner(all,"All flashcards","<a class=\"btn ghost\" href=\"#/flashcards\">Deck list</a>");}
 if(id&&id.indexOf("ch")===0&&id.length===4)id="c"+id.slice(2);
 if(id&&chById(id)){const c=chById(id);const deck=(c.topics||[]).flatMap(t=>(t.flashcards||[]).map(f=>Object.assign({topic:t.id},f)));if(deck.length)return flashRunner(deck,"Chapter "+c.num+": "+c.title,'<a class="btn ghost" href="#/chapter/'+c.id+'">Back to chapter</a>');}
 const t=topicById(id);if(t&&t.flashcards&&t.flashcards.length)return flashRunner(t.flashcards.map(f=>Object.assign({topic:t.id},f)),"Lesson: "+t.title,'<a class="btn ghost" href="#/topic/'+t.id+'">Back to lesson</a>');
 return listDecksOrig();}
routes.topic=function(id){const qm=id.indexOf("/quiz");if(qm>0){const t=topicById(id.slice(0,qm));if(!t){h('<div class="empty">Lesson not found.</div>');return;}
  const done=store.quiz[t.id+".quiz"];let html=crumbs([["Dashboard","dashboard"],["Library","library"],[t.title,"topic/"+t.id],["Quiz"]])+'<h1 class="h1">Quiz: '+esc(t.title)+"</h1>"+pageRef(t.pages)+'<div id="qzone"></div><div id="quizInfo" class="card"></div>';h(html);
  if(done)$("#quizInfo").innerHTML='<h3 class="h3">Best attempt: '+done.score+"/"+done.total+"</h3>";
  bindQuiz($("#qzone"),t.quiz,t.id+".quiz",(s,n)=>{$("#qzone").innerHTML='<div class="card q-result"><h3 class="h3">You scored '+s+" / "+n+"</h3><p class=\"hint\">"+(s===n?"Perfect. This lesson is locked in.":"Good work. Re-read the lesson and try again any time.")+'</p><div class="meta-row"><a class="btn" href="#/topic/'+t.id+'">Back to lesson</a><a class="btn ghost" href="#/practice">Practice Centre</a></div></div>';});
 }else{topicView(id);}};
function topicView(id){const t=topicById(id);if(!t){h('<div class="empty">Lesson not found.</div>');return;}
 const c=chById(t.chapterId);
 let html=crumbs([["Dashboard","dashboard"],["Library","library"],[c?"Chapter "+c.num:"","chapter/"+(c?c.id:"")],[t.title]]);
 html+='<article class="reading">';
 html+="<h1 class=\"h1\">"+esc(t.title)+"</h1>"+pageRef(t.pages);
 if(t.intro){html+='<div class="intro-grid">';
  [["What it is","what"],["Why it matters","why"],["Where it happens","where"],["The puzzle","problem"]].forEach(k=>{if(t.intro[k[1]])html+='<div class="intro-item"><div class="label">'+k[0]+"</div><p>"+esc(t.intro[k[1]])+"</p></div>";});
  html+="</div>";}
 if(t.explanation)html+='<h2 class="h2">The idea</h2><p>'+esc(t.explanation)+"</p>";
 if(t.mechanism)html+='<h2 class="h2">How it works</h2><div class="example-box"><p>'+esc(t.mechanism)+"</p></div>";
 if(t.components&&t.components.length)html+='<h2 class="h2">Key components</h2><ul class="fact-list">'+t.components.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>";
 if(t.examples&&t.examples.length)html+='<h2 class="h2">Examples</h2>'+t.examples.map(e=>'<div class="example-box"><strong>'+esc(e.title)+"</strong><p>"+esc(e.text)+"</p>"+(e.mechanism?'<p class="note-sup">Mechanism: '+esc(e.mechanism)+"</p>":"")+"</div>").join("");
 if(t.connections&&t.connections.length)html+='<h2 class="h2">Connects to</h2><ul class="fact-list">'+t.connections.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>";
 if(t.takeaways&&t.takeaways.length)html+='<div class="takeaways"><h3 class="h3">Takeaways</h3><ul class="fact-list">'+t.takeaways.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul></div>";
 if(t.glossary&&t.glossary.length)html+='<h2 class="h2">Terms in this lesson</h2><div class="tp">'+t.glossary.map(g=>'<a class="chip small" href="#/glossary">'+esc(g)+"</a>").join("")+"</div>";
 html+='<div class="lesson-foot"><button class="btn" id="markReadBtn">'+(store.read[t.id]?"✔ Already read":"Mark lesson as read")+"</button> ";
 if(t.quiz&&t.quiz.length)html+='<a class="btn ghost" href="#/topic/'+t.id+'/quiz">Take the quiz ('+t.quiz.length+" questions)</a>";
 html+='<a class="btn ghost" href="#/flashcards/'+t.id+'">Flashcards</a></div>';
 html+="</article>";h(html);
 $("#markReadBtn").onclick=()=>{markRead(t.id);$("#markReadBtn").textContent="✔ Saved to your progress";};}
const listDecksOrig=routes.flashcards;routes.flashcards=function(id){return id?flashRoute(id):listDecksOrig();}
/* remove the duplicate topic handler registered in part 1 */
delete routes.topicQuiz;
delete routes.flashcardsOrig;
/* menu + overlay wiring */
$("#menuBtn").onclick=()=>{$("#sidenav").classList.toggle("show");$("#overlay").classList.toggle("show");};
$("#overlay").onclick=closeNav;
window.addEventListener("hashchange",route);
let searchTimer=null;
$("#searchInput").addEventListener("input",e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{const v=e.target.value.trim();const m=$("#main");if(!v)return;
 const res=doSearch(v);m.innerHTML=crumbs([["Search"]])+'<h1 class="h1">Results for “'+esc(v)+'”</h1>'+(res&&res.length?res.map(r=>'<div class="sr-item"><div><span class="sr-type chip small">'+r.type+'</span><a class="sr-title" href="'+r.href+'">'+esc(r.title)+'</a></div><div class="sr-sub">'+esc(r.sub)+"</div></div>").join(""):'<div class="empty">No matches. Try a term from the Glossary.</div>');
},250);});
bumpStreak();
if(!location.hash)location.hash="#/dashboard";
route();
