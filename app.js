(function () {
  const PDF = 'https://www.ringette.ca/wp-content/uploads/2025/09/Final-Draft-Official-Rules-and-Case-Book-2025-2027-English-5.5x8.5-sm-1.pdf';
  // PDF page = printed page + offset (front matter). null = open the PDF without a page jump.
  const PAGE_OFFSET = 5;
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
    const ref = cs.rule ? (/^\d/.test(cs.rule.ref) ? `Rule ${cs.rule.ref}` : cs.rule.ref) : 'Annex C';
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
    const rules = cat === 'rules';
    grid.hidden = rules; $('rulesList').hidden = !rules;
    if (rules) {
      let m = 0;
      for (const r of ruleEls) { const show = !query || r.card.search.includes(query); r.el.hidden = !show; if (show) m++; }
      for (const s of secEls) s.hidden = !ruleEls.some((r) => r.card.kind === s.dataset.kind && !r.el.hidden);
      $('empty').hidden = m > 0;
      $('empty').textContent = 'No rules match that search.';
      return;
    }
    $('empty').textContent = 'No signals match that search.';
    let n = 0;
    for (const c of cards) {
      const show = (cat === 'all' || c.cs.cat === cat) && (c.cs.name + ' ' + c.cs.means).toLowerCase().includes(query);
      c.el.hidden = !show; if (show) n++;
    }
    $('empty').hidden = n > 0;
  }
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach((x) => x.setAttribute('aria-selected', x === b));
    cat = b.dataset.cat;
    $('search').placeholder = cat === 'rules' ? 'Search rules and situations' : 'Search signals';
    filter();
  }));
  $('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); filter(); });

  // ---------- rules list ----------
  const RC = window.RULE_CARDS || [];
  const ruleEls = [], secEls = [];
  const SECTIONS = [
    ['basic', 'Basics', 'New to ringette? Start here.'],
    ['situation', 'Situations', 'The things you don\'t see every game.'],
    ['ontario', 'Ringette Ontario extras', 'Only at Ringette Ontario sanctioned events, like tournaments and provincials. Your league may set its own rules.']
  ];
  for (const [kind, label, note] of SECTIONS) {
    const sec = document.createElement('div');
    sec.dataset.kind = kind;
    sec.innerHTML = `<h2 class="rsec">${label}</h2><p class="rsec-note">${note}</p>`;
    $('rulesList').appendChild(sec); secEls.push(sec);
    for (const card of RC.filter((c) => c.kind === kind)) {
      const el = document.createElement('button');
      el.className = 'rcard' + (kind === 'ontario' ? ' ontario' : '');
      el.innerHTML = `<span class="t">${card.title}${kind === 'ontario' ? '<span class="badge-on">ONTARIO</span>' : ''}</span><span class="s">${card.short}</span>`;
      el.addEventListener('click', () => openRule(card.id));
      sec.appendChild(el); ruleEls.push({ el, card });
    }
  }
  $('nRules').textContent = RC.length;

  // ---------- one at a time ----------
  const viewer = $('viewer');
  let vp = null, list = sigs, idx = 0, quiz = false, revealed = false, slow = false;

  function ruleLinks(cs) {
    const out = [];
    if (cs.rule) {
      const where = `p. ${cs.rule.page}`;
      out.push(`<a class="rule" href="${pdfLink(cs.rule.page)}" target="_blank" rel="noopener">
        <span>${/^\d/.test(cs.rule.ref) ? 'Rule ' : ''}${cs.rule.ref} · ${cs.rule.title}<small>Official Rules &amp; Case Book 2025–2027 · ${where}</small></span><span class="arr">↗</span></a>`);
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
    const learn = RC.filter((r) => r.signals.includes(cs.id));
    $('vLearn').innerHTML = learn.map((r) => `<button class="sigchip" data-rule="${r.id}">${r.title}</button>`).join('');
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

  $('startBtn').addEventListener('click', () => {
    if (cat === 'rules') { const first = ruleEls.find((r) => !r.el.hidden); if (first) openRule(first.card.id); }
    else openViewer(null);
  });
  $('vLearn').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rule]'); if (!b) return;
    viewer.hidden = true; if (vp) players.delete(vp);
    openRule(b.dataset.rule, true);
  });

  // ---------- rule cards, one at a time ----------
  const rviewer = $('rviewer');
  let rlist = RC, ridx = 0;
  const RO_LINK = window.RO_PDF;
  function ruleLink(r) {
    if (r.ro) return `<a class="rule" href="${RO_LINK}" target="_blank" rel="noopener"><span>Ringette Ontario ${r.ref} · ${r.title}<small>Competition Playing Rules, August 2025</small></span><span class="arr">↗</span></a>`;
    const label = /^\d/.test(r.ref) ? `Rule ${r.ref}` : r.ref;
    return `<a class="rule" href="${pdfLink(r.page)}" target="_blank" rel="noopener"><span>${label} · ${r.title}<small>Official Rules &amp; Case Book 2025–2027 · p. ${r.page}</small></span><span class="arr">↗</span></a>`;
  }
  function showRule(i) {
    ridx = (i + rlist.length) % rlist.length;
    const c = rlist[ridx];
    $('rCount').textContent = `${ridx + 1} / ${rlist.length}`;
    $('rKind').textContent = c.kind === 'basic' ? 'Basics' : c.kind === 'situation' ? 'Situation' : 'Ringette Ontario';
    $('rTitle').textContent = c.title;
    $('rShort').textContent = c.short;
    $('rText').innerHTML = c.body.map((t) => `<li>${t}</li>`).join('');
    const d = c.diagram && window.RULE_DIAGRAMS[c.diagram];
    $('rDiagram').innerHTML = d ? `${d.svg}<p class="cap">${d.caption}</p>${d.legend.length ? `<div class="legend">${d.legend.map(([k, t]) => `<span><i class="dot ${k}"></i>${t}</span>`).join('')}</div>` : ''}` : '';
    $('rOntarioNote').hidden = c.kind !== 'ontario';
    $('rRules').innerHTML = c.rules.map(ruleLink).join('');
    const sg = c.signals.map((id) => sigs.find((s) => s.id === id)).filter(Boolean);
    $('rSignals').innerHTML = sg.map((s) => `<button class="sigchip" data-sig="${s.id}">${s.name}</button>`).join('');
    $('rSigH').hidden = !sg.length;
    $('rBody').scrollTop = 0; rviewer.scrollTop = 0;
    history.replaceState(history.state, '', `#rule-${c.id}`);
  }
  function openRule(id, keepState) {
    rlist = cat === 'rules' && !keepState ? ruleEls.filter((r) => !r.el.hidden).map((r) => r.card) : RC;
    if (!rlist.some((r) => r.id === id)) rlist = RC;
    rviewer.hidden = false;
    document.body.style.overflow = 'hidden';
    for (const c of cards) players.delete(c.p);
    if (!history.state || !history.state.viewer) history.pushState({ viewer: true }, '', location.href);
    showRule(rlist.findIndex((r) => r.id === id));
    $('rClose').focus();
  }
  function closeRule() {
    if (rviewer.hidden) return;
    rviewer.hidden = true;
    document.body.style.overflow = '';
    if (io) cards.forEach((c) => { io.unobserve(c.el); io.observe(c.el); });
    history.replaceState(null, '', location.pathname + location.search);
  }
  $('rClose').addEventListener('click', () => (history.state && history.state.viewer ? history.back() : closeRule()));
  $('rPrev').addEventListener('click', () => showRule(ridx - 1));
  $('rNext').addEventListener('click', () => showRule(ridx + 1));
  $('rSignals').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sig]'); if (!b) return;
    rviewer.hidden = true;
    openViewer(b.dataset.sig);
  });
  let rsx = 0, rsy = 0;
  rviewer.addEventListener('touchstart', (e) => { rsx = e.touches[0].clientX; rsy = e.touches[0].clientY; }, { passive: true });
  rviewer.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - rsx, dy = e.changedTouches[0].clientY - rsy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) showRule(ridx + (dx < 0 ? 1 : -1));
  }, { passive: true });
  $('vClose').addEventListener('click', () => { viewer.hidden ? null : (history.state && history.state.viewer ? history.back() : closeViewer(true)); });
  window.addEventListener('popstate', () => {
    // A new #signal link while the viewer is open is handled by hashchange; anything else is "back".
    const h = decodeURIComponent(location.hash.slice(1));
    if (!viewer.hidden && h && h !== (list[idx] && list[idx].id) && sigs.some((s) => s.id === h)) return;
    if (!rviewer.hidden && h.startsWith('rule-') && h.slice(5) !== (rlist[ridx] && rlist[ridx].id)) return;
    closeViewer(true); closeRule();
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
    if (!rviewer.hidden) {
      if (e.key === 'ArrowRight') showRule(ridx + 1); else if (e.key === 'ArrowLeft') showRule(ridx - 1); else if (e.key === 'Escape') $('rClose').click();
      return;
    }
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
  else if (hash.startsWith('rule-') && RC.some((r) => r.id === hash.slice(5))) openRule(hash.slice(5), true);
  window.addEventListener('hashchange', () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith('rule-') && RC.some((r) => r.id === h.slice(5))) {
      if (rviewer.hidden) openRule(h.slice(5), true); else showRule(rlist.findIndex((r) => r.id === h.slice(5)));
      return;
    }
    if (h && sigs.some((s) => s.id === h)) { if (viewer.hidden) openViewer(h); else show(list.findIndex((s) => s.id === h), 0); }
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
