import { useRef, useState } from "react";
import { Quote, Star } from "lucide-react";

import PatientStoryDialog from "@/components/PatientStoryDialog";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { patientStories, type PatientStory } from "@/data/patientStories";
import { useAsia } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

const PatientStoriesSection = ({ ambient = false }: { ambient?: boolean }) => {
  const { lang } = useAsia();
  const zh = lang === "zh";
  const text = (en: string, zhText: string) => (zh ? zhText : translatedUiText(lang, en));
  const ageLine = (story: PatientStory) =>
    zh ? `${story.age} 岁 · ${story.countryZh}`
      : lang === "vi" ? `${story.age} tuổi · ${translatedUiText(lang, story.country)}`
        : `${translatedUiText(lang, "Age")} ${story.age} · ${translatedUiText(lang, story.country)}`;
  const [selectedStory, setSelectedStory] = useState<PatientStory | null>(null);
  const [paused, setPaused] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openStory = (story: PatientStory, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelectedStory(story);
  };

  const reviewCard = (story: PatientStory, duplicate = false) => (
    <button
      key={`${duplicate ? "copy" : "review"}-${story.name}`}
      type="button"
      tabIndex={duplicate ? -1 : 0}
      aria-hidden={duplicate || undefined}
      aria-haspopup={duplicate ? undefined : "dialog"}
      aria-label={duplicate ? undefined : zh ? `阅读全文：${story.name}` : `${translatedUiText(lang, "Read full story")}: ${story.name}`}
      onClick={(event) => openStory(story, event.currentTarget)}
      className="group/review flex h-[15.5rem] w-[19rem] shrink-0 flex-col rounded-2xl border border-border/80 bg-card/95 p-5 text-left shadow-[0_8px_24px_rgba(22,63,52,0.08)] backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_14px_34px_rgba(22,63,52,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:h-[16rem] sm:w-[23rem] sm:p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <Quote className="size-5 fill-primary/20 text-primary/75" aria-hidden="true" />
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className="size-4 fill-amber-400 text-amber-400" />
          ))}
        </span>
      </div>
      <blockquote className="mt-5 line-clamp-4 text-[0.95rem] leading-6 text-muted-foreground sm:text-base sm:leading-7">
        “{text(story.excerpt, story.excerptZh)}”
      </blockquote>
      <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm font-semibold text-foreground ring-1 ring-primary/15" aria-hidden="true">
          {story.name.slice(0, 1)}
        </span>
        <span className="min-w-0">
          <span role="heading" aria-level={3} className="block truncate font-display text-sm font-semibold text-foreground">{story.name}</span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{ageLine(story)}</span>
        </span>
      </div>
      <span className="sr-only">{text("Read full story", "阅读全文")}</span>
    </button>
  );

  return (
    <HomeSection
      tone="white"
      ariaLabelledBy="patient-stories-title"
      lang={lang}
      className={ambient ? "overflow-hidden" : "overflow-hidden bg-gradient-hero dark:bg-none"}
    >
      <SectionHeader
        icon={Quote}
        eyebrow={text("Patient stories", "患者故事")}
        titleId="patient-stories-title"
        title={<>{text("400+ patients trust", "400+ 位患者信任")} <em className="not-italic text-brand">CeladonChina</em></>}
      />

      <div
        className="review-motion-viewport relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-hidden py-3"
        role="region"
        aria-label={text("Automatically scrolling patient reviews", "自动滚动的患者评价")}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
      >
        <div className={`review-motion-track flex w-max gap-4 sm:gap-5 ${paused ? "is-paused" : ""}`}>
          <div className="flex gap-4 pl-4 sm:gap-5 sm:pl-6">
            {patientStories.map((story) => reviewCard(story))}
          </div>
          <div className="flex gap-4 pl-4 sm:gap-5 sm:pl-6" aria-hidden="true">
            {patientStories.map((story) => reviewCard(story, true))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent sm:w-20" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent sm:w-20" aria-hidden="true" />
      </div>

      <p className="sr-only">{text("The reviews pause while you hover or focus a card.", "鼠标悬停或聚焦评价卡片时，滚动会暂停。")}</p>
      <PatientStoryDialog
        story={selectedStory}
        zh={zh}
        lang={lang}
        onClose={() => setSelectedStory(null)}
        onReturnFocus={() => triggerRef.current?.focus()}
      />
    </HomeSection>
  );
};

export default PatientStoriesSection;
