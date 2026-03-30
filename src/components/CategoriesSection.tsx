import { ArrowRight, Gauge, Cable, Wrench, Zap, Grid3X3, Package, Lightbulb, Flame } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const CategoriesSection = () => {
  const { t } = useLang();

  const categories = [
    { icon: Gauge, label: t("cat.measuring"), key: "Измерительные приборы" },
    { icon: Cable, label: t("cat.insulated"), key: "Изолированные наконечники" },
    { icon: Wrench, label: t("cat.tools"), key: "Инструменты" },
    { icon: Zap, label: t("cat.cable"), key: "Кабельные наконечники" },
    { icon: Grid3X3, label: t("cat.terminals"), key: "Клеммы и шины" },
    { icon: Package, label: t("cat.mounting"), key: "Монтажные аксессуары" },
    { icon: Lightbulb, label: t("cat.lowvolt"), key: "Низковольтная продукция" },
    { icon: Flame, label: t("cat.heatshrink"), key: "Термоусадка и изоляция" },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("cat.title")}</h2>
          <a href="/catalog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
            {t("cat.all")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <a
              key={cat.key}
              href={`/catalog?category=${encodeURIComponent(cat.key)}`}
              className={`animate-fade-up stagger-${i + 1} group flex flex-col items-center gap-3 rounded-xl border bg-background p-6 text-center transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.97]`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <cat.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{cat.label}</span>
            </a>
          ))}
        </div>
        <div className="sm:hidden mt-6 text-center">
          <a href="/catalog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            {t("cat.all")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
