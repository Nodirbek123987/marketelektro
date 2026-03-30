import { Zap } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="border-t bg-section-alt">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">ELEKTRO MARKET</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">{t("nav.home")}</a>
            <a href="/catalog" className="hover:text-foreground transition-colors">{t("nav.catalog")}</a>
            <a href="/about" className="hover:text-foreground transition-colors">{t("nav.about")}</a>
            <a href="/contacts" className="hover:text-foreground transition-colors">{t("nav.contacts")}</a>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Elektro Market. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
