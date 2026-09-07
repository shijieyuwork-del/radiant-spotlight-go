import { Quote } from "lucide-react";

import { useAsia } from "@/lib/asia-i18n";

type PatientStory = {
  name: string;
  age: number;
  country: string;
  countryZh: string;
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
      "I had always wanted to travel to China. When I came across CeladonChina, I realized I could finally plan the cosmetic treatments I had been considering alongside the trip.",
      "The whole experience was smoother than I expected. When I arrived, a Celadon coordinator was waiting with a sign bearing my name and flowers—a thoughtful welcome that meant a lot in an unfamiliar city. The following day, they accompanied me to meet the doctor, and I went ahead with rhinoplasty, double-eyelid surgery and lip enhancement.",
      "During recovery, Celadon arranged gentle outings to parks around Shanghai, so I could rest while still experiencing the city. I barely encountered any language barriers; the interpreter was professional, patient and made me feel cared for and secure throughout.",
      "This trip fulfilled my dream of visiting China and gave me the change I had long hoped for. It felt easy, reassuring and far warmer than I imagined.",
    ],
    storyZh: [
      "我一直想去中国旅行，偶然发现了这个平台，才意识到可以在旅行的同时，把一直想做的医美项目也安排上。",
      "整个过程比我想象中顺利得多。落地时，Celadon 的工作人员举着写有我名字的接机牌，还准备了鲜花，让刚到陌生城市的我特别感动。第二天，他们便陪我完成了医生面诊，并顺利进行了隆鼻、双眼皮和丰唇项目。",
      "恢复期间，Celadon 还贴心地为我安排了上海的公园和轻松行程，让我可以一边休养，一边感受这座城市。整个过程中，我几乎没有遇到任何语言沟通上的困难，翻译人员既专业又耐心，给了我很多照顾和安全感。",
      "这次经历不仅圆了我的中国旅行梦，也让我完成了期待已久的改变，整个旅程轻松、安心，也比想象中更加温暖。",
    ],
  },
  {
    name: "Rob C.",
    age: 38,
    country: "Canada",
    countryZh: "加拿大",
    story: [
      "A friend of mine had a hair transplant in China with excellent results, but he also ran into travel-service problems, including difficulty getting around and language barriers. That led me to CeladonChina while researching services on Google.",
      "I was surprised to learn that they provide airport transfers, interpretation and hotel-booking support at no charge. They also introduced me to several established hair-transplant groups with clinics across China, so I could compare options based on my budget and priorities.",
      "I am still in recovery, but I can already see a noticeable difference in my appearance. Without CeladonChina, the cost questions and travel complications would probably have kept me hesitating for several more years.",
      "Thank you, CeladonChina, for making the whole experience easier, safer and much smoother than I expected.",
    ],
    storyZh: [
      "我有个朋友去中国做了植发，效果非常好，但他也遇到了不少行程服务方面的问题，比如打车不方便、语言沟通困难等。因此，我在 Google 上搜索相关服务时发现了 CeladonChina。",
      "让我惊喜的是，他们免费提供接送、翻译和酒店预订等服务，还为我推荐了几家在中国拥有多家分院的植发机构，让我可以根据预算和需求进行比较和选择。",
      "虽然我目前还处于恢复期，但已经能明显感受到外形上的变化。如果没有 CeladonChina 的帮助，考虑到价格和各种行程上的不便，我可能还要再犹豫好几年才会真正决定去做植发。",
      "感谢 CeladonChina，让整个过程比我想象中轻松、安心，也更顺利！",
    ],
  },
  {
    name: "Valerie C.",
    age: 27,
    country: "Malaysia",
    countryZh: "马来西亚",
    story: [
      "I am a K-pop fan and have always loved the naturally refined, slightly doll-like aesthetic often associated with Korean cosmetic medicine. Because I travel to China frequently, I had known about CeladonChina for some time. I did not expect much when I first mentioned the idea—I assumed they only worked with providers based in China. To my surprise, they explained that they also collaborate with many well-known Korean doctors.",
      "Popular doctors can be difficult to book in Korea, but some occasionally visit China to see patients. CeladonChina booked me with a Korean doctor whose aesthetic approach matched mine, two months in advance, and arranged my double-eyelid surgery during his visit to China.",
      "It has now been two months since surgery. My eyelids look very natural and the shape has largely settled. Friends say the change is noticeable: I look prettier, brighter and more refreshed.",
      "I am genuinely delighted with the experience. CeladonChina helped me achieve a change I had wanted for a long time and regain confidence. For me, it feels like a new beginning. I am deeply grateful to CeladonChina.",
    ],
    storyZh: [
      "我是一个 K-pop 粉丝，也一直很喜欢韩国那种自然精致、又带一点芭比感的医美风格。我经常往返中国，所以一直了解 CeladonChina 这个平台。刚和 CeladonChina 提起这个想法时，我其实没抱太大希望，因为我原以为他们只提供中国本土的医美服务。让我惊喜的是，CeladonChina 告诉我，他们还对接了许多韩国知名医生。",
      "一些热门医生在韩国很难预约，但偶尔会来中国出诊。CeladonChina 提前两个月帮我预约到了一位审美理念与我非常契合的韩国医生，并安排我在他来中国出诊期间完成了双眼皮手术。",
      "现在术后已经两个月了，我的双眼皮恢复得非常自然，形态也基本稳定。身边的朋友都说我的变化很明显，整个人不仅漂亮了许多，看起来也更有精神。",
      "我对这次体验真的非常满意。CeladonChina 不仅帮我实现了期待已久的改变，也让我找回了更多自信——对我来说，这就像一次新生。真的非常感谢 CeladonChina！",
    ],
  },
];

const PatientStoriesSection = () => {
  const { lang } = useAsia();
  const zh = lang === "zh";

  return (
    <section className="border-t border-border/70 bg-card/45 py-14 sm:py-16 md:py-20" aria-labelledby="patient-stories-title">
      <div className="container">
        <div className="grid gap-6 border-b border-border/80 pb-8 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Quote className="size-4" aria-hidden="true" />
              {zh ? "真实患者经历" : "Patient stories"}
            </span>
            <h2 id="patient-stories-title" className="mt-3 font-display text-4xl font-medium leading-[1.03] tracking-tight sm:text-5xl">
              {zh ? "他们的中国医美旅程" : "Care that travels with you."}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {zh
              ? "从第一次咨询、抵达中国，到治疗与恢复，听三位患者讲述 CeladonChina 如何陪伴他们完成整个旅程。"
              : "From the first conversation and arrival in China to treatment and recovery, three patients share how CeladonChina supported their journey."}
          </p>
        </div>

        <div className="divide-y divide-border/80 lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {patientStories.map((story, index) => {
            const paragraphs = zh ? story.storyZh : story.story;
            return (
              <article key={story.name} className="py-8 first:pt-8 lg:px-7 lg:py-10 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-medium leading-none">{story.name}</h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {zh ? `${story.age} 岁 · ${story.countryZh}` : `Age ${story.age} · ${story.country}`}
                    </p>
                  </div>
                  <span className="font-display text-5xl leading-none text-primary/15" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <blockquote className="mt-6 space-y-4 border-l-2 border-primary/25 pl-5 text-[15px] leading-7 text-foreground/75">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </blockquote>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PatientStoriesSection;
