# AGENTS.md

## Rules

- User-facing contact details (WhatsApp number, email) come from `src/lib/consultation-handoff.ts`; never inline a second `wa.me/<number>` or `mailto:` literal, because the coordinator contact changes in one place.
- Floating contact controls share one bottom-right rail: the WhatsApp bubble is pinned (visible on mobile without a scroll gate) and the consultation shortcut stacks above it via `.float-rail-above-wa` in `src/index.css`; new floating UI must not reuse that corner or unpin the bubble on mobile.
- Every floating control is skipped on `/admin/*` screens and steps aside while the analytics consent prompt is open, so internal tooling and the privacy prompt keep the bottom edge to themselves.
