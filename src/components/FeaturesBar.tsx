import { Truck, ShieldCheck, Headphones, Boxes } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const FeaturesBar = () => {
  const { t } = useLang();
  const features = [
    { icon: Truck, title: t("feat.delivery"), desc: t("feat.delivery.desc") },
    { icon: ShieldCheck, title: t("feat.quality"), desc: t("feat.quality.desc") },
    { icon: Headphones, title: t("feat.support"), desc: t("feat.support.desc") },
    { icon: Boxes, title: t("feat.products"), desc: t("feat.products.desc") },
  ];

  return (
    <section className="border-b bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`animate-fade-up stagger-${i + 1} flex items-center gap-4`}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-soft text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
