# RODEO branch onboarding

Added at the site owner's request on 2026-09-13. The owner's final choice was Shanghai flagship only; Suzhou is not listed.

## Sources

- Owner-supplied `品牌介绍2025103.pdf`, 31 pages: brand background (pages 2 and 8), physician-led consultation approach (page 13), Shanghai address and photographs (page 14), injectable and energy-based treatment categories (page 23).
- https://rodeomed.com/about: brand website, Shanghai address listed as Room 202, 7 Maoming South Road, Huangpu District. Checked 2026-09-13.

The original embedded photo montage on page 14 was extracted as `rodeo-shanghai.png`. These are supplied Shanghai branch photographs, not AI-generated or retouched images.

## Data ownership

The Shanghai flagship has a stable static directory identity. Its bilingual descriptions, official website and photo gallery are managed in the existing `clinics` database table using its `static_slug`. The image is stored in the existing `clinic-photos` bucket. Admin edits override the directory's baseline fields, and hiding the record removes it from the public clinic directory.

No physician profiles, ratings, prices, treatment results, regulatory approvals, international awards, hormone therapies or cell-therapy claims were added. BHRC's overseas branch photographs were not used as China branch photographs.
