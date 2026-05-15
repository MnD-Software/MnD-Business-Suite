import ProductPageClient from "./ProductPageClient";

export const dynamic = "force-dynamic";

type PageParams = {
  params: {
    org: string;
    sku: string;
  };
};

export async function generateMetadata({ params }: PageParams) {
  try {
    const res = await fetch(`/api/store/${params.org}/products/${params.sku}`, { cache: "no-store" });
    if (!res.ok) return {};

    const product = await res.json();
    return {
      title: product.meta_title || product.name,
      description: product.meta_description || product.description,
      openGraph: {
        title: product.meta_title || product.name,
        description: product.meta_description || product.description,
        images: product.image_url ? [product.image_url] : [],
      },
    };
  } catch {
    return {};
  }
}

export default function ProductPage() {
  return <ProductPageClient />;
}
