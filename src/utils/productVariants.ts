import { Product } from "@/types/product";

export const DEFAULT_PRODUCT_SIZES = ["500 ml", "1 L", "2 L", "5 L"] as const;
export type ProductSizeVariant = (typeof DEFAULT_PRODUCT_SIZES)[number];

export function getProductSizes(product?: Product): string[] {
  if (product?.sizes && product.sizes.length > 0) {
    return product.sizes;
  }
  return [...DEFAULT_PRODUCT_SIZES];
}

export function getProductSizePrice(basePrice: number, size: string) {
  if (basePrice === 299) {
    if (size === "500 ml") return { price: 169, oldPrice: 219, discount: "23% OFF" };
    if (size === "1 L") return { price: 299, oldPrice: 399, discount: "25% OFF" };
    if (size === "2 L") return { price: 499, oldPrice: 649, discount: "23% OFF" };
    if (size === "5 L") return { price: 999, oldPrice: 1299, discount: "23% OFF" };
  }

  switch (size) {
    case "500 ml": {
      const p = Math.max(99, Math.round((basePrice * 0.6) / 5) * 5 - 1);
      return { price: p, oldPrice: Math.round(p * 1.3), discount: "23% OFF" };
    }
    case "1 L":
    case "750 ml": {
      return { price: basePrice, oldPrice: Math.round(basePrice * 1.33), discount: "25% OFF" };
    }
    case "2 L": {
      const p = Math.round((basePrice * 1.7) / 10) * 10 - 1;
      return { price: p, oldPrice: Math.round(p * 1.3), discount: "23% OFF" };
    }
    case "5 L": {
      const p = Math.round((basePrice * 3.4) / 10) * 10 - 1;
      return { price: p, oldPrice: Math.round(p * 1.3), discount: "23% OFF" };
    }
    default:
      return { price: basePrice, oldPrice: Math.round(basePrice * 1.3), discount: "20% OFF" };
  }
}

export function getVariantProduct(product: Product, size: string): Product {
  const { price, oldPrice } = getProductSizePrice(product.price, size);
  const baseName = product.name.replace(/\s*\([^)]*\)/g, "").trim();
  const sizeIdx = DEFAULT_PRODUCT_SIZES.indexOf(size as any);
  const variantIdOffset = sizeIdx >= 0 ? (sizeIdx + 1) * 10000 : 0;

  return {
    ...product,
    id: product.id + variantIdOffset,
    name: `${baseName} (${size})`,
    price,
    oldPrice,
    selectedSize: size,
    specifications: {
      ...product.specifications,
      volume: size,
    },
  };
}
