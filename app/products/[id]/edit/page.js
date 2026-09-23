"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import ProductForm from "@/components/ProductForm";
import { fetchProductById, updateProduct } from "@/lib/api/products";
import { editLocalProduct, getLocalAdd, getLocalEdit, isDeleted } from "@/lib/localOverrides";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (isDeleted(Number(id))) {
        if (!cancelled) setStatus("notfound");
        return;
      }
      const localAdd = getLocalAdd(Number(id));
      if (localAdd) {
        if (!cancelled) {
          setProduct(localAdd);
          setStatus("found");
        }
        return;
      }
      try {
        const res = await fetchProductById(id);
        if (cancelled) return;
        const edit = getLocalEdit(res.data.id);
        setProduct(edit ? { ...res.data, ...edit } : res.data);
        setStatus("found");
      } catch (err) {
        if (cancelled) return;
        setStatus(err.response?.status === 404 ? "notfound" : "error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(values) {
    // Same story as adding: the PUT call is real but DummyJSON discards
    // it, so the edit is what actually persists inside this app.
    await updateProduct(id, values).catch(() => {});
    editLocalProduct(Number(id), values);
    router.push(`/products/${id}`);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-lg font-semibold mb-4">Edit product</h1>

        {status === "loading" && <Loader label="Loading product…" />}

        {status === "error" && (
          <div className="text-center py-16 border border-line rounded-xl bg-danger-light">
            <p className="font-medium text-danger">Couldn't load this product.</p>
          </div>
        )}

        {status === "notfound" && (
          <div className="text-center py-16 border border-dashed border-line rounded-xl">
            <p className="font-medium">Product not found</p>
          </div>
        )}

        {status === "found" && product && (
          <ProductForm
            initialValues={product}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}
