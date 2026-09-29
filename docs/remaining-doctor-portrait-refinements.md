# Remaining doctor portrait refinements

## Scope

98 additional published doctor portraits edited, completing 107 of the 110 published doctors together with the original nine. The previously excluded Ning Jin (6c64e796-bbc8-4500-8d28-53e191d3d1aa), Li Lin (19cfa4fc-8608-4d98-b20e-beaebff32bc4) and Xun Wang (65658e20-07d8-40d3-b366-edc0cf016542) were not retouched. The other doctor named 李林 (qimei-013) is a separate record and is included.

## Final assets and mapping

- Final web assets: `public/images/doctors/directory-canon-v3/*.webp`.
- 98 independent 800 × 800 WebP files; quality 90; 4,877,654 bytes combined.
- IDs, original source paths and final filenames: `src/data/remaining-doctor-portrait-retouches.ts`.
- Original first-nine assets stay in `public/images/doctors/directory-canon-v2/`.
- Homepage Zhang Wenkai, Huang Xingguo and Huang Liewen now share their new directory portraits. The other three homepage portraits remain unchanged.
- Directory, managed detail pages and linked experts in uploaded case pages use the source-path guarded override. Any new photo path or removal set in admin takes precedence.
- No database or source-storage changes. Originals and full-resolution generated PNGs are retained. Local provenance records are in `tmp/canon-records/{slug}.json`; each includes the original path/hash and generated PNG path.

## Method and prompt set

Built-in image_gen edit mode, one call per original portrait, following the imagegen skill. Each original was viewed before editing and every generated output visually reviewed. Canon is a visual reference, not a claim these images were shot on a Canon camera. This is AI-assisted photographic retouching, not pixel-identical preservation. Faces already cropped in source images stay cropped rather than inventing unseen features.

The following prompt was used for each of the 98 doctors, substituting the source record's name for {name}:

```text
Use case: identity-preserve.
Asset type: real doctor's directory portrait, photograph retouch.
Image 1 is the original edit target: {name}.
Primary request: give this EXISTING photo a flattering Canon full-frame professional portrait photography look, not a new face. Canon EOS R5 / 85mm portrait-lens visual character: warm-neutral lifelike skin tones, luminous but controlled highlights, smooth tonal roll-off, soft directional studio key light with gentle fill, realistic depth, crisp eyes and hair without sharpening halos. Preserve visible pores, fine wrinkles, fabric texture and real age. Improve photographic clarity and light, mildly soften temporary blemishes and harsh under-eye shadows.
Backdrop: seamless neutral light gray #e7e7e7 edge-to-edge, soft natural fall-off but no white border or dark vignette.
Composition and identity constraints: retain the exact original crop, face placement, pose, expression, gaze, facial proportions, eyes, nose, mouth, jaw, hair, glasses, clothing and recognizable identity. Do not reframe or reconstruct areas of face cropped outside the source; those must stay cropped. Preserve 1:1 aspect ratio. Only retouch lighting, color, image quality, temporary blemishes and background.
Avoid: porcelain skin, beauty filters, orange skin, waxy smoothing, exaggerated HDR, synthetic CGI, face slimming, enlarged eyes, younger age, a new smile, altered features, new jewelry, props, badges, text or logos. This must still look like the same original doctor, professionally photographed.
```

Web exports use cwebp only for deterministic resizing/compression, not generation.

## Verification

- 98/98 deliverables and provenance records verified against the original job manifest.
- 98/98 WebP dimensions verified at 800 × 800; all generated PNG sources still exist.
- 144 targeted tests passed, including all 107 ID/source-path guards, admin replacement/removal behavior, protected portraits and homepage mapping consistency.
- Targeted ESLint, TypeScript and production build passed; 208 pages prerendered.
- Browser verification: all nine portraits on directory page 2 loaded from v3 assets; Wu Hao's detail page uses the same new portrait; the homepage's three edited portraits load from v3 while the exempt portraits retain their prior paths.
- No production-write RLS test suite was run.
