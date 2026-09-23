"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductForm from "@/components/ProductForm";
import { addProduct } from "@/lib/api/products";
import { addLocalProduct } from "@/lib/localOverrides";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(values) {
    // DummyJSON accepts this and returns a fake new product, but it never
    // actually saves it — so we keep our own local copy and treat that as
    // the source of truth for anything added in this app.
    await addProduct(values).catch(() => {});
    addLocalProduct(values);
    router.push("/products");
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-lg font-semibold mb-4">Add product</h1>
        <ProductForm submitLabel="Add product" onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
