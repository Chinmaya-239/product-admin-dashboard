# Product Admin Dashboard

Live demo:https://product-admin-dashboard-two.vercel.app/

A small admin dashboard for the [DummyJSON](https://dummyjson.com) product
catalog, built with Next.js (App Router), React, Tailwind CSS and Axios.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

**Demo login:** username `emilys`, password `emilyspass`.

To build for production:

```bash
npm run build
npm start
```

## What's finished

* **Login** — calls `POST /auth/login`, shows an error message on wrong
credentials, stores the token, and guards every `/products` route (via
`middleware.js`) so they can't be opened while logged out. Logout button
in the top bar clears the session.
* **Product list** — table on desktop, cards on mobile (both rendered,
Tailwind's `md:` breakpoint shows/hides the right one — no JS breakpoint
detection needed).
* **Pagination** — page numbers, Previous/Next, a 10/20/50 page-size
selector, and a "Showing X–Y of Z" line. Built from `limit`/`skip`, no
pagination library.
* **Search** — debounced 500ms, resets to page 1 on change, and is
race-condition safe (see below).
* **Filter + sort** — category dropdown from `/products/categories`, sort
by title/price/rating in either direction.
* **Product details** at `/products/\[id]` — images, description, price,
reviews, and a proper "not found" state for a bad id.
* **Add / edit / delete** — a validated form (required title/category/
description, price > 0, stock ≥ 0, rating 0–5) and a confirm modal before
deleting.
* **Loading / empty / error states** everywhere data is fetched, with a
Retry button on error.
* **URL as state** — `page`, `limit`, `q`, `category`, `sortBy`, `order` all
live in the query string, so refreshing or sharing a link reproduces the
same view. Bad values (`?page=abc`, `?page=999`, an unsupported `?limit=`)
are clamped instead of crashing.

## Notable choices

**Search + category can't be combined by the API.** DummyJSON's
`/products/search` endpoint has no category parameter, and
`/products/category/:cat` has no search parameter. When both are set, the
app fetches a larger batch of search results (`limit=100`) and filters
those by category on the client, then paginates the filtered list itself.
This is simpler than trying to reconcile two separate paginated endpoints,
and DummyJSON's catalog is small enough (194 products) that a 100-item
search batch comfortably covers realistic cases. It's client-side work
instead of server-side, so it's a bit heavier than a normal request, but it
keeps the behavior predictable.

**Add / edit / delete aren't really saved by the API.** DummyJSON accepts
the `POST /products/add`, `PUT /products/:id` and `DELETE /products/:id`
calls and returns a plausible response, but the underlying data never
changes — fetching the product again shows the old values. The app still
makes those calls (so the network traffic a reviewer expects is really
there), but the actual state change is kept in a small `localStorage`
"overrides" store (`lib/localOverrides.js`): edited fields keyed by id,
newly added products (with a locally generated id), and a list of deleted
ids. Every read — the list page, the detail page, the edit form — merges
this store on top of whatever the API returns. One limitation from this
approach: locally added products only show up at the top of page 1 when no
search or category filter is active, so a freshly added item won't appear
"in its sorted position" the way a real backend would place it. That felt
like a reasonable trade-off for a catalog that can't actually be written
to.

**Preventing duplicate requests from fast clicks.** The login button and
the product form's Save button both track a `submitting` boolean and
return early if a submit is already in flight, so mashing the button
doesn't fire multiple requests.

**Preventing stale search results.** Typing quickly against a slow API
(tested with `\&delay=2000` appended to requests) could let an earlier
request's response land after a later one's, showing outdated results. Two
things guard against this: each request carries an incrementing id, and a
response is only applied if its id still matches the latest one issued;
each fetch also passes an `AbortController` signal, so the in-flight
request tied to the previous set of filters is cancelled as soon as a new
one starts.

**Invalid URL values.** `page` and `limit` are parsed defensively —
anything that isn't a positive integer falls back to `1`, and `limit` only
accepts `10`, `20` or `50` (anything else falls back to `10`). A `page`
number past the last page (e.g. `?page=999`) doesn't error; once the empty
result comes back with the real total, the app corrects the URL down to
the last valid page.

## One problem I ran into

Handling the search+category limitation initially caused duplicate/missing
items when paginating a client-filtered list, because I was recomputing
`skip` from the original (unfiltered) page instead of the filtered
results. Fixed by fetching a single larger batch, filtering the whole batch
by category first, and only then slicing out the requested page from the
already-filtered array.

## Where AI helped

I used AI assistance to scaffold the project structure, the Axios
interceptor setup, and the debounced-search/race-condition-safe fetch
pattern, then reviewed and adjusted it component by component. I can walk
through and explain every file.

## Project structure

```
app/
  login/page.js
  products/page.js            product list (search, filter, sort, pagination)
  products/new/page.js
  products/\[id]/page.js       product details
  products/\[id]/edit/page.js
lib/
  axios.js                    shared Axios instance + interceptors
  api/auth.js, api/products.js
  localOverrides.js           local add/edit/delete simulation
components/                   Navbar, SearchBar, FilterSortBar, Pagination,
                               ProductTable, ProductCards, ProductForm,
                               ConfirmModal, Loader, EmptyState, ErrorState
context/AuthContext.js
middleware.js                 route protection
```

