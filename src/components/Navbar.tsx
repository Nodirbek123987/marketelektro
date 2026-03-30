import { Search, ShoppingCart, Menu, Zap, X, Globe, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLang } from "@/contexts/LangContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.catalog"), href: "/catalog" },
    { label: t("nav.about"), href: "/about" },
    { label: t("nav.contacts"), href: "/contacts" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container flex items-center justify-between gap-4 py-3">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <span className="text-lg font-extrabold tracking-tight">ELEKTRO</span>
            <span className="block text-[10px] font-bold tracking-[0.25em] text-primary">MARKET</span>
          </div>
        </a>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("nav.search")}
              className="w-full rounded-lg border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-secondary hover:text-foreground text-muted-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <button
            onClick={() => setLang(lang === "ru" ? "uz" : "ru")}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all hover:bg-secondary active:scale-[0.97]"
            title={lang === "ru" ? "O'zbek tiliga o'tish" : "Переключить на русский"}
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "ru" ? "UZ" : "RU"}
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all hover:bg-secondary active:scale-[0.97]"
            title="Админ панель"
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>
          <button className="flex items-center gap-2 rounded-lg border bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 active:scale-[0.97]">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nav.cart")}</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-background animate-fade-in">
          <div className="container py-3 space-y-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("nav.search")}
                className="w-full rounded-lg border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm outline-none"
              />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
