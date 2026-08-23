import { useEffect, useState } from "react";

export type CityTimezone = {
  iana: string;
  offset: string;
  label: { en: string; zh: string; ru: string };
};

export const CHINA_TZ: CityTimezone = {
  iana: "Asia/Shanghai",
  offset: "GMT+8",
  label: { en: "China Standard Time", zh: "中国标准时间", ru: "Китайское стандартное время" },
};

const CITY_TIMEZONES: { match: RegExp; tz: CityTimezone }[] = [
  {
    match: /seoul|서울|首尔/i,
    tz: { iana: "Asia/Seoul", offset: "GMT+9", label: { en: "Korea Standard Time", zh: "韩国标准时间", ru: "Корейское стандартное время" } },
  },
  {
    match: /tokyo|东京|東京/i,
    tz: { iana: "Asia/Tokyo", offset: "GMT+9", label: { en: "Japan Standard Time", zh: "日本标准时间", ru: "Японское стандартное время" } },
  },
  {
    match: /bangkok|曼谷/i,
    tz: { iana: "Asia/Bangkok", offset: "GMT+7", label: { en: "Indochina Time", zh: "曼谷时间", ru: "Время Бангкока" } },
  },
  {
    match: /singapore|新加坡/i,
    tz: { iana: "Asia/Singapore", offset: "GMT+8", label: { en: "Singapore Time", zh: "新加坡时间", ru: "Сингапурское время" } },
  },
];

/** Resolve a city's IANA timezone. China Standard Time (GMT+8) is the default for all China cities and unknowns. */
export const getCityTimezone = (city?: string | null): CityTimezone => {
  if (!city) return CHINA_TZ;
  const hit = CITY_TIMEZONES.find((entry) => entry.match.test(city));
  return hit ? hit.tz : CHINA_TZ;
};

const LOCALES: Record<string, string> = { en: "en-US", zh: "zh-CN", ru: "ru-RU" };

export const formatCityTime = (tz: CityTimezone, lang: string = "en", date: Date = new Date()) =>
  new Intl.DateTimeFormat(LOCALES[lang] ?? "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz.iana,
  }).format(date);

/** Current local time in the given timezone, refreshed every 30 seconds. */
export const useCityTime = (tz: CityTimezone, lang: string = "en") => {
  const [now, setNow] = useState(() => formatCityTime(tz, lang));
  useEffect(() => {
    setNow(formatCityTime(tz, lang));
    const id = window.setInterval(() => setNow(formatCityTime(tz, lang)), 30_000);
    return () => window.clearInterval(id);
  }, [tz.iana, lang]);
  return now;
};
