import { ArrowRight, Building2, Wallet } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAsia } from "@/lib/asia-i18n";

const PaymentDetailsSection = () => {
  const { lang } = useAsia();
  const c = (en: string, zh: string, ru: string) => lang === "zh" ? zh : lang === "ru" ? ru : en;
  const questions = [
    {
      q: c("Who receives my medical payment?", "手术和治疗费用支付给谁？", "Кому оплачиваются медицинские услуги?"),
      a: c("All surgery, examination, anesthesia and other medical fees are charged directly by the clinic or hospital. Cosmetics Asia does not collect your medical payment.", "全部手术、检查、麻醉及其他医疗费用均由诊所或医院直接收取。Cosmetics Asia 不代收医疗费用。", "Операция, обследования, анестезия и другие медицинские услуги оплачиваются напрямую клинике или больнице. Cosmetics Asia не принимает медицинские платежи."),
    },
    {
      q: c("Can my consultation be conducted in English?", "线上咨询可以使用英语吗？", "Можно ли провести консультацию на английском?"),
      a: c("Yes. We arrange confirmed English-language support for the appointment, either with an English-speaking expert or a bilingual coordinator, depending on availability.", "可以。我们会根据已确认的预约安排英语沟通支持；具体形式可能是英语专家或双语协调员陪同。", "Да. Для подтверждённой записи мы организуем поддержку на английском: англоговорящего эксперта или двуязычного координатора, в зависимости от доступности."),
    },
    {
      q: c("How is my medical information handled?", "我的医疗资料如何使用？", "Как используются мои медицинские данные?"),
      a: c("Information is used for the consultation and coordination you authorize, and only necessary details are shared with relevant service providers. Do not send sensitive records through public comments or social media.", "资料仅用于你授权的咨询和行程协调，并只向相关服务方提供必要信息。请勿通过公开评论或社交媒体发送敏感病历。", "Данные используются только для разрешённой вами консультации и координации; партнёрам передаётся лишь необходимая информация. Не отправляйте конфиденциальные документы в открытых комментариях или соцсетях."),
    },
  ];

  return (
    <section className="container py-12 md:py-16" aria-labelledby="payment-details-title">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-primary/20 bg-card p-5 shadow-pop sm:p-7 md:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-[hsl(var(--primary)/.12)] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-[hsl(48_86%_82%/.2)] blur-3xl" aria-hidden="true" />

        <div className="relative max-w-4xl">
          <span className="pill mb-4 border border-primary/15 bg-primary/10 text-foreground"><Wallet className="size-3.5 text-primary" /> {c("Payment, made simple", "付款方式，一眼看懂", "Оплата — всё просто")}</span>
          <h2 id="payment-details-title" className="font-display text-3xl font-medium leading-[1.04] tracking-tight sm:text-4xl md:text-5xl">
            {c("Simple, transparent payments. ", "付款简单透明，", "Простая и прозрачная оплата. ")}<em className="not-italic text-primary">{c("Know exactly where your money goes.", "每一笔都清楚去向。", "Вы точно знаете, куда идут ваши деньги.")}</em>
          </h2>
        </div>

        <div className="relative mt-8 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-card bg-foreground text-background shadow-soft lg:grid" aria-hidden="true">
            <ArrowRight className="size-4" strokeWidth={2} />
          </div>
          <article className="relative overflow-hidden rounded-[1.75rem] border border-primary/20 bg-[hsl(var(--primary)/.075)] p-5 shadow-soft sm:p-7">
            <span className="absolute right-5 top-4 font-display text-5xl font-medium text-primary/10" aria-hidden="true">01</span>
            <div className="relative flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_22px_hsl(var(--primary)/.22)]"><Building2 className="size-5" strokeWidth={2} /></span>
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{c("Medical treatment", "手术与医疗费用", "Медицинские услуги")}</p>
                <h3 className="mt-1 font-display text-xl font-medium leading-tight text-foreground sm:text-2xl">{c("Pay the clinic directly", "直接支付给诊所或医院", "Оплачивайте напрямую клинике")}</h3>
              </div>
            </div>
            <p className="relative mt-5 max-w-xl text-[15px] leading-7 text-foreground/70 sm:text-base">{c("Your clinic or hospital collects all surgery, examination and anesthesia fees. Cosmetics Asia does not collect your medical payment.", "手术、检查和麻醉等医疗费用均由诊所或医院直接收取，Cosmetics Asia 不代收。", "Операция, обследования и анестезия оплачиваются напрямую клинике или больнице. Cosmetics Asia не принимает медицинские платежи.")}</p>
          </article>
          <article className="relative overflow-hidden rounded-[1.75rem] border border-[hsl(43_70%_72%/.65)] bg-[hsl(48_82%_94%)] p-5 shadow-soft sm:p-7">
            <span className="absolute right-5 top-4 font-display text-5xl font-medium text-[hsl(33_78%_38%/.09)]" aria-hidden="true">02</span>
            <div className="relative flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[hsl(42_88%_86%)] text-[hsl(33_78%_33%)] shadow-[0_8px_22px_hsl(42_70%_55%/.16)]"><Wallet className="size-5" strokeWidth={2} /></span>
              <div className="min-w-0 pt-0.5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[hsl(33_72%_35%)]">{c("Before departure", "出发前", "До вылета")}</p>
                <h3 className="mt-1 font-display text-xl font-medium leading-tight text-foreground sm:text-2xl">{c("$400 coordination deposit", "支付 $400 协调押金", "Координационный депозит $400")}</h3>
              </div>
            </div>
            <p className="relative mt-5 max-w-xl text-[15px] leading-7 text-foreground/70 sm:text-base">{c("It reserves your procedure appointment and coordinates airport pickup and in-clinic translation. It remains valid for 12 months and is refunded when you pay the clinic for treatment.", "用于保留手术预约，并协调机场接送和院内翻译。押金在 12 个月内有效，并在你向诊所支付治疗费用时退还。", "Он закрепляет время процедуры и помогает организовать трансфер и перевод в клинике. Депозит действует 12 месяцев и возвращается после оплаты лечения в клинике.")}</p>
          </article>
        </div>

        <div className="relative mt-5 grid gap-6 rounded-[1.75rem] border border-border/80 bg-background/65 p-5 sm:p-7 lg:grid-cols-[0.52fr_1.48fr] lg:items-start lg:gap-8">
          <div className="lg:py-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{c("Need more detail?", "还想了解更多？", "Нужны подробности?")}</p>
            <h3 className="mt-2 font-display text-2xl font-medium leading-tight sm:text-3xl">{c("Common questions", "常见问题", "Частые вопросы")}</h3>
            <a href="#support" className="group/link mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/20 bg-card px-4 text-sm font-semibold text-foreground shadow-soft transition-[color,border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary">
              {c("Review support services", "查看支持服务", "Посмотреть услуги поддержки")}<ArrowRight className="size-4 text-primary transition-transform duration-150 group-hover/link:translate-x-1" />
            </a>
          </div>
          <Accordion type="single" collapsible className="overflow-hidden rounded-2xl border border-border/80 bg-card px-4 shadow-soft sm:px-5">
            {questions.map((item, index) => (
              <AccordionItem key={item.q} value={`payment-faq-${index}`} className="border-border/65 last:border-0">
                <AccordionTrigger className="group gap-4 rounded-xl px-1 py-4 text-left text-sm font-semibold transition-colors duration-150 hover:bg-primary/[0.045] hover:no-underline sm:text-base">
                  <span className="flex items-start gap-3"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-[10px] text-primary">0{index + 1}</span><span className="pt-0.5">{item.q}</span></span>
                </AccordionTrigger>
                <AccordionContent className="pl-10 pr-3 text-sm leading-relaxed text-muted-foreground sm:pl-11 sm:text-[15px]">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default PaymentDetailsSection;
