# Ringette Signals

A phone app (PWA) showing every on-ice official's signal in ringette as a looping animation, with links to the rule in Ringette Canada's *Official Rules & Case Book 2025–2027*.

- **List:** all 37 signals (19 general, 18 penalty) with live thumbnails, tabs and search.
- **One at a time:** big animation, swipe or ‹ › to move, pause, slow motion, and **Hide names** to quiz yourself.
- Works offline once opened (service worker), installs to the home screen, follows light/dark mode.
- **Rules tab:** 35 cards (Basics, Situations, Ringette Ontario extras) with rink diagrams, each linked to its rule and page, and to the related signals.
- Deep links: `…/#tripping` opens a signal, `…/#rule-three-in-box` opens a rule card.

## Files

- `signals.js`: the 37 signals: name, how it's given, rule reference, and the key poses for the animation. Rule numbers and pages live here (`rule: { ref, title, page }`).
- `rules.js`: the Rules tab cards and rink diagrams. National rules cite Ringette Canada rule numbers and printed pages; Ontario cards cite Ringette Ontario's Competition Playing Rules (Aug 2025).
- `rig.js`: draws the referee (SVG) and animates her between key poses (arm angles or hand positions, solved with simple inverse kinematics).
- `app.js`: list, viewer, swipe, rule links. `PAGE_OFFSET` at the top turns printed page numbers into PDF page jumps once it's set.
- `sw.js`: offline cache. Bump `CACHE` when you change files.

## Notes

- How each signal is given comes from Ringette Canada's officials' signal guide (Annex C, p. 197). The illustrations are original and unofficial.
- All rule numbers and pages were checked against the 2025–2027 rulebook PDF (printed page + 5 = PDF page).
