import { ArrowRight } from "lucide-react";
import { useQuote } from "@/components/QuoteRequest";
import { useAsia } from "@/lib/asia-i18n";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ConsultationCtaProps = {
  className?: string;
  source?: string;
};

const ConsultationCta = ({ className, source = "page_footer_cta" }: ConsultationCtaProps) => {
  const { lang } = useAsia();
  const { open } = useQuote();
  const c = (en: string, zh: string, ru: string, es: string) =>
    lang === "zh" ? zh : lang === "ru" ? ru : lang === "es" ? es : en;

  const handleClick = () => {
    trackEvent("select_cta", { source });
    open({ source });
  };

  return (
    <section
      className={cn("container py-12 md:py-20", className)}
      aria-labelledby={`${source}-title`}
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-foreground px-6 py-10 text-background shadow-pop sm:px-9 md:rounded-[3rem] md:px-12 md:py-16 lg:px-16">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-amber-200/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary sm:text-sm">
              {c("Start with one conversation", "从一次沟通开始", "Начните с одного разговора", "Empieza con una conversación")}
            </p>
            <h2 id={`${source}-title`} className="mt-3 max-w-4xl font-display text-4xl font-medium leading-[0.98] tracking-tight sm:text-5xl md:text-6xl">
              {c("You do not need every answer before you begin.", "开始之前，你不需要先知道所有答案。", "Необязательно знать все ответы, чтобы начать.", "No necesitas tener todas las respuestas antes de empezar.")}
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-background/65 sm:text-base">
              {c("Tell us what you are considering. We will help you turn your questions into a clear next step. It is free and carries no obligation.", "告诉我们你正在考虑什么。我们会帮你把疑问变成清晰的下一步，免费且无需承诺。", "Расскажите, что вы рассматриваете. Мы поможем превратить вопросы в понятный следующий шаг. Это бесплатно и без обязательств.", "Cuéntanos qué estás considerando. Te ayudaremos a convertir tus preguntas en un siguiente paso claro. Es gratis y sin compromiso.")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-foreground lg:w-auto lg:min-w-64"
          >
            {c("Start a consultation", "开始咨询", "Начать консультацию", "Solicita una consulta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConsultationCta;
