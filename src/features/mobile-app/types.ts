export type AppDoctor = {
  bio: string;
  city: string;
  id: string;
  name: string;
  photo: string;
  specialties: string[];
  title: string;
};

export type CarePlan = {
  destination: string;
  procedure: string;
  tasks: Record<string, boolean>;
};

export type AppSection = "home" | "experts" | "clinics" | "diaries" | "plan";
