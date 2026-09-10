import { useRef, useState } from "react";
import { ArrowRight, Quote } from "lucide-react";

import PatientStoryDialog from "@/components/PatientStoryDialog";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { patientStories, type PatientStory } from "@/data/patientStories";
import { useAsia } from "@/lib/asia-i18n";
import { translatedUiText } from "@/lib/locale-text";

const PatientStoriesSection = ({ ambient = false }: { ambient?: boolean }) => {
  const { lang } = useAsia();
  const zh = lang === "zh";
  // Chinese copy is authored alongside the English; every other language reads the English string through the catalog.
  const text = (en: string, zhText: string) => (zh ? zhText : translatedUiText(lang, en));
  const ageLine = (story: PatientStory) =>
    zh ? `${story.age} 岁 · ${story.countryZh}`
      : lang === "vi" ? `${story.age} tuổi · ${translatedUiText(lang, story.country)}`
        : `${translatedUiText(lang, "Age")} ${story.age} · ${translatedUiText(lang, story.country)}`;
  const [selectedStory, setSelectedStory] = useState<PatientStory | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <HomeSection
      tone="white"
      ariaLabelledBy="patient-stories-title"
      lang={lang}
      // The homepage (ambient) sits on the shared white/sage rhythm; other pages keep their warm gradient band.
      className={ambient ? undefined : "bg-gradient-hero dark:bg-none"}
    >
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
          breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
        }}
        aria-label={text("Patient stories carousel", "患者故事轮播")}
      >
        <SectionHeader
          icon={Quote}
          eyebrow={text("Patient stories", "患者故事")}
          titleId="patient-stories-title"
          title={<>{text("400+ patients trust", "400+ 位患者信任")} <em className="not-italic text-brand">CeladonChina</em></>}
          action={
            <>
              <CarouselPrevious
                className="!static !size-11 !translate-y-0 border-border bg-card text-foreground shadow-none hover:bg-secondary dark:hover:bg-muted hover:text-foreground focus-visible:ring-foreground disabled:opacity-35 motion-reduce:transition-none"
                aria-label={text("View previous patient", "查看上一位患者")}
              />
              <CarouselNext
                className="!static !size-11 !translate-y-0 border-border bg-card text-foreground shadow-none hover:bg-secondary dark:hover:bg-muted hover:text-foreground focus-visible:ring-foreground disabled:opacity-35 motion-reduce:transition-none"
                aria-label={text("View next patient", "查看下一位患者")}
              />
            </>
          }
        />

        <CarouselContent className="-ml-4 pb-4 pt-1 sm:-ml-6">
          {patientStories.map((story) => (
            <CarouselItem key={story.name} className="basis-[calc(100%-2rem)] pl-4 sm:basis-1/2 sm:pl-6 lg:basis-1/3">
              <article className="home-story-card flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft lg:min-h-[336px]">
                <blockquote className="flex-1 text-lg font-medium leading-normal text-foreground">
                  <p>“{text(story.excerpt, story.excerptZh)}”</p>
                </blockquote>

                <div className="mt-6 flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary dark:bg-muted text-sm font-semibold text-foreground" aria-hidden="true">
                    {story.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[15px] font-semibold leading-snug text-foreground">{story.name}</h3>
                    <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                      {ageLine(story)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={zh ? `阅读全文：${story.name}` : `${translatedUiText(lang, "Read full story")}: ${story.name}`}
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setSelectedStory(story);
                  }}
                  className="mt-5 flex min-h-11 w-full items-center justify-between gap-3 rounded-full border border-border px-4 py-2 text-start text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-secondary dark:hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  {text("Read full story", "阅读全文")}
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </button>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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
