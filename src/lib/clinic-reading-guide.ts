import { RODEO_SHANGHAI_PROFILE } from "@/data/rodeoShanghaiProfile";

export type ClinicChapter = { title: string; blocks: string[] };
export type ClinicReadingGroup = { title: string; hint: string; chapters: ClinicChapter[]; includesIntro?: boolean };

export function parseClinicDescription(description: string) {
  const intro: string[] = [];
  const chapters: ClinicChapter[] = [];
  const blocks = description.replace(/\r\n/g, "\n").trim().split(/\n\s*\n/).filter(Boolean);
  for (const block of blocks) {
    if (/^## [^\n]+$/.test(block)) chapters.push({ title: block.slice(3), blocks: [] });
    else (chapters.at(-1)?.blocks ?? intro).push(block);
  }
  return { intro, chapters };
}

/** Summaries only accompany the reviewed text. Admin edits never inherit stale claims. */
export function getClinicReadingGuide(description: string, chapters: ClinicChapter[], language: string) {
  const zh = language === "zh";
  const reviewed = description.trim() === (zh ? RODEO_SHANGHAI_PROFILE.descriptionZh : RODEO_SHANGHAI_PROFILE.descriptionEn);
  const copy = zh ? {
    title: "先看重点", prompt: "选择想了解的内容，展开查看详情。", expand: "展开全部", collapse: "收起全部",
    summary: "柔缇欧上海旗舰店专注皮肤管理与面部年轻化，先面诊，再制定个人方案。",
    facts: [
      ["关注方向", "皮肤管理与面部年轻化"],
      ["面诊方式", "医生主导，个性化规划"],
      ["门店位置", "上海 · 黄浦区"],
    ],
    note: "项目和医生资料来自品牌宣传册，当前服务与出诊安排请在预约前确认。",
    groups: [
      ["项目与诊疗理念", "注射、光电与个性化面诊", [1, 2, 3]],
      ["认识医疗团队", "三位医生的背景与专长", [4]],
      ["面诊与后续护理", "到店流程、护理支持与居家护肤", [6, 7]],
      ["上海店与预约", "地址、联系方式和预约前需确认的事项", [8, 9]],
      ["品牌与创始团队", "发展历程、BHRC 背景及运营团队", [0, 5]],
      ["资料来源与说明", "信息出处及本介绍的范围", [10]],
    ],
  } : {
    title: "At a glance", prompt: "Choose a topic to see the details.", expand: "Expand all", collapse: "Collapse all",
    summary: "RODEO’s Shanghai flagship combines skin treatments with doctor-led aesthetic planning.",
    facts: [
      ["Focus", "Skin & facial rejuvenation"],
      ["Approach", "Doctor-led, individual planning"],
      ["Location", "Huangpu, Shanghai"],
    ],
    note: "Treatments and team details come from the brand brochure. Confirm current services and doctor availability before booking.",
    groups: [
      ["Treatments & approach", "Injectables, skin treatments and individual planning", [1, 2, 3]],
      ["Meet the medical team", "Three doctors, their backgrounds and specialties", [4]],
      ["Your visit & aftercare", "Consultation, follow-up and home skin care", [6, 7]],
      ["Shanghai clinic & booking", "Address, contact details and what to confirm", [8, 9]],
      ["Brand & founding team", "The RODEO story, BHRC and the people behind it", [0, 5]],
      ["Sources & important details", "Where the information comes from and its scope", [10]],
    ],
  };
  const groups: ClinicReadingGroup[] = reviewed
    ? copy.groups.map(([title, hint, indices]) => ({ title: title as string, hint: hint as string, chapters: (indices as number[]).map((i) => chapters[i]), includesIntro: (indices as number[]).includes(0) }))
    : chapters.map((chapter) => ({ title: chapter.title, hint: "", chapters: [chapter] }));
  return { ...copy, summary: reviewed ? copy.summary : "", facts: reviewed ? copy.facts : [], note: reviewed ? copy.note : "", groups };
}
