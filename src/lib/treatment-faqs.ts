import { PROCEDURE_BRIEFS } from "@/data/procedureGuides";

/** The exact FAQ content rendered by the existing parent treatment guides. */
export function treatmentFaqs(slug: string, zh = false): string[][] {
  const guide = PROCEDURE_BRIEFS[slug];
  if (!guide) return [];
  const text = (en: string, cn: string) => zh ? cn : en;
  return [
    [text('How is the technique chosen?', '如何选择具体方式？'), guide.consideration[zh ? 1 : 0]],
    [text('Will the result match a case photo?', '效果会和案例照片一样吗？'), text('Case photos can help explain an approach, but anatomy, tissue quality and healing differ. Ask to see consented examples with similar starting features and comparable lighting; a result cannot be promised.', '案例照片可帮助理解方案，但结构、组织条件与愈合存在差异。可查看起点相近、光线可比且已获授权的案例，不能据此承诺相同效果。')],
    [text('How long should I allow for recovery?', '需要预留多久恢复？'), text('Early return to routine activity is different from complete healing. Ask for separate guidance on visible swelling, wound care, work, exercise, travel and the timing of result assessment.', '恢复日常活动不等于完全愈合。应分别确认可见肿胀、伤口护理、工作、运动、出行及结果评估的时间。')],
    [text('What should a written quote include?', '书面报价应包含什么？'), text('Confirm the treatment scope, clinician and facility fees, materials, tests, anesthesia if needed, follow-ups and how additional treatment or complications are charged. Medical fees are paid directly to the hospital; any coordination or travel fees should be listed separately.', '确认治疗范围、医生及机构费用、材料、检查、必要的麻醉、复诊，以及额外治疗和并发症处理如何计费。医疗费用直接支付给医院，协调或行程费用应单独列明。')],
  ];
}
