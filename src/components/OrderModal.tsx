import { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { z } from "zod";
import type { GroupedProduct } from "@/data/products";

const orderSchema = z.object({
  name: z.string().trim().min(1, "Введите имя").max(100),
  phone: z.string().trim().min(5, "Введите телефон").max(20),
  comment: z.string().max(500).optional(),
});

export interface OrderItem {
  product: GroupedProduct;
  selectedVariant: string;
}

const OrderModal = ({
  item,
  onClose,
}: {
  item: OrderItem;
  onClose: () => void;
}) => {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.functions.invoke("send-telegram-order", {
        body: {
          customerName: form.name,
          customerPhone: form.phone,
          comment: form.comment || "",
          productName: item.selectedVariant,
          category: item.product.category,
          brand: item.product.brand,
        },
      });
      if (error) throw error;
      setSent(true);
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      console.error("Order error:", err);
      setErrors({ form: t("order.error") });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-md hover:bg-secondary transition-colors">
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-bold mb-1">{t("order.title")}</h3>
        <p className="text-sm text-muted-foreground mb-5 line-clamp-1">{item.selectedVariant}</p>

        {sent ? (
          <div className="flex flex-col items-center py-8 gap-3 text-center">
            <CheckCircle className="h-12 w-12 text-success" />
            <p className="font-semibold">{t("order.success")}</p>
            <p className="text-sm text-muted-foreground">{t("order.success.desc")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("contacts.form.name")}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full rounded-lg border bg-background py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.name ? "border-destructive" : ""}`}
                maxLength={100}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("contacts.form.phone")}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+998"
                className={`w-full rounded-lg border bg-background py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.phone ? "border-destructive" : ""}`}
                maxLength={20}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t("order.comment")}</label>
              <textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={2}
                className="w-full rounded-lg border bg-background py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                maxLength={500}
              />
            </div>
            {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
            >
              {sending ? (
                <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t("order.send")}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
