"use client";

import Link from "next/link";

// Desktop view: a table. Hidden below the md breakpoint (ProductCards
// takes over there).
export default function ProductTable({ products, onDelete }) {
  return (
    <table className="hidden md:table w-full text-sm border-separate border-spacing-y-2">
      <thead>
        <tr className="text-left text-muted">
          <th className="px-3 font-medium">Product</th>
          <th className="px-3 font-medium">Category</th>
          <th className="px-3 font-medium">Price</th>
          <th className="px-3 font-medium">Rating</th>
          <th className="px-3 font-medium">Stock</th>
          <th className="px-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="bg-surface">
            <td className="px-3 py-2 rounded-l-xl">
              <Link href={`/products/${p.id}`} className="flex items-center gap-3">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  className="h-10 w-10 rounded-md object-cover border border-line bg-canvas"
                />
                <span className="font-medium hover:text-accent">{p.title}</span>
              </Link>
            </td>
            <td className="px-3 py-2 capitalize text-muted">{p.category}</td>
            <td className="px-3 py-2">${p.price}</td>
            <td className="px-3 py-2">{p.rating?.toFixed(1) ?? "—"}</td>
            <td className="px-3 py-2">{p.stock}</td>
            <td className="px-3 py-2 rounded-r-xl">
              <div className="flex justify-end gap-3">
                <Link
                  href={`/products/${p.id}/edit`}
                  className="text-accent hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(p)}
                  className="text-danger hover:underline"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
