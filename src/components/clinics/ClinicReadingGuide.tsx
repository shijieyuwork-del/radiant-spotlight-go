import { useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { getClinicReadingGuide, type ClinicChapter } from "@/lib/clinic-reading-guide";
import { RodeoMedicalTeam } from "./RodeoMedicalTeam";

type Props = {
  description: string;
  language: string;
  chapters: ClinicChapter[];
  intro: ReactNode;
  renderBlocks: (blocks: string[]) => ReactNode;
};

/** Native disclosure keeps every paragraph in the HTML and works without JavaScript. */
export function ClinicReadingGuide({ description, language, chapters, intro, renderBlocks }: Props) {
  const guide = getClinicReadingGuide(description, chapters, language);
  const disclosures = useRef<HTMLDivElement>(null);
  const [allOpen, setAllOpen] = useState(false);
  function updateOpenState() {
    const items = Array.from(disclosures.current?.querySelectorAll("details") ?? []);
    setAllOpen(items.length > 0 && items.every((item) => item.open));
  }
  function toggleAll() {
    const items = Array.from(disclosures.current?.querySelectorAll("details") ?? []);
    const nextOpen = !items.every((item) => item.open);
    items.forEach((item) => { item.open = nextOpen; });
    setAllOpen(nextOpen);
  }

  return <div className="clinic-reading-guide mt-5 space-y-7 text-base leading-relaxed text-foreground" lang={language === "zh" ? "zh-CN" : "en"}>
    <div className="space-y-5 rounded-2xl bg-primary/5 p-5 sm:p-6">
      <h3 className="text-xl font-semibold leading-snug">{guide.title}</h3>
      <div className="reading-copy max-w-prose space-y-4">{guide.summary ? <p>{guide.summary}</p> : intro}</div>
      {guide.facts.length > 0 && <dl className="grid gap-5 sm:grid-cols-3">
        {guide.facts.map(([label, value]) => <div key={label} className="min-w-0 space-y-1">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="font-semibold leading-normal">{value}</dd>
        </div>)}
      </dl>}
    </div>

    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm leading-relaxed text-muted-foreground">{guide.prompt}</p>
        <button type="button" onClick={toggleAll} className="min-h-11 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
          {allOpen ? guide.collapse : guide.expand}
        </button>
      </div>
      <div ref={disclosures} className="space-y-3">
        {guide.groups.map((group) => <details key={group.title} onToggle={updateOpenState} className="group rounded-xl border border-primary/20 bg-background open:border-primary/40">
          <summary className="cursor-pointer list-none rounded-xl px-5 py-5 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [&::-webkit-details-marker]:hidden sm:px-6">
            <h3 className="flex items-center justify-between gap-4 text-lg font-semibold leading-snug">
              <span className="min-w-0 break-words">
                {group.title}
                {group.hint && <span className="mt-1.5 block text-sm font-normal leading-relaxed tracking-normal text-muted-foreground">{group.hint}</span>}
              </span>
              <ChevronDown className="size-5 shrink-0 group-open:rotate-180" aria-hidden="true" />
            </h3>
          </summary>
          <div className="reading-copy space-y-7 px-5 pb-6 pt-2 sm:px-6">
            {group.includesIntro && <div className="max-w-prose space-y-4">{intro}</div>}
            {group.chapters.map((chapter) => {
              const isMedicalTeam = guide.reviewed && /^(Medical team|医疗团队)$/.test(chapter.title);
              return <section key={chapter.title} className={isMedicalTeam ? "space-y-4" : "max-w-prose space-y-4"}>
                <h4 className="text-base font-semibold leading-normal">{chapter.title}</h4>
                {isMedicalTeam ? <RodeoMedicalTeam language={language} /> : renderBlocks(chapter.blocks)}
              </section>;
            })}
          </div>
        </details>)}
      </div>
    </div>
    {guide.note && <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{guide.note}</p>}
  </div>;
}
