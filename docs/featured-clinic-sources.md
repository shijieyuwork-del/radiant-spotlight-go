# Featured clinic comparison details

Public sources reviewed on **2026-09-08**. This is a content-source review, not a medical evaluation, licensing audit, endorsement, or confirmation of partnership or appointment availability.

## Shanghai Huamei Plastic Surgery Hospital

Exact directory identity: `shanghai` / `Shanghai Huamei Plastic Surgery Hospital` / `上海华美医疗美容医院`.

- [Pudong New Area 2026 equipment supervision document](https://www.pudong.gov.cn/zwgk/14470.gkml_zhzw_ghjh/2026/41/350996/d9310ad7f81945cb8bc2c8c899a29cfb.pdf), published 2026-02-06, page 22, row 269: institution locations on Yuanshen Road, odd Nos. 125–135 (floors 2–3), Nos. 139–147 and No. 155, Pudong New Area. These are public-record addresses, not a confirmed patient arrival location. The visitor must confirm the exact building and entrance before travelling.
- The previous `Xuhui District` location was incorrect. The sourced record is in `Pudong New Area`.
- Current services, official physician roster and language support could not be confirmed from accessible primary sources. The institution sites timed out; old cached search snippets and third-party marketing sites were not used to fill these gaps.

## Plastic Surgery Hospital, CAMS (Badachu)

Exact directory identity: `beijing` / `Plastic Surgery Hospital, CAMS (Badachu)` / `中国医学科学院整形外科医院 (八大处)`.

- [Official hospital introduction](https://www.zhengxing.com.cn/page/yiyuanjianjie): published departments cover nose, breast, fat surgery, face/neck, scars/wounds, laser, injections and hair transplantation. These are department categories, not confirmation that any requested procedure is available or suitable.
- [Official location information](https://www.zhengxing.com.cn/page/dlwz): No. 33 Badachu Road, Shijingshan District, Beijing.
- [Official doctor schedule](https://www.zhengxing.com.cn/page/chuzhenanpai): linked as an external source, separate from CeladonChina's published doctor profiles. No physician names or qualifications were inferred or copied into platform profiles.
- The official introduction states the former East campus closed in April 2023. That legacy campus is not included in the current comparison panel.
- Language support was not confirmed in the reviewed sources.

## Guangzhou Huamei Aesthetic Hospital

Exact directory identity: `guangzhou` / `Guangzhou Huamei Aesthetic Hospital` / `广州华美医疗美容医院`.

- [Current hospital homepage](https://www.ubeauty.cn/): public arrival address is No. 493 Huangpu Avenue West, Tianhe District, Guangzhou.
- [Government-filed environmental impact report](https://sthjj.gz.gov.cn/attachment/7/7708/7708339/9566270.pdf), PDF page 39 (printed page 25): existing department categories include cosmetic surgery, cosmetic dentistry and cosmetic dermatology. These categories are presented as source-listed departments, not current procedural availability or clinical credential verification. The report also records cosmetic TCM, which is not included in the site's focused comparison summary.
- The report lists Nos. 493 and 495 in existing facility addresses. The comparison panel uses the hospital's current published arrival address, No. 493; visitors must confirm the appointment building and entrance.
- A current official doctor-directory URL and language service were not confirmed. A formerly indexed `/expert/` URL now returned 404 and was not added.

## Implementation boundaries

`src/data/clinicProfiles.ts` attaches evidence only by the complete exact city and bilingual directory identity, not by brand or substring. The detail comparison panel displays services, doctor-directory status, campus/address, language status, source links and the public-source review date. New interface copy explicitly supports all six current languages.

Missing details have actionable, factual empty states; no doctors, services, translators, credentials, prices or partnerships are invented. Existing dynamically published doctor associations and hospital-specific consultation context remain unchanged.

Tests cover exact identity isolation, field-to-source references, external physician-directory separation, truthful missing-data states and rendering in six languages. Production publication must be verified separately by the coordinating task.
