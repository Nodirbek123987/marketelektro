import { useState } from "react";
import { Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(20),
  message: z.string().trim().min(1).max(1000),
});

const ContactsPage = () => {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", phone: "", message: "" });
  };

  const infoCards = [
    { icon: Phone, label: t("contacts.phone"), value: "+998 97 700 98 90", href: "tel:+998977009890" },
    { icon: MapPin, label: t("contacts.address"), value: t("contacts.address.value"), href: undefined },
    { icon: Clock, label: t("contacts.hours"), value: t("contacts.hours.value"), href: undefined },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <div className="bg-section-alt border-b">
          <div className="container py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t("contacts.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("contacts.subtitle")}</p>
          </div>
        </div>

        <div className="container py-12">
          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {infoCards.map((card, i) => (
              <div
                key={i}
                className={`animate-fade-up stagger-${i + 1} flex items-start gap-4 rounded-xl border bg-background p-5`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-soft text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                  {card.href ? (
                    <a href={card.href} className="text-sm font-semibold hover:text-primary transition-colors">
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold">{card.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact form */}
            <div className="animate-fade-up stagger-4">
              <h2 className="text-xl font-bold mb-6">{t("contacts.form.title")}</h2>
              {submitted && (
                <div className="flex items-center gap-2 rounded-lg bg-success-light border border-success/30 p-4 mb-6 text-sm text-success-foreground">
                  <CheckCircle className="h-4 w-4" />
                  {t("contacts.form.success")}
                </div>
              )}
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
                    className={`w-full rounded-lg border bg-background py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.phone ? "border-destructive" : ""}`}
                    maxLength={20}
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("contacts.form.message")}</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className={`w-full rounded-lg border bg-background py-2.5 px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none ${errors.message ? "border-destructive" : ""}`}
                    maxLength={1000}
                  />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97]"
                >
                  <Send className="h-4 w-4" />
                  {t("contacts.form.send")}
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="animate-fade-up stagger-5">
              <h2 className="text-xl font-bold mb-6">{t("contacts.map")}</h2>
              <div className="rounded-xl overflow-hidden border aspect-[4/3]">
                <iframe
                  title="Elektro Market location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=69.24402836570548%2C41.35399340400994%2C69.25002836570548%2C41.35799340400994&layer=mapnik&marker=41.35599340400994%2C69.24702836570548"
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=41.35599340400994&mlon=69.24702836570548#map=17/41.35599/69.24703`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-medium hover:underline underline-offset-4"
              >
                <MapPin className="h-3.5 w-3.5" />
                {t("contacts.address.value")}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactsPage;
