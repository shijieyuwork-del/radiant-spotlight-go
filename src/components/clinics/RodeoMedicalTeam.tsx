import { ExternalLink } from "lucide-react";
import drDan from "@/assets/rodeo-dr-dan.jpg";
import chenSikai from "@/assets/rodeo-chen-sikai.jpg";
import huLingling from "@/assets/rodeo-hu-lingling.jpg";

const TEAM = [
  {
    image: drDan,
    nameEn: "Dr. Dan",
    nameZh: "Dr. Dan",
    roleEn: "Chief Medical Officer",
    roleZh: "首席医疗官",
    focusEn: "Facial rejuvenation, non-invasive treatments and injectables",
    focusZh: "全面部年轻化、非侵入性治疗与注射治疗",
  },
  {
    image: chenSikai,
    nameEn: "Dr Chen Sikai",
    nameZh: "陈思凯 院长",
    roleEn: "Medical Director · Aesthetic Dermatology",
    roleZh: "总院长 · 美容皮肤科",
    focusEn: "Individual aesthetic planning, facial contouring and injectables",
    focusZh: "个性化美学设计、面部轮廓管理与注射美容",
  },
  {
    image: huLingling,
    nameEn: "Dr Hu Lingling",
    nameZh: "胡玲玲 院长",
    roleEn: "Technical Director · Aesthetic Dermatology",
    roleZh: "技术院长 · 美容皮肤科",
    focusEn: "Skin concerns, facial rejuvenation and energy-based treatments",
    focusZh: "问题肌肤、全面部年轻化与光电联合治疗",
  },
] as const;

export function RodeoMedicalTeam({ language }: { language: string }) {
  const zh = language === "zh";
  return (
    <div className="space-y-4">
      <p className="max-w-prose text-sm leading-6 text-muted-foreground">
        {zh
          ? "认识官网当前展示的医疗团队。具体执业注册、上海出诊时间和可预约项目，请在预约前确认。"
          : "Meet the medical team currently featured by RODEO. Confirm current registration, Shanghai attendance and appointment availability before booking."}
      </p>
      <ul className="grid gap-4 sm:grid-cols-3" aria-label={zh ? "柔缇欧医疗团队" : "RODEO medical team"}>
        {TEAM.map((member) => (
          <li key={member.nameEn} className="min-w-0 overflow-hidden rounded-xl border border-primary/15 bg-primary/[0.035]">
            <img
              src={member.image}
              alt={zh ? `${member.nameZh}，柔缇欧官网照片` : `${member.nameEn}, official RODEO photograph`}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <div className="space-y-2 p-4">
              <div>
                <h5 className="text-base font-semibold leading-snug">{zh ? member.nameZh : member.nameEn}</h5>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">{zh ? member.roleZh : member.roleEn}</p>
              </div>
              <p className="text-sm leading-6 text-foreground/75">{zh ? member.focusZh : member.focusEn}</p>
            </div>
          </li>
        ))}
      </ul>
      <a href="https://rodeomed.com/doctors" target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
        {zh ? "查看 RODEO 官网医疗团队" : "View the medical team on RODEO’s official website"}
        <ExternalLink className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}
