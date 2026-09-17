import { useEffect, useRef, useState } from "react";
import { ArrowRight, Quote } from "lucide-react";

import PatientStoryDialog from "@/components/PatientStoryDialog";
import { HomeSection } from "@/components/home/HomeSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const updateSelected = () => setSelectedIndex(carouselApi.selectedScrollSnap());
    updateSelected();
    carouselApi.on("select", updateSelected);
    carouselApi.on("reInit", updateSelected);
    return () => {
      carouselApi.off("select", updateSelected);
      carouselApi.off("reInit", updateSelected);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi || autoplayPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => carouselApi.scrollNext(), 5500);
    return () => window.clearInterval(timer);
  }, [autoplayPaused, carouselApi, selectedIndex]);

  return (
    <HomeSection
      tone="white"
      ariaLabelledBy="patient-stories-title"
      lang={lang}
      // The homepage (ambient) sits on the shared white/sage rhythm; other pages keep their warm gradient band.
      className={ambient ? undefined : "bg-gradient-hero dark:bg-none"}
    >
      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "center",
          loop: true,
          slidesToScroll: 1,
          breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
        }}
        onMouseEnter={() => setAutoplayPaused(true)}
        onMouseLeave={() => setAutoplayPaused(false)}
        onFocusCapture={() => setAutoplayPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAutoplayPaused(false);
        }}
        aria-label={text("Patient stories carousel", "患者故事轮播")}
      >
        <SectionHeader
          icon={Quote}
          eyebrow={text("Patient stories", "患者故事")}
          titleId="patient-stories-title"
          title={<>{text("400+ patients trust", "400+ 位患者信任")} <em className="not-italic text-brand">CeladonChina</em></>}
        />

        <div className="relative mx-auto mt-2 max-w-6xl px-0 sm:px-14 lg:px-20">
          <CarouselContent className="ml-0">
          {patientStories.map((story, index) => (
            <CarouselItem key={story.name} className="pl-0" aria-label={`${story.name}, ${index + 1} / ${patientStories.length}`}>
              <article className="mx-auto flex min-h-[390px] max-w-4xl flex-col items-center justify-center px-5 py-9 text-center sm:min-h-[430px] sm:px-12 sm:py-12">
                <span className="grid size-[4.5rem] place-items-center rounded-full border border-primary/30 bg-secondary text-xl font-semibold text-foreground shadow-[0_12px_35px_rgba(22,63,52,0.10)]" aria-hidden="true">
                  {story.name.slice(0, 1)}
                </span>

                <span className="mt-6 inline-flex items-center gap-2 text-brand" aria-hidden="true">
                  <span className="h-px w-8 bg-primary/35" />
                  <Quote className="size-5 fill-primary/10" />
                  <span className="h-px w-8 bg-primary/35" />
                </span>

                <blockquote className="mt-5 max-w-3xl font-display text-xl font-medium leading-[1.55] text-foreground sm:text-2xl md:text-[1.75rem]">
                  <p>“{text(story.excerpt, story.excerptZh)}”</p>
                </blockquote>

                <div className="mt-7">
                  <h3 className="font-display text-lg font-semibold leading-snug text-foreground">{story.name}</h3>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">{ageLine(story)}</p>
                </div>

                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={zh ? `阅读全文：${story.name}` : `${translatedUiText(lang, "Read full story")}: ${story.name}`}
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setSelectedStory(story);
                  }}
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground shadow-sm transition-[background-color,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {text("Read full story", "阅读全文")}
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </button>
              </article>
            </CarouselItem>
          ))}
          </CarouselContent>

          <CarouselPrevious
            className="!left-1 !top-1/2 !size-11 border-border bg-card text-foreground shadow-[0_8px_24px_rgba(22,63,52,0.10)] hover:bg-secondary hover:text-foreground focus-visible:ring-foreground disabled:opacity-35 motion-reduce:transition-none sm:!left-2"
            aria-label={text("View previous patient", "查看上一位患者")}
          />
          <CarouselNext
            className="!right-1 !top-1/2 !size-11 border-border bg-card text-foreground shadow-[0_8px_24px_rgba(22,63,52,0.10)] hover:bg-secondary hover:text-foreground focus-visible:ring-foreground disabled:opacity-35 motion-reduce:transition-none sm:!right-2"
            aria-label={text("View next patient", "查看下一位患者")}
          />
        </div>

        <div className="mt-1 flex items-center justify-center gap-2" role="tablist" aria-label={text("Choose a patient story", "选择患者故事")}>
          {patientStories.map((story, index) => (
            <button
              key={story.name}
              type="button"
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={zh ? `查看第 ${index + 1} 个患者故事` : `${translatedUiText(lang, "View patient story")} ${index + 1}`}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none ${selectedIndex === index ? "w-7 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/40"}`}
            />
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {text("Patient story", "患者故事")} {selectedIndex + 1} / {patientStories.length}
        </p>
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
