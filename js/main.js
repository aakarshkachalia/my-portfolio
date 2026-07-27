/* ============================================================
   Aakarsh Kachalia — portfolio
   Runs on DOMContentLoaded (this file is loaded at end of body).

   Sections:
     1. helpers + <image-slot> custom element
     2. hover / cursor binding
     3. card + modal templates
     4. PROJECTS data  <-- edit your case studies here
     5. Component: scroll effects, 3D scenes, contact form
   ============================================================ */

(function(){
  var e = function(v){ return String(v==null?'':v).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  window.__e = e;

  /* ---------- image-slot: click or drop a local image, remembered per browser ---------- */
  class ImageSlot extends HTMLElement {
    connectedCallback(){
      if (this._init) return; this._init = true;
      var id  = this.getAttribute('id') || 'slot';
      var ph  = this.getAttribute('placeholder') || 'Drop an image';
      var fit = this.getAttribute('fit') || 'cover';
      var key = 'imgslot:' + id;
      var self = this;
      var input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*';

      function paint(src){
        if (src) {
          self.innerHTML = '<img alt="" style="width:100%;height:100%;object-fit:' + fit + '">';
          self.querySelector('img').src = src;
        } else {
          self.innerHTML = '<div style="position:absolute;inset:0;display:flex;flex-direction:column;gap:.45rem;'
            + 'align-items:center;justify-content:center;text-align:center;font-family:var(--f-m);font-size:.64rem;'
            + 'letter-spacing:.1em;text-transform:uppercase;color:var(--fnt);border:1px dashed var(--line);border-radius:4px">'
            + '<span style="font-size:1.2rem;line-height:1">+</span><span>' + e(ph) + '</span></div>';
        }
      }
      function load(file){
        if (!file || !/^image\//.test(file.type)) return;
        var r = new FileReader();
        r.onload = function(){ paint(r.result); try { localStorage.setItem(key, r.result); } catch (err) {} };
        r.readAsDataURL(file);
      }
      /* A committed file in img/ wins (src="img/whatever.jpg"); otherwise fall
         back to whatever was dropped in on this browser. */
      var file = this.getAttribute('src');
      var saved = null; try { saved = localStorage.getItem(key); } catch (err) {}
      paint(file || saved);

      this.addEventListener('click', function(){ input.click(); });
      input.addEventListener('change', function(){ load(input.files[0]); });
      this.addEventListener('dragover', function(ev){ ev.preventDefault(); self.style.outline = '2px solid var(--acc)'; });
      this.addEventListener('dragleave', function(){ self.style.outline = 'none'; });
      this.addEventListener('drop', function(ev){
        ev.preventDefault(); self.style.outline = 'none';
        load(ev.dataTransfer && ev.dataTransfer.files[0]);
      });
    }
  }
  if (!customElements.get('image-slot')) customElements.define('image-slot', ImageSlot);

  /* ---------- style-hover="..." attribute support ---------- */
  function bindHovers(scope){
    (scope || document).querySelectorAll('[style-hover]').forEach(function(el){
      if (el.__hov) return; el.__hov = true;
      var base = el.getAttribute('style') || '';
      var hov  = el.getAttribute('style-hover') || '';
      el.addEventListener('pointerenter', function(){ el.setAttribute('style', base + ';' + hov); });
      el.addEventListener('pointerleave', function(){ el.setAttribute('style', base); });
    });
  }
  window.__bindHovers = bindHovers;

  /* ---------- cursor hover targets (re-bindable for dynamic nodes) ---------- */
  function bindCursorTargets(scope, dot, ring){
    if (!dot || !ring) return;
    (scope || document).querySelectorAll('a,button,input,textarea,[data-award],image-slot').forEach(function(el){
      if (el.__cur) return; el.__cur = true;
      el.addEventListener('pointerenter', function(){
        dot.style.width = '10px'; dot.style.height = '10px'; dot.style.background = 'var(--acc)';
        ring.style.width = '46px'; ring.style.height = '46px'; ring.style.borderColor = 'var(--acc)';
      });
      el.addEventListener('pointerleave', function(){
        dot.style.width = '6px'; dot.style.height = '6px'; dot.style.background = 'var(--ink)';
        ring.style.width = '30px'; ring.style.height = '30px'; ring.style.borderColor = 'var(--line)';
      });
    });
  }

  /* ---------- templates ---------- */
  function cardHTML(p, k){ return `            <button type="button" data-open="${k}" style="display:flex;flex-direction:column;align-items:stretch;text-align:left;background:var(--bg2);padding:1.6rem 1.5rem 1.4rem;min-height:250px;transition:background .3s,transform .35s cubic-bezier(.16,1,.3,1)" style-hover="background:var(--bg3);transform:translateY(-3px)">
              <span style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;font-family:var(--f-m);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:var(--fnt);padding-bottom:1rem;border-bottom:1px solid var(--line2)">
                <span style="color:var(--acc)">${e(p.num)} / ${e(p.kind)}</span><span>${e(p.year)}</span>
              </span>
              <span style="display:block;font-family:var(--f-d);font-size:clamp(1.6rem,2.6vw,2.15rem);letter-spacing:-.02em;line-height:1.08;margin-top:1.1rem">${e(p.title)}</span>
              <span style="display:block;color:var(--mut);font-size:.92rem;margin-top:.6rem;line-height:1.6;flex:1">${e(p.blurb)}</span>
              <span style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-top:1.3rem;font-family:var(--f-m);font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mut)">
                <span>${e(p.stackLine)}</span><span aria-hidden="true">↗</span>
              </span>
            </button>`; }
  function modalHTML(sel){ return `    <div style="position:fixed;inset:0;z-index:500;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;padding:clamp(1rem,4vw,3rem) 1rem">
      <button type="button" aria-label="Close case study" data-close style="position:fixed;inset:0;background:rgba(10,10,14,.55);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);cursor:none"></button>
      <div role="dialog" aria-modal="true" style="position:relative;width:min(920px,100%);background:var(--bg2);border:1px solid var(--line);border-radius:5px;box-shadow:var(--sh);animation:fadeUp .45s cubic-bezier(.16,1,.3,1) forwards">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1rem clamp(1.2rem,3vw,2rem);border-bottom:1px solid var(--line)">
          <span style="font-family:var(--f-m);font-size:.66rem;letter-spacing:.13em;text-transform:uppercase;color:var(--acc)">${e(sel.num)} — ${e(sel.kind)} — ${e(sel.year)}</span>
          <button type="button" data-close style="font-family:var(--f-m);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);border:1px solid var(--line);border-radius:3px;padding:.4rem .8rem;transition:border-color .25s,color .25s" style-hover="border-color:var(--acc);color:var(--ink)">Close ✕</button>
        </div>
        <div style="padding:clamp(1.4rem,3vw,2.4rem) clamp(1.2rem,3vw,2rem) 2.6rem">
          <h3 style="font-family:var(--f-d);font-size:clamp(2.2rem,4.6vw,3.4rem);letter-spacing:-.025em">${e(sel.title)}</h3>
          <p style="color:var(--mut);margin-top:.7rem;font-size:1.05rem;line-height:1.7;max-width:62ch;text-wrap:pretty">${e(sel.blurb)}</p>
          <div style="position:relative;margin-top:1.6rem;border:1px solid var(--line);border-radius:4px;overflow:hidden;background:var(--bg3);aspect-ratio:16/9">
            <image-slot id="${e(sel.slot)}" src="${e(sel.img || '')}" shape="rect" fit="cover" placeholder="${e(sel.slotHint)}"></image-slot>
          </div>
          <div data-cols style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);margin-top:1.8rem">
            <div style="background:var(--bg2);padding:1.2rem 1.2rem 1.4rem">
              <p style="font-family:var(--f-m);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);margin-bottom:.6rem">The problem</p>
              <p style="line-height:1.7;font-size:.94rem;text-wrap:pretty">${e(sel.problem)}</p>
            </div>
            <div style="background:var(--bg2);padding:1.2rem 1.2rem 1.4rem">
              <p style="font-family:var(--f-m);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);margin-bottom:.6rem">What I built</p>
              <p style="line-height:1.7;font-size:.94rem;text-wrap:pretty">${e(sel.approach)}</p>
            </div>
            <div style="background:var(--bg2);padding:1.2rem 1.2rem 1.4rem">
              <p style="font-family:var(--f-m);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--acc);margin-bottom:.6rem">Outcome</p>
              <p style="line-height:1.7;font-size:.94rem;text-wrap:pretty">${e(sel.outcome)}</p>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1.5rem;flex-wrap:wrap;margin-top:1.6rem">
            <div style="display:flex;flex-wrap:wrap;gap:.4rem">
              ${sel.stack.map(s=>`<span style="font-family:var(--f-m);font-size:.64rem;padding:.28rem .7rem;border-radius:3px;border:1px solid var(--line);color:var(--mut)">${e(s)}</span>`).join('')}
            </div>
            ${sel.hasLinks ? `<div style="display:flex;gap:.6rem;flex-wrap:wrap">
                ${sel.links.map(l=>`<a href="${e(l.href)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:.4rem;font-family:var(--f-m);font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;padding:.6rem 1.1rem;border-radius:3px;border:1px solid var(--line);transition:border-color .25s,background .25s" style-hover="border-color:var(--acc);background:var(--accsoft);color:var(--ink)">${e(l.label)} ↗</a>`).join('')}
              </div>` : ''}
          </div>
          <button type="button" data-next style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:1rem;margin-top:2rem;padding:1.1rem 1.2rem;border:1px solid var(--line);border-radius:4px;background:var(--bg);text-align:left;transition:border-color .25s,background .25s" style-hover="border-color:var(--acc);background:var(--surf2)">
            <span>
              <span style="display:block;font-family:var(--f-m);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--fnt)">Next project</span>
              <span style="display:block;font-family:var(--f-d);font-size:1.35rem;margin-top:.2rem">${e(sel.nextTitle)}</span>
            </span>
            <span aria-hidden="true" style="font-family:var(--f-m);color:var(--mut)">→</span>
          </button>
        </div>
      </div>
    </div>`; }

  /* ---------- tiny stand-in for the builder runtime ---------- */
  window.DCLogic = class DCLogic {
    setState(patch){ Object.assign(this.state, patch); this.__paint(); }
    __mount(){
      this.__paint();
      if (this.componentDidMount) this.componentDidMount();
      var dot = document.querySelector('[data-cursor]'), ring = document.querySelector('[data-ring]');
      this.__dot = dot; this.__ring = ring;
      bindHovers(document); bindCursorTargets(document, dot, ring);
    }
    __paint(){
      var v = this.renderVals();
      var grid = document.querySelector('[data-projects]');
      if (grid && !grid.__filled) {
        grid.__filled = true;
        grid.innerHTML = v.projects.map(cardHTML).join('');
        grid.querySelectorAll('[data-open]').forEach(function(btn){
          btn.addEventListener('click', function(){ v.projects[+btn.getAttribute('data-open')].open(); });
        });
      }
      var host = document.querySelector('[data-modal-host]');
      if (!host) return;
      if (!v.sel) { host.innerHTML = ''; document.body.style.overflow = ''; return; }
      host.innerHTML = modalHTML(v.sel);
      document.body.style.overflow = 'hidden';
      host.querySelectorAll('[data-close]').forEach(function(b){ b.addEventListener('click', v.closeCase); });
      host.querySelectorAll('[data-next]').forEach(function(b){ b.addEventListener('click', v.nextCase); });
      bindHovers(host); bindCursorTargets(host, this.__dot, this.__ring);
    }
  };
})();

const PROJECTS = [
  { num:"01", title:"MathFlow", kind:"FBLA Website Design", year:"2025",
    blurb:"An AI math coach that finds a student's weak spots and rebuilds them with guided, step-by-step practice.",
    slot:"bcs-mathflow", slotHint:"Drop a MathFlow screenshot",
    problem:"Students who fall behind in math rarely know which specific skill broke first — they just know the whole unit feels impossible. Generic practice sets don't diagnose anything.",
    approach:"A hand-rolled front end on top of the Google Gemini API: it reads a student's wrong answers, infers the underlying gap, and generates a guided path back through it. Plain JavaScript, HTML, and Tailwind so every interaction stayed fast.",
    outcome:"Carried a full competition package — site, documentation, live demo — to a top-10 finish at FBLA North Carolina states, against a field of 1,000+ students.",
    stack:["Google Gemini","JavaScript","Tailwind","HTML"],
    links:[{label:"Live demo",href:"#"},{label:"GitHub",href:"#"}] },
  { num:"02", title:"TundraScout", kind:"Native iOS · App Store", year:"2024",
    blurb:"The unofficial FTC scouting app — match data, team analytics, and offline-first storage in a clean SwiftUI interface, shipped to the App Store.",
    slot:"bcs-tundrascout", slotHint:"Drop a TundraScout screenshot",
    problem:"FTC scouting happens in gyms with no usable Wi-Fi, on a stopwatch, between matches. Spreadsheets and paper both fail under that pressure.",
    approach:"A native SwiftUI app with Core Data underneath so every entry works fully offline and syncs later. Match entry is two taps deep; analytics roll up automatically so a drive team can make an alliance call in seconds.",
    outcome:"Designed, built, and published to the App Store as sole developer, then marketed it to other FTC teams as an unofficial scouting tool. Now on a yearly release cycle — each season's feedback becomes the next version's features.",
    stack:["SwiftUI","Core Data","iOS"],
    links:[{label:"App Store",href:"#"}] },
  { num:"03", title:"AI Carbon Footprint Tracker", kind:"Research · NYAS", year:"2025",
    blurb:"A tool that quantifies the energy and emissions cost of AI workloads, grounded in peer-reviewed data.",
    slot:"bcs-carbon", slotHint:"Drop a dashboard screenshot",
    problem:"Everyone talks about the cost of AI compute; almost nobody can put a number on a specific workload. The data exists but sits scattered across papers.",
    approach:"A Streamlit application that models energy draw and grid emissions per workload, with interactive D3.js visualizations, built entirely on peer-reviewed figures rather than vendor estimates.",
    outcome:"Presented as part of a New York Academy of Sciences research program, and became the foundation for the CarbonCast scheduling concept.",
    stack:["Python","Streamlit","D3.js"],
    links:[{label:"Read more",href:"#"}] },
  { num:"04", title:"CarbonCast", kind:"Research concept · ML systems", year:"2025",
    blurb:"Carbon-aware inference scheduling that shifts LLM compute toward cleaner grid windows.",
    slot:"bcs-carboncast", slotHint:"Drop a diagram or chart",
    problem:"Inference emissions depend as much on when a request runs as on how big the model is — the grid is far dirtier at 6pm than at 3am.",
    approach:"A scheduling layer that forecasts grid carbon intensity and defers latency-tolerant inference into cleaner windows — no retraining, no quantization, no change to the model itself.",
    outcome:"An in-progress research concept: the mechanism is specified and the emissions model is built; next is a measured benchmark against a live grid feed.",
    stack:["Research","ML systems","Sustainability"], links:[] },
  { num:"05", title:"Quantum experiments", kind:"Stanford · Qiskit", year:"2025",
    blurb:"Bell states, GHZ states, and quantum teleportation — implemented and verified on simulators.",
    slot:"bcs-quantum", slotHint:"Drop a circuit diagram",
    problem:"Quantum computing is easy to read about and hard to believe until you've watched entanglement show up in your own measurement statistics.",
    approach:"Built Bell and GHZ state circuits and a full teleportation protocol in Qiskit, verifying each against expected distributions, then connected gate-level behaviour to higher-level algorithms.",
    outcome:"Completed the Stanford Quantum High School Program's full problem set and capstone exercises.",
    stack:["Qiskit","Python"], links:[] },
  { num:"06", title:"Agentic trading research", kind:"NC State · finance AI", year:"2025",
    blurb:"A local-LLM trading agent on the Alpaca API, and research into whether language models just agree with whatever the market already did.",
    slot:"bcs-stock", slotHint:"Drop a results chart",
    problem:"Two problems, one project. First: can an LLM agent actually reason about a portfolio, or is it just generating plausible-sounding trades? Second, and more interesting: LLMs are trained to be agreeable — so when a stock overshoots and you ask the model about it, does it push back, or does it rationalize the move it was just shown?",
    approach:"An agent running on Ollama locally, wired to the Alpaca API for paper trading, with a pandas feature pipeline and logistic-regression and random-forest baselines to check the agent against. The agreeability work probes the same model with overshoot scenarios framed different ways and measures how far its answer moves with the framing rather than with the data.",
    outcome:"Ongoing research at NC State. The agent trades on paper against real market data, and the early agreeability finding is the uncomfortable one: framing moves the model's read of an overshoot more than the underlying numbers do.",
    stack:["Ollama","Alpaca API","scikit-learn","pandas","Python"], links:[] },
  { num:"07", title:"Competition robots", kind:"FTC 7083 · seven seasons", year:"2018—25",
    blurb:"Seven seasons of FIRST robotics — mechanical design, Java/Python control code, and systems thinking.",
    slot:"bcs-robots", slotHint:"Drop a robot photo",
    problem:"Every FTC season is a new game with a fixed six-week build window and a robot that has to survive being driven by humans under pressure.",
    approach:"Seven seasons with Team 7083 TundraBots — starting on LEGO and Technic bricks in 1st grade and now leading the software side as Software Development Captain since 7th grade. Mechanical design iterations, autonomous and tele-op control code in Java and Python, and the documentation discipline judges actually read.",
    outcome:"Earned the NC State Championship Inspire Award — FTC's highest all-around honor, given for excellence across engineering, documentation, and outreach. Outside competition: outreach events across North Carolina and building robotics kits for students in rural districts who don't have a team to join.",
    stack:["Java","Python","FTC SDK"], links:[] },
  { num:"08", title:"6DOF Arm Simulator", kind:"Robotics · inverse kinematics", year:"2025",
    blurb:"A desktop simulator that models a six-degree-of-freedom robotic arm, so you can drive a real industrial arm without owning one.",
    slot:"bcs-arm", slotHint:"Drop a simulator screenshot",
    problem:"A six-axis industrial arm costs more than most schools will ever spend, so the students most curious about robotics never get to touch the thing they want to learn. And the hard part isn't the hardware — it's the inverse kinematics, which you can absolutely learn on a screen.",
    approach:"A model of a 6DOF arm with a full inverse-kinematics solver: set a target position and orientation for the end effector and the simulator works backward to the joint angles, showing the arm move through the solution rather than just reporting numbers.",
    outcome:"Used by students to learn arm kinematics without hardware, and by industry-minded users to mock up a real arm's reach and motion on a laptop before committing to it.",
    stack:["Python","Inverse kinematics","3D modeling"], links:[] },
  { num:"09", title:"AI for Young Minds", kind:"Podcast · Spotify & Apple", year:"2025",
    blurb:"A podcast making AI literacy real for middle and high schoolers — on Spotify and Apple Podcasts.",
    slot:"bcs-podcast", slotHint:"Drop cover art or a waveform",
    problem:"Students my age are handed AI tools constantly and taught almost nothing about how they work, what they cost, or where they fail. The available explanations are either research papers or marketing.",
    approach:"A podcast written and produced for a student audience: episodes that break down how these systems actually work, what they're good and bad at, and where the industry is heading — in language a 12-year-old can follow without being talked down to.",
    outcome:"Published on both Spotify and Apple Podcasts, building AI literacy and genuine interest in the field among students who'd otherwise only meet AI as a homework shortcut.",
    stack:["Writing","Audio production","AI literacy"],
    links:[{label:"Spotify",href:"https://open.spotify.com/show/4VxIQAWIUq30C2uyIKbxgs"},{label:"Apple Podcasts",href:"https://podcasts.apple.com/us/podcast/ai-for-young-minds/id1805390678"}] },
  { num:"10", title:"SolveFire", kind:"Frontend · UI/UX design", year:"2025",
    blurb:"Designing the interface for a competitive math platform that ships new features constantly.",
    slot:"bcs-solvefire", slotHint:"Drop a UI screenshot",
    problem:"Competitive math sites are usually built by mathematicians, and it shows — dense, unfriendly interfaces that add difficulty on top of problems that are already hard enough.",
    approach:"Frontend design work on SolveFire: UI and UX for a platform on a fast release cadence, which means designing systems and components that new features can slot into rather than one-off screens.",
    outcome:"Ongoing role — the design side of a live product with real users and frequent updates.",
    stack:["UI/UX","Frontend","Design systems"],
    links:[{label:"SolveFire",href:"https://www.solvefire.net/"}] }
];

class Component extends DCLogic {
  state = { sel: null };

  renderVals() {
    const i = this.state.sel;
    const p = i === null ? null : PROJECTS[i];
    return {
      projects: PROJECTS.map((pr, k) => ({ ...pr, stackLine: pr.stack.slice(0, 3).join(" · "), open: () => this.setState({ sel: k }) })),
      sel: p ? { ...p, hasLinks: p.links.length > 0, nextTitle: PROJECTS[(i + 1) % PROJECTS.length].title } : null,
      closeCase: () => this.setState({ sel: null }),
      nextCase: () => this.setState({ sel: (i + 1) % PROJECTS.length })
    };
  }

  componentDidMount() {
    const root = document.querySelector("[data-a-root]");
    if (!root) return;
    this.root = root;
    this.reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
    this.fine = matchMedia("(pointer:fine)").matches;
    const html = document.documentElement;
    const th = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
    html.setAttribute("data-th", th);
    this.syncGlyph(th);

    root.querySelector("[data-theme-btn]").addEventListener("click", () => {
      const n = html.getAttribute("data-th") === "dark" ? "light" : "dark";
      html.setAttribute("data-th", n);
      this.syncGlyph(n);
    });

    this.setupReveals();
    this.setupCounters();
    this.setupExp();
    this.setupContact();
    this.setupStars();
    this.setupLoop();
    this.onKey = e => { if (e.key === "Escape" && this.state.sel !== null) this.setState({ sel: null }); };
    addEventListener("keydown", this.onKey);
    if (this.fine && !this.reduced) this.setupCursor();
    if (!this.reduced) { this.initHero3D(); this.initWorlds(); }
    else this.staticWorlds();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    clearInterval(this.clockT);
    removeEventListener("keydown", this.onKey);
    if (this.stopHero) this.stopHero();
    if (this.stopWorlds) this.stopWorlds();
  }

  syncGlyph(t) {
    const g = this.root.querySelector("[data-theme-glyph]");
    if (g) g.textContent = t === "dark" ? "☾" : "☀";
  }

  setupReveals() {
    const els = Array.from(this.root.querySelectorAll("[data-rev]"));
    if (!this.reduced) {
      els.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1)";
      });
      const show = el => { el.style.opacity = "1"; el.style.transform = "none"; };
      const io = new IntersectionObserver(es => {
        es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
      }, { threshold: .06, rootMargin: "0px 0px -5% 0px" });
      els.forEach(el => io.observe(el));
      setTimeout(() => els.forEach(show), 2500);
    }
    const tl = this.root.querySelector("[data-tl-line]");
    const tlBox = this.root.querySelector("[data-timeline]");
    if (tl && tlBox) {
      const o = new IntersectionObserver(e => {
        if (e[0].isIntersecting) { tl.style.height = "calc(100% - 3.8rem)"; o.disconnect(); }
      }, { threshold: .12 });
      o.observe(tlBox);
    }
  }

  setupCounters() {
    const ease = t => 1 - Math.pow(1 - t, 3);
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target, target = parseInt(el.getAttribute("data-count"), 10);
        if (this.reduced) { el.textContent = target; return; }
        const t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / 1300, 1);
          el.textContent = Math.round(ease(p) * target);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .5 });
    this.root.querySelectorAll("[data-count]").forEach(el => io.observe(el));
  }

  setupExp() {
    this.root.querySelectorAll("[data-exp]").forEach(item => {
      const head = item.querySelector("[data-exp-head]");
      const extra = item.querySelector("[data-exp-extra]");
      const tog = item.querySelector("[data-exp-toggle]");
      head.addEventListener("click", () => {
        const open = extra.style.maxHeight && extra.style.maxHeight !== "0px";
        this.root.querySelectorAll("[data-exp]").forEach(o => {
          const e2 = o.querySelector("[data-exp-extra]"), t2 = o.querySelector("[data-exp-toggle]");
          e2.style.maxHeight = "0px"; e2.style.opacity = "0"; e2.style.marginTop = "0";
          t2.style.transform = "none"; t2.style.color = "var(--fnt)";
          o.querySelector("[data-exp-head]").setAttribute("aria-expanded", "false");
        });
        if (!open) {
          extra.style.maxHeight = extra.scrollHeight + 40 + "px";
          extra.style.opacity = "1"; extra.style.marginTop = "1rem";
          tog.style.transform = "rotate(135deg)"; tog.style.color = "var(--acc)";
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  setupContact() {
    const r = this.root;
    const msg = r.querySelector("#b-cm");
    r.querySelectorAll("[data-topic]").forEach(chip => {
      chip.addEventListener("click", () => {
        r.querySelectorAll("[data-topic]").forEach(c => {
          c.style.background = "var(--surf)"; c.style.color = "var(--mut)"; c.style.borderColor = "var(--line)";
        });
        chip.style.background = "var(--acc)"; chip.style.color = "#fff"; chip.style.borderColor = "var(--acc)";
        if (msg) { msg.value = chip.getAttribute("data-topic"); msg.focus(); }
      });
    });
    const copy = r.querySelector("[data-copy-btn]");
    const label = r.querySelector("[data-copy-label]");
    if (copy) copy.addEventListener("click", () => {
      const done = () => {
        label.textContent = "Copied to clipboard";
        copy.style.borderColor = "var(--sig)"; copy.style.color = "var(--sig)";
        setTimeout(() => { label.textContent = "Copy email"; copy.style.borderColor = "var(--line)"; copy.style.color = "var(--mut)"; }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText("aakik2011@gmail.com").then(done, done); else done();
    });
    const clock = r.querySelector("[data-clock]");
    if (clock) {
      const dot = '<span aria-hidden="true" style="width:6px;height:6px;border-radius:50%;background:var(--sig);flex-shrink:0"></span>';
      const tick = () => {
        try {
          const t = new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" });
          clock.innerHTML = dot + "It's " + t + " for me in Cary, NC — usually replies within a day";
        } catch (e) {}
      };
      tick(); this.clockT = setInterval(tick, 20000);
    }
    const form = r.querySelector("[data-form]");
    if (form) form.addEventListener("submit", e => {
      e.preventDefault();
      const note = r.querySelector("[data-note]"), btn = r.querySelector("[data-submit]");
      if (!form.checkValidity()) { note.textContent = "Please fill in all fields with a valid email."; note.style.color = "var(--acc)"; return; }
      const orig = btn.innerHTML;
      btn.disabled = true; btn.textContent = "Sending…";
      setTimeout(() => {
        btn.innerHTML = "Sent ✓"; btn.style.background = "var(--sig)"; btn.style.color = "#fff";
        note.textContent = "Thanks — I'll get back to you soon."; note.style.color = "var(--fnt)";
        form.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = "var(--ink)"; btn.style.color = "var(--bg)"; btn.disabled = false; }, 2600);
      }, 700);
    });
  }

  setupCursor() {
    const dot = this.root.querySelector("[data-cursor]");
    const ring = this.root.querySelector("[data-ring]");
    dot.style.transition += ", opacity .3s";
    ring.style.transition += ", opacity .3s";
    this.cur = { x: innerWidth / 2, y: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2, dot, ring };
    document.documentElement.setAttribute("data-cursor-on", "");
    addEventListener("pointermove", e => {
      if (!this.curShown) { this.curShown = true; this.cur.rx = e.clientX; this.cur.ry = e.clientY; dot.style.opacity = "1"; ring.style.opacity = "1"; }
      this.cur.x = e.clientX; this.cur.y = e.clientY;
      this.mx = e.clientX / innerWidth - .5; this.my = e.clientY / innerHeight - .5;
    }, { passive: true });
    this.root.querySelectorAll("a,button,input,textarea,[data-award]").forEach(el => {
      el.addEventListener("pointerenter", () => {
        dot.style.width = "10px"; dot.style.height = "10px"; dot.style.background = "var(--acc)";
        ring.style.width = "46px"; ring.style.height = "46px"; ring.style.borderColor = "var(--acc)";
      });
      el.addEventListener("pointerleave", () => {
        dot.style.width = "6px"; dot.style.height = "6px"; dot.style.background = "var(--ink)";
        ring.style.width = "30px"; ring.style.height = "30px"; ring.style.borderColor = "var(--line)";
      });
    });
  }

  setupStars() {
    const box = this.root.querySelector("[data-fly-stars]");
    if (!box || this.reduced) return;
    let h = "";
    for (let i = 0; i < 90; i++) {
      const s = (Math.random() * 1.9 + .5).toFixed(2);
      h += '<span style="position:absolute;border-radius:50%;width:' + s + "px;height:" + s + "px;left:" + (Math.random() * 100).toFixed(2) + "%;top:" + (Math.random() * 100).toFixed(2) + "%;background:rgba(255,255,255," + (Math.random() * .5 + .1).toFixed(2) + ')"></span>';
    }
    box.innerHTML = h;
  }

  setupLoop() {
    const r = this.root;
    const nav = r.querySelector("[data-nav]");
    const bar = r.querySelector("[data-progress]");
    const grid = r.querySelector("[data-herogrid]");
    const flySec = r.querySelector("[data-fly-sec]");
    const flys = Array.from(r.querySelectorAll("[data-fly]"));
    const dots = Array.from(r.querySelectorAll("[data-fly-dot]"));
    const glow = r.querySelector("[data-fly-glow]");
    const GLOWS = [
      "radial-gradient(ellipse 68% 58% at 50% 50%, rgba(127,162,255,.2) 0%, transparent 70%)",
      "radial-gradient(ellipse 68% 58% at 50% 50%, rgba(180,200,255,.18) 0%, transparent 70%)",
      "radial-gradient(ellipse 68% 58% at 50% 50%, rgba(255,159,122,.16) 0%, transparent 70%)",
      "radial-gradient(ellipse 68% 58% at 50% 50%, rgba(67,201,138,.15) 0%, transparent 70%)",
      "radial-gradient(ellipse 68% 58% at 50% 50%, rgba(196,164,255,.16) 0%, transparent 70%)",
      "radial-gradient(ellipse 68% 58% at 50% 50%, rgba(255,214,140,.15) 0%, transparent 70%)"
    ];
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const eOut = t => 1 - Math.pow(1 - t, 3);
    const eIn = t => t * t * t;
    let smx = 0, smy = 0, lastGlow = -1;
    this.mx = 0; this.my = 0;

    const frame = () => {
      const y = scrollY, vh = innerHeight;
      if (y > 24) {
        nav.style.background = "var(--navbg)";
        nav.style.backdropFilter = "saturate(160%) blur(20px)";
        nav.style.webkitBackdropFilter = "saturate(160%) blur(20px)";
        nav.style.borderBottomColor = "var(--line)";
        nav.style.paddingTop = ".65rem"; nav.style.paddingBottom = ".65rem";
      } else {
        nav.style.background = "transparent"; nav.style.backdropFilter = "none";
        nav.style.webkitBackdropFilter = "none"; nav.style.borderBottomColor = "transparent";
        nav.style.paddingTop = "1rem"; nav.style.paddingBottom = "1rem";
      }
      const h = document.documentElement.scrollHeight - vh;
      bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";

      if (!this.reduced) {
        smx += (this.mx - smx) * .06; smy += (this.my - smy) * .06;
        if (y < vh * 1.4 && grid) grid.style.transform = "translate3d(" + (smx * 8).toFixed(1) + "px," + (smy * 8 - y * .03).toFixed(1) + "px,0)";
      }
      if (this.cur) {
        const c = this.cur;
        c.rx += (c.x - c.rx) * .14; c.ry += (c.y - c.ry) * .14;
        c.dot.style.transform = "translate3d(" + c.x + "px," + c.y + "px,0) translate(-50%,-50%)";
        c.ring.style.transform = "translate3d(" + c.rx + "px," + c.ry + "px,0) translate(-50%,-50%)";
      }
      if (flySec && flys.length) {
        const rect = flySec.getBoundingClientRect();
        if (rect.bottom > -200 && rect.top < vh + 200) {
          const total = flySec.offsetHeight - vh;
          const p = clamp(-rect.top / total, 0, 1);
          const N = flys.length, seg = 1 / N;
          flys.forEach((sc, i) => {
            const lp = clamp((p - i * seg) / seg, 0, 1);
            let scale, op, peak;
            if (lp < .28) { const t = lp / .28; scale = .04 + eOut(t) * .96; op = t; peak = false; }
            else if (lp < .7) { scale = 1; op = 1; peak = true; }
            else { const t = (lp - .7) / .3; scale = 1 + eIn(t) * 5.2; op = 1 - t; peak = false; }
            sc.style.transform = "scale(" + scale.toFixed(3) + ") translateZ(0)";
            sc.style.opacity = op.toFixed(3);
            const lbl = sc.querySelector("[data-fly-lbl]"), sub = sc.querySelector("[data-fly-sub]");
            if (lbl) { lbl.style.opacity = peak ? "1" : "0"; lbl.style.transform = peak ? "none" : "translateY(14px)"; }
            if (sub) sub.style.opacity = peak ? "1" : "0";
            const d = dots[i];
            if (d) { d.style.background = peak ? "#fff" : "rgba(255,255,255,.22)"; d.style.transform = peak ? "scale(1.5)" : "none"; }
          });
          const ai = Math.min(Math.floor(p * N + .5), N - 1);
          if (ai !== lastGlow && glow) { glow.style.background = GLOWS[ai]; lastGlow = ai; }
        }
      }
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  async initHero3D() {
    const canvas = this.root.querySelector("[data-hero3d]");
    if (!canvas || innerWidth < 700) return;
    let THREE;
    try { THREE = await import("https://unpkg.com/three@0.160.0/build/three.module.js"); } catch (e) { return; }
    let rn;
    try { rn = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { return; }
    rn.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    rn.setSize(innerWidth, innerHeight);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
    cam.position.z = 14;
    const group = new THREE.Group(); scene.add(group);

    const c = document.createElement("canvas"); c.width = c.height = 64;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.25, "rgba(255,255,255,.85)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(c);

    const N = 1500, rad = 5.6, pos = new Float32Array(N * 3);
    const GA = Math.PI * (1 + Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const t = i / N, phi = Math.acos(1 - 2 * t), th = GA * i, r = rad * (.8 + Math.random() * .2);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pm = new THREE.PointsMaterial({ size: .15, map: sprite, color: 0x2b5adf, transparent: true, depthWrite: false, opacity: .5 });
    group.add(new THREE.Points(pg, pm));
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.6, 1)),
      new THREE.LineBasicMaterial({ color: 0x2b5adf, transparent: true, opacity: .16 })
    );
    group.add(wire);

    const onResize = () => { rn.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); };
    addEventListener("resize", onResize);
    canvas.style.opacity = "1";

    const worldsSec = this.root.querySelector("[data-worlds]");
    const clock = new THREE.Clock();
    let live = true;
    const loop = () => {
      if (!live) return;
      this.heroRaf = requestAnimationFrame(loop);
      const s = clock.getElapsedTime();
      const wr = worldsSec ? worldsSec.getBoundingClientRect() : null;
      const hidden = wr && wr.top < innerHeight * .4 && wr.bottom > innerHeight * .6;
      const dark = document.documentElement.getAttribute("data-th") === "dark";
      canvas.style.opacity = hidden ? "0" : (dark ? "1" : ".8");
      if (hidden || document.hidden) return;
      const docH = document.documentElement.scrollHeight - innerHeight;
      const p = docH > 0 ? scrollY / docH : 0;
      group.rotation.y = s * .035 + (this.mx || 0) * .45 + p * 2;
      group.rotation.x = Math.sin(s * .14) * .1 + (this.my || 0) * .28 + p * .4;
      group.position.y = p * 6;
      wire.rotation.y = -s * .05;
      const fade = 1 - Math.min(scrollY / innerHeight, 1) * .68;
      pm.color.setHex(dark ? 0x7fa2ff : 0x2b5adf);
      wire.material.color.setHex(dark ? 0x7fa2ff : 0x2b5adf);
      pm.opacity = (dark ? .75 : .42) * fade;
      wire.material.opacity = (dark ? .18 : .2) * fade;
      cam.position.z = 14 - Math.min(scrollY, 600) * .002 + p * 4;
      rn.render(scene, cam);
    };
    loop();
    this.stopHero = () => { live = false; cancelAnimationFrame(this.heroRaf); removeEventListener("resize", onResize); rn.dispose(); };
  }

  staticWorlds() {
    const sec = this.root.querySelector("[data-worlds]");
    if (!sec) return;
    sec.style.height = "auto";
    const st = sec.querySelector("[data-worlds-sticky]");
    st.style.position = "static"; st.style.height = "auto"; st.style.flexDirection = "column"; st.style.padding = "4rem 0";
    const cv = sec.querySelector("[data-worlds3d]"); if (cv) cv.style.display = "none";
    const caps = sec.querySelector("[data-worlds-caps]");
    caps.style.height = "auto"; caps.style.display = "flex"; caps.style.flexDirection = "column"; caps.style.gap = "2.6rem";
    sec.querySelectorAll("[data-wcap]").forEach(c => { c.style.position = "static"; c.style.opacity = "1"; c.style.transform = "none"; c.style.maxWidth = "42ch"; });
    sec.querySelectorAll("[data-wdot]").forEach(d => { d.style.display = "none"; });
  }

  async initWorlds() {
    const sec = this.root.querySelector("[data-worlds]");
    const canvas = this.root.querySelector("[data-worlds3d]");
    if (!sec || !canvas) return;
    if (innerWidth < 900) { this.staticWorlds(); return; }
    let THREE;
    try { THREE = await import("https://unpkg.com/three@0.160.0/build/three.module.js"); } catch (e) { this.staticWorlds(); return; }
    let rn;
    try { rn = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { this.staticWorlds(); return; }
    rn.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    const size = () => ({ w: canvas.clientWidth || innerWidth, h: canvas.clientHeight || innerHeight });
    let sz = size(); rn.setSize(sz.w, sz.h, false);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, sz.w / sz.h, .1, 100);
    cam.position.set(0, 0, 9);
    scene.add(new THREE.AmbientLight(0xffffff, .6));
    const key = new THREE.PointLight(0xdfe8ff, 85, 60); key.position.set(6, 7, 9); scene.add(key);
    const fill = new THREE.PointLight(0xffd9c2, 50, 60); fill.position.set(-7, -3, 5); scene.add(fill);
    const rim = new THREE.PointLight(0xffffff, 35, 60); rim.position.set(0, 4, -7); scene.add(rim);

    const stage = new THREE.Group(); scene.add(stage);
    const place = () => { stage.position.x = innerWidth < 1100 ? 0 : 2.6; };
    place();

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const smooth = t => t * t * (3 - 2 * t);
    const rand = (a, b) => a + Math.random() * (b - a);
    const mat = (hex, e) => new THREE.MeshStandardMaterial({ color: hex, metalness: .3, roughness: .28, emissive: hex, emissiveIntensity: e === undefined ? .15 : e });
    const tex = draw => { const c2 = document.createElement("canvas"); c2.width = c2.height = 256; draw(c2.getContext("2d"), 256); const t = new THREE.CanvasTexture(c2); t.colorSpace = THREE.SRGBColorSpace; return t; };

    const scenes = [];
    const add = builder => {
      const g = new THREE.Group(); g.visible = false; stage.add(g);
      let api = {};
      try { api = builder(g) || {}; } catch (e) {}
      scenes.push({ g, update: api.update || (() => {}) });
    };

    add(g => {
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4.6, .3), mat(0x24304a, .06));
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 4.2), new THREE.MeshBasicMaterial({
        map: tex((x, S) => {
          const gr = x.createLinearGradient(0, 0, S, S); gr.addColorStop(0, "#eef2fa"); gr.addColorStop(1, "#cdd8ee");
          x.fillStyle = gr; x.fillRect(0, 0, S, S);
          x.fillStyle = "rgba(40,70,140,.55)";
          for (let i = 0; i < 5; i++) x.fillRect(28, 46 + i * 40, 200 - i * 22, 12);
          x.fillStyle = "#2b5adf"; x.fillRect(28, 250, 90, 26);
        })
      }));
      screen.position.z = .16; body.add(screen); g.add(body);
      const tile = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, .22), new THREE.MeshStandardMaterial({
        roughness: .35, metalness: .1, map: tex((x, S) => {
          const gr = x.createLinearGradient(0, 0, S, S); gr.addColorStop(0, "#3b6bf5"); gr.addColorStop(1, "#12275f");
          x.fillStyle = gr; x.fillRect(0, 0, S, S);
          x.fillStyle = "#fff"; x.font = "400 128px Georgia, serif"; x.textAlign = "center"; x.textBaseline = "middle";
          x.fillText("AK", S / 2, S / 2 + 8);
        })
      }));
      g.add(tile); g.scale.setScalar(.9);
      return { update: t => {
        body.rotation.y = Math.sin(t * .35) * .5 + .25;
        body.rotation.x = Math.sin(t * .25) * .08;
        const a = t * .65;
        tile.position.set(Math.cos(a) * 2.3, Math.sin(a * .8) * 1.1, Math.sin(a) * 2.3);
        tile.rotation.y = -t * .9; tile.rotation.x = t * .4;
      } };
    });

    add(g => {
      const counts = [3, 4, 4, 3], xs = [-3, -1, 1, 3], nodes = [];
      const nm = mat(0x3b6bf5, .35), ng = new THREE.SphereGeometry(.18, 18, 18);
      counts.forEach((cnt, li) => {
        for (let i = 0; i < cnt; i++) {
          const n = new THREE.Mesh(ng, nm);
          n.position.set(xs[li], (i - (cnt - 1) / 2) * 1.25, rand(-.3, .3));
          n.userData.layer = li; g.add(n); nodes.push(n);
        }
      });
      const edges = [], pts = [];
      nodes.forEach(a => nodes.forEach(b => {
        if (b.userData.layer === a.userData.layer + 1) { edges.push([a, b]); pts.push(a.position.x, a.position.y, a.position.z, b.position.x, b.position.y, b.position.z); }
      }));
      const lg = new THREE.BufferGeometry();
      lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x3b6bf5, transparent: true, opacity: .3 })));
      const pulses = [], pg2 = new THREE.SphereGeometry(.075, 8, 8), pmat = new THREE.MeshBasicMaterial({ color: 0xff9f7a });
      for (let k = 0; k < 9; k++) {
        const m = new THREE.Mesh(pg2, pmat);
        m.userData = { e: edges[(Math.random() * edges.length) | 0], t: Math.random(), s: rand(.4, .9) };
        g.add(m); pulses.push(m);
      }
      return { update: t => {
        g.rotation.y = Math.sin(t * .2) * .5 + .2; g.rotation.x = Math.sin(t * .15) * .1;
        nodes.forEach((n, i) => n.scale.setScalar(1 + Math.sin(t * 2 + i) * .12));
        pulses.forEach(m => {
          m.userData.t += .016 * m.userData.s;
          if (m.userData.t > 1) { m.userData.t = 0; m.userData.e = edges[(Math.random() * edges.length) | 0]; }
          m.position.lerpVectors(m.userData.e[0].position, m.userData.e[1].position, m.userData.t);
        });
      } };
    });

    add(g => {
      const fz = .1;
      g.add(new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.9, .16), mat(0x263349, .04)));
      [0xff5f57, 0xfebc2e, 0x28c840].forEach((c2, i) => {
        const d = new THREE.Mesh(new THREE.CircleGeometry(.075, 14), new THREE.MeshBasicMaterial({ color: c2 }));
        d.position.set(-1.9 + i * .26, 1.14, fz); g.add(d);
      });
      const bar = new THREE.Mesh(new THREE.BoxGeometry(3.3, .26, .05), mat(0x1b2436, .02));
      bar.position.set(.25, 1.14, fz); g.add(bar);
      const lm = new THREE.MeshBasicMaterial({ color: 0x5b7fd6 });
      [[-.9, .45, 2.2], [-1.1, .05, 1.8], [-1.4, -.35, 1.2]].forEach(L => {
        const b2 = new THREE.Mesh(new THREE.PlaneGeometry(L[2], .12), lm);
        b2.position.set(L[0], L[1], fz); g.add(b2);
      });
      const btnPos = new THREE.Vector3(.7, -.7, fz);
      const btn = new THREE.Mesh(new THREE.BoxGeometry(1, .42, .07), mat(0x3b6bf5, .5));
      btn.position.copy(btnPos); g.add(btn);
      const ripple = new THREE.Mesh(new THREE.RingGeometry(.12, .2, 24), new THREE.MeshBasicMaterial({ color: 0xa9c2ff, transparent: true, opacity: 0 }));
      ripple.position.copy(btnPos); ripple.position.z = fz + .02; g.add(ripple);
      const cs = new THREE.Shape();
      cs.moveTo(0, 0); cs.lineTo(0, -1.3); cs.lineTo(.34, -.98); cs.lineTo(.58, -1.5); cs.lineTo(.76, -1.42); cs.lineTo(.52, -.92); cs.lineTo(.95, -.92); cs.closePath();
      const cur = new THREE.Mesh(new THREE.ExtrudeGeometry(cs, { depth: .12, bevelEnabled: false }), mat(0xffffff, .04));
      cur.scale.setScalar(.6); g.add(cur);
      const way = [new THREE.Vector3(-1.2, .6, fz + .25), new THREE.Vector3(1.1, .35, fz + .25), btnPos.clone().setZ(fz + .25), new THREE.Vector3(-.5, -1, fz + .25)];
      let clickT = -10;
      return { update: t => {
        g.rotation.y = Math.sin(t * .35) * .35; g.rotation.x = Math.sin(t * .25) * .07;
        const cyc = (t * .33) % way.length, i = Math.floor(cyc), f = smooth(cyc - i);
        cur.position.lerpVectors(way[i], way[(i + 1) % way.length], f);
        const at = ((i + 1) % way.length) === 2 && f > .8;
        cur.scale.setScalar(.6 * (at ? .82 : 1)); btn.scale.setScalar(at ? .92 : 1);
        if (at && t - clickT > 1) clickT = t;
        const e = t - clickT;
        if (e >= 0 && e < .6) { const k = e / .6; ripple.visible = true; ripple.scale.setScalar(1 + k * 5); ripple.material.opacity = .7 * (1 - k); }
        else ripple.visible = false;
      } };
    });

    add(g => {
      const R = 1.9;
      g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 32, 32), new THREE.MeshStandardMaterial({ color: 0x3b6bf5, transparent: true, opacity: .14, roughness: .3, metalness: .2 })));
      const rm = new THREE.MeshBasicMaterial({ color: 0x8ea9ff, transparent: true, opacity: .55 });
      const eq = new THREE.Mesh(new THREE.TorusGeometry(R, .014, 8, 64), rm); eq.rotation.x = Math.PI / 2; g.add(eq);
      g.add(new THREE.Mesh(new THREE.TorusGeometry(R, .014, 8, 64), rm));
      const m2 = new THREE.Mesh(new THREE.TorusGeometry(R, .014, 8, 64), rm); m2.rotation.y = Math.PI / 2; g.add(m2);
      const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), R, 0xff9f7a, .42, .26); g.add(arrow);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(.1, 14, 14), new THREE.MeshBasicMaterial({ color: 0xffc7ad })); g.add(tip);
      const gates = [];
      ["H", "X", "Z"].forEach((ch, i) => {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(.7, .7, .7), new THREE.MeshStandardMaterial({
          roughness: .4, metalness: .2, map: tex((x, S) => {
            x.fillStyle = "#f4f2ed"; x.fillRect(0, 0, S, S);
            x.strokeStyle = "#3b6bf5"; x.lineWidth = 10; x.strokeRect(16, 16, S - 32, S - 32);
            x.fillStyle = "#14161a"; x.font = "500 148px monospace"; x.textAlign = "center"; x.textBaseline = "middle";
            x.fillText(ch, S / 2, S / 2 + 10);
          })
        }));
        cube.userData.ph = i * 2.1; g.add(cube); gates.push(cube);
      });
      return { update: t => {
        g.rotation.y = t * .18;
        const th = Math.PI * .32 + Math.sin(t * .6) * .4, ph = t * 1.1;
        const dir = new THREE.Vector3(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph));
        arrow.setDirection(dir); tip.position.copy(dir).multiplyScalar(R);
        gates.forEach((c2, i) => {
          const a = t * .5 + c2.userData.ph;
          c2.position.set(Math.cos(a) * 2.7, Math.sin(a * .8) * 1.3, Math.sin(a) * 2.7);
          c2.rotation.y = t * .8 + i; c2.rotation.x = t * .5;
          c2.scale.setScalar(.8 + Math.sin(t * 2 + i) * .1);
        });
      } };
    });

    add(g => {
      const dark = mat(0x4a5262, .03), joint = mat(0xff9f7a, .4);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(.9, 1.1, .4, 24), dark);
      base.position.y = -2.2; g.add(base);
      const j1 = new THREE.Group(); j1.position.y = -2; g.add(j1);
      j1.add(new THREE.Mesh(new THREE.SphereGeometry(.42, 20, 20), joint));
      const a1 = new THREE.Mesh(new THREE.BoxGeometry(.5, 2, .5), dark); a1.position.y = 1; j1.add(a1);
      const j2 = new THREE.Group(); j2.position.y = 2; j1.add(j2);
      j2.add(new THREE.Mesh(new THREE.SphereGeometry(.34, 18, 18), joint));
      const a2 = new THREE.Mesh(new THREE.BoxGeometry(.42, 1.7, .42), dark); a2.position.y = .85; j2.add(a2);
      const j3 = new THREE.Group(); j3.position.y = 1.7; j2.add(j3);
      j3.add(new THREE.Mesh(new THREE.SphereGeometry(.26, 16, 16), joint));
      const grip = new THREE.Group(); grip.position.y = .35; j3.add(grip);
      const gA = new THREE.Mesh(new THREE.BoxGeometry(.12, .5, .3), dark); gA.position.x = -.22; grip.add(gA);
      const gB = new THREE.Mesh(new THREE.BoxGeometry(.12, .5, .3), dark); gB.position.x = .22; grip.add(gB);
      const bolts = [];
      for (let i = 0; i < 3; i++) {
        const bg = new THREE.BufferGeometry();
        bg.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(12 * 3), 3));
        const bl = new THREE.Line(bg, new THREE.LineBasicMaterial({ color: 0x3b6bf5, transparent: true, opacity: .9 }));
        grip.add(bl); bolts.push(bl);
      }
      g.scale.setScalar(.82); g.position.set(0, .3, 0);
      const rejag = line => {
        const p = line.geometry.attributes.position, n = p.count;
        for (let i = 0; i < n; i++) {
          const tt = i / (n - 1);
          p.setXYZ(i, (Math.random() - .5) * .5, -.1 + tt * -1.1 + (Math.random() - .5) * .18, (Math.random() - .5) * .5);
        }
        p.needsUpdate = true;
      };
      return { update: t => {
        g.rotation.y = Math.sin(t * .3) * .5 + .3;
        j1.rotation.z = Math.sin(t * .7) * .35;
        j2.rotation.z = Math.sin(t * .9 + 1) * .5;
        j3.rotation.z = Math.sin(t * 1.1 + 2) * .4;
        gA.position.x = -.22 - Math.abs(Math.sin(t * 1.5)) * .12;
        gB.position.x = .22 + Math.abs(Math.sin(t * 1.5)) * .12;
        bolts.forEach(bl => {
          if (Math.random() < .5) { bl.visible = true; rejag(bl); bl.material.opacity = rand(.5, 1); }
          else bl.visible = false;
        });
      } };
    });

    const caps = Array.from(sec.querySelectorAll("[data-wcap]"));
    const dots = Array.from(sec.querySelectorAll("[data-wdot]"));
    const COLORS = [0xdfe8ff, 0xc9d8ff, 0xffe0cf, 0xd6e0ff, 0xffd9c2];
    let curIdx = -1;
    const setActive = i => {
      caps.forEach((c2, k) => {
        const on = k === i;
        c2.style.opacity = on ? "1" : "0";
        c2.style.transform = on ? "none" : "translateY(34px)";
      });
      dots.forEach((d, k) => {
        const on = k === i;
        d.style.opacity = on ? "1" : ".35";
        d.style.height = on ? "20px" : "6px";
        d.style.background = on ? "var(--acc)" : "var(--fnt)";
      });
      key.color.setHex(COLORS[i]);
    };
    const onResize = () => { const s = size(); rn.setSize(s.w, s.h, false); cam.aspect = s.w / s.h; cam.updateProjectionMatrix(); place(); };
    addEventListener("resize", onResize);

    scenes.forEach((s, i) => { s.g.visible = i === 0; });
    setActive(0);
    const clock = new THREE.Clock();
    let disp = 0, swap = 1, swapping = false, live = true;
    const loop = () => {
      if (!live) return;
      this.wRaf = requestAnimationFrame(loop);
      const rect = sec.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight || document.hidden) return;
      const total = sec.offsetHeight - innerHeight;
      const p = clamp(-rect.top / total, 0, 1);
      const idx = Math.min(Math.floor(p * scenes.length), scenes.length - 1);
      if (idx !== curIdx) { curIdx = idx; setActive(idx); }
      if (idx !== disp && !swapping) swapping = true;
      if (swapping) {
        swap -= .08;
        if (swap <= 0) { swap = 0; scenes[disp].g.visible = false; disp = idx; scenes[disp].g.visible = true; swapping = false; }
      } else if (swap < 1) swap = Math.min(1, swap + .05);
      stage.scale.setScalar(.2 + .8 * smooth(swap));
      scenes[disp].update(clock.getElapsedTime());
      rn.render(scene, cam);
    };
    loop();
    this.stopWorlds = () => { live = false; cancelAnimationFrame(this.wRaf); removeEventListener("resize", onResize); rn.dispose(); };
  }
}



new Component().__mount();
