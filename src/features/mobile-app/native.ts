import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Share } from "@capacitor/share";

export const isNativeApp = () => Capacitor.isNativePlatform();

export const tapFeedback = async () => {
  if (!isNativeApp()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* Haptics are an enhancement; the action must still complete. */
  }
};

export const shareCarePlan = async (procedure: string, destination: string) => {
  const text = `My Cosmetics Asia care plan: ${procedure} in ${destination}.`;
  const { value } = await Share.canShare();
  if (!value) return false;
  await Share.share({
    title: "My Cosmetics Asia care plan",
    text,
    url: "https://cosmetics-asia.com/app",
    dialogTitle: "Share my care plan",
  });
  return true;
};
