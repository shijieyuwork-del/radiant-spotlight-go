# RODEO branch onboarding

Added at the site owner's request on 2026-09-13. The owner's final choice was Shanghai flagship only; Suzhou is not listed.

## Sources

- Owner-supplied `品牌介绍2025103.pdf`, 31 pages: brand background (pages 2 and 8), physician-led consultation approach (page 13), Shanghai address and photographs (page 14), injectable and energy-based treatment categories (page 23).
- https://rodeomed.com/about: brand website, Shanghai address listed as Room 202, 7 Maoming South Road, Huangpu District. Checked 2026-09-13.

The original embedded photo montage on page 14 was extracted as `rodeo-shanghai.png`. These are supplied Shanghai branch photographs, not AI-generated or retouched images.

## Data ownership

The Shanghai flagship has a stable static directory identity. Its bilingual descriptions, official website and photo gallery are managed in the existing `clinics` database table using its `static_slug`. The image is stored in the existing `clinic-photos` bucket. Admin edits override the directory's baseline fields, and hiding the record removes it from the public clinic directory.

## Expanded introduction

At the owner's request, expanded the introduction into eleven bilingual subsections: history, clinical approach, injectables, energy-based treatments, brochure medical-team biographies, founding team, consultation and aftercare, BIOLAB collaboration, Shanghai environment/contact details, visit planning and source limitations.

Additional brochure pages reviewed: 17–20 (founding team and medical advisers), 25 and 28 (BIOLAB). Page 25's logo reads 听研; the extracted PDF text inconsistently spells the name, so the rendered page was checked. The medical-team descriptions are explicitly brochure-attributed, not live physician schedules or independently verified licences. No separately bookable physician profiles were created.

The brand website's contact details, hours and appointment/aftercare-group descriptions were checked on 2026-09-13. These are brand-published statements. BHRC's 2005 founding date is distinguished from RODEO's 2021 Shanghai founding and 2024 Shanghai flagship opening. Overseas branch counts, awards, sales figures, guaranteed treatment outcomes and unverified Shanghai hormone/cell-service claims are excluded.

Full English and Chinese text is stored in the clinic admin description fields. Matching build-time defaults are in src/data/rodeoShanghaiProfile.ts so the expanded profile is also present in initial HTML. Admin edits still override those defaults. Descriptions support double-hash subsection headings, hyphen list items and HTTPS source links, with raw HTML always escaped.
