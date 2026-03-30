import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Upload, Search, Pencil, Save, X, Loader2, ImagePlus, Link as LinkIcon, Settings, Eye, EyeOff } from "lucide-react";
import staticProducts from "@/data/products-raw";
import { useToast } from "@/hooks/use-toast";

interface DBProduct {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  brand: string;
  image: string;
}

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border bg-background p-8 shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-center">Админ панель</h1>
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

const ImageEditor = ({ currentImage, onSave, onCancel }: { currentImage: string; onSave: (url: string) => void; onCancel: () => void }) => {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [urlValue, setUrlValue] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    onSave(data.publicUrl);
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border bg-secondary/30">
      <div className="flex gap-1 mb-1">
        <button
          onClick={() => setMode("url")}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${mode === "url" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
        >
          <LinkIcon className="h-3 w-3" /> URL
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors ${mode === "upload" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
        >
          <ImagePlus className="h-3 w-3" /> Загрузить
        </button>
      </div>
      {mode === "url" ? (
        <div className="flex gap-2">
          <input
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded border px-2 py-1.5 text-xs outline-none focus:border-primary"
          />
          <button onClick={() => onSave(urlValue)} className="rounded bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:brightness-110">
            <Save className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-medium hover:bg-secondary disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
            {uploading ? "Загрузка..." : "Выбрать файл"}
          </button>
        </div>
      )}
      <button onClick={onCancel} className="text-xs text-muted-foreground hover:underline self-end">Отмена</button>
    </div>
  );
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<DBProduct>>({});
  const [seeding, setSeeding] = useState(false);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("id");
    setProducts((data as DBProduct[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    const batch = staticProducts.map((p) => ({
      name: p.name, price: p.price, unit: p.unit, category: p.category, brand: p.brand, image: p.image,
    }));
    for (let i = 0; i < batch.length; i += 100) {
      const { error } = await supabase.from("products").insert(batch.slice(i, i + 100));
      if (error) {
        toast({ title: "Ошибка импорта", description: error.message, variant: "destructive" });
        setSeeding(false);
        return;
      }
    }
    toast({ title: "Импорт завершён", description: `${batch.length} товаров загружено` });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    fetchProducts();
    setSeeding(false);
  };

  const startEdit = (p: DBProduct) => {
    setEditingId(p.id);
    setEditForm({ name: p.name, price: p.price, unit: p.unit, category: p.category, brand: p.brand, image: p.image });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("products").update({ ...editForm, updated_at: new Date().toISOString() }).eq("id", editingId);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Сохранено" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingId(null);
      fetchProducts();
    }
  };

  const saveImage = async (productId: number, newUrl: string) => {
    const { error } = await supabase.from("products").update({ image: newUrl, updated_at: new Date().toISOString() }).eq("id", productId);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Изображение обновлено" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingImageId(null);
      fetchProducts();
    }
  };

  const handleSaveSettings = async () => {
    if (!currentPassword) {
      toast({ title: "Введите текущий пароль", variant: "destructive" });
      return;
    }

    setSavingSettings(true);

    // Re-authenticate with current password
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      toast({ title: "Ошибка", description: "Не удалось получить текущий email", variant: "destructive" });
      setSavingSettings(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (authError) {
      toast({ title: "Неверный текущий пароль", variant: "destructive" });
      setSavingSettings(false);
      return;
    }

    const updates: { email?: string; password?: string } = {};
    if (newEmail.trim()) updates.email = newEmail.trim();
    if (newPassword.trim()) updates.password = newPassword.trim();

    if (Object.keys(updates).length === 0) {
      toast({ title: "Нечего обновлять", variant: "destructive" });
      setSavingSettings(false);
      return;
    }

    const { error } = await supabase.auth.updateUser(updates);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Данные обновлены" });
      setCurrentPassword("");
      setNewEmail("");
      setNewPassword("");
      setShowSettings(false);
    }
    setSavingSettings(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex items-center justify-between py-3">
          <h1 className="text-lg font-bold">Админ панель — Товары ({products.length})</h1>
          <div className="flex items-center gap-2">
            {products.length === 0 && (
              <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50">
                {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Импорт товаров
              </button>
            )}
            <button onClick={() => setShowSettings(!showSettings)} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${showSettings ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <Settings className="h-4 w-4" /> Настройки
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-secondary">
              <LogOut className="h-4 w-4" /> Выйти
            </button>
          </div>
        </div>
        {showSettings && (
          <div className="container border-t py-4">
            <div className="max-w-md space-y-3">
              <h2 className="text-sm font-semibold">Изменить учётные данные</h2>
              <div className="relative">
                <input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="Текущий пароль *"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pr-10"
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <input
                type="email"
                placeholder="Новый email (оставьте пустым если не меняете)"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  placeholder="Новый пароль (оставьте пустым если не меняете)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pr-10"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings || !currentPassword}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50"
              >
                {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Сохранить
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="container py-6">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск товаров..." className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="rounded-xl border bg-background overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/50">
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Изображение</th>
                    <th className="px-4 py-3 text-left font-medium">Название</th>
                    <th className="px-4 py-3 text-left font-medium">Цена</th>
                    <th className="px-4 py-3 text-left font-medium">Ед.</th>
                    <th className="px-4 py-3 text-left font-medium">Категория</th>
                    <th className="px-4 py-3 text-left font-medium">Бренд</th>
                    <th className="px-4 py-3 text-left font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-2 text-muted-foreground">{p.id}</td>
                      <td className="px-4 py-2">
                        <div className="relative group">
                          <img src={p.image} alt="" className="h-10 w-10 rounded object-contain bg-secondary/30" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                          <button
                            onClick={() => setEditingImageId(editingImageId === p.id ? null : p.id)}
                            className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 rounded-full bg-primary p-1 text-primary-foreground transition-opacity"
                          >
                            <ImagePlus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                        {editingImageId === p.id && (
                          <div className="mt-2 min-w-[250px]">
                            <ImageEditor currentImage={p.image} onSave={(url) => saveImage(p.id, url)} onCancel={() => setEditingImageId(null)} />
                          </div>
                        )}
                      </td>
                      {editingId === p.id ? (
                        <>
                          <td className="px-4 py-2"><input value={editForm.name ?? ""} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-primary" /></td>
                          <td className="px-4 py-2"><input type="number" value={editForm.price ?? 0} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-20 rounded border px-2 py-1 text-sm outline-none focus:border-primary" /></td>
                          <td className="px-4 py-2"><input value={editForm.unit ?? ""} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} className="w-16 rounded border px-2 py-1 text-sm outline-none focus:border-primary" /></td>
                          <td className="px-4 py-2"><input value={editForm.category ?? ""} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-primary" /></td>
                          <td className="px-4 py-2"><input value={editForm.brand ?? ""} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} className="w-full rounded border px-2 py-1 text-sm outline-none focus:border-primary" /></td>
                          <td className="px-4 py-2">
                            <div className="flex gap-1">
                              <button onClick={saveEdit} className="rounded bg-primary p-1.5 text-primary-foreground hover:brightness-110"><Save className="h-3.5 w-3.5" /></button>
                              <button onClick={() => setEditingId(null)} className="rounded border p-1.5 hover:bg-secondary"><X className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 max-w-[300px] truncate">{p.name}</td>
                          <td className="px-4 py-2">{p.price}</td>
                          <td className="px-4 py-2">{p.unit}</td>
                          <td className="px-4 py-2">{p.category}</td>
                          <td className="px-4 py-2">{p.brand}</td>
                          <td className="px-4 py-2">
                            <button onClick={() => startEdit(p)} className="rounded border p-1.5 hover:bg-secondary transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [session, setSession] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setChecking(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return session ? <AdminDashboard /> : <AdminLogin onLogin={() => {}} />;
};

export default AdminPage;
