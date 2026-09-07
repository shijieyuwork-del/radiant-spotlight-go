import { Quote } from "lucide-react";

import { useAsia } from "@/lib/asia-i18n";

type PatientStory = {
  name: string;
  age: number;
  country: string;
  countryZh: string;
  procedure?: string;
  procedureZh?: string;
  story: string[];
  storyZh: string[];
};

const patientStories: PatientStory[] = [
  {
    name: "Angela M.",
    age: 31,
    country: "United States",
    countryZh: "美国",
    story: [
      "I had always wanted to visit China, and CeladonChina helped me combine that trip with rhinoplasty, double-eyelid surgery and lip enhancement.",
      "A coordinator met me at the airport with a sign bearing my name and flowers, then supported me through the consultation, interpretation and recovery. I felt safe and cared for while still getting to enjoy Shanghai.",
    ],
    storyZh: [
      "我一直想去中国旅行，CeladonChina 帮我把这趟旅程与隆鼻、双眼皮和丰唇项目安排在一起。",
      "落地时，协调员举着写有我名字的接机牌和鲜花迎接我，之后陪我完成面诊、翻译和恢复安排。整个过程安心又温暖，我也能在休养中感受上海。",
    ],
  },
  {
    name: "Rob C.",
    age: 38,
    country: "Canada",
    countryZh: "加拿大",
    story: [
      "A friend had a great hair transplant result in China, but his travel and language difficulties made me hesitate. CeladonChina introduced me to several established clinic groups, so I could compare options by budget and priorities.",
      "They arranged airport transfers, interpretation and hotel booking at no charge. I am still recovering, but I can already see the difference. Their support made the decision and the journey much easier.",
    ],
    storyZh: [
      "朋友在中国做植发的效果很好，但他遇到的出行和语言问题让我一直犹豫。CeladonChina 推荐了几家成熟的连锁植发机构，让我可以按预算和需求比较。",
      "他们还免费安排接送、翻译和酒店预订。我仍在恢复期，但已经能看到变化。有了这些支持，做决定和完成旅程都轻松了许多。",
    ],
  },
  {
    name: "Valerie C.",
    age: 27,
    country: "Malaysia",
    countryZh: "马来西亚",
    story: [
      "I love the natural, refined look of Korean cosmetic medicine, but I assumed CeladonChina only worked with doctors in China. They matched me with a Korean doctor whose aesthetic approach felt right and booked him two months ahead during his China visit.",
      "Two months after double-eyelid surgery, the shape looks natural and has nearly settled. Friends say I look brighter and more refreshed. I love the result and feel much more confident.",
    ],
    storyZh: [
      "我喜欢韩式医美自然精致的风格，但原以为 CeladonChina 只对接中国医生。他们根据我的审美匹配了一位韩国医生，并提前两个月预约了医生来中国出诊的时间。",
      "双眼皮术后两个月，形态已经基本稳定，看起来很自然。朋友们都说我更漂亮、更有精神，这次改变也让我找回了更多自信。",
    ],
  },
  {
    name: "Sofia R.",
    age: 34,
    country: "Spain",
    countryZh: "西班牙",
    procedure: "Rhinoplasty",
    procedureZh: "鼻整形",
    story: [
      "I had been considering rhinoplasty for nearly five years, but arranging surgery abroad always felt overwhelming. I had questions about the doctor’s experience, the recovery timeline and what would happen if I needed help after returning home.",
      "CeladonChina first asked me to send photos from the front, side and three-quarter angles. Within four days, they came back with recommendations from two surgeons in Shanghai, including estimated costs, available dates and examples of similar cases. I chose a doctor whose approach was subtle and focused on preserving my natural features.",
      "A coordinator met me at Pudong Airport and helped me check into a hotel about ten minutes from the hospital. At the consultation, the interpreter stayed throughout the discussion and made sure I understood the surgical plan. I never felt rushed into making a decision.",
      "The first three days after surgery were uncomfortable, but the team checked on me every morning and arranged an extra hospital visit when the swelling around my left eye worried me. The doctor confirmed that it was normal and showed me how to use the cold compress correctly.",
      "It has now been six months. My nose looks more balanced from the side, but I still look like myself. That was exactly the result I wanted.",
    ],
    storyZh: [
      "我考虑鼻整形已经快五年了，但去国外安排手术一直让我觉得很复杂。我担心医生经验、恢复周期，以及回国后如果需要帮助该怎么办。",
      "CeladonChina 根据我不同角度的照片，在四天内推荐了两位上海医生，并提供预估费用、可预约日期和相似案例。我最终选择了一位风格克制、注重保留自然特征的医生。",
      "协调员在浦东机场接到我并协助入住医院附近的酒店。面诊时翻译全程陪同，术后团队每天了解我的情况，还在我担心眼周肿胀时额外安排了复诊。",
      "六个月后，我的鼻子从侧面看更协调，但仍然像我自己。这正是我想要的结果。",
    ],
  },
  {
    name: "Daniel K.",
    age: 42,
    country: "Australia",
    countryZh: "澳大利亚",
    procedure: "Hair transplant",
    procedureZh: "植发",
    story: [
      "My hairline had been receding since my early thirties. I had spoken with clinics in Australia and Turkey, but I struggled to compare the techniques, graft estimates and final prices because every clinic presented the information differently.",
      "CeladonChina arranged three online assessments and placed the proposals into one clear comparison. One clinic suggested 2,800 grafts, while another recommended closer to 3,400. After discussing the density I wanted and the limits of my donor area, I selected a clinic in Beijing that proposed 3,050 grafts using an FUE procedure.",
      "The procedure took most of the day. The interpreter was present during the hairline design and returned before I was discharged to review the medication and washing instructions. For the first wash, a coordinator accompanied me back to the clinic and recorded the nurse’s demonstration on my phone so I could follow the same steps at the hotel.",
      "I experienced redness and shedding during the first month, which the doctor had warned me about. The team continued checking my progress through monthly photos after I returned to Melbourne.",
      "At nine months, the front looks noticeably fuller and the new hairline suits my face. The result developed slowly, but having someone available for questions made the waiting period much less stressful.",
    ],
    storyZh: [
      "从三十岁出头开始，我的发际线就不断后退。咨询不同国家的诊所后，我发现技术、毛囊单位预估和最终价格很难直接比较。",
      "CeladonChina 安排了三次线上评估，并把方案整理成清晰对比。在讨论理想密度和供区条件后，我选择了北京一家建议采用 FUE 移植 3,050 个毛囊单位的诊所。",
      "翻译陪同发际线设计，并在离院前确认用药和清洗说明。第一次清洗时，协调员还陪我返回诊所并录下护士的示范。回到墨尔本后，团队继续通过每月照片了解恢复进度。",
      "九个月后，前额明显更浓密，新发际线也很适合我的脸型。等待期间随时有人解答问题，让整个过程轻松了很多。",
    ],
  },
  {
    name: "Mina L.",
    age: 29,
    country: "Singapore",
    countryZh: "新加坡",
    procedure: "Double-eyelid surgery",
    procedureZh: "双眼皮手术",
    story: [
      "I wanted a small, natural crease rather than a dramatic change. My main concern was communicating that preference clearly, especially because many before-and-after photos online showed a style that felt too wide for me.",
      "Before I booked my trip, CeladonChina arranged a video consultation with a Korean surgeon who visits Hangzhou regularly. I showed him photos of how my eyelids looked with temporary tape and explained that I did not want the crease to be obvious when my eyes were closed.",
      "The appointment was scheduled six weeks in advance to match the dates of his visit. On the morning of surgery, the interpreter helped me review the crease height again and confirmed that the doctor planned a conservative design. The procedure took a little over an hour, and I returned to the clinic five days later to have the stitches removed.",
      "For the first week, one eye was more swollen than the other. The coordinator asked me to send a photo each morning and checked it with the nurse. By the third week, the difference had become much less noticeable.",
      "Four months later, the crease is soft and visible without looking artificial. My makeup takes less time, but the change is subtle enough that most people simply tell me I look more rested.",
    ],
    storyZh: [
      "我想要的是窄而自然的褶皱，而不是明显的改变，最担心的是无法准确表达这种偏好。",
      "预订行程前，CeladonChina 为我安排了一位定期到杭州出诊的韩国医生进行视频面诊。我展示了使用双眼皮贴时的照片，并说明闭眼时不希望褶皱过于明显。",
      "手术提前六周预约。当天翻译协助我再次确认褶皱高度和保守设计。第一周两侧肿胀程度不同，协调员让我每天发送照片并与护士确认恢复情况。",
      "四个月后，褶皱柔和自然。化妆时间更短了，但变化很细微，大多数人只是说我看起来更有精神。",
    ],
  },
  {
    name: "Claire B.",
    age: 37,
    country: "United Kingdom",
    countryZh: "英国",
    procedure: "Dental veneers",
    procedureZh: "牙齿贴面",
    story: [
      "I damaged one of my front teeth in a cycling accident several years ago. Over time, the repaired tooth became darker than the others, and I began avoiding wide smiles in photographs.",
      "I contacted CeladonChina while planning a twelve-day trip to Shanghai. They explained that veneers should not be treated as a single quick appointment and built the schedule around an initial examination, tooth preparation, temporary veneers and a final fitting.",
      "The dentist recommended four ceramic veneers rather than treating only the damaged tooth, because matching its colour perfectly to the surrounding teeth would have been difficult. Before proceeding, I received digital previews in two shades. I chose the warmer, less opaque option because it looked closer to natural enamel.",
      "The temporary veneers felt slightly bulky, so the clinic adjusted the edges the following day. At the final fitting, the dentist checked my bite several times and shortened one veneer by a fraction before bonding it permanently.",
      "The entire process took nine days. Six months later, I can eat normally, the colour still looks natural in daylight and the repaired tooth no longer stands out. The result is not an unnaturally perfect smile—it simply feels like my own smile again.",
    ],
    storyZh: [
      "几年前的一次骑行事故损伤了我的一颗门牙。随着时间推移，修复过的牙齿颜色变深，我开始避免在照片里大笑。",
      "计划十二天的上海之旅时，我联系了 CeladonChina。他们围绕初诊检查、牙体预备、临时贴面和最终试戴安排了完整行程。",
      "牙医建议做四颗全瓷贴面，以便更自然地匹配周围牙齿。我查看了两种色调的数字预览，选择了更温暖、更接近天然牙釉质的方案。临时贴面和最终咬合也经过了细致调整。",
      "整个过程用了九天。六个月后，我可以正常进食，颜色在自然光下依旧自然。这不是不真实的完美笑容，而是让我重新拥有了自己的笑容。",
    ],
  },
  {
    name: "Marcus T.",
    age: 46,
    country: "United States",
    countryZh: "美国",
    procedure: "Lower-eyelid treatment",
    procedureZh: "下眼睑治疗",
    story: [
      "The bags beneath my eyes had become more noticeable after several years of irregular sleep and frequent business travel. I looked tired even when I felt well, but I was concerned that surgery might change my expression.",
      "CeladonChina arranged consultations with two doctors in Guangzhou. One recommended filler, while the second explained that filler could make the area look heavier because I already had prominent fat pads. He suggested lower blepharoplasty with a small amount of fat repositioning instead.",
      "I appreciated that the coordinator did not push me toward the cheaper or faster option. She translated both doctors’ explanations and helped me prepare a list of questions about scarring, dry eyes and how soon I could fly home.",
      "After surgery, I stayed in Guangzhou for eleven days. The swelling was strongest on the second and third days, and I had temporary tightness when looking upward. The clinic examined me twice before approving my return flight and provided written aftercare instructions in English.",
      "Five months later, the under-eye area looks smoother, but my expression has not changed. Colleagues have commented that I look healthier without immediately guessing that I had a procedure.",
    ],
    storyZh: [
      "几年不规律睡眠和频繁出差后，我的眼袋更加明显。即使精神不错，看起来也很疲惫，但我担心手术会改变自己的表情。",
      "CeladonChina 为我安排了广州两位医生的面诊。一位建议填充，另一位认为填充可能让眼下更厚重，建议采用下眼睑手术并进行少量脂肪重新定位。",
      "协调员没有把我推向更便宜或更快的方案，而是翻译两位医生的解释，并帮我整理关于疤痕、干眼和返程飞行的问题。术后诊所做了两次检查才批准我乘机回国。",
      "五个月后，眼下区域更加平整，但我的表情没有改变。同事们说我看起来更健康，却不会马上猜到我做过治疗。",
    ],
  },
  {
    name: "Noor A.",
    age: 32,
    country: "United Arab Emirates",
    countryZh: "阿联酋",
    procedure: "Skin treatment program",
    procedureZh: "皮肤治疗方案",
    story: [
      "I originally contacted CeladonChina about pigmentation on my cheeks that had become darker after pregnancy. I expected to book a laser session, but the dermatologist advised against starting with an aggressive treatment because my skin develops dark marks easily after irritation.",
      "Instead, the clinic proposed a three-month plan: a gentle in-clinic treatment during my visit to Shenzhen, daily sunscreen and a prescription skincare routine that I could continue at home. The coordinator translated every product label and created a simple morning-and-evening schedule for me.",
      "During the first two weeks, my skin felt dry and slightly sensitive. I sent photographs to the team, and the dermatologist adjusted how often I used one of the products. That small change made the routine much easier to tolerate.",
      "The pigmentation did not disappear overnight. I began noticing a difference after about six weeks, particularly around the edges of the darker patches. At the three-month review, my skin tone looked more even and I was using less concealer.",
      "What impressed me most was the realistic advice. The clinic did not promise perfect skin or encourage me to book unnecessary procedures. I felt that the plan was designed around my skin rather than around selling a treatment.",
    ],
    storyZh: [
      "我最初联系 CeladonChina，是因为怀孕后脸颊色素沉着变深。我原本以为会预约激光治疗，但皮肤科医生认为我的皮肤受刺激后容易留下深色印记，不建议一开始就采用激进治疗。",
      "诊所制定了三个月方案：在深圳期间接受一次温和的院内治疗、每天防晒，并在家继续处方护肤方案。协调员翻译了每件产品的标签，还整理了简单的早晚使用计划。",
      "前两周皮肤有些干燥和敏感。根据我发送的照片，医生调整了其中一种产品的使用频率。大约六周后我开始看到变化，三个月复查时肤色更加均匀。",
      "最打动我的是现实的建议。诊所没有承诺完美皮肤，也没有鼓励我预约不必要的项目。这个方案是围绕我的皮肤制定，而不是为了销售治疗。",
    ],
  },
];

