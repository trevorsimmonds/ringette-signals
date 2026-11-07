/* Referee rig: builds an SVG referee and poses her from keyframe data. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const SH = { L: [92, 114], R: [148, 114] };   // shoulder anchors
  const UA = 32, FA = 31;                        // upper arm / forearm lengths
  const TORSO = 'M95 112q0-10 12-12h26q12 2 12 12l-2.5 34 3 40H94.5l3-40z';
  const INK = '#17171a';

  // One shared <defs> for every referee on the page.
  function ensureDefs() {
    if (document.getElementById('ref-defs')) return;
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('id', 'ref-defs');
    s.setAttribute('aria-hidden', 'true');
    s.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    s.innerHTML = `<defs>
      <pattern id="ref-st" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><rect width="4" height="8" fill="${INK}"/></pattern>
      <clipPath id="ref-torso"><path d="${TORSO}"/></clipPath></defs>`;
    document.body.prepend(s);
  }

  const HANDS = {
    fist: `<circle cx="0" cy="4.5" r="6.6" fill="${INK}"/>`,
    flat: `<rect x="-5.6" y="-2" width="11.2" height="17" rx="5.6" fill="${INK}"/>`,
    palm: `<rect x="-5.6" y="-2" width="11.2" height="16" rx="5.6" fill="${INK}"/><ellipse cx="6.2" cy="3" rx="2.6" ry="4.6" transform="rotate(-28 6.2 3)" fill="${INK}"/>`,
    point: `<circle cx="0" cy="4" r="6.4" fill="${INK}"/><rect x="-1.9" y="7" width="3.8" height="11" rx="1.9" fill="${INK}"/>`,
    two: `<circle cx="0" cy="4" r="6.4" fill="${INK}"/><rect x="-4.4" y="7" width="3.6" height="11" rx="1.8" fill="${INK}"/><rect x="0.6" y="7" width="3.6" height="11.5" rx="1.8" fill="${INK}"/>`,
    spread: `<circle cx="0" cy="4" r="6" fill="${INK}"/>` +
      [-48, -22, 0, 22, 46].map((a, i) => `<rect x="-1.6" y="6" width="3.2" height="${i === 0 ? 7 : 9.5}" rx="1.6" fill="${INK}" transform="rotate(${a} 0 4)"/>`).join('')
  };

  function armMarkup(side) {
    return `<g class="ua">
      <rect class="uar" x="-7.5" y="-6" width="15" height="40" rx="7.5" fill="url(#ref-st)" stroke="${INK}" stroke-width="1.6"/>
      <g class="fo"><g class="fa">
        <rect class="far" x="-7" y="-4" width="14" height="35" rx="7" fill="url(#ref-st)" stroke="${INK}" stroke-width="1.6"/>
        <rect class="cuff" x="-7" y="25" width="14" height="6" rx="2" fill="${INK}"/>
        <g class="hp"><g class="hand"></g></g>
      </g></g></g>`;
  }

  function build(svg, opts = {}) {
    ensureDefs();
    svg.setAttribute('viewBox', '0 -14 240 314');
    svg.innerHTML = `
      <ellipse cx="120" cy="284" rx="62" ry="8" fill="#000" opacity=".1"/>
      <g class="props"></g>
      <g class="bodyg">
        <g class="armsBack"></g>
        <g class="legs">
          <path d="M97 182h22l-2 70h-17z" fill="#1c1d22"/><path d="M121 182h22l-3 70h-17z" fill="#1c1d22"/>
        </g>
        <g class="skL"><path d="M96 248h22v12q0 6-6 6H88q-4 0-4-4t5-6z" fill="#26272d"/><rect x="84" y="268" width="36" height="3" rx="1.5" fill="#a9b4bf"/></g>
        <g class="skR"><path d="M122 248h22l7 8q5 2 5 6t-4 4h-24q-6 0-6-6z" fill="#26272d"/><rect x="120" y="268" width="36" height="3" rx="1.5" fill="#a9b4bf"/></g>
        <g class="torso">
          <path d="${TORSO}" fill="url(#ref-st)"/>
          <g clip-path="url(#ref-torso)"><rect x="88" y="176" width="64" height="12" fill="${INK}"/></g>
          <path d="${TORSO}" fill="none" stroke="${INK}" stroke-width="2"/>
          <path d="M110 100l10 13 10-13z" fill="${INK}"/>
          <path d="M113 100q-2 10 -5 18" stroke="#d63b3b" stroke-width="1.6" fill="none"/>
          <rect x="103" y="117" width="9" height="5" rx="2" fill="#8c96a3"/>
        </g>
        <g class="head">
          <g class="pony"><path d="M133 82q12 2 13 14q1 10-5 16q-2-9-7-14q-4-6-1-16z" fill="#5a3a22"/><path d="M135 86q8 4 8 13" stroke="#3f2816" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>
          <path d="M100.5 78q-1 12 4 18l4-2q-3-7-2-16z" fill="#5a3a22"/><path d="M139.5 78q1 12-4 18l-4-2q3-7 2-16z" fill="#5a3a22"/>
          <rect x="113" y="88" width="14" height="14" rx="4" fill="#e3ad85"/>
          <circle cx="120" cy="76" r="19" fill="#f2c9a0"/>
          <path d="M101 74a19 19 0 0 1 38 0v2h-38z" fill="${INK}"/>
          <path d="M99 76h42l-2 4h-38z" fill="#2d2f36"/>
          <rect x="100" y="76" width="7" height="12" rx="3" fill="${INK}"/><rect x="133" y="76" width="7" height="12" rx="3" fill="${INK}"/>
<g class="face">          <circle cx="113" cy="85" r="1.9" fill="#2a2a2a"/><circle cx="127" cy="85" r="1.9" fill="#2a2a2a"/>
          <path d="M110.6 83.6l-1.6-1.2M129.4 83.6l1.6-1.2" stroke="#2a2a2a" stroke-width="1.1" stroke-linecap="round"/>
          <circle cx="109.5" cy="89.5" r="2.6" fill="#f0a7a0" opacity=".45"/><circle cx="130.5" cy="89.5" r="2.6" fill="#f0a7a0" opacity=".45"/>
          <path class="mouth" d="M116 91.5q4 3 8 0" stroke="#c0605a" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>
        </g>
        <g class="armsFront"></g>
      </g>
      <g class="cap" opacity="0"><rect x="70" y="0" width="100" height="22" rx="11" fill="#000"/><text x="120" y="15.5" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="system-ui,-apple-system,Segoe UI,sans-serif" letter-spacing=".5"></text></g>`;
    const q = (s) => svg.querySelector(s);
    const arms = {};
    for (const side of ['L', 'R']) {
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = armMarkup(side);
      const anchor = document.createElementNS(NS, 'g');
      anchor.appendChild(g);
      arms[side] = {
        anchor, ua: g.querySelector('.ua'), uar: g.querySelector('.uar'), fo: g.querySelector('.fo'),
        fa: g.querySelector('.fa'), far: g.querySelector('.far'), cuff: g.querySelector('.cuff'),
        hp: g.querySelector('.hp'), hand: g.querySelector('.hand'), shape: null
      };
      q('.armsBack').appendChild(anchor);
    }
    return {
      svg, arms, bodyg: q('.bodyg'), legs: q('.legs'), skR: q('.skR'), skL: q('.skL'), torso: q('.torso'), head: q('.head'),
      pony: q('.pony'), face: q('.face'), cap: q('.cap'), capText: q('.cap text'), capRect: q('.cap rect'), props: q('.props'),
      back: q('.armsBack'), front: q('.armsFront'), capVal: null, ponyA: 0, ponyV: 0, lastU: null
    };
  }

  // ---- Inverse kinematics ------------------------------------------------
  // Arm angles: θ measured from straight down, positive = away from the body.
  // Targets: {x,y} relative to shoulder in "outward" coords, or {ax,ay} absolute.
  function solveArm(side, a, dy) {
    const ul = a.ul ?? 1, fl = a.fl ?? 1;
    if (a.u !== undefined) return { u: a.u, f: a.f ?? 0, ul, fl };
    const out = side === 'L' ? -1 : 1;
    let x, y;
    if (a.ax !== undefined) { x = (a.ax - SH[side][0]) * out; y = a.ay - (SH[side][1] + (dy || 0)); }
    else { x = a.x; y = a.y; }
    const A = UA * ul, B = (FA + 4) * fl;
    let d = Math.hypot(x, y);
    d = Math.min(Math.max(d, Math.abs(A - B) + 0.01), A + B - 0.01);
    const phi = Math.atan2(x, y);
    const alpha = Math.acos((A * A + d * d - B * B) / (2 * A * d));
    const cand = [phi + alpha, phi - alpha].map((tu) => {
      const ex = A * Math.sin(tu), ey = A * Math.cos(tu);
      const tf = Math.atan2(x - ex, y - ey);
      return { u: tu * 180 / Math.PI, f: (tf - tu) * 180 / Math.PI, ex, ey };
    });
    let pick;
    if (a.bend === 'in') pick = cand[0].ex < cand[1].ex ? cand[0] : cand[1];
    else if (a.bend === 'up') pick = cand[0].ey < cand[1].ey ? cand[0] : cand[1];
    else if (a.bend === 'down') pick = cand[0].ey > cand[1].ey ? cand[0] : cand[1];
    else pick = cand[0].ex > cand[1].ex ? cand[0] : cand[1];
    return { u: pick.u, f: norm(pick.f), ul, fl };
  }
  const norm = (a) => { while (a > 180) a -= 360; while (a < -180) a += 360; return a; };
  const near = (from, to) => { while (to - from > 180) to -= 360; while (to - from < -180) to += 360; return to; };

  // Body: crouch c (0..1), lean, toe (deg), bob
  function bodyDy(b) {
    const c = b?.c || 0, ls = 1 - 0.4 * c, ts = 1 - 0.2 * c;
    const Hn = 252 - (252 - 186) * ls;
    return { ls, ts, Hn, dy: (Hn - 72 * ts) - 114 };
  }

  // Precompute a signal: resolve every key into numeric pose.
  function compile(sig) {
    const keys = sig.keys.map(([t, p]) => {
      const body = { c: 0, toe: 0, bob: 0, look: 0, ...(p.body || {}) };
      const dy = bodyDy(body).dy;
      const arm = (side) => {
        const a = p[side] || REST;
        const s = solveArm(side, a, dy);
        const w = a.ha !== undefined ? a.ha - (s.u + s.f) : (a.w ?? 0);
        return { ...s, h: a.h || 'fist', hs: a.hs ?? 1, w: norm(w) };
      };
      return { t, L: arm('L'), R: arm('R'), body, cap: p.cap === undefined ? null : p.cap, prop: p.prop ?? null };
    });
    return { ...sig, ck: keys };
  }
  const REST = { u: 12, f: -6, h: 'fist' };

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  function sample(cs, t) {
    const k = cs.ck;
    let i = 0;
    while (i < k.length - 1 && k[i + 1].t <= t) i++;
    const a = k[i], b = k[Math.min(i + 1, k.length - 1)];
    const span = b.t - a.t;
    const p = span > 0 ? ease(Math.min(1, Math.max(0, (t - a.t) / span))) : 0;
    const arm = (s) => ({
      u: lerp(a[s].u, near(a[s].u, b[s].u), p), f: lerp(a[s].f, near(a[s].f, b[s].f), p),
      ul: lerp(a[s].ul, b[s].ul, p), fl: lerp(a[s].fl, b[s].fl, p), hs: lerp(a[s].hs, b[s].hs, p),
      w: lerp(a[s].w, near(a[s].w, b[s].w), p), h: p < 0.35 ? a[s].h : b[s].h
    });
    const body = {}; for (const key of ['c', 'toe', 'bob', 'look']) body[key] = lerp(a.body[key] || 0, b.body[key] || 0, p);
    return { L: arm('L'), R: arm('R'), body, cap: a.cap, prop: a.prop };
  }

  function apply(r, pose, dt) {
    const { ls, ts, Hn, dy } = bodyDy(pose.body);
    r.legs.setAttribute('transform', `translate(0 ${252 * (1 - ls)}) scale(1 ${ls})`);
    r.torso.setAttribute('transform', `translate(0 ${Hn}) scale(1 ${ts}) translate(0 -186)`);
    r.bodyg.setAttribute('transform', `translate(0 ${-pose.body.bob})`);
    r.skR.setAttribute('transform', `rotate(${-pose.body.toe} 124 268)`);
    const lk = pose.body.look || 0;
    r.face.setAttribute('transform', `translate(${lk * 6} 0)`);
    r.head.setAttribute('transform', `translate(0 ${dy + pose.body.c * 6}) rotate(${lk * 6} 120 90)`);
    for (const side of ['L', 'R']) {
      const a = pose[side], m = r.arms[side], sg = side === 'L' ? 1 : -1;
      const [sx, sy] = SH[side];
      m.anchor.setAttribute('transform', `translate(${sx} ${sy + dy})`);
      m.ua.setAttribute('transform', `rotate(${sg * a.u})`);
      const uLen = UA * a.ul;
      m.uar.setAttribute('height', uLen + 8);
      m.fo.setAttribute('transform', `translate(0 ${uLen})`);
      m.fa.setAttribute('transform', `rotate(${sg * a.f})`);
      const fLen = FA * a.fl;
      m.far.setAttribute('height', Math.max(8, fLen + 4));
      m.cuff.setAttribute('y', fLen - 6);
      m.hp.setAttribute('transform', `translate(0 ${fLen}) rotate(${sg * a.w}) scale(${a.hs})`);
      if (m.shape !== a.h) { m.hand.innerHTML = `<g stroke="#fff" stroke-width="1.4" paint-order="stroke" stroke-linejoin="round">${HANDS[a.h] || HANDS.fist}</g>`; m.shape = a.h; }
    }
    // ponytail: springs against arm motion
    const u = pose.L.u + pose.R.u;
    if (r.lastU !== null && dt > 0) {
      const vel = (u - r.lastU) / dt;
      r.ponyV += (-vel * 0.004 - r.ponyA * 0.09) - r.ponyV * 0.18;
      r.ponyA = Math.max(-14, Math.min(14, r.ponyA + r.ponyV));
    }
    r.lastU = u;
    r.pony.setAttribute('transform', `rotate(${r.ponyA.toFixed(2)} 136 86)`);
    if (pose.cap !== r.capVal) {
      r.capVal = pose.cap;
      if (pose.cap) {
        r.capText.textContent = pose.cap;
        const w = Math.max(44, pose.cap.length * 9 + 26);
        r.capRect.setAttribute('x', 120 - w / 2); r.capRect.setAttribute('width', w);
        r.cap.setAttribute('opacity', '1');
      } else r.cap.setAttribute('opacity', '0');
    }
    if (pose.prop !== r.propVal) {
      r.propVal = pose.prop;
      r.props.innerHTML = PROPS[pose.prop] || '';
    }
  }

  const PROPS = {
    net: `<g transform="translate(204 214)"><path d="M0 0h32v58H0" fill="none" stroke="#d6001c" stroke-width="4" stroke-linejoin="round"/>
      <g stroke="#9aa6b2" stroke-width="1">${[8, 16, 24].map(x => `<line x1="${x}" y1="2" x2="${x}" y2="58"/>`).join('')}${[12, 24, 36, 48].map(y => `<line x1="2" y1="${y}" x2="30" y2="${y}"/>`).join('')}</g></g>`,
    arrow: `<g transform="translate(186 236)"><path d="M0 8h30v-8l18 14-18 14v-8H0z" fill="#d6001c"/></g>`,
    ring: `<ellipse cx="214" cy="268" rx="13" ry="4.5" fill="none" stroke="#2f6fd6" stroke-width="3.5"/>`
  };

  function setLayers(r, sig) {
    for (const side of (sig.top === 'L' ? ['R', 'L'] : ['L', 'R'])) {
      const want = (sig.front && sig.front.includes(side)) ? r.front : r.back;
      if (r.arms[side].anchor.parentNode !== want) want.appendChild(r.arms[side].anchor);
    }
  }

  window.RefRig = { build, compile, sample, apply, setLayers };
})();
