# Ringette Signals

A phone app (PWA) showing every on-ice official's signal in ringette as a looping animation, with links to the rule in Ringette Canada's *Official Rules & Case Book 2025–2027*.

- **List:** all 37 signals (19 general, 18 penalty) with live thumbnails, tabs and search.
- **One at a time:** big animation, swipe or ‹ › to move, pause, slow motion, and **Hide names** to quiz yourself.
- Works offline once opened (service worker), installs to the home screen, follows light/dark mode.
- Deep links: `…/#tripping` opens that signal directly.

## Files

- `signals.js`: the 37 signals: name, how it's given, rule reference, and the key poses for the animation. Rule numbers and pages live here (`rule: { ref, title, page }`).
- `rig.js`: draws the referee (SVG) and animates her between key poses (arm angles or hand positions, solved with simple inverse kinematics).
- `app.js`: list, viewer, swipe, rule links. `PAGE_OFFSET` at the top turns printed page numbers into PDF page jumps once it's set.
- `sw.js`: offline cache. Bump `CACHE` when you change files.

## Notes

- How each signal is given comes from Ringette Canada's officials' signal guide (Annex C, p. 197). The illustrations are original and unofficial.
- Penalty rule numbers 14.1 to 14.13 are the minor penalty rules in Section 14; their exact pages still need checking against the PDF.
