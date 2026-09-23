import api from "@/lib/axios";

function withSort(params, sortBy, order) {
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  return params;
}

export function fetchProducts({ limit, skip, sortBy, order }, signal) {
  const params = withSort({ limit, skip }, sortBy, order);
  return api.get("/products", { params, signal });
}

export function searchProducts({ q, limit, skip, sortBy, order }, signal) {
  const params = withSort({ q, limit, skip }, sortBy, order);
  return api.get("/products/search", { params, signal });
}

export function fetchProductsByCategory(
  { category, limit, skip, sortBy, order },
  signal
) {
  const params = withSort({ limit, skip }, sortBy, order);
  return api.get(`/products/category/${encodeURIComponent(category)}`, {
    params,
    signal,
  });
}

export function fetchCategories(signal) {
  return api.get("/products/categories", { signal });
}

export function fetchProductById(id, signal) {
  return api.get(`/products/${id}`, { signal });
}

export function addProduct(data) {
  return api.post("/products/add", data);
}

export function updateProduct(id, data) {
  return api.put(`/products/${id}`, data);
}

export function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}

// DummyJSON cannot search (q) and filter by category in the same request.
// When both a search term and a category are active we fetch a larger
// search result set and filter it by category on the client, then paginate
// the filtered list ourselves. See README for the reasoning.
export async function loadProducts(
  { page, limit, q, category, sortBy, order },
  signal
) {
  const skip = (page - 1) * limit;

  if (q && category) {
    const res = await searchProducts(
      { q, limit: 100, skip: 0, sortBy, order },
      signal
    );
    const filtered = res.data.products.filter((p) => p.category === category);
    return {
      products: filtered.slice(skip, skip + limit),
      total: filtered.length,
    };
  }

  if (q) {
    const res = await searchProducts({ q, limit, skip, sortBy, order }, signal);
    return { products: res.data.products, total: res.data.total };
  }

  if (category) {
    const res = await fetchProductsByCategory(
      { category, limit, skip, sortBy, order },
      signal
    );
    return { products: res.data.products, total: res.data.total };
  }

  const res = await fetchProducts({ limit, skip, sortBy, order }, signal);
  return { products: res.data.products, total: res.data.total };
}
