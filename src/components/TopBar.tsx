import { Phone } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const TopBar = () => {
  const { t } = useLang();
  return (
    <div className="bg-topbar text-topbar-foreground">
      <div className="container flex items-center justify-between py-2 text-sm">
        <a href="tel:+998977009890" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Phone className="h-3.5 w-3.5" />
          +998 97 700 98 90
        </a>
        <span className="hidden sm:block">{t("topbar.delivery")}</span>
      </div>
    </div>
  );
};

export default TopBar;
