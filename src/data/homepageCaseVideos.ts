import type { TikTokItem } from "@/components/TikTokWall";
import homepageCaseVideo from "@/assets/cases/homepage-case.mp4.asset.json";
import homepageCasePoster from "@/assets/cases/homepage-case-poster.jpg.asset.json";

/**
 * 首页展示区新增的案例视频（用户上传）。
 * 没有提供术式、专家、患者或效果信息，因此只用中性的「案例视频」标题，不编造任何事实。
 * 没有对应的案例详情页（hasCasePage: false）。
 */
export const HOMEPAGE_CASE_VIDEOS: TikTokItem[] = [
  {
    id: "homepage-case-video-1",
    src: homepageCaseVideo.url,
    poster: homepageCasePoster.url,
    user: { en: "", zh: "" },
    caption: { en: "Case video", zh: "案例视频", ru: "Видео случая", es: "Video de caso" },
    treatment: { en: "Case video", zh: "案例视频", ru: "Видео случая", es: "Video de caso" },
    clinic: { en: "", zh: "" },
    likes: "",
    comments: "",
    priceCny: 0,
    hasCasePage: false,
  },
];
