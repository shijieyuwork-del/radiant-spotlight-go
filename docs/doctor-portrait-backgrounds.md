# Homepage doctor portrait backgrounds

2026-09-29 — Six background-only retouches requested for the homepage doctor marquee.

## Assets

Saved directory: `public/images/doctors/light-gray-v1/`

- `zhang-wenkai.webp`
- `huang-xingguo.webp`
- `huang-liewen.webp`
- `ning-jin.webp`
- `li-lin.webp`
- `xun-wang.webp`

Source doctor IDs and original storage paths are recorded in `src/data/doctor-portrait-retouches.ts`.
Original storage objects remain untouched. The retouch applies only while the doctor's source path matches, so a later admin upload or removal takes precedence. These edits affect the homepage cards, not the admin's original files.

## Method and prompt set

Mode: built-in `image_gen` editing, one call per original portrait; no CLI/API image-generation fallback. Each original was inspected first. Outputs were inspected and exported to 800px-wide WebP at quality 90 for web delivery (six images total about 200KB).

Shared final prompt, replacing `{name}` with each of the six names above:

> Use case: identity-preserve. Edit target: the attached original portrait of {name}. Background-only retouch for a medical directory portrait. Replace the entire background with uniform solid neutral light gray #eeeeee, extending gray edge-to-edge with no white border, frame, panels or vignette. Keep the real person's exact face, expression, eyes, nose, skin texture, hair, facial hair, glasses if present, clothing, original pose, hands if visible, and lighting unchanged. Do not beautify, reshape, reinterpret or regenerate the person. Preserve the original image framing, aspect ratio and subject scale. No added text or objects. This must look like the same original photograph with only the background color replaced.

Zhang Wenkai's prompt explicitly identified the blue background, square framing and goatee; otherwise the same constraints were used. Generative edits are not a claim of pixel-identical preservation.

The card frame uses a matching neutral gray (`#e7e7e7`) across its full width. `object-contain` preserves the complete portrait without stretching or cutting off the face, while eliminating the previous white gutters. The marquee and flip behavior are unchanged.

## Verification

- Desktop (1280px) and mobile (390px): visually checked the new gray photo frame and uncropped portrait fit.
- 29 targeted doctor card, marquee and published-data tests passed; targeted ESLint, TypeScript and production build passed.
- Original photos remain in storage; replacement/removal precedence is regression-tested.
- 200% zoom and RTL: not verified for this background-only change.

## Follow-up: restrained portrait refinement

The user subsequently requested slightly more handsome, authoritative-looking portraits, then explicitly excluded **Ning Jin, Li Lin and Xun Wang**. Those three keep their existing `light-gray-v1` images, byte-for-byte unchanged.

Only these three new assets are used on the homepage:

- `public/images/doctors/refined-v2/zhang-wenkai.webp`
- `public/images/doctors/refined-v2/huang-xingguo.webp`
- `public/images/doctors/refined-v2/huang-liewen.webp`

Mode: built-in `image_gen`, separate edit calls using each existing `light-gray-v1` portrait as its edit target. Existing files are preserved for rollback. New outputs were visually reviewed and converted to 800px-wide WebP at quality 90.

Final shared prompt, with `{name}` replaced by Dr. Zhang Wenkai, Dr. Huang Xingguo or Dr. Huang Liewen:

> Use case: identity-preserve. Edit target: attached real portrait of {name}. Asset: professional doctor website portrait. Apply restrained, natural executive-portrait retouching so this same person looks slightly more handsome, well-rested, composed and authoritative. Improve flattering soft facial lighting and balanced contrast; subtly tidy flyaway hair and brow edges; reduce temporary blemishes and under-eye darkness only a little; bring clarity and gentle catchlights to the eyes without enlarging or changing them; define existing facial contours only with subtle dodge and burn. Preserve the person's recognizable identity, age, natural skin texture, facial proportions, eye shape, nose shape, mouth shape, hairstyle, facial hair and glasses if present. Keep the existing expression, pose, clothing, body, framing and aspect ratio unchanged. Keep the entire edge-to-edge neutral light gray background exactly as in the input, no white border. Do not add credentials, insignia, text, props or objects. No face replacement, model-like makeover, artificial skin smoothing, face slimming, exaggerated jawline, changed anatomy or younger appearance. The result should look like tasteful professional photo retouching of the same doctor, not a new person.

The existing source-path guard, full-width gray frame, and marquee/flip behavior remain unchanged. Generative retouching is not a guarantee of pixel-identical facial features.

Verification: all 30 targeted doctor tests passed, including the three exclusions; targeted lint, TypeScript and production build passed. The rendered homepage was checked for all six image paths and the three new portraits were visually checked in their cards.
