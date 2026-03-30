export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  brand: string;
  image: string;
}

export interface GroupedProduct {
  id: number;
  baseName: string;
  category: string;
  brand: string;
  image: string;
  variants: {
    id: number;
    name: string;
    unit: string;
  }[];
}

function getGroupKey(name: string): string {
  const base = name
    .replace(/\s*\(\d+шт\)/g, "")
    .replace(/\d+[.,]\d+/g, "N")
    .replace(/\d+[/x×-]+\d+/g, "N")
    .replace(/\b\d+\b/g, "N")
    .replace(/N+/g, "")
    .replace(/\s*-\s*/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[-\s]+$/, "")
    .trim()
    .toLowerCase();
  return base.length >= 2 ? base : "SINGLE::" + name;
}

function getCommonPrefix(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  let prefix = names[0];
  for (let i = 1; i < names.length; i++) {
    while (!names[i].startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix.replace(/[\s\-,]+$/, "").trim() || names[0];
}

export function groupProducts(products: Product[]): GroupedProduct[] {
  const map = new Map<string, Product[]>();

  products.forEach((p) => {
    const key = p.category + "::" + getGroupKey(p.name);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  });

  const result: GroupedProduct[] = [];

  map.forEach((items) => {
    const first = items[0];
    if (items.length === 1) {
      result.push({
        id: first.id,
        baseName: first.name,
        category: first.category,
        brand: first.brand,
        image: first.image,
        variants: [{ id: first.id, name: first.name, unit: first.unit }],
      });
    } else {
      const baseName = getCommonPrefix(items.map((i) => i.name));
      result.push({
        id: first.id,
        baseName,
        category: first.category,
        brand: first.brand,
        image: first.image, // Use first product's image for the group
        variants: items.map((p) => ({
          id: p.id,
          name: p.name,
          unit: p.unit,
        })),
      });
    }
  });

  return result;
}
