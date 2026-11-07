/* All 37 on-ice officials' signals (Ringette Canada, 2025–2027).
   "how" is paraphrased from Ringette Canada's officials' signal guide.
   RULES (bottom): the rule each signal relates to, with printed page numbers. Annex C (signals) is p. 197. */
(function () {
  const REST = { u: 12, f: -6, h: 'fist' };
  const up = (L, R, extra = {}) => ({ L: L || REST, R: R || REST, ...extra });
  // Standard "raise, hold, lower" timeline.
  const hold = (pose, opts = {}) => [
    [0, up()], [0.06, up()], [0.3, pose], [0.78, pose], [0.97, up()], [1, up()]
  ];

  // Arm pointing straight at the viewer (foreshortened), used for forward reaches.
  const FWD = (h, hs = 1.5) => ({ u: 86, f: 0, ul: 0.26, fl: 0.26, h, hs });
  const EXP = { ax: 158, ay: 124, fl: 0.8, h: 'spread', hs: 1.25 };       // open hand out in front
  const WHISTLE = { ax: 114, ay: 94, h: 'fist', bend: 'down' };          // whistle to the mouth
  const S = [];
  const add = (o) => S.push(o);

  // ---------------- GENERAL SIGNALS ----------------
  add({ id: 'all-clear', name: 'All clear', cat: 'general', dur: 4.2,
    how: 'The official looks left and right to check both teams are ready, then holds both arms straight out to the sides at shoulder height, palms down.',
    keys: [[0, up()], [0.04, up()], [0.14, up(null, null, { body: { look: -1 } })], [0.24, up(null, null, { body: { look: -1 } })],
      [0.32, up(null, null, { body: { look: 1 } })], [0.42, up(null, null, { body: { look: 1 } })], [0.48, up()],
      [0.6, up({ u: 90, f: 0, h: 'flat' }, { u: 90, f: 0, h: 'flat' })], [0.86, up({ u: 90, f: 0, h: 'flat' }, { u: 90, f: 0, h: 'flat' })],
      [0.98, up()], [1, up()]] });

  add({ id: 'delayed-penalty', name: 'Delayed penalty', cat: 'general', dur: 3,
    how: 'The arm without the whistle goes straight up, palm facing the official and thumb tucked in. If needed, the other hand points once at the player being penalized.',
    keys: hold(up(null, { u: 176, f: 0, h: 'flat' })) });

  add({ id: 'delayed-violation', name: 'Delayed violation', cat: 'general', dur: 3,
    how: 'One arm out at shoulder height with the elbow bent 90°, so the forearm and hand point straight up, palm forward.',
    keys: hold(up(null, { u: 90, f: 90, h: 'palm' })) });

  const sweepKeys = (other) => {
    const k = [[0, up(other ? other : null)], [0.05, up(other)]];
    const fwd = { u: 84, f: -40, ul: 0.3, fl: 0.5, h: 'flat', hs: 1.3 };   // hand drawn in close at the chest
    const side = { u: 92, f: 0, h: 'flat' };
    for (let i = 0; i < 5; i++) {
      const t0 = 0.08 + i * 0.17;
      k.push([t0, up(other, fwd, { cap: String(i + 1) })]);
      k.push([t0 + 0.085, up(other, side, { cap: String(i + 1) })]);
    }
    k.push([0.94, up(other)]); k.push([1, up(other)]);
    return k;
  };
  add({ id: 'five-second-count', name: 'Five-second count', cat: 'general', dur: 6,
    how: 'One arm moves from the chest out to the side, once for each second, counting to five.',
    keys: sweepKeys(null) });

  add({ id: 'delayed-violation-five', name: 'Delayed violation with five-second count', cat: 'general', dur: 6,
    how: 'One arm gives the delayed violation signal (forearm upright) while the other arm moves from the chest to the side, once for each second.',
    keys: sweepKeys({ u: 90, f: 90, h: 'palm' }) });

  add({ id: 'goal', name: 'Goal', cat: 'general', dur: 3,
    how: 'Arm extended at shoulder height pointing at the net, thumb tucked in.',
    keys: hold(up(null, { u: 90, f: 0, h: 'flat' }, { prop: 'net' })).map(([t, p], i) => [t, { ...p, prop: 'net' }]) });

  add({ id: 'goaltender-ring', name: 'Goaltender ring', cat: 'general', dur: 3,
    how: 'Both arms raised overhead, each angled about 45° out to the side, in line with the body. Play restarts with the ring given to the defending goaltender instead of a free pass.',
    keys: hold(up({ u: 140, f: 0, h: 'flat' }, { u: 140, f: 0, h: 'flat' })) });

  const LT_APART = up({ ax: 104, ay: 124, h: 'fist' }, { ax: 136, ay: 124, h: 'fist' });
  const LT_TOGETHER = up({ ax: 114, ay: 124, h: 'fist' }, { ax: 126, ay: 124, h: 'fist' });
  add({ id: 'bottom-third', name: 'Hand on lower third of stick', cat: 'general', dur: 3,
    how: 'Both fists clenched in front of the chest, brought together at the thumbs and apart again.',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, LT_APART], [0.4, LT_TOGETHER], [0.56, LT_APART], [0.72, LT_TOGETHER], [0.84, LT_TOGETHER], [0.97, up()], [1, up()]] });

  // Timeout "T": flat hand across the top, the other hand upright under it, fingertips touching.
  const TEE = up({ ax: 108, ay: 118, ul: 0.8, fl: 0.55, bend: 'down', ha: -90, h: 'flat', hs: 1.3 },
    { ax: 120, ay: 153, ul: 0.85, fl: 0.55, bend: 'down', ha: 180, h: 'flat', hs: 1.3 });
  // Timeout is a horizontal T, matching Ringette Canada's demo clip: the right-hand side (viewer's right)
  // hand stands upright at upper-chest height; the other hand lies flat, fingertips into its palm.
  // The official then extends that arm out to the side.
  const SIDE_T = up({ ax: 108, ay: 128, ul: 0.8, fl: 0.55, bend: 'down', ha: -90, h: 'flat', hs: 1.3 },
    { ax: 130, ay: 142, ul: 0.85, fl: 0.55, bend: 'down', ha: 180, h: 'flat', hs: 1.3 });
  const TO_SIDE = up(null, { u: 90, f: 0, h: 'flat' });
  add({ id: 'timeout', name: 'Timeout', cat: 'general', dur: 4,
    how: 'Hands form a horizontal "T" in front of the chest: one hand upright, the other flat with its fingertips touching the middle of the upright palm. In Ringette Canada\'s demonstration the official then extends that arm straight out to the side.',
    front: 'LR',
    keys: [[0, up()], [0.05, up()], [0.22, SIDE_T], [0.52, SIDE_T], [0.64, TO_SIDE], [0.86, TO_SIDE], [0.98, up()], [1, up()]] });

  add({ id: 'two-blue', name: 'Two blue line pass', cat: 'general', dur: 3,
    how: 'Arm extended up and out from shoulder height at about 22.5°, index and middle fingers extended, while saying "two".',
    keys: hold(up(null, { u: 112, f: 0, h: 'two', hs: 1.1 })).map(([t, p]) => [t, t >= 0.3 && t < 0.97 ? { ...p, cap: 'TWO' } : p]) });

  const WSIDE = { u: 90, f: 0, h: 'flat' }, WOUT = { u: 88, f: 0, ul: 0.2, fl: 0.2, h: 'flat', hs: 1.3 },
    WIN = { u: -84, f: 0, ul: 0.2, fl: 0.2, h: 'flat', hs: 1.3 }, WX = { u: -80, f: 0, ul: 0.82, fl: 0.82, h: 'flat' };
  const wk = [[0, up()], [0.05, up()], [0.18, up(WSIDE, WSIDE)]];
  for (const t0 of [0.24, 0.52]) {
    wk.push([t0, up(WOUT, WOUT)], [t0 + 0.02, up(WIN, WIN)], [t0 + 0.09, up(WX, WX)],
      [t0 + 0.16, up(WIN, WIN)], [t0 + 0.18, up(WOUT, WOUT)], [t0 + 0.25, up(WSIDE, WSIDE)]);
  }
  wk.push([0.86, up(WSIDE, WSIDE)], [0.98, up()], [1, up()]);
  add({ id: 'wash-out', name: 'Wash out', cat: 'general', dur: 3.6,
    how: 'Both arms swing sideways in opposite directions across the front of the body at shoulder height, palms down.',
    front: 'LR', top: 'L',
    keys: wk });

  const circ = [];
  for (let i = 0; i <= 8; i++) circ.push([0.3 + i * 0.06, up(null, { u: 90, f: 90, h: 'point', w: Math.sin(i * Math.PI / 2) * 24 })]);
  add({ id: 'shot-clock-reset', name: 'Shot clock reset', cat: 'general', dur: 3.4,
    how: 'The arm nearest the shot clock operator makes a delayed-violation shape with the index finger up, and the wrist circles.',
    keys: [[0, up()], [0.06, up()], [0.24, up(null, { u: 90, f: 90, h: 'point' })], ...circ, [0.97, up()], [1, up()]] });

  add({ id: 'line-violation', name: 'Line violation', cat: 'general', dur: 3,
    how: 'Arm fully extended pointing down toward the ice at 45°, thumb tucked in.',
    keys: hold(up(null, { u: 45, f: 0, h: 'flat' })) });

  add({ id: 'too-many-skaters', name: 'Too many skaters', cat: 'general', dur: 3,
    how: 'Hand without the whistle raised at shoulder height, palm out, with fingers showing the number of skaters.',
    keys: hold(up(null, { u: 90, f: 90, h: 'spread', hs: 1.1 })) });

  add({ id: 'toe-kick', name: 'Toe kick', cat: 'general', dur: 3,
    how: 'The toe of one skate is raised and the hand without the whistle reaches toward it, thumb tucked in.',
    keys: hold(up(null, { ax: 170, ay: 226, ul: 1.15, fl: 1.15, h: 'flat' }, { body: { toe: 34, c: 0.35 } })) });

  add({ id: 'five-second-expiry', name: 'Five-second expiration', cat: 'general', dur: 3,
    how: 'Hand without the whistle held out in front at chest height, palm out, fingers and thumb spread. Then the whistle, then the direction of play.',
    dur: 4.4, keys: [[0, up()], [0.05, up()], [0.18, up(null, EXP)], [0.42, up(null, EXP)],
      [0.5, up(WHISTLE, null)], [0.6, up(WHISTLE, null)], [0.7, up(null, { u: 90, f: 0, h: 'flat' })],
      [0.88, up(null, { u: 90, f: 0, h: 'flat' })], [0.98, up()], [1, up()]] });

  add({ id: 'touch', name: 'Touch', cat: 'general', dur: 3,
    how: 'Both hands out in front of the forehead; the fingers of the non-whistle hand brush over the other hand while saying "touch".',
    front: 'LR',
    keys: [[0, up()], [0.05, up()], [0.14, up({ ax: 110, ay: 132, h: 'flat' }, { ax: 130, ay: 130, h: 'flat' })], [0.26, up({ ax: 112, ay: 58, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { ax: 128, ay: 54, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' })],
      [0.38, up({ ax: 112, ay: 58, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { ax: 113, ay: 52, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { cap: 'TOUCH' })],
      [0.5, up({ ax: 112, ay: 58, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { ax: 128, ay: 54, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { cap: 'TOUCH' })],
      [0.62, up({ ax: 112, ay: 58, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { ax: 113, ay: 52, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { cap: 'TOUCH' })],
      [0.8, up({ ax: 112, ay: 58, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' }, { ax: 128, ay: 54, ul: 0.82, fl: 0.82, bend: 'down', h: 'flat' })], [0.88, up({ ax: 110, ay: 132, h: 'flat' }, { ax: 130, ay: 130, h: 'flat' })], [0.98, up()], [1, up()]] });

  add({ id: 'direction-of-play', name: 'Direction of play', cat: 'general', dur: 3,
    how: 'Arm fully extended at shoulder height toward where the ring will go, fingers forward and thumb tucked in.',
    keys: hold(up(null, { u: 90, f: 0, h: 'flat' })).map(([t, p]) => [t, { ...p, prop: 'arrow' }]) });

  add({ id: 'hold', name: 'Hold', cat: 'general', dur: 3,
    how: 'Arm extended in front at shoulder height, palm out, fingers pointing up.',
    keys: hold(up(null, { u: 38, f: 120, ul: 0.55, fl: 0.75, h: 'palm', hs: 1.25 })).map(([t, p]) => [t, t >= 0.3 && t < 0.97 ? { ...p, cap: 'HOLD' } : p]) });

  // ---------------- PENALTY SIGNALS ----------------
  const P = (o) => add({ cat: 'penalty', ...o });

  const palmL = { ax: 116, ay: 118, h: 'palm', bend: 'down' };
  P({ id: 'boarding', name: 'Boarding', dur: 3,
    how: 'In front of the chest, a clenched fist strikes the open palm of the other hand.',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.24, up(palmL, { ax: 152, ay: 106, h: 'fist' })], [0.36, up(palmL, { ax: 124, ay: 118, h: 'fist' })],
      [0.48, up(palmL, { ax: 152, ay: 106, h: 'fist' })], [0.6, up(palmL, { ax: 124, ay: 118, h: 'fist' })],
      [0.8, up(palmL, { ax: 124, ay: 118, h: 'fist' })], [0.97, up()], [1, up()]] });

  P({ id: 'body-contact', name: 'Body contact', dur: 3,
    how: 'Clenched fist, arm extended straight out to the side at shoulder height.',
    keys: [[0, up()], [0.06, up()], [0.22, up(null, { ax: 132, ay: 126, h: 'fist' })], [0.36, up(null, { u: 90, f: 0, h: 'fist' })],
      [0.8, up(null, { u: 90, f: 0, h: 'fist' })], [0.97, up()], [1, up()]] });

  const ch = [];
  for (let i = 0; i <= 8; i++) {
    const a = i * Math.PI / 2.0;
    ch.push([0.24 + i * 0.07, up({ ax: 120 - 10 * Math.cos(a), ay: 120 - 10 * Math.sin(a), h: 'fist' }, { ax: 120 + 10 * Math.cos(a), ay: 120 + 10 * Math.sin(a), h: 'fist' })]);
  }
  P({ id: 'charging', name: 'Charging', dur: 3.4,
    how: 'Both clenched fists rotate around each other in front of the chest.',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], ...ch, [0.97, up()], [1, up()]] });

  const ccIn = up({ ax: 106, ay: 122, h: 'fist' }, { ax: 134, ay: 122, h: 'fist' });
  const ccOut = up({ ax: 86, ay: 116, h: 'fist', ul: 0.85, fl: 0.7, hs: 1.4 }, { ax: 154, ay: 116, h: 'fist', ul: 0.85, fl: 0.7, hs: 1.4 });
  P({ id: 'cross-checking', name: 'Cross checking', dur: 3,
    how: 'Both fists clenched at chest height, about shoulder-width apart, then both arms push out together (about a foot).',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, ccIn], [0.38, ccOut], [0.5, ccIn], [0.62, ccOut], [0.8, ccOut], [0.97, up()], [1, up()]] });

  P({ id: 'delay-of-game', name: 'Delay of game', dur: 3,
    how: 'Fist placed just below the opposite shoulder, with the arm forming about a 45° angle across the front of the body.',
    front: 'R',
    keys: hold(up(null, { ax: 100, ay: 116, h: 'fist', bend: 'down' })) });

  const ELB = { u: 145, f: -128, h: 'fist' };   // elbow raised high, forearm folded down
  P({ id: 'elbowing', name: 'Elbowing', dur: 3.2,
    how: 'The other hand taps one raised elbow once.',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, up(ELB, { ax: 94, ay: 110, h: 'flat' })], [0.4, up(ELB, { ax: 80, ay: 98, h: 'flat' })],
      [0.52, up(ELB, { ax: 94, ay: 110, h: 'flat' })], [0.8, up(ELB, { ax: 94, ay: 110, h: 'flat' })], [0.98, up()], [1, up()]] });

  const hs1 = up({ ax: 140, ay: 76, h: 'fist', bend: 'down' }, { ax: 140, ay: 62, h: 'fist', bend: 'down' });
  const hs2 = up({ ax: 142, ay: 72, h: 'fist', bend: 'down' }, { ax: 142, ay: 58, h: 'fist', bend: 'down' });
  P({ id: 'high-sticking', name: 'High sticking', dur: 3,
    how: 'Both fists clenched, one immediately above the other, at forehead height (as if holding a stick up high).',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.16, up({ ax: 140, ay: 140, h: 'fist', bend: 'down' }, { ax: 134, ay: 120, h: 'fist' })], [0.28, hs1], [0.42, hs2], [0.56, hs1], [0.8, hs1],
      [0.88, up({ ax: 140, ay: 140, h: 'fist', bend: 'down' }, { ax: 134, ay: 120, h: 'fist' })], [0.98, up()], [1, up()]] });

  P({ id: 'holding', name: 'Holding', dur: 3,
    how: 'One fist in front of the centre of the chest, gripped at the wrist by the other hand.',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, up({ ax: 104, ay: 128, h: 'palm' }, { ax: 118, ay: 122, h: 'fist' })],
      [0.4, up({ ax: 128, ay: 130, h: 'palm' }, { ax: 118, ay: 122, h: 'fist' })],
      [0.8, up({ ax: 128, ay: 130, h: 'palm' }, { ax: 118, ay: 122, h: 'fist' })], [0.97, up()], [1, up()]] });

  const hkOut = up({ ax: 150, ay: 158, h: 'fist' }, { ax: 172, ay: 156, h: 'fist' });
  const hkIn = up({ ax: 124, ay: 162, h: 'fist' }, { ax: 138, ay: 160, h: 'fist' });
  P({ id: 'hooking', name: 'Hooking', dur: 3,
    how: 'Both fists out to one side at belly-button height, then pulled in toward the belly button.',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, hkOut], [0.4, hkIn], [0.52, hkOut], [0.66, hkIn], [0.8, hkIn], [0.97, up()], [1, up()]] });

  P({ id: 'illegal-substitution', name: 'Illegal substitution', dur: 3,
    how: 'The palm of one hand pats the top of the helmet.',
    front: 'R',
    keys: [[0, up()], [0.05, up()], [0.16, up(null, { u: 150, f: 40, h: 'flat' })], [0.26, up(null, { ax: 124, ay: 48, h: 'flat' })], [0.36, up(null, { ax: 124, ay: 56, h: 'flat' })],
      [0.46, up(null, { ax: 124, ay: 46, h: 'flat' })], [0.56, up(null, { ax: 124, ay: 56, h: 'flat' })],
      [0.8, up(null, { ax: 124, ay: 56, h: 'flat' })], [0.88, up(null, { u: 150, f: 40, h: 'flat' })], [0.98, up()], [1, up()]] });

  P({ id: 'interference', name: 'Interference', dur: 3,
    how: 'Arms crossed over the chest, hands open with palms facing the sides, hands level with the shoulders.',
    front: 'LR',
    keys: hold(up({ ax: 144, ay: 120, h: 'palm' }, { ax: 96, ay: 122, h: 'palm' })) });

  const slA = { ax: 140, ay: 134, h: 'flat', bend: 'down' };
  P({ id: 'slashing', name: 'Slashing', dur: 3,
    how: 'One arm held across the chest; the other hand chops down onto that forearm.',
    front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.24, up(slA, { ax: 150, ay: 96, h: 'flat' })], [0.36, up(slA, { ax: 122, ay: 128, h: 'flat' })],
      [0.48, up(slA, { ax: 150, ay: 96, h: 'flat' })], [0.6, up(slA, { ax: 122, ay: 128, h: 'flat' })],
      [0.8, up(slA, { ax: 122, ay: 128, h: 'flat' })], [0.97, up()], [1, up()]] });

  const trDown = { body: { c: 0.7 } };
  const trUp = { ax: 158, ay: 182, h: 'flat' }, trHit = { ax: 152, ay: 232, ul: 1.15, fl: 1.15, h: 'flat', bend: 'out' };
  P({ id: 'tripping', name: 'Tripping', dur: 3.2,
    how: 'Knees slightly bent and leaning forward, the official strikes the leg just below the knee with the edge of the hand, on the same side.',
    keys: [[0, up()], [0.06, up()], [0.24, up(null, trUp, trDown)], [0.36, up(null, trHit, trDown)], [0.48, up(null, trUp, trDown)],
      [0.6, up(null, trHit, trDown)], [0.8, up(null, trHit, trDown)], [0.97, up()], [1, up()]] });

  P({ id: 'unsportsmanlike', name: 'Unsportsmanlike conduct', dur: 3,
    how: 'A fist placed in the small of the back.',
    keys: hold(up(null, { u: 30, f: -118, h: 'fist' })) });

  // Arms raised nearly straight, crossing at the wrists above the head (each fist past the other).
  const PSHOT = up({ u: 186, f: 37, ul: 1.4, fl: 1.8, h: 'fist', hs: 1.1 }, { u: 186, f: 37, ul: 1.4, fl: 1.8, h: 'fist', hs: 1.1 });
  P({ id: 'penalty-shot', name: 'Penalty shot', dur: 3,
    how: 'Both fists clenched with the wrists crossed above the head.',
    front: 'LR',
    top: 'L',
    keys: [[0, up()], [0.05, up()], [0.16, up({ u: 150, f: 10, h: 'fist' }, { u: 150, f: 10, h: 'fist' })],
      [0.3, PSHOT], [0.82, PSHOT], [0.9, up({ u: 150, f: 10, h: 'fist' }, { u: 150, f: 10, h: 'fist' })], [0.98, up()], [1, up()]] });

  const T = TEE;
  P({ id: 'major', name: 'Major penalty', dur: 4,
    how: 'Both hands form an upright "T" in front of the chest, followed by the signal for the infraction (or rough play) the major was given for.',
    front: 'LR', top: 'L',
    keys: [[0, up()], [0.05, up()], [0.2, T], [0.44, T], [0.58, up(null, FWD('fist', 1.7))],
      [0.84, up(null, FWD('fist', 1.7))], [0.97, up()], [1, up()]] });

  P({ id: 'rough-play', name: 'Rough play',
    how: 'Rough play is always a major, so the official first makes the major "T", then holds one clenched fist with the arm straight out in front at shoulder height.',
    front: 'LR', top: 'L', dur: 4,
    keys: [[0, up()], [0.05, up()], [0.18, T], [0.38, T], [0.5, up(null, FWD('fist', 1.7))],
      [0.8, up(null, FWD('fist', 1.7))], [0.97, up()], [1, up()]] });

  const HIPS = up({ ax: 97, ay: 172, h: 'flat' }, { ax: 143, ay: 172, h: 'flat' });
  P({ id: 'misconduct-match', name: 'Misconduct / match penalty', dur: 3,
    how: 'Both hands placed on the hips, then an open hand points at the penalized player.',
    front: 'LR',
    dur: 4, keys: [[0, up()], [0.05, up()], [0.2, HIPS], [0.5, HIPS], [0.62, up({ ax: 97, ay: 172, h: 'flat' }, { u: 80, f: 0, h: 'flat' })],
      [0.86, up({ ax: 97, ay: 172, h: 'flat' }, { u: 80, f: 0, h: 'flat' })], [0.98, up()], [1, up()]] });


  // What each signal means, in plain language.
  const MEANS = {
    'all-clear': 'Before a free pass, the official checks both sides to make sure both teams are set. Play can start.',
    'delayed-penalty': 'The team without the ring has committed a penalty. Play carries on until that team gets control of the ring, then the whistle goes and the penalty is given.',
    'delayed-violation': 'The team without the ring has broken a rule (for example, too many skaters in the zone or a crease violation). Play carries on; if that team gets the ring, play stops.',
    'five-second-count': 'After the whistle on a free pass or goaltender ring, the player has five seconds to pass the ring out of the circle or crease. The official counts the seconds with the arm.',
    'delayed-violation-five': 'The team without the ring broke a rule and the five-second count is also running, so the official shows both at once.',
    'goal': 'The ring fully crossed the goal line and the goal counts.',
    'goaltender-ring': 'After a stoppage in a team\'s defensive zone, the ring goes to their goaltender in the crease instead of a free pass.',
    'bottom-third': 'The ring carrier\'s hand slid down onto the bottom third of the stick while an opponent was close enough to check. That\'s a violation, and the ring goes to the other team.',
    'timeout': 'A team asked for a timeout during a stoppage and the official approved it. Each team gets one 30-second timeout per game.',
    'two-blue': 'The ring is about to be (or was) passed over two blue lines without being touched, which isn\'t allowed. The back official warns it\'s coming; the lead official signals when the ring crosses the second blue line.',
    'wash-out': 'The goal does not count. It\'s also used on a two-blue-line pass when the team that\'s allowed to play the ring misses it, so play carries on.',
    'shot-clock-reset': 'Tells the shot clock operator to reset the shot clock because it should have been reset and wasn\'t.',
    'line-violation': 'Play stopped because a player crossed a line they weren\'t allowed to: a blue line, the free play line, the crease, or a free pass circle.',
    'too-many-skaters': 'Play stopped because a team had too many skaters inside the restricted area at one end (only three skaters per team are allowed in there). The fingers show how many there were.',
    'toe-kick': 'A player kicked the ring forward with the toe of the skate. That\'s a violation, and the ring goes to the other team.',
    'five-second-expiry': 'The five seconds ran out before the ring was passed out of the circle or crease, so the ring goes to the other team.',
    'touch': 'The ring just grazed a player or stick. It tells the partner official, who might not have seen it, so a two-blue-line pass or blue line violation isn\'t called by mistake.',
    'direction-of-play': 'After a stoppage, it shows which team gets the ring: the arm points the way that team will attack.',
    'hold': 'Don\'t start play yet. Used before play begins if there\'s any reason to wait.',
    'boarding': 'A player used the body to force an opponent into the boards. 2-minute minor.',
    'body-contact': 'A player checked an opponent with the body in a forceful way. Ringette has no body checking. 2-minute minor.',
    'charging': 'The ring carrier skated straight into an opponent who was already in a legal defending position. 2-minute minor.',
    'cross-checking': 'A player checked an opponent with the stick held in both hands in front of the body. 2-minute minor.',
    'delay-of-game': 'A player held up the game, for example by holding or shooting the ring out of play, deliberately going into the crease, playing with a broken stick, or stalling. It\'s also the penalty for a "4 in" by the team without the ring when one of its skaters gets involved in the play while there are too many in the restricted area (see the "Too many in the zone" card). 2-minute minor.',
    'elbowing': 'A player hit an opponent with the elbow. 2-minute minor.',
    'high-sticking': 'A player raised the playing end of the stick above shoulder height near another player, even by accident. 2-minute minor.',
    'holding': 'A player held an opponent with the hand, or pinned the ring carrier\'s stick so they couldn\'t pass or shoot. 2-minute minor.',
    'hooking': 'A player used the stick to hook an opponent\'s body, arms, legs or stick to slow them down. 2-minute minor.',
    'illegal-substitution': 'A team had too many players on the ice, usually from a bad line change. 2-minute minor.',
    'interference': 'A player blocked an opponent who didn\'t have the ring, used the arm to fend off a checker, screened the goalie by moving with her, or checked a stick too early. 2-minute minor.',
    'slashing': 'A player hit an opponent\'s legs, hands, arms or body with the stick, or swung it at them forcefully. 2-minute minor.',
    'tripping': 'A player used the stick, foot, leg, arm or body to make an opponent trip or fall. 2-minute minor.',
    'unsportsmanlike': 'Disputing calls with an official, taunting, throwing a stick, or similar unsportsmanlike behaviour. 2 minutes, served in full: a goal doesn\'t end it.',
    'penalty-shot': 'Awarded when the defending team illegally stops a sure goal or a breakaway: for example a penalty on a breakaway, a defender in the crease stopping a goal, or knocking the net off. In the last two minutes and overtime, deliberately playing with too many defenders in the restricted area also gives one.',
    'major': '4 minutes, served in full. Given when a minor penalty is reckless or intentionally aggressive, for rough play, or for boarding, body contact, charging, cross-checking or elbowing with contact to the head or from behind. The official then shows the infraction.',
    'rough-play': 'Unnecessary aggression that isn\'t bad enough for a match penalty, like a one-handed push to an opponent\'s face or a "face wash" with the glove. Always a major (4 minutes, served in full).',
    'misconduct-match': 'Misconduct (abusive language or gestures, persistently disputing calls): the player is ejected and a teammate serves a 2-minute unsportsmanlike penalty. Match (intent to injure, fighting, kicking, abusing an official): ejected, suspended for the next game, and a teammate serves a 4-minute major.'
  };
  S.forEach((s) => { s.means = MEANS[s.id] || ''; });


  // Rule each signal relates to: Official Rules & Case Book 2025–2027 (printed page numbers).
  const RULES = {
    'all-clear': { ref: 'Annex B', title: 'Mechanics: hold and all clear', page: 188 },
    'delayed-penalty': { ref: '20.2.b', title: 'Stoppage of Play (delayed penalty)', page: 148 },
    'delayed-violation': { ref: '13.1.b', title: 'Stoppage of Play (delayed violation)', page: 106 },
    'five-second-count': { ref: '10.1', title: 'Free Pass', page: 71 },
    'delayed-violation-five': { ref: '13.1.b', title: 'Stoppage of Play (delayed violation)', page: 106 },
    'goal': { ref: '11.1', title: 'Goal Scoring Regulations', page: 89 },
    'goaltender-ring': { ref: '10.2', title: 'Goaltender Ring', page: 75 },
    'bottom-third': { ref: '12.2.c', title: 'Violations (hand on the playing end of the stick)', page: 99 },
    'timeout': { ref: '6.5', title: 'Timeouts', page: 25 },
    'two-blue': { ref: '8.5', title: 'Two Blue Line Pass', page: 37 },
    'wash-out': { ref: 'Annex B', title: 'Mechanics: wash out', page: 195 },
    'shot-clock-reset': { ref: '24.2', title: 'Shot Clock', page: 176 },
    'line-violation': { ref: '8.6', title: 'Free Play Line', page: 42 },
    'too-many-skaters': { ref: '8.6.a', title: 'Free Play Line (maximum skaters)', page: 42 },
    'toe-kick': { ref: '12.2.e', title: 'Violations (kicking with the toe or heel)', page: 99 },
    'five-second-expiry': { ref: '10.1', title: 'Free Pass', page: 71 },
    'touch': { ref: 'Annex B', title: 'Mechanics: touch', page: 190 },
    'direction-of-play': { ref: '10.4', title: 'Resuming Play', page: 78 },
    'hold': { ref: 'Annex B', title: 'Mechanics: hold and all clear', page: 188 },
    'boarding': { ref: '14.1', title: 'Boarding', page: 108 },
    'body-contact': { ref: '14.2', title: 'Body Contact', page: 108 },
    'charging': { ref: '14.3', title: 'Charging', page: 110 },
    'cross-checking': { ref: '14.4', title: 'Cross-Checking', page: 110 },
    'delay-of-game': { ref: '14.5', title: 'Delay of Game', page: 111 },
    'elbowing': { ref: '14.6', title: 'Elbowing', page: 119 },
    'high-sticking': { ref: '14.7', title: 'High Sticking', page: 119 },
    'holding': { ref: '14.8', title: 'Holding', page: 120 },
    'hooking': { ref: '14.9', title: 'Hooking', page: 120 },
    'illegal-substitution': { ref: '14.10', title: 'Illegal Substitution', page: 120 },
    'interference': { ref: '14.11', title: 'Interference', page: 125 },
    'slashing': { ref: '14.12', title: 'Slashing', page: 127 },
    'tripping': { ref: '14.13', title: 'Tripping', page: 128 },
    'unsportsmanlike': { ref: '15.1', title: 'Unsportsmanlike Conduct Penalties', page: 130 },
    'penalty-shot': { ref: '19', title: 'Penalty Shot Award', page: 139 },
    'major': { ref: '17.1', title: 'Major Penalties', page: 134 },
    'rough-play': { ref: '17.1.b', title: 'Major Penalties (rough play)', page: 134 },
    'misconduct-match': { ref: '16.1', title: 'Misconduct Penalties (match penalties: 18.1, p. 136)', page: 132 }
  };
  S.forEach((s) => { s.rule = RULES[s.id] || null; });

  window.SIGNALS = S;
})();
