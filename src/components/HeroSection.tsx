import { ArrowRight, Zap } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  const { t } = useLang();
  return (
    <section className="relative min-h-[520px] flex items-center overflow-hidden">
      <img src={heroBanner} alt="Электротовары" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/75" />
      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-xl space-y-6">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </div>
          <h1 className="animate-fade-up stagger-1 text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-background text-balance">
            {t("hero.title")}
          </h1>
          <p className="animate-fade-up stagger-2 text-base md:text-lg text-background/70 max-w-md leading-relaxed">
            {t("hero.desc")}
          </p>
          <div className="animate-fade-up stagger-3 flex flex-wrap gap-3">
            <a href="/catalog" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] shadow-lg shadow-primary/25">
              {t("hero.catalog")} <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/about" className="inline-flex items-center gap-2 rounded-lg border border-background/30 px-6 py-3 text-sm font-semibold text-background backdrop-blur-sm transition-all hover:bg-background/10 active:scale-[0.97]">
              {t("hero.about")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
