import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CountryTrend {
  flag: string;
  name: string;
  city: string;
  procedures: { name: string; price: string }[];
  gradient: string;
}

const data: CountryTrend[] = [
  {
    flag: "🇰🇷", name: "Korea", city: "Seoul",
    gradient: "bg-gradient-mint",
    procedures: [
      { name: "Double Eyelid", price: "$1,800" },
      { name: "V-Line Surgery", price: "$6,800" },
      { name: "Rhinoplasty", price: "$4,200" },
    ],
  },
  {
    flag: "🇹🇭", name: "Thailand", city: "Bangkok",
    gradient: "bg-gradient-peach",
    procedures: [
      { name: "Breast Aug", price: "$3,900" },
      { name: "Liposuction", price: "$2,800" },
      { name: "Rhinoplasty", price: "$2,600" },
    ],
  },
  {
    flag: "🇹🇷", name: "Turkey", city: "Istanbul",
    gradient: "bg-gradient-mint",
    procedures: [
      { name: "Hair Transplant", price: "$2,400" },
      { name: "Rhinoplasty", price: "$2,900" },
      { name: "Facelift", price: "$5,400" },
    ],
  },
  {
    flag: "🇲🇽", name: "Mexico", city: "Mexico City",
    gradient: "bg-gradient-peach",
    procedures: [
      { name: "Liposuction", price: "$3,100" },
      { name: "Breast Aug", price: "$4,200" },
      { name: "Facelift", price: "$5,900" },
    ],
  },
  {
    flag: "🇯🇵", name: "Japan", city: "Tokyo",
    gradient: "bg-gradient-mint",
    procedures: [
      { name: "Double Eyelid", price: "$2,400" },
      { name: "Rhinoplasty", price: "$5,800" },
      { name: "Facelift", price: "$8,400" },
    ],
  },
  {
    flag: "🇫🇷", name: "France", city: "Paris",
    gradient: "bg-gradient-peach",
    procedures: [
      { name: "Rhinoplasty", price: "$6,400" },
      { name: "Facelift", price: "$8,900" },
      { name: "Liposuction", price: "$4,800" },
    ],
  },
];

const TrendingByCountry = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
    {data.map((c) => (
      <article key={c.name} className="glow-card rounded-3xl p-6 flex flex-col">
        <div className="flex items-center gap-3">
          <div className={`size-14 rounded-2xl ${c.gradient} grid place-items-center text-3xl`}>
            {c.flag}
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold leading-tight">{c.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="size-3" /> {c.city}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-1 flex-1">
          {c.procedures.map((p, i) => (
            <li key={p.name} className="flex items-center justify-between py-2 border-t border-border first:border-t-0">
              <span className="flex items-center gap-2 text-sm">
                <span className="font-display text-xs text-primary font-semibold">0{i + 1}</span>
                {p.name}
              </span>
              <span className="text-sm font-semibold">avg {p.price}</span>
            </li>
          ))}
        </ul>

        <Button variant="outline" className="rounded-full mt-5 w-full">
          View experts in {c.name} <ArrowRight className="ml-1 size-4" />
        </Button>
      </article>
    ))}
  </div>
);

export default TrendingByCountry;
