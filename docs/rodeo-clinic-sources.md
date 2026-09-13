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

## Customer-facing revision and expanded gallery, 2026-09-13

The owner requested natural clinic copy without repeated brochure/reporting language. Rewrote both languages and the topic summaries while retaining eleven chapters and six disclosure groups. Source provenance stays in this internal record; doctor registration, attendance and treatment availability still require booking-time confirmation. Removed the hospital's phone, email and opening-hours paragraph. The owner explicitly clarified that the official website link should remain, alongside the Shanghai address and CeladonChina consultation controls.

Expanded the gallery using six original images from the official about-page gallery (https://rodeomed.com/about). Browser-observed assets were exported without AI editing or retouching. Clinic image 1 visibly carries the Shanghai clinic name; the reception, blue counter, curved partitions and corridor match the owner-supplied Shanghai spread. Images from Suzhou or overseas branches are not used.

| Official gallery image | Stored clinic-photos path | View |
| --- | --- | --- |
| clinic-2.jpg | rodeo-shanghai-reception.webp | Reception overview / cover |
| clinic-1.jpg | rodeo-shanghai-entrance.webp | Entrance with Shanghai clinic sign |
| clinic-5.jpg | rodeo-shanghai-retail.webp | Retail display space |
| clinic-7.jpg | rodeo-shanghai-corridor.webp | Corridor and greenery |
| clinic-8.jpg | rodeo-shanghai-window.webp | Window and glass partition |
| clinic-10.jpg | rodeo-shanghai-lounge.webp | Lounge seating |

The previous montage remains in storage for recovery but is no longer the selected gallery. All six new images remain editable through the existing clinic admin gallery. No storage objects, clinic records, DNS records or permissions were deleted or changed outside this listing's content fields.

## Official medical-team cards, 2026-09-13

The site owner confirmed permission to reuse material from https://rodeomed.com/. The medical-team disclosure now uses the official portraits and current summary information published at https://rodeomed.com/doctors for Dr. Dan, Chen Sikai and Hu Lingling. The images are stored locally as `rodeo-dr-dan.jpg`, `rodeo-chen-sikai.jpg` and `rodeo-hu-lingling.jpg`; no generated portraits are used. The public page links back to the official team page and continues to tell readers to confirm current registration, Shanghai attendance and availability before booking.
