"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import { fetchProductById } from "@/lib/api/products";
import { getLocalAdd, getLocalEdit, isDeleted } from "@/lib/localOverrides";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | found | notfound | error

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");

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

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/products" className="text-sm text-accent hover:underline">
          ← Back to products
        </Link>

        {status === "loading" && <Loader label="Loading product…" />}

        {status === "error" && (
          <div className="mt-6 text-center py-16 border border-line rounded-xl bg-danger-light">
            <p className="font-medium text-danger">Couldn't load this product.</p>
          </div>
        )}

        {status === "notfound" && (
          <div className="mt-6 text-center py-16 border border-dashed border-line rounded-xl">
            <p className="font-medium">Product not found</p>
            <p className="text-sm text-muted mt-1">
              There's no product with id "{id}".
            </p>
          </div>
        )}

        {status === "found" && product && (
          <div className="mt-6 grid sm:grid-cols-2 gap-6">
            <div>
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full rounded-xl border border-line object-cover bg-surface aspect-square"
              />
              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {product.images.slice(0, 5).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="h-16 w-16 rounded-md border border-line object-cover shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-muted capitalize">{product.category}</p>
              <h1 className="text-xl font-semibold mt-1">{product.title}</h1>
              <p className="text-2xl font-semibold mt-3">${product.price}</p>
              <p className="text-sm text-muted mt-1">
                {product.rating?.toFixed(1) ?? "—"}★ · {product.stock} in stock
              </p>
              <p className="text-sm mt-4 leading-relaxed">{product.description}</p>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="rounded-lg bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2"
                >
                  Edit
                </Link>
              </div>

              {product.reviews?.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold mb-2">Reviews</h2>
                  <div className="space-y-3">
                    {product.reviews.map((r, i) => (
                      <div
                        key={i}
                        className="border border-line rounded-lg p-3 text-sm bg-surface"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{r.reviewerName}</span>
                          <span className="text-muted">{r.rating}★</span>
                        </div>
                        <p className="text-muted mt-1">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
