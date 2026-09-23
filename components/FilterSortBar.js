"use client";

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "title-desc", label: "Title: Z to A" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "rating-desc", label: "Rating: high to low" },
];

export default function FilterSortBar({
  categories,
  category,
  sortBy,
  order,
  onCategoryChange,
  onSortChange,
}) {
  const sortValue = sortBy ? `${sortBy}-${order}` : "";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-line rounded-lg text-sm px-3 py-2 sm:w-56"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={sortValue}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) return onSortChange("", "asc");
          const [field, dir] = val.split("-");
          onSortChange(field, dir);
        }}
        className="border border-line rounded-lg text-sm px-3 py-2 sm:w-56"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
