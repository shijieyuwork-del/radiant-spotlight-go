# Homepage doctor marquee

The existing final six published doctors now run in one left-moving row instead
of a two-row grid. Profile selection, portraits, biography flips and destinations
are unchanged. Loading placeholders also occupy only one row.

Motion is a 72-second linear CSS transform. Two equal-width groups, each including
the trailing card gap, provide the seam; no per-frame JavaScript or data refetch
is involved. Hover pauses motion, an explicit control pauses/resumes at the same
position, and touch interaction pauses until resumed. Off-screen/hidden-page
motion is suspended. Keyboard focus uses the original six cards in a stationary
native scroller. Visual duplicates have no keyboard stops or duplicate accessible
content. Reduced motion disables the loop and exposes horizontal scrolling.

Verification:

- 22 targeted tests passed: marquee lifecycle/async data arrival, pause/resume,
  duplicate semantics, keyboard state, short data sets, existing portrait/flip
  behavior, and published doctor selection.
- TypeScript, targeted ESLint and the production build passed (208 prerendered
  pages). Existing build size/dynamic-import warnings remain unchanged.
- Desktop browser at 1280px: all 12 visual cards share one top coordinate; three
  cards span the 1248px viewport. The two groups each measure 2544px, so the
  half-track transform equals one exact group including its seam gap.
- Browser transform progressed leftwards to -2025.19px; explicit pause retained
  precisely that transform across observations. Keyboard focus reached the first
  profile in static mode and leaving restored the loop.
- Mobile browser at 390px: 358px rail, 307.875px card and equal 1991.25px groups;
  the document remains 390px wide. Original six doctor names match the requested
  screenshot.

Not verified on physical touch hardware, at browser 200% zoom, or in RTL. The
reduced-motion path was inspected in CSS, not through an OS preference change.
