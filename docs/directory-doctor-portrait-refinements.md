# Directory portrait refinements

This records the original nine-doctor batch. The subsequent 98-doctor expansion is documented in [remaining-doctor-portrait-refinements.md](remaining-doctor-portrait-refinements.md).

Scope: the nine doctors shown in the user's screenshot of the first directory page, not all 110 published records. Homepage portraits, including the three previously excluded doctors, are untouched.

## Saved assets

Final files are `public/images/doctors/directory-canon-v2/{slug}.webp` (800 × 800, WebP quality 90):

- `yuan-ju`
- `liu-yafei`
- `qian-feng`
- `yuan`
- `wang-peisheng`
- `wang-shuangping`
- `wang-mingming`
- `li-bing`
- `zhao`

Exact doctor IDs and original paths are mapped in `src/data/directory-doctor-portrait-retouches.ts`. The directory and corresponding public detail pages use these local images only while the original source path matches. Admin replacement/removal immediately wins; originals remain untouched in storage. No production database writes or new access permissions are involved.

## Editing method and final prompt

Built-in `image_gen`, one edit call per doctor after inspecting each original. No CLI/API generation fallback. Following the user's request for a Canon-camera look, the final version was edited directly from the originals, not repeatedly from earlier generated faces. Canon is an aesthetic reference, not a claim about the camera that took these photos. Outputs were visually reviewed and exported non-destructively using cwebp.

This is AI-assisted photographic retouching. Identity preservation was explicitly requested and visually checked, but it is not a promise of pixel-identical facial preservation.

Final prompt (replace `{name}` with each doctor's name):

> Use case: identity-preserve.
> Asset type: real doctor's directory portrait, photograph retouch.
> Image 1 is the original edit target: {name}.
> Primary request: give this EXISTING photo a flattering Canon full-frame professional portrait photography look, not a new face. Canon EOS R5 / 85mm portrait-lens visual character: warm-neutral lifelike skin tones, luminous but controlled highlights, smooth tonal roll-off, soft directional studio key light with gentle fill, realistic depth, crisp eyes and hair without sharpening halos. Preserve visible pores, fine wrinkles, fabric texture and real age. Improve photographic clarity and light, mildly soften temporary blemishes and harsh under-eye shadows.
> Backdrop: seamless neutral light gray #e7e7e7 edge-to-edge, soft natural fall-off but no white border or dark vignette.
> Composition and identity constraints: retain the exact original crop, face placement, pose, expression, gaze, facial proportions, eyes, nose, mouth, jaw, hair, glasses, clothing and recognizable identity. Do not reframe or reconstruct areas of face cropped outside the source; those must stay cropped. Preserve 1:1 aspect ratio. Only retouch lighting, color, image quality, temporary blemishes and background.
> Avoid: porcelain skin, beauty filters, orange skin, waxy smoothing, exaggerated HDR, synthetic CGI, face slimming, enlarged eyes, younger age, a new smile, altered features, new jewelry, props, badges, text or logos. This must still look like the same original doctor, professionally photographed.

Several source portraits were already cropped through the face. Their original framing was retained rather than generating unseen facial features. Existing directory offsets remain in place; circular frames use light gray behind the image.

## Verification

- 43 targeted portrait, homepage card, marquee and published-doctor tests passed.
- Targeted lint, application TypeScript check and production build passed (208 prerendered pages; existing bundle warnings).
- Browser: all nine directory portraits loaded with the expected versioned paths; checked circular presentation and the matching detail-page image.
- Web-delivery assets total approximately 396KB. Original storage photos and the homepage's six portrait files are unchanged.

## Source-to-output records

- `yuan-ju`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-21bb890c-fb38-4c58-a81b-5ddebed2c9dd.png`
- `liu-yafei`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-d28c1986-b340-4d1d-809f-404ce4aa2947.png`
- `qian-feng`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-f0c914e8-0a2c-4a7b-bf66-0963c37f6a7f.png`
- `yuan`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-b1bad4db-b471-41b9-b2fd-113746106a15.png`
- `wang-peisheng`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-05a94f82-080c-49a6-a7e4-c1fdf35055ad.png`
- `wang-shuangping`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-ac2f45d8-25f0-44da-9786-f98fc3c01f3b.png`
- `wang-mingming`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-5efaae11-1011-4d3c-adcc-89b94d34d4b7.png`
- `li-bing`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-2a133425-bef0-4710-aa1e-8800537c8aab.png`
- `zhao`: `/Users/lihui/.codex/generated_images/01a07b08-f8c9-7640-a3cb-910213cbcd89/exec-49a8a3fd-19f3-494b-bc16-186eda6f78f4.png`
