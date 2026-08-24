import { useCallback, useState } from "react";

/** [纬度, 经度] */
export type Coords = [number, number];

/** 亚洲主要医美城市坐标（英文名小写 + 中文名 两种 key） */
const CITY_COORDS: Record<string, Coords> = {
  shanghai: [31.2304, 121.4737],
  "上海": [31.2304, 121.4737],
  beijing: [39.9042, 116.4074],
  "北京": [39.9042, 116.4074],
  guangzhou: [23.1291, 113.2644],
  "广州": [23.1291, 113.2644],
  hangzhou: [30.2741, 120.1551],
  "杭州": [30.2741, 120.1551],
  hainan: [20.0174, 110.3492],
  "海南": [20.0174, 110.3492],
  chengdu: [30.5728, 104.0668],
  "成都": [30.5728, 104.0668],
  shenzhen: [22.5431, 114.0579],
  "深圳": [22.5431, 114.0579],
  seoul: [37.5665, 126.978],
  "首尔": [37.5665, 126.978],
  bangkok: [13.7563, 100.5018],
  "曼谷": [13.7563, 100.5018],
  tokyo: [35.6762, 139.6503],
  "东京": [35.6762, 139.6503],
  singapore: [1.3521, 103.8198],
  "新加坡": [1.3521, 103.8198],
};

/** 根据城市名（中/英文，自由文本）查坐标；查不到返回 null */
export const cityCoordsOf = (name?: string | null): Coords | null => {
  if (!name) return null;
  const key = name.trim().toLowerCase();
  if (!key) return null;
  if (CITY_COORDS[key]) return CITY_COORDS[key];
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (k.length > 1 && (key.includes(k) || k.includes(key))) return v;
  }
  return null;
};

/** 两点间球面距离（公里） */
export const haversineKm = (a: Coords, b: Coords): number => {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLng = (b[1] - a[1]) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
};

export type LocationStatus = "idle" | "locating" | "granted" | "denied";

/**
 * 浏览器定位。只有用户主动选择「按距离排序」时才调用 request()，
 * 避免页面加载就弹定位授权。
 */
export const useUserLocation = () => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setStatus("granted");
      },
      () => setStatus("denied"),
      { timeout: 8000, maximumAge: 10 * 60 * 1000 },
    );
  }, []);

  return { coords, status, request };
};
