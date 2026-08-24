import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, Cookie, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { analyticsConfigured, openPrivacyChoices } from "@/lib/analytics";

const Privacy = () => (
  <>
    <PageMeta
      title="Privacy Notice"
      description="How Cosmetics Asia uses essential storage, optional analytics, and the information you choose to share."
      path="/privacy"
    />
    <div className="min-h-screen bg-background">
      <AsiaNavbar />
      <main className="container max-w-4xl py-10 md:py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to home
        </Link>
        <div className="mt-7 rounded-[2rem] border border-primary/20 bg-gradient-hero p-6 shadow-soft md:p-10">
          <span className="pill bg-card/85"><ShieldCheck className="size-3.5 text-primary" /> Privacy notice</span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium md:text-6xl">Clear choices. Limited data.</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            We use only the information needed to run the site, respond to you, and—if you allow it—understand how visitors use public pages.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: August 24, 2026</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: Cookie, title: "Essential storage", text: "Keeps language, privacy choices, and sign-in functions working. It cannot be switched off through the analytics control." },
            { icon: BarChart3, title: "Optional analytics", text: "Loads only after you choose Allow analytics. We group sensitive page paths and do not send form answers or contact details to Google." },
            { icon: LockKeyhole, title: "Your enquiries", text: "Information you enter in the quote flow is used to prepare your WhatsApp message and coordinate your request. It is not added to analytics events." },
          ].map(({ icon: Icon, title, text }) => (
            <section key={title} className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary"><Icon className="size-5" /></span>
              <h2 className="mt-4 font-display text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </section>
          ))}
        </div>

        <div className="mt-10 space-y-8 rounded-[2rem] border border-border bg-card p-6 md:p-10">
          <section>
            <h2 className="font-display text-2xl font-semibold">What optional analytics measures</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              With your permission, Google Analytics may receive a grouped page category, device and browser information, approximate location, and actions such as opening the quote flow or continuing to WhatsApp. Treatment names, provider names, case identifiers, search queries, form fields, email addresses, phone numbers, and notes are excluded from our analytics event parameters.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Advertising safeguards</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Advertising storage, advertising user data, and personalized advertising signals are disabled in our consent configuration. We do not use enquiry details for Google remarketing audiences or enhanced conversions.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Your choices</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You can allow or refuse optional analytics and change that choice later. Refusing analytics does not block access to the site or the free consultation flow.
            </p>
            {analyticsConfigured() ? (
              <button type="button" onClick={openPrivacyChoices} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-foreground px-5 text-sm font-semibold hover:bg-foreground hover:text-background">
                Change privacy choices
              </button>
            ) : (
              <p className="mt-4 text-sm font-semibold text-foreground">Optional analytics is currently inactive.</p>
            )}
          </section>
          <section>
            <h2 className="font-display text-2xl font-semibold">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Questions about privacy or a request concerning information you shared with us? Email
              {" "}<a className="font-semibold text-foreground underline decoration-primary/50 underline-offset-4" href="mailto:hello@cosmetics-asia.com">hello@cosmetics-asia.com</a>.
            </p>
            <a href="mailto:hello@cosmetics-asia.com" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground"><Mail className="size-4 text-primary" /> Email Cosmetics Asia</a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default Privacy;
