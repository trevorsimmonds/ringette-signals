/* All 37 on-ice officials' signals (Ringette Canada, 2025–2027).
   "how" is paraphrased from Ringette Canada's officials' signal guide.
   rule: the rule the signal relates to; annex: Annex C (On-Ice Officials' Signals) is p. 197. */
(function () {
  const REST = { u: 12, f: -6, h: 'fist' };
  const up = (L, R, extra = {}) => ({ L: L || REST, R: R || REST, ...extra });
  // Standard "raise, hold, lower" timeline.
  const hold = (pose, opts = {}) => [
    [0, up()], [0.06, up()], [0.3, pose], [0.78, pose], [0.97, up()], [1, up()]
  ];

  const S = [];
  const add = (o) => S.push(o);

  // ---------------- GENERAL SIGNALS ----------------
  add({ id: 'all-clear', name: 'All clear', cat: 'general', dur: 3,
    how: 'Both arms held straight out to the sides at shoulder height, palms facing down.',
    rule: null,
    keys: hold(up({ u: 90, f: 0, h: 'flat' }, { u: 90, f: 0, h: 'flat' })) });

  add({ id: 'delayed-penalty', name: 'Delayed penalty', cat: 'general', dur: 3,
    how: 'The arm without the whistle goes straight up, palm facing the official and thumb tucked in. If needed, the other hand points once at the player being penalized.',
    rule: null,
    keys: [[0, up()], [0.06, up()], [0.28, up(null, { u: 176, f: 0, h: 'flat' })],
      [0.42, up({ u: 62, f: 8, h: 'point' }, { u: 176, f: 0, h: 'flat' })], [0.55, up(null, { u: 176, f: 0, h: 'flat' })],
      [0.8, up(null, { u: 176, f: 0, h: 'flat' })], [0.97, up()], [1, up()]] });

  add({ id: 'delayed-violation', name: 'Delayed violation', cat: 'general', dur: 3,
    how: 'One arm out at shoulder height with the elbow bent 90°, so the forearm and hand point straight up, palm forward.',
    rule: null,
    keys: hold(up(null, { u: 90, f: 90, h: 'palm' })) });

  const sweepKeys = (other) => {
    const k = [[0, up(other ? other : null)], [0.05, up(other)]];
    const fwd = { u: 58, f: 6, ul: 0.45, fl: 0.5, h: 'flat', hs: 1.15 };
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
    how: 'One arm at shoulder height sweeps out to the side and back, palm down: one sweep for each second.',
    rule: { ref: '8.4', title: 'Blue Line (five-second rule)', page: 34 },
    keys: sweepKeys(null) });

  add({ id: 'delayed-violation-five', name: 'Delayed violation with five-second count', cat: 'general', dur: 6,
    how: 'One arm gives the delayed violation signal while the other arm gives the five-second count.',
    rule: { ref: '8.4', title: 'Blue Line (five-second rule)', page: 34 },
    keys: sweepKeys({ u: 90, f: 90, h: 'palm' }) });

  add({ id: 'goal', name: 'Goal', cat: 'general', dur: 3,
    how: 'Arm extended at shoulder height pointing at the net, thumb tucked in.',
    rule: null,
    keys: hold(up(null, { u: 90, f: 0, h: 'flat' }, { prop: 'net' })).map(([t, p], i) => [t, { ...p, prop: 'net' }]) });

  add({ id: 'goaltender-ring', name: 'Goaltender ring', cat: 'general', dur: 3,
    how: 'Both arms raised overhead, each angled about 45° out to the side, in line with the body. Play restarts with the ring given to the defending goaltender instead of a free pass.',
    rule: { ref: '1.9', title: 'Goaltender Ring', page: 3 },
    keys: hold(up({ u: 140, f: 0, h: 'flat' }, { u: 140, f: 0, h: 'flat' })) });

  add({ id: 'bottom-third', name: 'Hand on lower third of stick', cat: 'general', dur: 3,
    how: 'Both fists clenched at chest height, brought together thumb to thumb in front of the chest.',
    rule: { ref: '1.14', title: 'Playing End of the Stick', page: 3 }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.28, up({ ax: 106, ay: 134, h: 'fist' }, { ax: 134, ay: 134, h: 'fist' })],
      [0.42, up({ ax: 114, ay: 134, h: 'fist' }, { ax: 126, ay: 134, h: 'fist' })],
      [0.8, up({ ax: 114, ay: 134, h: 'fist' }, { ax: 126, ay: 134, h: 'fist' })], [0.97, up()], [1, up()]] });

  add({ id: 'timeout', name: 'Timeout', cat: 'general', dur: 3,
    how: 'Hands form a horizontal "T" in front of the chest.',
    rule: { ref: '6.5', title: 'Timeouts', page: 25 }, front: 'LR',
    top: 'L', keys: hold(up({ u: -94, f: 4, h: 'flat' }, { u: -15, f: -165, fl: 0.85, h: 'flat' })) });

  add({ id: 'two-blue', name: 'Two blue line pass', cat: 'general', dur: 3,
    how: 'Arm extended up and out from shoulder height at about 22.5°, index and middle fingers extended, while saying "two".',
    rule: { ref: '8.5', title: 'Two Blue Line Pass', page: 37 },
    keys: hold(up(null, { u: 112, f: 0, h: 'two', hs: 1.1 })).map(([t, p]) => [t, t >= 0.3 && t < 0.97 ? { ...p, cap: 'TWO' } : p]) });

  add({ id: 'wash-out', name: 'Wash out', cat: 'general', dur: 3.2,
    how: 'Both arms swing sideways in opposite directions across the front of the body at shoulder height, palms down.',
    rule: null, front: 'LR',
    keys: [[0, up()], [0.06, up()],
      [0.22, up({ ax: 136, ay: 118, h: 'flat' }, { ax: 104, ay: 120, h: 'flat' })], [0.4, up({ u: 92, f: 0, h: 'flat' }, { u: 92, f: 0, h: 'flat' })],
      [0.56, up({ ax: 136, ay: 118, h: 'flat' }, { ax: 104, ay: 120, h: 'flat' })], [0.74, up({ u: 92, f: 0, h: 'flat' }, { u: 92, f: 0, h: 'flat' })],
      [0.84, up({ u: 92, f: 0, h: 'flat' }, { u: 92, f: 0, h: 'flat' })], [0.98, up()], [1, up()]] });

  const circ = [];
  for (let i = 0; i <= 8; i++) circ.push([0.3 + i * 0.06, up(null, { u: 90, f: 90, h: 'point', w: Math.sin(i * Math.PI / 2) * 24 })]);
  add({ id: 'shot-clock-reset', name: 'Shot clock reset', cat: 'general', dur: 3.4,
    how: 'The arm nearest the shot clock operator makes a delayed-violation shape with the index finger up, and the wrist circles.',
    rule: null,
    keys: [[0, up()], [0.06, up()], [0.24, up(null, { u: 90, f: 90, h: 'point' })], ...circ, [0.97, up()], [1, up()]] });

  add({ id: 'line-violation', name: 'Line violation', cat: 'general', dur: 3,
    how: 'Arm fully extended pointing down toward the ice at 45°, thumb tucked in.',
    rule: { ref: '8.6', title: 'Free Play Line', page: 42 },
    keys: hold(up(null, { u: 45, f: 0, h: 'flat' })) });

  add({ id: 'too-many-skaters', name: 'Too many skaters', cat: 'general', dur: 3,
    how: 'Hand without the whistle raised at shoulder height, palm out, with fingers showing the number of skaters.',
    rule: { ref: '8.6', title: 'Free Play Line (restricted area)', page: 42 },
    keys: hold(up(null, { u: 90, f: 90, h: 'spread', hs: 1.1 })) });

  add({ id: 'toe-kick', name: 'Toe kick', cat: 'general', dur: 3,
    how: 'The toe of one skate is raised and the hand without the whistle reaches toward it, thumb tucked in.',
    rule: { ref: '1.11', title: 'Kicking the Ring', page: 3 },
    keys: hold(up(null, { ax: 166, ay: 214, ul: 1.1, fl: 1.1, h: 'flat' }, { body: { toe: 26, c: 0.25 } })) });

  add({ id: 'five-second-expiry', name: 'Five-second expiration', cat: 'general', dur: 3,
    how: 'Hand without the whistle held out at shoulder height, palm out, fingers and thumb spread.',
    rule: { ref: '8.4', title: 'Blue Line (five-second rule)', page: 34 },
    keys: hold(up(null, { u: 88, f: 70, h: 'spread', hs: 1.1 })) });

  add({ id: 'touch', name: 'Touch', cat: 'general', dur: 3,
    how: 'Both hands out in front of the forehead; the fingers of the non-whistle hand brush over the other hand while saying "touch".',
    rule: null, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, up({ ax: 112, ay: 74, h: 'flat' }, { ax: 130, ay: 70, h: 'flat' })],
      [0.38, up({ ax: 112, ay: 74, h: 'flat' }, { ax: 112, ay: 68, h: 'flat' }, { cap: 'TOUCH' })],
      [0.5, up({ ax: 112, ay: 74, h: 'flat' }, { ax: 130, ay: 70, h: 'flat' }, { cap: 'TOUCH' })],
      [0.62, up({ ax: 112, ay: 74, h: 'flat' }, { ax: 112, ay: 68, h: 'flat' }, { cap: 'TOUCH' })],
      [0.8, up({ ax: 112, ay: 74, h: 'flat' }, { ax: 130, ay: 70, h: 'flat' })], [0.97, up()], [1, up()]] });

  add({ id: 'direction-of-play', name: 'Direction of play', cat: 'general', dur: 3,
    how: 'Arm fully extended at shoulder height toward where the ring will go, fingers forward and thumb tucked in.',
    rule: null,
    keys: hold(up(null, { u: 90, f: 0, h: 'flat' })).map(([t, p]) => [t, { ...p, prop: 'arrow' }]) });

  add({ id: 'hold', name: 'Hold', cat: 'general', dur: 3,
    how: 'Arm extended in front at shoulder height, palm out, fingers pointing up.',
    rule: null,
    keys: hold(up(null, { u: 38, f: 120, ul: 0.55, fl: 0.75, h: 'palm', hs: 1.25 })).map(([t, p]) => [t, t >= 0.3 && t < 0.97 ? { ...p, cap: 'HOLD' } : p]) });

  // ---------------- PENALTY SIGNALS ----------------
  const P = (o) => add({ cat: 'penalty', ...o });

  const palmL = { ax: 116, ay: 134, h: 'palm', bend: 'down' };
  P({ id: 'boarding', name: 'Boarding', dur: 3,
    how: 'In front of the chest, a clenched fist strikes the open palm of the other hand.',
    rule: { ref: '14.1', title: 'Boarding', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.24, up(palmL, { ax: 146, ay: 112, h: 'fist' })], [0.36, up(palmL, { ax: 124, ay: 132, h: 'fist' })],
      [0.48, up(palmL, { ax: 146, ay: 112, h: 'fist' })], [0.6, up(palmL, { ax: 124, ay: 132, h: 'fist' })],
      [0.8, up(palmL, { ax: 124, ay: 132, h: 'fist' })], [0.97, up()], [1, up()]] });

  P({ id: 'body-contact', name: 'Body contact', dur: 3,
    how: 'Clenched fist, arm extended straight out to the side at shoulder height.',
    rule: { ref: '14.2', title: 'Body Contact', page: 108, approx: true },
    keys: [[0, up()], [0.06, up()], [0.24, up(null, { u: 90, f: 150, h: 'fist' })], [0.4, up(null, { u: 90, f: 0, h: 'fist' })],
      [0.8, up(null, { u: 90, f: 0, h: 'fist' })], [0.97, up()], [1, up()]] });

  const ch = [];
  for (let i = 0; i <= 8; i++) {
    const a = i * Math.PI / 2.0;
    ch.push([0.24 + i * 0.07, up({ ax: 120 - 10 * Math.cos(a), ay: 132 - 10 * Math.sin(a), h: 'fist' }, { ax: 120 + 10 * Math.cos(a), ay: 132 + 10 * Math.sin(a), h: 'fist' })]);
  }
  P({ id: 'charging', name: 'Charging', dur: 3.4,
    how: 'Both clenched fists rotate around each other in front of the chest.',
    rule: { ref: '14.3', title: 'Charging', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], ...ch, [0.97, up()], [1, up()]] });

  const ccIn = up({ ax: 104, ay: 136, h: 'fist' }, { ax: 136, ay: 136, h: 'fist' });
  const ccOut = up({ ax: 98, ay: 128, h: 'fist', ul: 0.8, fl: 0.7, hs: 1.4 }, { ax: 142, ay: 128, h: 'fist', ul: 0.8, fl: 0.7, hs: 1.4 });
  P({ id: 'cross-checking', name: 'Cross checking', dur: 3,
    how: 'Both fists clenched at chest height, about shoulder-width apart, then both arms push out together (about a foot).',
    rule: { ref: '14.4', title: 'Cross Checking', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, ccIn], [0.38, ccOut], [0.5, ccIn], [0.62, ccOut], [0.8, ccOut], [0.97, up()], [1, up()]] });

  P({ id: 'delay-of-game', name: 'Delay of game', dur: 3,
    how: 'Fist placed just below the opposite shoulder, with the arm forming about a 45° angle across the front of the body.',
    rule: { ref: '14.5', title: 'Delay of Game', page: 108, approx: true }, front: 'R',
    keys: hold(up(null, { ax: 100, ay: 124, h: 'fist', bend: 'down' })) });

  const elb = { ax: 120, ay: 128, h: 'fist', bend: 'up' };
  P({ id: 'elbowing', name: 'Elbowing', dur: 3,
    how: 'One elbow raised to chest height with the opposite hand under it; the two are tapped together.',
    rule: { ref: '14.6', title: 'Elbowing', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, up({ ax: 160, ay: 150, h: 'flat', bend: 'down' }, { u: 86, f: -142, h: 'fist' })],
      [0.38, up({ ax: 168, ay: 136, h: 'flat', bend: 'down' }, { u: 86, f: -142, h: 'fist' })],
      [0.5, up({ ax: 160, ay: 150, h: 'flat', bend: 'down' }, { u: 86, f: -142, h: 'fist' })],
      [0.62, up({ ax: 168, ay: 136, h: 'flat', bend: 'down' }, { u: 86, f: -142, h: 'fist' })],
      [0.8, up({ ax: 168, ay: 136, h: 'flat', bend: 'down' }, { u: 86, f: -142, h: 'fist' })], [0.97, up()], [1, up()]] });

  const hs1 = up({ ax: 146, ay: 104, h: 'fist', bend: 'down' }, { ax: 130, ay: 58, h: 'fist' });
  const hs2 = up({ ax: 146, ay: 98, h: 'fist', bend: 'down' }, { ax: 130, ay: 52, h: 'fist' });
  P({ id: 'high-sticking', name: 'High sticking', dur: 3,
    how: 'Both fists raised as if holding a stick high: one at forehead height, the other beside the first elbow.',
    rule: { ref: '14.7', title: 'High Sticking', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.28, hs1], [0.42, hs2], [0.56, hs1], [0.8, hs1], [0.97, up()], [1, up()]] });

  P({ id: 'holding', name: 'Holding', dur: 3,
    how: 'One fist in front of the centre of the chest, gripped at the wrist by the other hand.',
    rule: { ref: '14.8', title: 'Holding', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, up({ ax: 104, ay: 140, h: 'palm' }, { ax: 118, ay: 134, h: 'fist' })],
      [0.4, up({ ax: 128, ay: 142, h: 'palm' }, { ax: 118, ay: 134, h: 'fist' })],
      [0.8, up({ ax: 128, ay: 142, h: 'palm' }, { ax: 118, ay: 134, h: 'fist' })], [0.97, up()], [1, up()]] });

  const hkOut = up({ ax: 150, ay: 158, h: 'fist' }, { ax: 172, ay: 156, h: 'fist' });
  const hkIn = up({ ax: 124, ay: 162, h: 'fist' }, { ax: 138, ay: 160, h: 'fist' });
  P({ id: 'hooking', name: 'Hooking', dur: 3,
    how: 'Both fists out to one side at belly-button height, then pulled in toward the belly button.',
    rule: { ref: '14.9', title: 'Hooking', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.26, hkOut], [0.4, hkIn], [0.52, hkOut], [0.66, hkIn], [0.8, hkIn], [0.97, up()], [1, up()]] });

  P({ id: 'illegal-substitution', name: 'Illegal substitution', dur: 3,
    how: 'The palm of one hand pats the top of the helmet.',
    rule: { ref: '14.10', title: 'Illegal Substitution', page: 108, approx: true }, front: 'R',
    keys: [[0, up()], [0.06, up()], [0.26, up(null, { ax: 124, ay: 48, h: 'flat' })], [0.36, up(null, { ax: 124, ay: 56, h: 'flat' })],
      [0.46, up(null, { ax: 124, ay: 46, h: 'flat' })], [0.56, up(null, { ax: 124, ay: 56, h: 'flat' })],
      [0.8, up(null, { ax: 124, ay: 56, h: 'flat' })], [0.97, up()], [1, up()]] });

  P({ id: 'interference', name: 'Interference', dur: 3,
    how: 'Arms crossed over the chest, hands open with palms facing the sides, hands level with the shoulders.',
    rule: { ref: '14.11', title: 'Interference', page: 108, approx: true }, front: 'LR',
    keys: hold(up({ ax: 144, ay: 120, h: 'palm' }, { ax: 96, ay: 122, h: 'palm' })) });

  const slA = { ax: 140, ay: 134, h: 'flat', bend: 'down' };
  P({ id: 'slashing', name: 'Slashing', dur: 3,
    how: 'One arm held across the chest; the other hand chops down onto that forearm.',
    rule: { ref: '14.12', title: 'Slashing', page: 108, approx: true }, front: 'LR',
    keys: [[0, up()], [0.06, up()], [0.24, up(slA, { ax: 128, ay: 98, h: 'flat' })], [0.36, up(slA, { ax: 122, ay: 128, h: 'flat' })],
      [0.48, up(slA, { ax: 128, ay: 98, h: 'flat' })], [0.6, up(slA, { ax: 122, ay: 128, h: 'flat' })],
      [0.8, up(slA, { ax: 122, ay: 128, h: 'flat' })], [0.97, up()], [1, up()]] });

  const trDown = { body: { c: 0.7 } };
  const trUp = { u: 75, f: 50, h: 'flat' }, trHit = { ax: 152, ay: 232, ul: 1.15, fl: 1.15, h: 'flat', bend: 'out' };
  P({ id: 'tripping', name: 'Tripping', dur: 3.2,
    how: 'Knees slightly bent and leaning forward, the official strikes the leg just below the knee with the edge of the hand, on the same side.',
    rule: { ref: '14.13', title: 'Tripping', page: 108, approx: true },
    keys: [[0, up()], [0.06, up()], [0.24, up(null, trUp, trDown)], [0.36, up(null, trHit, trDown)], [0.48, up(null, trUp, trDown)],
      [0.6, up(null, trHit, trDown)], [0.8, up(null, trHit, trDown)], [0.97, up()], [1, up()]] });

  P({ id: 'unsportsmanlike', name: 'Unsportsmanlike conduct', dur: 3,
    how: 'A fist placed in the small of the back.',
    rule: null,
    keys: hold(up(null, { u: 30, f: -118, h: 'fist' })) });

  P({ id: 'penalty-shot', name: 'Penalty shot', dur: 3,
    how: 'Both fists clenched with the wrists crossed above the head.',
    rule: null, front: 'LR',
    keys: hold(up({ ax: 128, ay: 34, h: 'fist' }, { ax: 112, ay: 34, h: 'fist' })) });

  const T = up({ ax: 132, ay: 112, h: 'flat', bend: 'down' }, { ax: 120, ay: 120, h: 'flat', bend: 'down' });
  P({ id: 'major', name: 'Major penalty', dur: 4,
    how: 'Both hands form a "T" in front of the chest, followed by the signal for the infraction (or rough play) the major was given for.',
    rule: null, front: 'LR',
    keys: [[0, up()], [0.05, up()], [0.2, T], [0.44, T], [0.58, up(null, { u: 24, f: 8, ul: 0.42, fl: 0.42, h: 'fist', hs: 1.55 })],
      [0.84, up(null, { u: 24, f: 8, ul: 0.42, fl: 0.42, h: 'fist', hs: 1.55 })], [0.97, up()], [1, up()]] });

  P({ id: 'rough-play', name: 'Rough play', dur: 3,
    how: 'One fist clenched, with the arm extended straight out in front of the body at shoulder height.',
    rule: null, front: 'R',
    keys: [[0, up()], [0.06, up()], [0.24, up(null, { ax: 140, ay: 136, h: 'fist' })], [0.38, up(null, { u: 24, f: 8, ul: 0.42, fl: 0.42, h: 'fist', hs: 1.55 })],
      [0.8, up(null, { u: 24, f: 8, ul: 0.42, fl: 0.42, h: 'fist', hs: 1.55 })], [0.97, up()], [1, up()]] });

  P({ id: 'misconduct-match', name: 'Misconduct / match penalty', dur: 3,
    how: 'Both hands placed on the hips.',
    rule: null, front: 'LR',
    keys: hold(up({ ax: 97, ay: 172, h: 'flat' }, { ax: 143, ay: 172, h: 'flat' })) });

  window.SIGNALS = S;
})();
