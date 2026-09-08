import { useRef, useState } from "react";
import { ArrowRight, Quote } from "lucide-react";

import PatientStoryDialog from "@/components/PatientStoryDialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { patientStories, type PatientStory } from "@/data/patientStories";
import { useAsia } from "@/lib/asia-i18n";

const PatientStoriesSection = ({ ambient = false }: { ambient?: boolean }) => {
  const { lang } = useAsia();
  const zh = lang === "zh";
  const [selectedStory, setSelectedStory] = useState<PatientStory | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section
      className={`${ambient ? "patient-stories-ambient" : "bg-gradient-hero dark:bg-none"} py-12 sm:py-16`}
      aria-labelledby="patient-stories-title"
      lang={zh ? "zh" : "en"}
    >
      <div className="container">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
            breakpoints: { "(prefers-reduced-motion: reduce)": { duration: 0 } },
          }}
          aria-label={zh ? "患者故事轮播" : "Patient stories carousel"}
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-5 md:mb-8">
            <div className="min-w-0 max-w-4xl">
              <span className="pill mb-3 bg-card text-foreground">
                <Quote className="size-3.5 text-primary" aria-hidden="true" />
                {zh ? "患者故事" : "Patient stories"}
              </span>
              <h2 id="patient-stories-title" className="font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
                {zh ? "400+ 位患者信任 CeladonChina。" : "400+ patients trust CeladonChina."}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <CarouselPrevious
                className="!static !size-11 !translate-y-0 border-border bg-card text-foreground shadow-none hover:bg-secondary dark:hover:bg-muted hover:text-foreground focus-visible:ring-foreground disabled:opacity-35 motion-reduce:transition-none"
                aria-label={zh ? "查看上一位患者" : "View previous patient"}
              />
              <CarouselNext
                className="!static !size-11 !translate-y-0 border-border bg-card text-foreground shadow-none hover:bg-secondary dark:hover:bg-muted hover:text-foreground focus-visible:ring-foreground disabled:opacity-35 motion-reduce:transition-none"
                aria-label={zh ? "查看下一位患者" : "View next patient"}
              />
            </div>
          </div>

          <CarouselContent className="-ml-4 pb-4 pt-1 sm:-ml-6">
            {patientStories.map((story) => (
              <CarouselItem key={story.name} className="basis-[calc(100%-2rem)] pl-4 sm:basis-1/2 sm:pl-6 lg:basis-1/3">
                <article className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
                  <blockquote className="flex-1 text-lg font-medium leading-normal text-foreground lg:text-xl">
                    <p>“{zh ? story.excerptZh : story.excerpt}”</p>
                  </blockquote>

                  <div className="mt-8 flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary dark:bg-muted text-sm font-semibold text-foreground" aria-hidden="true">
                      {story.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-semibold leading-normal text-foreground">{story.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {zh ? `${story.age} 岁 · ${story.countryZh}` : `Age ${story.age} · ${story.country}`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={zh ? `阅读全文：${story.name}` : `Read full story: ${story.name}`}
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setSelectedStory(story);
                    }}
                    className="mt-5 flex min-h-11 w-full items-center justify-between gap-3 rounded-full border border-border px-4 py-2 text-start text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-secondary dark:hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
                  >
                    {zh ? "阅读全文" : "Read full story"}
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </button>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <PatientStoryDialog
        story={selectedStory}
        zh={zh}
        onClose={() => setSelectedStory(null)}
        onReturnFocus={() => triggerRef.current?.focus()}
      />
    </section>
  );
};

export default PatientStoriesSection;
