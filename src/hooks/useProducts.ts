import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { groupProducts, type GroupedProduct } from "@/data/products";
import type { Product } from "@/data/products";

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id");

  if (error) throw error;

  return (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price) || 0,
    unit: p.unit || "шт",
    category: p.category,
    brand: p.brand,
    image: p.image,
  }));
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGroupedProducts() {
  const query = useProducts();
  const grouped: GroupedProduct[] = query.data ? groupProducts(query.data) : [];
  return { ...query, grouped };
}
