"use client";

import Link from "next/link";

// Mobile view: a stack of cards. Hidden at md and above (ProductTable
// takes over there).
export default function ProductCards({ products, onDelete }) {
  return (
    <div className="md:hidden space-y-3">
      {products.map((p) => (
        <div key={p.id} className="bg-surface border border-line rounded-xl p-3">
          <Link href={`/products/${p.id}`} className="flex gap-3">
            <img
              src={p.thumbnail}
              alt={p.title}
              className="h-16 w-16 rounded-md object-cover border border-line bg-canvas shrink-0"
            />
            <div className="min-w-0">
              <p className="font-medium truncate">{p.title}</p>
              <p className="text-sm text-muted capitalize">{p.category}</p>
              <p className="text-sm mt-1">
                ${p.price} · {p.rating?.toFixed(1) ?? "—"}★ · {p.stock} in stock
              </p>
            </div>
          </Link>
          <div className="flex justify-end gap-4 mt-2 text-sm">
            <Link href={`/products/${p.id}/edit`} className="text-accent">
              Edit
            </Link>
            <button onClick={() => onDelete(p)} className="text-danger">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
