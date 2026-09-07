import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Preferences } from "@capacitor/preferences";
import type { CarePlan } from "./types";
import { tapFeedback } from "./native";

const STORE_KEY = "cosmetics-asia.mobile-plan.v1";
const TASK_IDS = ["goals", "records", "shortlist", "consultation"] as const;

const initialPlan: CarePlan = {
  destination: "Shanghai",
  procedure: "Rhinoplasty",
  tasks: Object.fromEntries(TASK_IDS.map((id) => [id, false])),
};

type CarePlanState = {
  plan: CarePlan;
  progress: number;
  setDestination: (value: string) => void;
  setProcedure: (value: string) => void;
  toggleTask: (id: string) => void;
};

const CarePlanContext = createContext<CarePlanState | null>(null);

export const CarePlanProvider = ({ children }: { children: ReactNode }) => {
  const [plan, setPlan] = useState<CarePlan>(initialPlan);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void Preferences.get({ key: STORE_KEY }).then(({ value }) => {
      if (!active) return;
      if (value) {
        try {
          setPlan({ ...initialPlan, ...JSON.parse(value) });
        } catch {
          setPlan(initialPlan);
        }
      }
      setReady(true);
    }).catch(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void Preferences.set({ key: STORE_KEY, value: JSON.stringify(plan) });
  }, [plan, ready]);

  const value = useMemo<CarePlanState>(() => ({
    plan,
    progress: Math.round((Object.values(plan.tasks).filter(Boolean).length / TASK_IDS.length) * 100),
    setDestination: (destination) => setPlan((current) => ({ ...current, destination })),
    setProcedure: (procedure) => setPlan((current) => ({ ...current, procedure })),
    toggleTask: (id) => {
      void tapFeedback();
      setPlan((current) => ({
        ...current,
        tasks: { ...current.tasks, [id]: !current.tasks[id] },
      }));
    },
  }), [plan]);

  return <CarePlanContext.Provider value={value}>{children}</CarePlanContext.Provider>;
};

export const useCarePlan = () => {
  const value = useContext(CarePlanContext);
  if (!value) throw new Error("useCarePlan must be used inside CarePlanProvider");
  return value;
};