const PatientStoriesSection = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";

  return (
    <section className="border-t border-border/70 bg-background py-16 sm:py-20 md:py-24" aria-labelledby="patient-stories-title">
      <div className="container">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end md:gap-16">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-primary">
              <Quote className="size-4 fill-primary/15" aria-hidden="true" />
              {zh ? "真实患者经历" : "Patient stories"}
            </span>
            <h2 id="patient-stories-title" className="mt-4 font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
              {zh ? "他们的中国医美旅程" : "Care that travels with you."}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground md:justify-self-end">
            {zh
              ? "从第一次咨询、抵达中国，到治疗与恢复，400+ 位患者选择由 CeladonChina 陪伴他们完成整个旅程。"
              : "From the first conversation and arrival in China to treatment and recovery, 400+ patients have trusted CeladonChina to support their journey."}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {patientStories.map((story, index) => {
            const paragraphs = zh ? story.storyZh : story.story;
            return (
              <article
                key={story.name}
                className="group relative flex h-full flex-col overflow-hidden rounded-[8px] border border-primary/15 bg-card p-6 shadow-soft transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-pop sm:p-8"
              >
                <span className="pointer-events-none absolute -right-1 -top-7 select-none font-display text-[8rem] font-medium leading-none text-primary/10 transition-colors duration-500 group-hover:text-primary/15" aria-hidden="true">
                  “
                </span>

                <div className="relative flex items-center gap-4 border-b border-primary/10 pb-6">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-[8px] border border-primary/15 bg-secondary text-lg font-bold text-foreground shadow-sm" aria-hidden="true">
                    {story.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl font-medium leading-tight text-foreground">{story.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase text-muted-foreground">
                      {zh ? `${story.age} 岁 · ${story.countryZh}` : `Age ${story.age} · ${story.country}`}
                    </p>
                    {story.procedure && (
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                        {zh ? story.procedureZh : story.procedure}
                      </p>
                    )}
                  </div>
                  <span className="self-start text-sm font-bold text-primary/55" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <blockquote className="relative mt-7 flex-1 space-y-5 text-[15px] leading-7 text-foreground/75">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </blockquote>

                <div className="mt-8 h-1 w-12 rounded-full bg-primary/45 transition-all duration-500 group-hover:w-20 group-hover:bg-primary" aria-hidden="true" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PatientStoriesSection;
