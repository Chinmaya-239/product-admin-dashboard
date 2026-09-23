// DummyJSON's add/edit/delete endpoints accept the request and return a
// realistic response, but they never actually change the underlying data —
// fetching the product again afterwards shows the old values. To make
// changes feel real inside this app, we keep a small local overrides store
// in localStorage and merge it into whatever the API returns:
//   - edits:   { [productId]: { fieldsThatChanged } }
//   - adds:    products created in this app (given a local id)
//   - deletes: ids that should be hidden from the list
const KEY = "productOverrides";

function read() {
  if (typeof window === "undefined") {
    return { edits: {}, adds: [], deletes: [] };
  }
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { edits: {}, adds: [], deletes: [] };
  } catch {
    return { edits: {}, adds: [], deletes: [] };
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function addLocalProduct(product) {
  const data = read();
  const id = Date.now();
  const newProduct = {
    rating: 0,
    stock: 0,
    thumbnail: "",
    images: [],
    description: "",
    ...product,
    id,
    isLocal: true,
  };
  data.adds.unshift(newProduct);
  write(data);
  return newProduct;
}

export function editLocalProduct(id, changes) {
  const data = read();
  const existingAddIndex = data.adds.findIndex((p) => p.id === id);
  if (existingAddIndex !== -1) {
    data.adds[existingAddIndex] = { ...data.adds[existingAddIndex], ...changes };
  } else {
    data.edits[id] = { ...(data.edits[id] || {}), ...changes };
  }
  write(data);
}

export function deleteLocalProduct(id) {
  const data = read();
  data.adds = data.adds.filter((p) => p.id !== id);
  if (!data.deletes.includes(id)) data.deletes.push(id);
  delete data.edits[id];
  write(data);
}

export function isDeleted(id) {
  return read().deletes.includes(id);
}

export function getLocalAdd(id) {
  return read().adds.find((p) => p.id === id) || null;
}

export function getLocalEdit(id) {
  return read().edits[id] || null;
}

export function getVisibleLocalAdds() {
  const { adds, deletes } = read();
  return adds.filter((p) => !deletes.includes(p.id));
}

// Merge overrides into a page of products that came from the API.
export function applyOverrides(products) {
  const { edits, deletes } = read();
  return products
    .filter((p) => !deletes.includes(p.id))
    .map((p) => (edits[p.id] ? { ...p, ...edits[p.id] } : p));
}
