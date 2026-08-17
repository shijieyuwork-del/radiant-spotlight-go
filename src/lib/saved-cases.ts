import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useAsia } from "@/lib/asia-i18n";

const eventName = "cosmetics-asia:saved-cases-changed";
const storageKey = (userId: string) => `cosmetics-asia:saved-cases:${userId}`;

const readSavedCases = (userId: string) => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(storageKey(userId)) ?? "[]"));
  } catch {
    return new Set<string>();
  }
};

export const useSavedCase = (caseId: string) => {
  const { user } = useAuth();
  const { lang } = useAsia();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(user ? readSavedCases(user.id).has(caseId) : false);
    sync();
    window.addEventListener(eventName, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, [caseId, user]);

  const toggleSaved = useCallback(() => {
    if (!user) {
      const next = `${location.pathname}${location.search}`;
      navigate(`/auth?tab=signup&reason=save-case&next=${encodeURIComponent(next)}`);
      return;
    }

    const cases = readSavedCases(user.id);
    const willSave = !cases.has(caseId);
    if (willSave) cases.add(caseId);
    else cases.delete(caseId);
    localStorage.setItem(storageKey(user.id), JSON.stringify([...cases]));
    setSaved(willSave);
    window.dispatchEvent(new Event(eventName));
    toast.success(
      lang === "zh"
        ? willSave ? "已保存到喜欢的案例" : "已取消保存"
        : willSave ? "Saved to your favorite cases" : "Removed from saved cases",
    );
  }, [caseId, lang, location.pathname, location.search, navigate, user]);

  return { saved, toggleSaved, signedIn: Boolean(user) };
};
