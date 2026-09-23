"use client";

import { useState } from "react";

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.category.trim()) errors.category = "Category is required.";
  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }
  const stock = Number(values.stock);
  if (values.stock === "" || Number.isNaN(stock) || stock < 0) {
    errors.stock = "Stock must be 0 or more.";
  }
  const rating = Number(values.rating);
  if (values.rating !== "" && (Number.isNaN(rating) || rating < 0 || rating > 5)) {
    errors.rating = "Rating must be between 0 and 5.";
  }
  if (!values.description.trim()) errors.description = "Description is required.";
  return errors;
}

export default function ProductForm({ initialValues, submitLabel, onSubmit }) {
  const [values, setValues] = useState({
    title: initialValues?.title || "",
    category: initialValues?.category || "",
    price: initialValues?.price ?? "",
    stock: initialValues?.stock ?? "",
    rating: initialValues?.rating ?? "",
    thumbnail: initialValues?.thumbnail || "",
    description: initialValues?.description || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Guards against a fast double-click sending duplicate save requests.
    if (submitting) return;

    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setFormError("");
    setSubmitting(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        category: values.category.trim(),
        price: Number(values.price),
        stock: Number(values.stock),
        rating: values.rating === "" ? 0 : Number(values.rating),
        thumbnail: values.thumbnail.trim(),
        description: values.description.trim(),
      });
    } catch {
      setFormError("Couldn't save this product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-line rounded-xl p-5 space-y-4 max-w-xl"
    >
      {formError && (
        <div className="rounded-lg bg-danger-light text-danger text-sm px-3 py-2">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
        />
        {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder="e.g. beauty"
          />
          {errors.category && (
            <p className="text-xs text-danger mt-1">{errors.category}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
          />
          {errors.price && <p className="text-xs text-danger mt-1">{errors.price}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
          {errors.stock && <p className="text-xs text-danger mt-1">{errors.stock}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating (0–5)</label>
          <input
            type="number"
            step="0.1"
            className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
            value={values.rating}
            onChange={(e) => update("rating", e.target.value)}
          />
          {errors.rating && <p className="text-xs text-danger mt-1">{errors.rating}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Thumbnail URL (optional)
        </label>
        <input
          className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
          value={values.thumbnail}
          onChange={(e) => update("thumbnail", e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          rows={4}
          className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
        {errors.description && (
          <p className="text-xs text-danger mt-1">{errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-accent hover:bg-accent-dark disabled:opacity-50 text-white text-sm font-medium px-5 py-2"
      >
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
