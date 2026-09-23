"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import FilterSortBar from "@/components/FilterSortBar";
import Pagination from "@/components/Pagination";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import ConfirmModal from "@/components/ConfirmModal";
import { loadProducts, fetchCategories, deleteProduct } from "@/lib/api/products";
import { applyOverrides, deleteLocalProduct, getVisibleLocalAdds } from "@/lib/localOverrides";

const PAGE_SIZES = [10, 20, 50];

function parsePage(raw) {
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function parseLimit(raw) {
  const n = parseInt(raw, 10);
  return PAGE_SIZES.includes(n) ? n : 10;
}

function ProductsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const requestId = useRef(0);

  function updateParams(partial) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(partial).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(
    async (signal) => {
      const myId = ++requestId.current;
      setLoading(true);
      setError(false);
      try {
        const { products: apiProducts, total: apiTotal } = await loadProducts(
          { page, limit, q, category, sortBy, order },
          signal
        );
        // Ignore this response if a newer request has since started —
        // guards against a fast typer's earlier request resolving after a
        // later one.
        if (myId !== requestId.current) return;

        let merged = applyOverrides(apiProducts);
        let effectiveTotal = apiTotal;

        if (!q && !category && page === 1) {
          const localAdds = getVisibleLocalAdds();
          merged = [...localAdds, ...merged].slice(0, limit);
          effectiveTotal = apiTotal + localAdds.length;
        }

        setProducts(merged);
        setTotal(effectiveTotal);

        const totalPages = Math.max(1, Math.ceil(effectiveTotal / limit));
        if (apiProducts.length === 0 && effectiveTotal > 0 && page > totalPages) {
          updateParams({ page: totalPages });
        }
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return;
        if (myId !== requestId.current) return;
        setError(true);
      } finally {
        if (myId === requestId.current) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, limit, q, category, sortBy, order]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function handleDeleteConfirmed() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      if (!String(deleteTarget.id).length || deleteTarget.id < 1e12) {
        // Real DummyJSON products have small numeric ids; still call the
        // API so the network request happens even though it won't persist.
        await deleteProduct(deleteTarget.id).catch(() => {});
      }
      deleteLocalProduct(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h1 className="text-lg font-semibold">Products</h1>
          <Link
            href="/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2"
          >
            Add product
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="sm:flex-1">
            <SearchBar
              value={q}
              onDebouncedChange={(val) => updateParams({ q: val, page: 1 })}
            />
          </div>
          <FilterSortBar
            categories={categories}
            category={category}
            sortBy={sortBy}
            order={order}
            onCategoryChange={(val) => updateParams({ category: val, page: 1 })}
            onSortChange={(field, dir) =>
              updateParams({ sortBy: field, order: dir, page: 1 })
            }
          />
        </div>

        {loading && <Loader />}

        {!loading && error && <ErrorState onRetry={() => load()} />}

        {!loading && !error && products.length === 0 && (
          <EmptyState
            description={
              q || category
                ? "Try a different search term or clear your filters."
                : "There are no products to show yet."
            }
          />
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable products={products} onDelete={setDeleteTarget} />
            <ProductCards products={products} onDelete={setDeleteTarget} />
            <Pagination
              page={page}
              limit={limit}
              total={total}
              onPageChange={(p) => updateParams({ page: p })}
              onLimitChange={(l) => updateParams({ limit: l, page: 1 })}
            />
          </>
        )}
      </main>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this product?"
        description={
          deleteTarget ? `"${deleteTarget.title}" will be removed from the list.` : ""
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductsPageInner />
    </Suspense>
  );
}
