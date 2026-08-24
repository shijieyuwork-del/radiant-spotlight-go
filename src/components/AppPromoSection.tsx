import { ArrowRight, MapPin, MessageCircle, Play, Search, Smartphone, Star } from "lucide-react";

const WAITLIST_URL = "https://wa.me/14708613825?text=Hi%2C%20please%20add%20me%20to%20the%20Cosmetics%20Asia%20app%20launch%20list.";

const AppPromoSection = () => (
  <section className="container py-12 md:py-16">
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[hsl(155,55%,91%)] via-[hsl(48,78%,93%)] to-[hsl(var(--primary)/.26)] px-5 py-9 shadow-pop sm:rounded-[2.5rem] sm:px-6 sm:py-10 md:px-12 md:py-14 lg:px-16">
      <div className="absolute -left-28 -top-36 size-80 rounded-full bg-white/30 blur-2xl" />
      <div className="absolute -bottom-[65%] right-[-12%] size-[760px] rounded-full bg-primary/20" />
      <div className="absolute bottom-[-8rem] left-[32%] size-72 rounded-full bg-[hsl(50,78%,88%)]/45 blur-2xl" />
      <div className="relative grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative z-10 max-w-xl">
          <span className="pill mb-5 bg-white/75 text-foreground"><Smartphone className="size-3.5 text-primary" /> App coming soon</span>
          <h2 className="font-display text-3xl font-medium leading-[0.98] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            China’s cosmetic care.<br /><em className="not-italic text-primary">One app.</em>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground/75 md:text-lg">
            Compare surgeons, watch real patient diaries, book consultations and keep your China medical trip in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold sm:text-sm">
            <span className="rounded-full bg-white/65 px-4 py-2">China-focused doctor directory</span>
            <span className="rounded-full bg-white/65 px-4 py-2">10K+ diaries</span>
            <span className="rounded-full bg-white/65 px-4 py-2">iOS + Android</span>
          </div>
          <a href={WAITLIST_URL} target="_blank" rel="noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-4 text-center font-semibold text-background transition hover:-translate-y-0.5 hover:bg-foreground/90 sm:w-auto sm:px-6">
            <MessageCircle className="size-5" /> Join the launch list <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="relative z-10 flex min-h-[430px] items-center justify-center md:min-h-[500px]">
          <div className="relative rotate-[7deg] rounded-[2.8rem] border-[8px] border-foreground bg-foreground p-1 shadow-[0_30px_65px_rgba(20,47,38,0.3)] transition duration-500 hover:rotate-[3deg]">
            <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-foreground" />
            <div className="h-[430px] w-[225px] overflow-hidden rounded-[2.15rem] bg-[#fbfaf5] sm:h-[480px] sm:w-[250px]">
              <div className="bg-primary px-4 pb-4 pt-10 text-primary-foreground">
                <div className="flex items-center justify-between text-xs font-semibold"><span className="font-display text-lg">Cosmetics Asia</span><span>•••</span></div>
                <div className="mt-4 flex items-center gap-2 rounded-full bg-white px-3 py-2.5 text-[10px] text-foreground"><Search className="size-3.5 text-primary" /> Search doctors</div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between"><p className="font-display text-base font-semibold">Available surgeons</p><span className="text-[9px] font-semibold text-primary">See all</span></div>
                {["Dr. Li · Rhinoplasty", "Dr. Chen · Facelift"].map((name, index) => (
                  <div key={name} className="mt-2.5 rounded-xl border border-border bg-white p-2.5 shadow-soft">
                    <div className="flex items-center gap-2">
                      <div className={`grid size-10 shrink-0 place-items-center rounded-full ${index ? "bg-[#f7d5e1]" : "bg-primary/20"}`}><span className="font-display text-sm">Dr</span></div>
                      <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold">{name}</p><p className="mt-1 flex items-center gap-1 text-[8px] text-muted-foreground"><MapPin className="size-2.5" /> China · English</p></div>
                      <span className="flex items-center gap-0.5 text-[9px] font-bold"><Star className="size-2.5 fill-amber-400 text-amber-400" />4.9</span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1">{["10:00", "13:30", "16:00"].map((time) => <span key={time} className="rounded-md bg-accent py-1.5 text-center text-[8px] font-semibold">{time}</span>)}</div>
                  </div>
                ))}
                <div className="mt-3 rounded-xl bg-foreground p-3 text-background">
                  <div className="flex items-center justify-between"><div><p className="text-[8px] text-background/55">Continue watching</p><p className="mt-0.5 font-display text-sm">Real recovery diary</p></div><span className="grid size-8 place-items-center rounded-full bg-primary"><Play className="ml-0.5 size-3 fill-current" /></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AppPromoSection;
