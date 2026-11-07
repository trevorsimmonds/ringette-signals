(function () {
  const PDF = 'https://www.ringette.ca/wp-content/uploads/2025/09/Final-Draft-Official-Rules-and-Case-Book-2025-2027-English-5.5x8.5-sm-1.pdf';
  // PDF page = printed page + offset (front matter). null = open the PDF without a page jump.
  const PAGE_OFFSET = null;
  const ANNEX_C_PAGE = 197;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sigs = window.SIGNALS.map((s) => RefRig.compile(s));
  const pdfLink = (page) => PDF + (PAGE_OFFSET !== null && page ? `#page=${page + PAGE_OFFSET}` : '');
  $('bookLink').href = PDF;

  // ---------- animation loop ----------
  const players = new Set();
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    for (const p of players) {
      if (!p.playing) continue;
      p.clock += dt * p.speed;
      const t = (p.clock % p.cs.dur) / p.cs.dur;
      RefRig.apply(p.r, RefRig.sample(p.cs, t), dt * p.speed);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function makePlayer(svg, cs, opts = {}) {
    const r = RefRig.build(svg);
    const p = { r, cs, clock: opts.clock || 0, speed: 1, playing: true };
    setSignal(p, cs);
    return p;
  }
  function setSignal(p, cs, still) {
    p.cs = cs; p.clock = 0; p.r.lastU = null; p.r.ponyA = 0; p.r.ponyV = 0;
    RefRig.setLayers(p.r, cs);
    RefRig.apply(p.r, RefRig.sample(cs, still ? 0.6 : 0), 0);
    p.r.svg.setAttribute('aria-label', `Referee demonstrating the ${cs.name} signal`);
  }

  // ---------- list ----------
  const grid = $('grid');
  const cards = [];
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    for (const e of entries) {
      const c = cards.find((x) => x.el === e.target);
      if (!c || reduce) continue;
      if (e.isIntersecting) { c.p.clock = (c.i * 0.37) % c.p.cs.dur; players.add(c.p); }
      else players.delete(c.p);
    }
  }, { rootMargin: '60px' }) : null;

  sigs.forEach((cs, i) => {
    const el = document.createElement('button');
    el.className = 'sig';
    el.dataset.id = cs.id;
    const ref = cs.rule ? `Rule ${cs.rule.ref}` : 'Annex C';
    el.innerHTML = `<span class="thumb"><svg role="img"></svg></span>
      <span class="meta"><span class="nm">${cs.name}</span><span class="rf ${cs.cat === 'penalty' ? 'pen' : ''}">${cs.cat === 'penalty' ? 'Penalty' : 'General'} · ${ref}</span></span>`;
    const p = makePlayer(el.querySelector('svg'), cs);
    RefRig.apply(p.r, RefRig.sample(cs, 0.6), 0);
    el.addEventListener('click', () => openViewer(cs.id));
    grid.appendChild(el);
    cards.push({ el, p, cs, i });
    if (io) io.observe(el);
  });

  $('nAll').textContent = sigs.length;
  $('nGen').textContent = sigs.filter((s) => s.cat === 'general').length;
  $('nPen').textContent = sigs.filter((s) => s.cat === 'penalty').length;

  let cat = 'all', query = '';
  const visible = () => sigs.filter((s) => (cat === 'all' || s.cat === cat) && (s.name + ' ' + s.means).toLowerCase().includes(query));
  function filter() {
    let n = 0;
    for (const c of cards) {
      const show = (cat === 'all' || c.cs.cat === cat) && (c.cs.name + ' ' + c.cs.means).toLowerCase().includes(query);
      c.el.hidden = !show; if (show) n++;
    }
    $('empty').hidden = n > 0;
  }
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach((x) => x.setAttribute('aria-selected', x === b));
    cat = b.dataset.cat; filter();
  }));
  $('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); filter(); });

  // ---------- one at a time ----------
  const viewer = $('viewer');
  let vp = null, list = sigs, idx = 0, quiz = false, revealed = false, slow = false;

  function ruleLinks(cs) {
    const out = [];
    if (cs.rule) {
      const where = cs.rule.approx ? `Section ${cs.rule.ref.split('.')[0]} starts p. ${cs.rule.page}` : `p. ${cs.rule.page}`;
      out.push(`<a class="rule" href="${pdfLink(cs.rule.approx ? cs.rule.page : cs.rule.page)}" target="_blank" rel="noopener">
        <span>Rule ${cs.rule.ref} · ${cs.rule.title}<small>Official Rules &amp; Case Book 2025–2027 · ${where}</small></span><span class="arr">↗</span></a>`);
    }
    out.push(`<a class="rule ${cs.rule ? 'sec' : ''}" href="${pdfLink(ANNEX_C_PAGE)}" target="_blank" rel="noopener">
      <span>Annex C · On-Ice Officials' Signals<small>How the signal is given · p. ${ANNEX_C_PAGE}</small></span><span class="arr">↗</span></a>`);
    return out.join('');
  }

  function show(i, dir) {
    idx = (i + list.length) % list.length;
    const cs = list[idx];
    if (!vp) { vp = makePlayer($('vSvg'), cs); players.add(vp); }
    else setSignal(vp, cs);
    vp.speed = slow ? 0.5 : 1;
    $('vCount').textContent = `${idx + 1} / ${list.length}`;
    $('vCat').textContent = cs.cat === 'penalty' ? 'Penalty signal' : 'General signal';
    $('vName').textContent = cs.name;
    revealed = false; applyQuiz();
    $('vMeans').textContent = cs.means;
    $('vHow').textContent = cs.how;
    $('vRules').innerHTML = ruleLinks(cs);
    const st = $('vStage');
    st.classList.remove('slide-l', 'slide-r'); void st.offsetWidth;
    if (dir) st.classList.add(dir > 0 ? 'slide-l' : 'slide-r');
    history.replaceState(null, '', `#${cs.id}`);
  }
  function applyQuiz() {
    const hide = quiz && !revealed;
    $('vName').classList.toggle('hidden-name', hide);
    $('vHow').hidden = hide; $('vRules').hidden = hide; $('vMeansWrap').hidden = hide; $('vHowH').hidden = hide;
    $('vReveal').hidden = !hide;
    $('vName').setAttribute('aria-hidden', hide);
  }

  function openViewer(id) {
    list = id ? sigs : visible();
    if (!list.length) list = sigs;
    const start = id ? Math.max(0, list.findIndex((s) => s.id === id)) : 0;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    for (const c of cards) players.delete(c.p);
    if (!history.state || !history.state.viewer) history.pushState({ viewer: true }, '', location.href);
    show(start, 0);
    if (vp) { vp.playing = true; players.add(vp); $('vPlay').textContent = 'Pause'; }
    $('vClose').focus();
  }
  function closeViewer(fromPop) {
    if (viewer.hidden) return;
    viewer.hidden = true;
    document.body.style.overflow = '';
    if (vp) players.delete(vp);
    if (io) cards.forEach((c) => { io.unobserve(c.el); io.observe(c.el); });
    history.replaceState(null, '', location.pathname + location.search);
    if (!fromPop && history.state && history.state.viewer) history.back();
  }

  $('startBtn').addEventListener('click', () => openViewer(null));
  $('vClose').addEventListener('click', () => { viewer.hidden ? null : (history.state && history.state.viewer ? history.back() : closeViewer(true)); });
  window.addEventListener('popstate', () => {
    // A new #signal link while the viewer is open is handled by hashchange; anything else is "back".
    const h = decodeURIComponent(location.hash.slice(1));
    if (!viewer.hidden && h && h !== (list[idx] && list[idx].id) && sigs.some((s) => s.id === h)) return;
    closeViewer(true);
  });
  $('vPrev').addEventListener('click', () => show(idx - 1, -1));
  $('vNext').addEventListener('click', () => show(idx + 1, 1));
  $('vPlay').addEventListener('click', () => { vp.playing = !vp.playing; $('vPlay').textContent = vp.playing ? 'Pause' : 'Play'; });
  $('vSlow').addEventListener('click', () => {
    slow = !slow; vp.speed = slow ? 0.5 : 1;
    $('vSlow').textContent = slow ? 'Normal speed' : 'Slow motion';
    $('vSpeed').textContent = slow ? '½×' : '1×';
  });
  $('vQuiz').addEventListener('click', () => {
    quiz = !quiz; $('vQuiz').setAttribute('aria-pressed', quiz);
    $('vQuiz').textContent = quiz ? 'Show names' : 'Hide names';
    revealed = false; applyQuiz();
  });
  $('vReveal').addEventListener('click', () => { revealed = true; applyQuiz(); });
  document.addEventListener('keydown', (e) => {
    if (viewer.hidden) return;
    if (e.key === 'ArrowRight') show(idx + 1, 1);
    else if (e.key === 'ArrowLeft') show(idx - 1, -1);
    else if (e.key === 'Escape') $('vClose').click();
    else if (e.key === ' ') { e.preventDefault(); $('vPlay').click(); }
  });
  // swipe
  let sx = 0, sy = 0, tracking = false;
  const stage = $('vStage');
  stage.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (!tracking) return; tracking = false;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });

  // deep link: #signal-id opens it
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash && sigs.some((s) => s.id === hash)) openViewer(hash);
  window.addEventListener('hashchange', () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h && sigs.some((s) => s.id === h)) { if (viewer.hidden) openViewer(h); else show(list.findIndex((s) => s.id === h), 0); }
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
