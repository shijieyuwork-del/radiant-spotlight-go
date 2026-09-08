# Homepage ambient background history

## Current: full-page flowing water — 2026-09-08

- The user requested gently flowing water across the entire homepage, continuously animated by default.
- `HeroAmbientBackground` is now mounted once at the homepage root. Its viewport-sized fixed surface stays visible from the hero through the directory sections, patient stories, consultation panel surround, and footer.
- Two procedurally defined SVG ripple layers use slow 16/21-second transform-only loops. There is no animated bitmap, video, canvas, per-frame JavaScript, or new download dependency.
- A fixed, localized pause/play control remains available throughout the page. User pause and reduced-motion preferences are honored; hidden browser tabs suspend motion. Scrolling beyond the hero does not stop the full-page surface.
- Page copy and card surfaces are unchanged. The homepage section backgrounds expose the same continuous water surface; cards retain their opaque backgrounds for legibility. Other routes are unaffected.
- The organza PNG and earlier WebP remain in the repository for recovery but are not imported or downloaded by the current homepage.

## Previous organza replacement (not currently displayed)

- Current source: `src/assets/hero-ribbons.png`, supplied by the parallel design task after the user requested thin translucent organza rather than ribbons.
- Original PNG retained unchanged: 1672 × 941 RGB, 1,713,476 bytes. The cloth looks translucent within a pale complete composition; the file itself has no alpha channel.
- `HeroAmbientBackground.tsx` imports the asset through Vite, producing a cache-busted image URL. It is displayed once across the hero, not as two rotated cutouts that would expose rectangular white edges.
- Existing layout/copy and pause, off-screen, page-visibility, reduced-motion and contrast controls are preserved. Gentle 20-second scale-only movement replaces the older opposing ribbons and specular glints. This is an animated background image, not a cloth simulation.
- The earlier WebP remains in the repository for recoverability but is no longer rendered by the hero. The uncompressed source increases the image payload; no lossy conversion was made in this integration.

## Previous satin asset (not currently displayed)

- Asset: `public/images/hero-luminous-silk.webp`
- Generated with the built-in image generation tool on 2026-09-08.
- Original: 1536 × 1024 RGBA PNG; published as a 128,000-byte WebP with its alpha channel retained.
- Web delivery conversion: `cwebp -q 84 -alpha_q 100`.
- Usage: two decorative CSS background layers in `HeroAmbientBackground.tsx`. CSS transform/opacity animation supplies drift, gentle skew and a luminance-masked light sweep. This is an animated illustration, not a physical cloth simulation.
- Pause, off-screen/document visibility and reduced-motion behavior apply to both the cloth and its moving highlights.

## Generation prompt

Use case: stylized-concept. Asset type: high-quality transparent cutout decorative silk asset for the animated background of a premium CeladonChina website. Create ONE large piece of real, glossy, luminous silk satin floating freely in mid-air, gently curling into an elegant wide S wave. It must be instantly recognizable as thin soft FABRIC: irregular flowing folds, fine woven fiber texture, supple folded edges, broad billowing surfaces and narrower turning folds. Pearlescent ivory highlights and celadon jade / pale seafoam green fabric with very restrained champagne iridescent reflections. Bright silky specular ribbons travel along the crests of the folds, with realistic contrasting green valleys; the surface glistens luxuriously, not matte. Premium photographic fabric studio lighting, highly photorealistic, exquisite soft material, tactile fine detail. Landscape composition around 3:2, isolated single cloth swathe completely inside canvas with generous transparent margin; diagonal from lower-left towards upper-right, gracefully sweeping, broad enough to show lustrous texture. GENUINELY TRANSPARENT BACKGROUND with alpha, no background gradient, no floor or cast shadow outside the cloth. No people, no hands, no typography, no branding, no objects, no confetti, no cartoon stars, no glitter particles, no torus, no plastic, no glass, no metallic foil. The sparkle should come from satin reflecting light, not added objects.
