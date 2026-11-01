import { Link } from 'react-router-dom';
import { GUIDE_REFERENCES, PROCEDURE_BRIEFS } from '@/data/procedureGuides';
import { PROCEDURE_CATALOG, procedureSlug } from '@/data/procedureCatalog';
import type { Treatment } from '@/data/treatments';

type Props = { name: string; category: string; zh: boolean; treatment?: Treatment };

export default function ProcedureGuideSections({ name, category, zh, treatment }: Props) {
  const guide = PROCEDURE_BRIEFS[procedureSlug(name)];
  if (!guide) return null;
  const text = (en: string, cn: string) => zh ? cn : en;
  const hair = category === 'Hair Restoration';
  const dental = category === 'Cosmetic Dentistry';
  const skin = category === 'Skin & Non-Surgical';
  const reference = name === 'Brow Lift' ? GUIDE_REFERENCES.brow : /Implant|Breast Augmentation/.test(name) ? GUIDE_REFERENCES.implants : hair ? GUIDE_REFERENCES.hair : dental ? GUIDE_REFERENCES.dental : name === 'Botulinum Toxin' ? GUIDE_REFERENCES.toxin : name === 'Dermal Fillers' ? GUIDE_REFERENCES.fillers : skin ? GUIDE_REFERENCES.skin : GUIDE_REFERENCES.surgery;
  const related = PROCEDURE_CATALOG.filter(p => p.categoryEn === category && p.en !== name).slice(0, 3);
  const fit = treatment ? (zh ? treatment.goodFitZh : treatment.goodFitEn) : [text(
    'Suitability depends on the cause of the concern, examination findings, medical history and a goal that the proposed treatment can realistically address.',
    '是否适合取决于问题成因、检查结果、既往病史，以及目标是否在该治疗可实现的范围内。')];
  const notFit = treatment ? (zh ? treatment.notFitZh : treatment.notFitEn) : [text(
    'An active infection, an unexplained new symptom or an unstable medical condition needs assessment before elective treatment. Pregnancy, medicines and prior procedures may change the plan.',
    '活动性感染、原因不明的新症状或控制不稳的疾病应先评估，再考虑择期治疗。妊娠、用药及既往操作可能改变方案。')];
  const steps = [
    [text('1. Assess the cause', '1. 明确问题与目标'), text(
      dental ? 'Review the teeth, gums, bite and relevant imaging before deciding which teeth need treatment.' : hair ? 'Diagnose the type and progression of hair loss and assess the donor supply before choosing graft numbers.' : skin ? 'Examine skin type, the diagnosis, previous reactions and current products before choosing a device or injectable.' : 'Review anatomy, previous operations, scars and health history. Discuss what the operation can change and what it cannot.',
      dental ? '先检查牙齿、牙周、咬合与必要影像，再确定哪些牙齿需要处理。' : hair ? '先明确脱发类型与进程，评估供区资源，再讨论毛囊数量。' : skin ? '先评估肤质、诊断、既往反应及在用产品，再选择设备或注射材料。' : '评估解剖结构、既往手术、瘢痕与病史，明确手术能改变什么，以及不能改变什么。')],
    [text('2. Compare the options', '2. 比较方案与替代选择'), text('Ask about doing nothing, a less invasive option and a staged approach. Confirm who performs each step, the setting, anesthesia where relevant and the total written fee.', '讨论暂不治疗、创伤较小的选择与分期处理。确认每个步骤的执行者、场所、必要的麻醉安排及书面总费用。')],
    [text('3. Prepare and give consent', '3. 完成准备与知情同意'), text('Follow individualized testing and preparation instructions. Disclose medicines, supplements, allergies and nicotine use; do not stop prescribed medication yourself.', '按个人情况完成检查与准备。告知药物、补充剂、过敏及尼古丁使用情况，不要自行停用处方药。')],
    [text('4. Plan follow-up before travel', '4. 提前安排复诊与行程'), text('Get written aftercare instructions, an emergency contact and a review schedule. Ask when work, exercise and flying are appropriate for your procedure and health.', '取得书面护理说明、紧急联系方式与复诊安排。根据具体项目和健康情况，确认何时适合工作、运动与乘机。')],
  ];
  const faqs = [
    [text('How is the technique chosen?', '如何选择具体方式？'), guide.consideration[zh ? 1 : 0]],
    [text('Will the result match a case photo?', '效果会和案例照片一样吗？'), text('Case photos can help explain an approach, but anatomy, tissue quality and healing differ. Ask to see consented examples with similar starting features and comparable lighting; a result cannot be promised.', '案例照片可帮助理解方案，但结构、组织条件与愈合存在差异。可查看起点相近、光线可比且已获授权的案例，不能据此承诺相同效果。')],
    [text('How long should I allow for recovery?', '需要预留多久恢复？'), text('Early return to routine activity is different from complete healing. Ask for separate guidance on visible swelling, wound care, work, exercise, travel and the timing of result assessment.', '恢复日常活动不等于完全愈合。应分别确认可见肿胀、伤口护理、工作、运动、出行及结果评估的时间。')],
    [text('What should a written quote include?', '书面报价应包含什么？'), text('Confirm the treatment scope, clinician and facility fees, materials, tests, anesthesia if needed, follow-ups and how additional treatment or complications are charged. Medical fees are paid directly to the hospital; any coordination or travel fees should be listed separately.', '确认治疗范围、医生及机构费用、材料、检查、必要的麻醉、复诊，以及额外治疗和并发症处理如何计费。医疗费用直接支付给医院，协调或行程费用应单独列明。')],
  ];
  return <section data-testid="procedure-expanded-guide" className="mt-8 space-y-6">
    <nav aria-label={text('Procedure guide sections', '项目指南章节')} className="flex flex-wrap gap-2">
      {['overview','candidacy','process','questions','references'].map((id,i) => <a key={id} href={`#guide-${id}`} className="rounded-full border px-4 py-2 text-sm hover:bg-secondary">{(zh ? ['项目概况','适用与限制','准备与流程','常见问题','资料来源'] : ['Overview','Suitability','Planning & process','FAQs','Sources'])[i]}</a>)}
    </nav>
    <section id="guide-overview" className="scroll-mt-28 rounded-3xl border bg-card p-6 md:p-8">
      <h2 className="font-display text-2xl">{text('What this procedure involves', '项目概况与改善方向')}</h2>
      <p className="mt-4 leading-relaxed text-muted-foreground">{guide.overview[zh ? 1 : 0]}</p>
      <p className="mt-4 border-l-2 border-primary pl-4 text-sm leading-relaxed">{guide.consideration[zh ? 1 : 0]}</p>
      {treatment && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{zh ? treatment.whatZh : treatment.whatEn}</p>}
    </section>
    <section id="guide-candidacy" className="scroll-mt-28 grid gap-4 sm:grid-cols-2">
      {[[text('Who may consider it', '哪些情况可考虑'), fit], [text('When to reassess or defer', '哪些情况需谨慎或暂缓'), notFit]].map(([heading, items]) => <div key={heading as string} className="rounded-3xl border bg-card p-6"><h2 className="font-display text-xl">{heading}</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">{(items as string[]).map(item => <li key={item}>{item}</li>)}</ul></div>)}
    </section>
    <section id="guide-process" className="scroll-mt-28 rounded-3xl border bg-card p-6 md:p-8"><h2 className="font-display text-2xl">{text('From assessment to follow-up', '从评估到随访')}</h2><ol className="mt-5 grid gap-5 sm:grid-cols-2">{steps.map(([title,body]) => <li key={title}><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></li>)}</ol></section>
    <section id="guide-questions" className="scroll-mt-28 rounded-3xl border bg-card p-6 md:p-8"><h2 className="font-display text-2xl">{text('Frequently asked questions', '常见问题')}</h2>{faqs.map(([q,a]) => <details key={q} className="border-b py-4 last:border-0"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p></details>)}</section>
    <section className="rounded-3xl bg-secondary/40 p-6"><h2 className="font-display text-xl">{text('Compare related approaches', '了解相关项目，比较不同方式')}</h2><p className="mt-2 text-sm text-muted-foreground">{text('Related does not mean you need combined treatment. Discuss the least intervention needed for your goal.', '相关不代表必须联合治疗，应讨论实现目标所需的最少干预。')}</p><div className="mt-4 flex flex-wrap gap-3">{related.map(p => <Link key={p.slug} to={`/treatments/${p.slug}`} className="rounded-full border bg-card px-4 py-2 text-sm hover:underline">{zh ? p.zh : p.en}</Link>)}</div></section>
    <section id="guide-references" className="scroll-mt-28 rounded-3xl border p-6 text-sm text-muted-foreground"><h2 className="font-semibold text-foreground">{text('Sources & editorial note', '资料来源与编辑说明')}</h2><p className="mt-2">{text('Original patient education updated November 1, 2026. Editorially researched; not individually reviewed by a clinician. International sources describe general principles, not product approval or provider credentials in China.', '原创患者科普，更新于 2026 年 11 月 1 日。内容经过资料核对，尚未经临床医生逐篇审核。国际资料用于说明一般原则，不代表产品在中国获批或机构资质认证。')}</p><a className="mt-3 inline-block text-brand underline" href={reference.url} target="_blank" rel="noreferrer">{reference.label}</a>{skin && name !== 'Dermal Fillers' && <a className="ml-4 inline-block text-brand underline" href={GUIDE_REFERENCES.fillers.url} target="_blank" rel="noreferrer">{GUIDE_REFERENCES.fillers.label}</a>}</section>
  </section>;
}
