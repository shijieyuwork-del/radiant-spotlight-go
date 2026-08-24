/**
 * 项目科普内容。
 *
 * 写作原则（改动前请先读）：
 * 1. 只写普遍适用的医学常识，不对任何个人给出诊疗建议
 * 2. 风险栏必须写真实风险，包括不好听的那些 —— 隐去风险的科普没有价值，
 *    而且对医美这类决策来说是有害的
 * 3. 价格是公开市场的大致区间，不是报价；口径（是否含麻醉/住院/复诊）必须写清
 * 4. 不出现具体专家、诊所、执照号 —— 那属于 experts.ts，且需真实授权
 */

export interface RecoveryStage {
  whenEn: string;
  whenZh: string;
  whatEn: string;
  whatZh: string;
}

export interface Treatment {
  slug: string;
  en: string;
  zh: string;
  /** 搜索引擎结果里显示的一句话概括 */
  summaryEn: string;
  summaryZh: string;
  /** 这是什么手术 */
  whatEn: string;
  whatZh: string;
  /** 常见术式 / 入路 */
  techniquesEn: string[];
  techniquesZh: string[];
  /** 通常适合谁 */
  goodFitEn: string[];
  goodFitZh: string[];
  /** 通常不适合 / 需先处理其他问题 */
  notFitEn: string[];
  notFitZh: string[];
  recovery: RecoveryStage[];
  /** 真实风险，不粉饰 */
  risksEn: string[];
  risksZh: string[];
  /** 面诊时该问专家什么 */
  askEn: string[];
  askZh: string[];
  /** 亚洲主要城市的公开市场区间（美元），仅供量级参考 */
  priceUsdLow: number;
  priceUsdHigh: number;
  priceNoteEn: string;
  priceNoteZh: string;
}

