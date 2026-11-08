import HeroVideoGallery from "@/components/HeroVideoGallery";
import { usePublishedVideos } from "@/hooks/use-published-videos";
import { TIKTOK_CASES } from "@/data/tiktokCases";
import { useAsia } from "@/lib/asia-i18n";

export default function HeroCaseGallery() {
  const { lang, fmt } = useAsia();
  const uploaded = usePublishedVideos(lang);
  return <HeroVideoGallery items={[...uploaded, ...TIKTOK_CASES].slice(0, 10)} lang={lang} fmtPrice={fmt} layout="arc" />;
}