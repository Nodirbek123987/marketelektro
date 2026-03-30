import { Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const CTASection = () => {
  const { t } = useLang();
  return (
    <section className="bg-foreground">
      <div className="container py-16 md:py-20 text-center">
        <h2 className="animate-fade-up text-2xl md:text-3xl font-bold text-background tracking-tight mb-4 text-balance">
          {t("cta.title")}
        </h2>
        <p className="animate-fade-up stagger-1 text-background/60 max-w-md mx-auto mb-8 text-sm md:text-base">
          {t("cta.desc")}
        </p>
        <div className="animate-fade-up stagger-2 flex flex-wrap justify-center gap-3">
          <a href="tel:+998977009890" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97]">
            <Phone className="h-4 w-4" /> {t("cta.call")}
          </a>
          <a href="/contacts" className="inline-flex items-center gap-2 rounded-lg border border-background/20 px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-background/10 active:scale-[0.97]">
            {t("cta.contacts")}
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
