import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";

type CompanyPageLayoutProps = {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  path: string;
  title: string;
};

const CompanyPageLayout = ({ children, description, eyebrow, icon: Icon, path, title }: CompanyPageLayoutProps) => (
  <>
    <PageMeta title={title} description={description} path={path} />
    <div className="min-h-screen bg-background">
      <AsiaNavbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-hero/70">
          <div className="container py-10 md:py-16">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="size-4" /> Back to home
            </Link>
            <div className="mt-7 max-w-3xl">
              <span className="pill bg-card/85"><Icon className="size-3.5 text-primary" /> {eyebrow}</span>
              <h1 className="mt-5 font-display text-4xl font-medium leading-[1.04] tracking-tight md:text-6xl">{title}</h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
            </div>
          </div>
        </section>
        <div className="container max-w-4xl space-y-6 py-10 md:py-16">{children}</div>
      </main>
      <Footer />
    </div>
  </>
);

export default CompanyPageLayout;
