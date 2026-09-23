"use client";

// Renders page numbers (with ellipses for large ranges), Previous/Next
// buttons, a page size selector, and the "Showing X-Y of Z" text.
export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);

  function pageNumbers() {
    const pages = [];
    const window = 1;
    for (let p = 1; p <= totalPages; p++) {
      if (
        p === 1 ||
        p === totalPages ||
        (p >= safePage - window && p <= safePage + window)
      ) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
      <p className="text-sm text-muted">
        {total === 0 ? "Showing 0 of 0" : `Showing ${start}–${end} of ${total}`}
      </p>

      <div className="flex items-center gap-3">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-line rounded-lg text-sm px-2 py-1.5"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
            className="rounded-lg border border-line text-sm px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>

          {pageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className="px-2 text-sm text-muted">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`rounded-lg text-sm px-3 py-1.5 border ${
                  p === safePage
                    ? "bg-accent text-white border-accent"
                    : "border-line hover:bg-canvas"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-line text-sm px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
