import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ShoppingBag, Package, Loader2 } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingTelegram from "@/components/FloatingTelegram";
import OrderModal, { type OrderItem } from "@/components/OrderModal";
import { useGroupedProducts } from "@/hooks/useProducts";
import type { GroupedProduct } from "@/data/products";

const CATEGORIES = [
  "Кабельные наконечники",
  "Изолированные наконечники",
  "Низковольтная продукция",
  "Измерительные приборы",
  "Клеммы и шины",
  "Монтажные аксессуары",
  "Термоусадка и изоляция",
  "Инструменты",
];

const catTranslationKeys: Record<string, string> = {
  "Измерительные приборы": "cat.measuring",
  "Изолированные наконечники": "cat.insulated",
  "Инструменты": "cat.tools",
  "Кабельные наконечники": "cat.cable",
  "Клеммы и шины": "cat.terminals",
  "Монтажные аксессуары": "cat.mounting",
  "Низковольтная продукция": "cat.lowvolt",
  "Термоусадка и изоляция": "cat.heatshrink",
};

const ProductCard = ({
  product,
  onOrder,
}: {
  product: GroupedProduct;
  onOrder: (item: OrderItem) => void;
}) => {
  const { t } = useLang();
  const hasMultiple = product.variants.length > 1;

  return (
    <div className="group flex flex-col rounded-xl border bg-background overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.baseName}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4 gap-1.5 sm:gap-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-semibold leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] hover:text-primary transition-colors">
            {product.baseName}
          </h3>
        </Link>

        <div className="mt-auto pt-3 space-y-2">
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground block">{t("catalog.negotiable")}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onOrder({ product, selectedVariant: product.variants[0].name });
            }}
            className="flex w-full h-8 sm:h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-2 sm:px-3 text-[11px] sm:text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.95]"
          >
            <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
            <span className="truncate">{t("catalog.order")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CatalogPage = () => {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);

  const { grouped, isLoading } = useGroupedProducts();

  const filtered = useMemo(() => {
    let result = grouped;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.baseName.toLowerCase().includes(q) ||
          p.variants.some((v) => v.name.toLowerCase().includes(q)) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    return result;
  }, [grouped, activeCategory, searchQuery]);

  const handleCategoryClick = (cat: string) => {
    if (cat === activeCategory) {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <div className="bg-section-alt border-b">
          <div className="container py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t("catalog.title")}</h1>
            <p className="text-muted-foreground text-sm">
              {filtered.length} {t("catalog.items")}
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("catalog.search")}
                  className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSearchParams({})}
                  className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-colors active:scale-[0.98] ${!activeCategory ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                >
                  {t("catalog.all")}
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 text-sm font-medium transition-colors active:scale-[0.98] ${activeCategory === cat ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                  >
                    {t(catTranslationKeys[cat] || cat)}
                  </button>
                ))}
              </div>
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onOrder={setOrderItem} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="font-semibold">{t("catalog.notfound")}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("catalog.notfound.desc")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingTelegram />
      {orderItem && <OrderModal item={orderItem} onClose={() => setOrderItem(null)} />}
    </div>
  );
};

export default CatalogPage;