export const TREATMENTS: Treatment[] = [
  {
    slug: "rhinoplasty",
    en: "Rhinoplasty",
    zh: "鼻综合",
    summaryEn:
      "Reshapes the bridge, tip or nostrils, and can also correct breathing problems. Final shape takes up to a year to settle.",
    summaryZh:
      "重塑鼻背、鼻尖或鼻翼，也可同时改善通气。最终形态需要长达一年才稳定。",
    whatEn:
      "Rhinoplasty reshapes the bone and cartilage framework of the nose. It is one of the most technically demanding facial procedures because the nose is a three-dimensional structure where small changes are highly visible, and because swelling masks the result for months. When breathing is also a concern, the surgery is often combined with septoplasty to straighten the septum.",
    whatZh:
      "鼻综合是对鼻部骨与软骨支架的重塑。它是技术难度最高的面部手术之一：鼻子是立体结构，微小改动都非常显眼；而且肿胀会掩盖结果长达数月。若同时存在通气问题，常与鼻中隔矫正一并进行。",
    techniquesEn: [
      "Closed (endonasal) — all incisions inside the nostrils, no external scar, less swelling, but limited exposure",
      "Open (external) — a small incision across the columella gives direct visibility, standard for complex or revision cases",
      "Structural grafting — cartilage taken from the septum, ear or rib to support or build up the framework",
    ],
    techniquesZh: [
      "闭合式（鼻内入路）—— 切口全在鼻孔内，无外部疤痕、肿胀较轻，但视野受限",
      "开放式（外切）—— 鼻小柱上一道小切口换取直接视野，复杂病例和修复手术的标准做法",
      "结构性移植 —— 取鼻中隔、耳或肋软骨来支撑或垫高支架",
    ],
    goodFitEn: [
      "Facial growth has finished (generally 17+ for women, 18+ for men)",
      "A specific, describable concern — a hump, a wide or drooping tip, asymmetry",
      "Understands the final result is judged at 12 months, not 12 weeks",
    ],
    goodFitZh: [
      "面部发育已完成（一般女性 17 岁以上、男性 18 岁以上）",
      "有具体、说得清的诉求 —— 驼峰、鼻头宽大或下垂、不对称",
      "理解最终效果看 12 个月，而不是 12 周",
    ],
    notFitEn: [
      "Active nasal infection or uncontrolled skin conditions in the area",
      "Expectations set by heavily edited photos, or by a nose that does not suit your facial proportions",
      "Body dysmorphic disorder — surgery does not treat it and often worsens distress",
    ],
    notFitZh: [
      "鼻部存在活动性感染，或局部皮肤疾病未控制",
      "预期建立在精修照片上，或想要一个与自身面部比例不协调的鼻子",
      "躯体变形障碍 —— 手术不能治疗它，通常反而加重痛苦",
    ],
    recovery: [
      { whenEn: "Days 1–7", whenZh: "第 1–7 天", whatEn: "External splint in place; swelling and bruising around the eyes peak around day 3.", whatZh: "外固定夹板在位；眼周肿胀淤青在第 3 天左右达到高峰。" },
      { whenEn: "Week 1–2", whenZh: "第 1–2 周", whatEn: "Splint removed. Most people are presentable in public, though the nose still looks swollen and upturned.", whatZh: "拆除夹板。多数人可以见人，但鼻子仍显肿、鼻尖上翘。" },
      { whenEn: "Month 1–3", whenZh: "第 1–3 个月", whatEn: "Major swelling subsides. Avoid contact sports and glasses resting on the bridge.", whatZh: "主要肿胀消退。避免对抗性运动，避免眼镜压在鼻背。" },
      { whenEn: "Month 6–12+", whenZh: "第 6–12 个月及以后", whatEn: "Tip swelling resolves last, especially in thicker skin. Judge the result here.", whatZh: "鼻尖肿胀消退最慢，皮肤厚者尤其如此。效果以此时为准。" },
    ],
    risksEn: [
      "Revision surgery is needed in roughly 5–15% of cases — the highest revision rate of any facial procedure",
      "Breathing can get worse, not better, if structural support is over-reduced",
      "Asymmetry, visible or palpable graft edges, and irregularities of the bridge",
      "Numbness of the nasal tip, usually temporary but occasionally lasting",
      "If rib cartilage is used: a chest scar, and cartilage that can warp over time",
    ],
    risksZh: [
      "约 5–15% 的病例需要二次修复 —— 面部手术中修复率最高的项目",
      "如果支撑结构被过度削减，通气可能变差而不是变好",
      "不对称、移植物边缘可见或可触及、鼻背不平整",
      "鼻尖麻木，通常是暂时的，偶尔长期存在",
      "若使用肋软骨：胸部会留疤，且软骨随时间可能变形",
    ],
    askEn: [
      "How many rhinoplasties do you perform per year, and what share are revisions of other surgeons' work?",
      "Will you use grafts, and where will the cartilage come from?",
      "May I see before/after photos of patients with skin thickness and nose shape similar to mine, at 12 months?",
      "What is your policy and cost if a revision is needed?",
    ],
    askZh: [
      "您每年做多少例鼻综合？其中修复他人手术的占比多少？",
      "会用到移植物吗？软骨从哪里取？",
      "能否看与我皮肤厚度、鼻型相近的患者术后 12 个月的对比照？",
      "如果需要修复，您的政策和费用如何？",
    ],
    priceUsdLow: 3000,
    priceUsdHigh: 9000,
    priceNoteEn:
      "Typical range across major Asian cities for primary rhinoplasty including surgeon fee, anaesthesia and facility. Revision cases and rib-cartilage grafting sit well above this. Excludes flights, accommodation and any second-stage surgery.",
    priceNoteZh:
      "亚洲主要城市初次鼻综合的常见区间，含术者费、麻醉与场地费。修复病例与肋软骨移植远高于此。不含机票、住宿及任何二期手术。",
  },
  {
    slug: "blepharoplasty",
    en: "Blepharoplasty",
    zh: "眼睑成形（双眼皮 / 眼袋）",
    summaryEn:
      "Reshapes upper or lower eyelids — double-eyelid creation, hooded-skin removal, or under-eye bag correction.",
    summaryZh:
      "重塑上眼睑或下眼睑 —— 双眼皮成形、去除遮挡的松弛皮肤，或矫正眼袋。",
    whatEn:
      "Blepharoplasty covers several distinct operations. Upper-lid surgery either creates or refines a crease (the 'double eyelid') or removes redundant skin that hoods the eye. Lower-lid surgery addresses under-eye bags caused by fat that has pushed forward, and sometimes the hollow beneath them. The right operation depends on which of these is actually the problem, which is why an in-person assessment matters more here than photos.",
    whatZh:
      "眼睑成形其实包含好几种不同的手术。上睑手术要么形成或调整褶皱（即「双眼皮」），要么切除遮挡视线的多余皮肤。下睑手术处理眶隔脂肪前突形成的眼袋，有时还要处理其下方的凹陷。到底该做哪一种取决于问题本身是什么 —— 这也是为什么这个项目当面评估比看照片重要得多。",
    techniquesEn: [
      "Incisional double-eyelid — a full-length incision creates a permanent, well-defined crease; suits thicker lids or excess skin",
      "Buried-suture (non-incisional) — sutures create the crease with no skin incision; faster recovery but can loosen over years",
      "Transconjunctival lower lid — incision inside the lid removes fat with no external scar",
      "Skin–muscle flap lower lid — external incision under the lashes when skin also needs tightening",
    ],
    techniquesZh: [
      "切开法双眼皮 —— 全长切口形成永久、清晰的褶皱；适合眼皮较厚或皮肤松弛者",
      "埋线法（非切开）—— 缝线形成褶皱，皮肤无切口；恢复快，但数年后可能松脱",
      "结膜入路下睑 —— 从眼睑内侧切口取出脂肪，外部无疤痕",
      "皮肤肌肉瓣下睑 —— 睫毛下外切口，适用于同时需要收紧皮肤者",
    ],
    goodFitEn: [
      "Upper-lid skin that rests on the lashes or narrows the visual field",
      "Under-eye bags that persist regardless of sleep and salt intake",
      "Asymmetric or unstable creases from previous buried-suture surgery",
    ],
    goodFitZh: [
      "上睑皮肤压在睫毛上，或已影响视野",
      "无论睡眠和饮食如何调整都持续存在的眼袋",
      "既往埋线术后褶皱不对称或不稳定",
    ],
    notFitEn: [
      "Untreated dry eye — eyelid surgery can make it substantially worse",
      "Thyroid eye disease or other active orbital conditions",
      "Puffiness that is actually allergy or fluid retention, not fat",
    ],
    notFitZh: [
      "未经治疗的干眼症 —— 眼睑手术会使其明显加重",
      "甲状腺相关眼病或其他活动性眼眶疾病",
      "实际是过敏或水肿造成的浮肿，而非脂肪",
    ],
    recovery: [
      { whenEn: "Days 1–7", whenZh: "第 1–7 天", whatEn: "Swelling and bruising peak. Sutures usually removed around day 5–7.", whatZh: "肿胀淤青达到高峰。通常第 5–7 天拆线。" },
      { whenEn: "Week 2–4", whenZh: "第 2–4 周", whatEn: "Most bruising gone and coverable with makeup. The crease still looks higher and harder than it will be.", whatZh: "淤青基本消退，可用化妆遮盖。褶皱看起来仍比最终偏高、偏硬。" },
      { whenEn: "Month 3–6", whenZh: "第 3–6 个月", whatEn: "The crease softens and settles into its final height. Scars fade from pink toward skin tone.", whatZh: "褶皱变柔和并稳定在最终高度。疤痕由粉色逐渐接近肤色。" },
    ],
    risksEn: [
      "Dry eye, grittiness or excessive tearing — common early, occasionally persistent",
      "Asymmetry between the two sides, which is the most frequent reason for revision",
      "Lower-lid pull-down (ectropion or scleral show) if too much skin is removed",
      "A crease that is set too high, too deep, or that fades and needs redoing",
      "Difficulty closing the eyes fully, usually temporary",
    ],
    risksZh: [
      "干眼、异物感或流泪过多 —— 早期常见，偶尔持续存在",
      "两侧不对称，这是最常见的修复原因",
      "下睑外翻或露白（皮肤切除过多所致）",
      "褶皱过高、过深，或变浅需要重做",
      "闭眼不全，通常是暂时的",
    ],
    askEn: [
      "Based on my lid anatomy, do you recommend incisional or buried-suture, and why?",
      "Do I have any dry-eye symptoms that should be assessed or treated first?",
      "How high will you set the crease, and how will it look once swelling settles?",
      "If the crease loosens or is asymmetric, what does correction involve?",
    ],
    askZh: [
      "根据我的眼睑条件，您建议切开还是埋线？理由是什么？",
      "我是否有需要先评估或治疗的干眼症状？",
      "褶皱会设计多高？消肿后会是什么样子？",
      "如果褶皱松脱或不对称，矫正需要怎么做？",
    ],
    priceUsdLow: 1500,
    priceUsdHigh: 5000,
    priceNoteEn:
      "Range covers upper-lid or lower-lid surgery alone. Doing both, or combining with ptosis correction or fat repositioning, sits at the upper end or above. Excludes travel and accommodation.",
    priceNoteZh:
      "该区间对应单做上睑或单做下睑。上下同做，或合并上睑下垂矫正、脂肪重置，费用在上限或更高。不含差旅住宿。",
  },
  {
    slug: "facelift",
    en: "Facelift",
    zh: "面部拉皮",
    summaryEn:
      "Repositions sagging tissue of the lower face and jawline. It does not change skin texture or volume on its own.",
    summaryZh:
      "复位下面部与下颌缘的松垂组织。它本身不改变皮肤质地，也不补充容量。",
    whatEn:
      "A modern facelift lifts the SMAS — the fibrous layer beneath the skin that actually carries facial shape — rather than pulling skin tight. That distinction is why well-done results look rested rather than stretched. A facelift addresses sagging along the jawline and neck. It does not improve sun damage, fine lines around the mouth, or lost volume, so it is frequently combined with other treatments.",
    whatZh:
      "现代拉皮提升的是 SMAS（皮下那层真正承载面部形态的筋膜），而不是把皮肤拉紧。这个区别正是效果自然而非紧绷的原因。拉皮解决的是下颌缘与颈部的松垂，它不改善光老化、口周细纹或容量流失，因此常与其他治疗联合进行。",
    techniquesEn: [
      "SMAS plication or SMASectomy — the SMAS layer is folded or partially removed and re-secured",
      "Deep-plane — the SMAS is released and lifted as a unit with the skin; more extensive, longer recovery",
      "Mini or short-scar lift — shorter incisions for limited early sagging; correspondingly limited result",
      "Often combined with neck lift, fat grafting or skin resurfacing to address what a lift alone cannot",
    ],
    techniquesZh: [
      "SMAS 折叠或部分切除 —— 将 SMAS 层折叠或部分切除后重新固定",
      "深层平面（Deep-plane）—— 松解 SMAS 并与皮肤整体提升；创伤更大、恢复更久",
      "小切口 / 迷你拉皮 —— 切口更短，适合早期轻度松垂；效果也相应有限",
      "常与颈部提升、脂肪填充或皮肤重塑联合，弥补单纯提升做不到的部分",
    ],
    goodFitEn: [
      "Sagging along the jawline and beneath the chin, with reasonable skin elasticity remaining",
      "Good general health and, importantly, a non-smoker or willing to stop well in advance",
      "Wants a change measured in years of appearance, not a different face",
    ],
    goodFitZh: [
      "下颌缘与下巴下方松垂，皮肤仍保有一定弹性",
      "全身状况良好，且不吸烟，或愿意提前足够长时间戒烟",
      "希望的是「看起来年轻几岁」，而不是换一张脸",
    ],
    notFitEn: [
      "Active smoking — it markedly raises the risk of skin necrosis and poor scarring",
      "Uncontrolled hypertension, which is strongly linked to post-operative haematoma",
      "The main concern is skin quality or volume loss rather than sagging",
    ],
    notFitZh: [
      "仍在吸烟 —— 显著提高皮肤坏死与疤痕不良的风险",
      "高血压未控制，与术后血肿高度相关",
      "主要困扰其实是皮肤质地或容量流失，而非松垂",
    ],
    recovery: [
      { whenEn: "Days 1–7", whenZh: "第 1–7 天", whatEn: "Dressings and sometimes drains. Swelling and bruising are substantial. This is when haematoma, if it happens, appears.", whatZh: "包扎，有时留置引流。肿胀淤青明显。若发生血肿，多在此阶段出现。" },
      { whenEn: "Week 2–3", whenZh: "第 2–3 周", whatEn: "Sutures out. Bruising fades enough to cover. Numbness and tightness are normal and expected.", whatZh: "拆线。淤青消退到可遮盖。麻木与紧绷感属正常预期。" },
      { whenEn: "Month 1–3", whenZh: "第 1–3 个月", whatEn: "Contour settles; most patients feel comfortable in social and work settings.", whatZh: "轮廓趋于稳定；多数人可正常社交与工作。" },
      { whenEn: "Month 6–12", whenZh: "第 6–12 个月", whatEn: "Scars mature and soften. Residual numbness near the ears resolves last.", whatZh: "疤痕成熟变软。耳周残留麻木消退最慢。" },
    ],
    risksEn: [
      "Haematoma — the most common early complication, sometimes needing an urgent return to theatre",
      "Facial nerve injury causing weakness; usually temporary but permanent injury is possible",
      "Skin necrosis, disproportionately in smokers",
      "Visible scars, widened scars, or altered hairline position in front of and behind the ear",
      "Persistent numbness around the ears and cheeks",
    ],
    risksZh: [
      "血肿 —— 最常见的早期并发症，有时需紧急返回手术室处理",
      "面神经损伤导致无力；通常是暂时的，但存在永久损伤的可能",
      "皮肤坏死，吸烟者比例显著更高",
      "疤痕可见、增宽，或耳前耳后发际线位置改变",
      "耳周与面颊持续麻木",
    ],
    askEn: [
      "Which SMAS technique do you use for someone with my degree of laxity, and why that one?",
      "Where exactly will the incisions sit, and how will they affect my hairline and sideburn?",
      "Will a lift alone address my concerns, or do I also need volume or skin treatment?",
      "What is your haematoma rate, and what happens if I develop one after I have flown home?",
    ],
    askZh: [
      "针对我的松垂程度，您采用哪种 SMAS 术式？为什么选它？",
      "切口具体在哪里？会如何影响我的发际线和鬓角？",
      "单做提升能解决我的问题吗？还是我同时需要补容量或做皮肤治疗？",
      "您的血肿发生率是多少？如果我回国后才出现血肿该怎么办？",
    ],
    priceUsdLow: 6000,
    priceUsdHigh: 18000,
    priceNoteEn:
      "Wide range because 'facelift' spans short-scar procedures to deep-plane surgery with neck work. Combined procedures and general anaesthesia push toward the top. Excludes travel, accommodation and the extended local stay this procedure requires.",
    priceNoteZh:
      "区间跨度大，因为「拉皮」从小切口到含颈部的深层平面手术都算。联合手术与全身麻醉接近上限。不含差旅住宿，也不含本项目所需的较长当地停留。",
  },
  {
    slug: "liposuction",
    en: "Liposuction",
    zh: "吸脂",
    summaryEn:
      "Removes localised fat deposits to reshape contour. It is a contouring operation, not a weight-loss method.",
    summaryZh:
      "去除局部脂肪堆积以重塑轮廓。它是塑形手术，不是减重方法。",
    whatEn:
      "Liposuction removes fat through small cannulas to change the shape of an area that has not responded to diet and exercise. The important framing is that it treats distribution, not quantity: results are best in people already near a stable weight, with good skin elasticity. Skin that has lost elasticity will not shrink to the new contour, and may need a skin-excision procedure instead.",
    whatZh:
      "吸脂通过细吸管去除脂肪，改变饮食和运动无法改善的局部形态。关键在于：它处理的是脂肪分布而非总量。效果最好的是体重已接近稳定、皮肤弹性良好的人。弹性已丧失的皮肤不会回缩贴合新轮廓，可能反而需要做皮肤切除类手术。",
    techniquesEn: [
      "Tumescent — dilute anaesthetic and adrenaline fluid infiltrated first; the standard baseline for most cases",
      "Power-assisted (PAL) — a vibrating cannula reduces surgeon fatigue and treats fibrous areas more evenly",
      "Ultrasound- or laser-assisted — energy liquefies fat first; useful in fibrous or revision areas, adds a burn risk",
      "VASER and similar are marketing names for energy-assisted variants, not separate categories of result",
    ],
    techniquesZh: [
      "肿胀技术 —— 先注入稀释的麻药与肾上腺素液体；绝大多数病例的基础标准",
      "动力辅助（PAL）—— 振动吸管减轻术者疲劳，对纤维化区域处理更均匀",
      "超声或激光辅助 —— 先用能量乳化脂肪；对纤维化或修复区域有用，但增加烫伤风险",
      "VASER 等是能量辅助术式的商品名，并不是另一类效果",
    ],
    goodFitEn: [
      "Localised bulges that persist at a stable, near-goal weight",
      "Skin with enough elasticity to retract over the new contour",
      "Realistic about scale — this removes shape, typically a few litres at most in one session",
    ],
    goodFitZh: [
      "体重稳定、接近目标值时仍存在的局部凸起",
      "皮肤弹性足以回缩贴合新轮廓",
      "对量级有合理认知 —— 它改变形状，单次通常最多抽取数升",
    ],
    notFitEn: [
      "Using it as a substitute for weight loss, or while weight is still changing significantly",
      "Significant skin laxity — the contour will look worse, not better, without skin excision",
      "Untreated clotting disorders or a history of DVT without specialist clearance",
    ],
    notFitZh: [
      "把它当作减重的替代方案，或体重仍在大幅变化期间",
      "皮肤明显松弛 —— 不配合皮肤切除的话轮廓只会更差",
      "未经处理的凝血功能障碍，或有深静脉血栓史且未获专科许可",
    ],
    recovery: [
      { whenEn: "Days 1–7", whenZh: "第 1–7 天", whatEn: "Compression garment worn continuously. Drainage from incisions in the first days is expected. Soreness like a deep bruise.", whatZh: "持续穿戴加压衣。最初几天切口渗液属正常。酸痛类似深部淤伤。" },
      { whenEn: "Week 2–6", whenZh: "第 2–6 周", whatEn: "Garment usually continued. Swelling makes the area look larger than the eventual result — this misleads a lot of people.", whatZh: "通常继续穿加压衣。肿胀让该部位看起来比最终结果更大 —— 很多人在这一步被误导。" },
      { whenEn: "Month 3–6", whenZh: "第 3–6 个月", whatEn: "Contour becomes reliable. Firm or lumpy areas soften, sometimes with massage.", whatZh: "轮廓趋于可靠。硬结或不平区域变软，有时需配合按摩。" },
    ],
    risksEn: [
      "Contour irregularity, dents or asymmetry — the most common reason for dissatisfaction and revision",
      "Seroma (fluid collection) that may need drainage",
      "Prolonged swelling and numbness in the treated area",
      "Skin laxity becoming more obvious once the underlying volume is gone",
      "Rare but serious: fat embolism, deep vein thrombosis, and perforation of underlying structures",
    ],
    risksZh: [
      "轮廓不平整、凹陷或不对称 —— 最常见的不满意与修复原因",
      "血清肿（积液），可能需要引流",
      "治疗区域长期肿胀与麻木",
      "底层容量减少后，皮肤松弛反而更明显",
      "罕见但严重：脂肪栓塞、深静脉血栓、以及穿透深层结构",
    ],
    askEn: [
      "How much volume do you expect to remove, and is that within safe limits for a single session?",
      "Given my skin elasticity, will liposuction alone give a good contour or do I need skin excision?",
      "How long must I wear compression, and what does aftercare look like once I fly home?",
      "How do you handle contour irregularities if they appear?",
    ],
    askZh: [
      "预计抽取多少量？这在单次手术的安全范围内吗？",
      "以我的皮肤弹性，单做吸脂轮廓会好吗？还是需要配合皮肤切除？",
      "加压衣要穿多久？我回国后的术后护理是怎样的？",
      "如果出现轮廓不平整，您如何处理？",
    ],
    priceUsdLow: 2000,
    priceUsdHigh: 8000,
    priceNoteEn:
      "Depends heavily on the number and size of areas treated. Multi-area sessions requiring general anaesthesia and an overnight stay sit at the top of the range. Compression garments and follow-up are sometimes billed separately — ask.",
    priceNoteZh:
      "很大程度取决于治疗部位的数量与面积。需全麻并留观过夜的多部位手术接近上限。加压衣与复诊有时单独收费 —— 记得问清楚。",
  },
  {
    slug: "breast-augmentation",
    en: "Breast Augmentation",
    zh: "隆胸",
    summaryEn:
      "Increases breast size with implants or fat grafting. Implants are not lifetime devices and will need attention eventually.",
    summaryZh:
      "通过假体或自体脂肪增大胸部。假体不是终身器械，最终一定需要处理。",
    whatEn:
      "Augmentation is done either with implants or by transferring the patient's own fat. Implants give a predictable, larger increase in one operation; fat grafting gives a smaller, softer change with unpredictable retention and often needs more than one session. The single most under-discussed fact is that implants are not permanent devices: most people will need a revision or replacement operation at some point in their life.",
    whatZh:
      "隆胸可用假体，也可移植自体脂肪。假体一次手术即可获得可预期的、幅度较大的增大；脂肪移植幅度小、手感更自然，但存活率不可预测，常需多次。最少被认真讨论的一点是：假体不是永久器械 —— 多数人一生中某个时点需要接受修复或置换手术。",
    techniquesEn: [
      "Implant material — silicone gel (more natural feel) or saline (rupture is obvious immediately)",
      "Placement — subglandular, submuscular, or dual-plane; affects feel, animation and mammogram imaging",
      "Incision — inframammary (under the fold), periareolar, or transaxillary (armpit)",
      "Fat transfer — liposuction from elsewhere, processed and injected; roughly half the volume survives long term",
    ],
    techniquesZh: [
      "假体材质 —— 硅胶（手感更自然）或盐水（破裂后立即可察觉）",
      "放置层次 —— 腺体下、胸大肌下或双平面；影响手感、动态形变与乳腺钼靶成像",
      "切口 —— 乳房下皱襞、乳晕缘或腋窝",
      "脂肪移植 —— 从别处吸脂、处理后注射；长期约有一半容量存活",
    ],
    goodFitEn: [
      "Breast development complete and weight stable",
      "Understands implants require lifelong monitoring and probable future surgery",
      "Wants volume; sagging is a separate problem requiring a lift, not just an implant",
    ],
    goodFitZh: [
      "乳房发育完成、体重稳定",
      "理解假体需要终身随访，且未来很可能需要再次手术",
      "诉求是容量；下垂是另一个问题，需要提升术而不只是放假体",
    ],
    notFitEn: [
      "Pregnancy or breastfeeding currently, or planned in the near term",
      "Untreated breast pathology or an overdue screening",
      "Expecting an implant to correct significant sagging or marked asymmetry on its own",
    ],
    notFitZh: [
      "当前处于妊娠或哺乳期，或近期有此计划",
      "存在未处理的乳腺疾病，或筛查已逾期",
      "指望单靠假体矫正明显下垂或显著不对称",
    ],
    recovery: [
      { whenEn: "Days 1–7", whenZh: "第 1–7 天", whatEn: "Tightness and soreness, more pronounced with submuscular placement. Support bra worn continuously.", whatZh: "紧绷与酸痛，胸大肌下放置更明显。持续穿戴支撑内衣。" },
      { whenEn: "Week 2–6", whenZh: "第 2–6 周", whatEn: "Return to desk work early in this window; no chest exercise or heavy lifting.", whatZh: "此阶段前期可恢复文职工作；禁止胸部锻炼与提重物。" },
      { whenEn: "Month 3–6", whenZh: "第 3–6 个月", whatEn: "Implants settle into position and soften. This is when shape should be judged.", whatZh: "假体就位并变软。形态应以此时为准评估。" },
      { whenEn: "Long term", whenZh: "长期", whatEn: "Periodic imaging is recommended for silicone implants. Plan for eventual revision.", whatZh: "硅胶假体建议定期影像学检查。应为最终的修复手术做好规划。" },
    ],
    risksEn: [
      "Capsular contracture — scar tissue tightening around the implant, causing firmness, distortion or pain",
      "Rupture or leakage, which can be silent with silicone and only found on imaging",
      "Rippling or palpable implant edges, more likely in thin patients or subglandular placement",
      "Changes in nipple and skin sensation, sometimes permanent",
      "BIA-ALCL, a rare lymphoma associated mainly with textured implants — ask which surface type is being used",
      "Effects on breastfeeding and on mammogram interpretation",
    ],
    risksZh: [
      "包膜挛缩 —— 假体周围疤痕组织收缩，导致变硬、变形或疼痛",
      "破裂或渗漏，硅胶可能无症状，仅靠影像检查发现",
      "波纹感或可触及假体边缘，体瘦者或腺体下放置更易出现",
      "乳头与皮肤感觉改变，有时是永久性的",
      "BIA-ALCL，一种主要与毛面假体相关的罕见淋巴瘤 —— 务必问清使用的是哪种表面",
      "对哺乳以及乳腺钼靶判读的影响",
    ],
    askEn: [
      "Which implant brand, surface type and size are you recommending, and why for my anatomy?",
      "What placement do you advise, and how will it affect feel and future imaging?",
      "What is your capsular contracture rate, and what warranty does the manufacturer provide?",
      "Do I need a lift as well as an implant to get the shape I am describing?",
    ],
    askZh: [
      "您推荐哪个品牌、哪种表面、多大规格的假体？针对我的条件为什么选它？",
      "建议放在哪个层次？会如何影响手感和日后影像检查？",
      "您的包膜挛缩发生率是多少？厂家提供什么质保？",
      "要达到我描述的形态，除了假体是否还需要做提升？",
    ],
    priceUsdLow: 3500,
    priceUsdHigh: 10000,
    priceNoteEn:
      "Implant brand and type drive much of the variation. Fat-transfer augmentation is priced differently again because it includes liposuction. Budget separately for the revision surgery that implants will eventually require.",
    priceNoteZh:
      "假体品牌与型号是价格差异的主因。自体脂肪隆胸计价方式不同，因为其中包含吸脂。请另行为假体日后必然需要的修复手术预留预算。",
  },
  {
    slug: "tummy-tuck",
    en: "Tummy Tuck (Abdominoplasty)",
    zh: "腹壁成形（收腹）",
    summaryEn:
      "Removes loose abdominal skin and repairs separated muscle. Leaves a long, permanent hip-to-hip scar.",
    summaryZh:
      "切除腹部松弛皮肤并修复分离的腹直肌。会留下一道横贯两侧髋部的永久疤痕。",
    whatEn:
      "Abdominoplasty removes excess skin and, critically, repairs diastasis recti — the separation of the abdominal muscles that commonly follows pregnancy and does not respond to exercise. It is a considerably bigger operation than liposuction, with a longer recovery and a permanent scar that is traded deliberately for a flat contour. Anyone considering it should be clear that the scar is the price of the result.",
    whatZh:
      "腹壁成形切除多余皮肤，更关键的是修复腹直肌分离 —— 妊娠后常见、且靠锻炼无法改善的问题。它比吸脂大得多，恢复期更长，并留下一道永久疤痕，这是为换取平坦轮廓而有意做出的取舍。考虑做这个手术的人必须清楚：疤痕就是效果的代价。",
    techniquesEn: [
      "Full abdominoplasty — hip-to-hip incision, muscle repair, and the navel is repositioned",
      "Mini abdominoplasty — shorter scar, addresses only skin below the navel, no navel repositioning",
      "Muscle plication — the separated rectus muscles are stitched back together; this is what flattens the profile",
      "Often combined with liposuction of the flanks for a smoother overall shape",
    ],
    techniquesZh: [
      "全腹壁成形 —— 横贯髋部的切口、肌肉修复，肚脐需重新定位",
      "迷你腹壁成形 —— 疤痕更短，只处理脐下皮肤，不重置肚脐",
      "腹直肌折叠 —— 将分离的腹直肌缝合复位；这一步才是让腹部真正变平的关键",
      "常与腰侧吸脂联合，使整体形态更流畅",
    ],
    goodFitEn: [
      "Loose skin and muscle separation after pregnancy or major weight loss",
      "Weight stable for at least six months and no further pregnancies planned",
      "Non-smoker, or able to stop several weeks before and after surgery",
    ],
    goodFitZh: [
      "妊娠后或大幅减重后出现皮肤松弛与腹直肌分离",
      "体重稳定至少六个月，且无再次生育计划",
      "不吸烟，或能在术前术后数周内戒断",
    ],
    notFitEn: [
      "Planning future pregnancy — it will undo the muscle repair",
      "Smoking, which sharply increases wound-healing complications in this operation specifically",
      "Significant untreated obesity or unstable weight",
      "Poorly controlled diabetes or clotting disorders without specialist clearance",
    ],
    notFitZh: [
      "计划将来怀孕 —— 妊娠会破坏已完成的肌肉修复",
      "吸烟，这在本手术中会急剧增加伤口愈合并发症",
      "存在未处理的明显肥胖或体重不稳定",
      "糖尿病控制不佳或凝血功能障碍且未获专科许可",
    ],
    recovery: [
      { whenEn: "Days 1–7", whenZh: "第 1–7 天", whatEn: "Drains usually in place. Walking bent forward is normal. Early mobilisation matters for clot prevention.", whatZh: "通常留置引流管。弯腰行走属正常。尽早下床活动对预防血栓很重要。" },
      { whenEn: "Week 2–4", whenZh: "第 2–4 周", whatEn: "Drains removed; desk work often possible late in this window. Compression binder continues.", whatZh: "拔除引流；此阶段后期通常可恢复文职工作。继续使用腹带。" },
      { whenEn: "Week 6–8", whenZh: "第 6–8 周", whatEn: "Clearance for most exercise. Core training resumes last and gradually.", whatZh: "多数运动获准恢复。核心训练最后恢复，且需循序渐进。" },
      { whenEn: "Month 6–18", whenZh: "第 6–18 个月", whatEn: "The scar matures from red and raised toward flat and pale. It never disappears.", whatZh: "疤痕由红色隆起逐渐变平变淡。但它永远不会消失。" },
    ],
    risksEn: [
      "Seroma — the most frequent complication, often needing repeated drainage",
      "Wound-healing problems and skin necrosis, dramatically more likely in smokers",
      "Deep vein thrombosis and pulmonary embolism; this operation carries a higher risk than most aesthetic surgery",
      "A wide, raised or asymmetric scar, and an unnatural-looking navel",
      "Permanent numbness across the lower abdomen, which is very common",
    ],
    risksZh: [
      "血清肿 —— 最常见的并发症，常需反复引流",
      "伤口愈合障碍与皮肤坏死，吸烟者风险急剧升高",
      "深静脉血栓与肺栓塞；本手术风险高于多数美容手术",
      "疤痕增宽、增生或不对称，以及肚脐外观不自然",
      "下腹部永久性麻木，这非常常见",
    ],
    askEn: [
      "Do I need a full or mini abdominoplasty, and will you repair muscle separation?",
      "Exactly where will the scar sit relative to my usual underwear line?",
      "What is your seroma rate, and how is it managed if I have already flown home?",
      "What thrombosis prevention do you use, and when is it safe for me to fly?",
    ],
    askZh: [
      "我需要做全腹还是迷你腹壁成形？会做腹直肌修复吗？",
      "疤痕的具体位置相对我平常的内衣线在哪里？",
      "您的血清肿发生率是多少？如果我已回国该如何处理？",
      "您采用什么血栓预防措施？我什么时候可以安全乘机？",
    ],
    priceUsdLow: 4000,
    priceUsdHigh: 12000,
    priceNoteEn:
      "Higher end reflects full abdominoplasty with muscle repair, general anaesthesia and inpatient stay. This procedure needs a longer local stay than most — typically 10–14 days before flying — so budget accommodation accordingly.",
    priceNoteZh:
      "上限对应含肌肉修复的全腹壁成形、全身麻醉与住院。本项目所需当地停留比多数项目更长 —— 通常需 10–14 天后才可乘机 —— 住宿预算请据此安排。",
  },
];

export const findTreatment = (slug: string) =>
  TREATMENTS.find((t) => t.slug === slug.toLowerCase());
