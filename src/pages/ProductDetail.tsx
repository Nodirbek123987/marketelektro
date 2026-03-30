import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Tag, Layers, ChevronRight, Loader2 } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingTelegram from "@/components/FloatingTelegram";
import OrderModal, { type OrderItem } from "@/components/OrderModal";
import { useGroupedProducts } from "@/hooks/useProducts";

const ProductDetailPage = () => {
  const { t } = useLang();
  const { id } = useParams<{ id: string }>();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [orderItem, setOrderItem] = useState<OrderItem | null>(null);

  const { grouped, isLoading } = useGroupedProducts();

  const product = useMemo(
    () => grouped.find((p) => p.id === Number(id)),
    [grouped, id]
  );

  const related = useMemo(
    () => product ? grouped.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : [],
    [grouped, product]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-lg font-semibold mb-2">{t("catalog.notfound")}</p>
            <Link to="/catalog" className="text-sm text-primary font-medium hover:underline underline-offset-4">
              ← {t("product.back")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const variant = product.variants[selectedIdx];
  const hasMultiple = product.variants.length > 1;

  const getVariantLabel = (v: { name: string }) => {
    const stripped = v.name.replace(product.baseName, "").trim();
    return stripped || v.name;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <div className="border-b bg-section-alt">
          <div className="container py-4">
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">{t("nav.home")}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/catalog" className="hover:text-foreground transition-colors">{t("nav.catalog")}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link
                to={`/catalog?category=${encodeURIComponent(product.category)}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {hasMultiple ? product.baseName : variant.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="animate-fade-up">
              <div className="aspect-square rounded-2xl border bg-secondary/20 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.baseName}
                  className="h-full w-full object-contain p-8"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>

            <div className="animate-fade-up stagger-1 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Tag className="h-3.5 w-3.5" />
                {product.category}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-balance leading-tight">
                {hasMultiple ? product.baseName : variant.name}
              </h1>

              <p className="text-sm text-muted-foreground mb-6">
                {t("product.brand")}: <span className="font-medium text-foreground">{product.brand}</span>
              </p>

              {hasMultiple && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    {t("product.variants")} ({product.variants.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedIdx(i)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                          i === selectedIdx
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {getVariantLabel(v)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasMultiple && (
                <div className="rounded-lg bg-secondary/50 px-4 py-3 mb-6">
                  <p className="text-xs text-muted-foreground mb-0.5">{t("product.selected")}</p>
                  <p className="text-sm font-semibold">{variant.name}</p>
                </div>
              )}

              <div className="mb-6">
                <span className="text-xl font-bold text-muted-foreground">{t("catalog.negotiable")}</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-auto">
                <button
                  onClick={() => setOrderItem({ product, selectedVariant: variant.name })}
                  className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] shadow-lg shadow-primary/20"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {t("catalog.order")}
                </button>
                <a
                  href="tel:+998977009890"
                  className="flex items-center gap-2 rounded-lg border px-8 py-3.5 text-sm font-semibold transition-all hover:bg-secondary active:scale-[0.97]"
                >
                  {t("product.call")}
                </a>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6">{t("product.related")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="group flex flex-col rounded-xl border bg-background overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
                  >
                    <div className="aspect-square overflow-hidden bg-secondary/30">
                      <img
                        src={p.image}
                        alt={p.baseName}
                        className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">{p.brand}</p>
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2 mt-1">{p.baseName}</h3>
                      <p className="text-xs font-medium text-muted-foreground mt-2">{t("catalog.negotiable")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingTelegram />
      {orderItem && <OrderModal item={orderItem} onClose={() => setOrderItem(null)} />}
    </div>
  );
};

export default ProductDetailPage;
