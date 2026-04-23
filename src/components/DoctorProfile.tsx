import {
  ShieldCheck, Award, Languages, Hospital, MessageCircle, Clock, Scissors, MapPin, BadgeCheck, Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SafetyIndicator from "./SafetyIndicator";
import { useQuote } from "./QuoteRequest";

export interface DoctorProfileData {
  name: string;
  title: string;
  city: string;
  flag: string;
  avatar?: string;
  license: { country: string; number: string; board: string };
  certifications: { label: string; org: string }[];
  proceduresPerformed: string;
  responseRate: number; // 0-100
  avgResponseTime: string;
  languages: string[];
  hospitals: string[];
  safety: { level: "green" | "amber" | "red"; score: number };
}

const DoctorProfile = ({ d }: { d: DoctorProfileData }) => {
  return (
    <article className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-soft">
      {/* Header */}
      <div className="bg-gradient-mint p-7 flex flex-col md:flex-row md:items-center gap-5">
        <div className="size-20 rounded-3xl bg-card grid place-items-center font-display text-3xl font-semibold shrink-0 shadow-soft">
          {d.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-2xl md:text-3xl font-semibold leading-tight">{d.name}</h3>
            <BadgeCheck className="size-5 text-primary fill-primary/20" />
          </div>
          <p className="text-sm text-foreground/80 mt-1">{d.title}</p>
          <p className="text-xs text-foreground/70 flex items-center gap-1 mt-1">
            <MapPin className="size-3" /> {d.city} <span className="ml-1">{d.flag}</span>
          </p>
        </div>
        <div className="md:w-64">
          <SafetyIndicator level={d.safety.level} score={d.safety.score} />
        </div>
      </div>

      <div className="p-7 grid md:grid-cols-2 gap-5">
        {/* License */}
        <div className="rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <ShieldCheck className="size-3 text-primary" /> Medical license
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl">{d.flag}</span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">{d.license.number}</p>
              <p className="text-xs text-muted-foreground">Issued by {d.license.board} · {d.license.country}</p>
            </div>
          </div>
        </div>

        {/* Procedures performed */}
        <div className="rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <Scissors className="size-3 text-primary" /> Procedures performed
          </p>
          <p className="font-display text-3xl font-semibold mt-1">{d.proceduresPerformed}</p>
          <p className="text-xs text-muted-foreground">verified case volume</p>
        </div>

        {/* Response */}
        <div className="rounded-2xl border border-border p-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <MessageCircle className="size-3 text-primary" /> Response rate
            </p>
            <p className="font-display text-2xl font-semibold mt-1">{d.responseRate}%</p>
          </div>
          <div className="border-l border-border pl-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
              <Clock className="size-3 text-primary" /> Avg reply
            </p>
            <p className="font-display text-2xl font-semibold mt-1">{d.avgResponseTime}</p>
          </div>
        </div>

        {/* Languages */}
        <div className="rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <Languages className="size-3 text-primary" /> Languages
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {d.languages.map((l) => (
              <span key={l} className="pill bg-muted text-foreground">{l}</span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="rounded-2xl border border-border p-4 md:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <Award className="size-3 text-primary" /> Board certifications
          </p>
          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            {d.certifications.map((c) => (
              <div key={c.label} className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-3 py-2">
                <div className="size-8 rounded-lg bg-card grid place-items-center shrink-0">
                  <Stethoscope className="size-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{c.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{c.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitals */}
        <div className="rounded-2xl border border-border p-4 md:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <Hospital className="size-3 text-primary" /> Hospital affiliations
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {d.hospitals.map((h) => (
              <span key={h} className="pill bg-accent text-accent-foreground">
                <Hospital className="size-3" /> {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-7 pb-7 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => open({ doctorName: d.name, city: d.city })}
          className="rounded-full flex-1 bg-foreground text-background hover:bg-foreground/90"
        >
          <MessageCircle className="size-4 mr-1.5" /> Get a Free Quote
        </Button>
        <Button variant="outline" className="rounded-full flex-1">Book free consult</Button>
      </div>
    </article>
  );
};

export default DoctorProfile;
