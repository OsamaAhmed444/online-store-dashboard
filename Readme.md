# Admin Dashboard

Internal control panel for the store — products, orders, users, and analytics. Talks to the `/admin` endpoints on the shared API.

---

## Running it

```
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev
```

---

## 🎨 Color Palette

Warm Orange theme. Components should use the semantic token names (`bg-background`, `text-foreground`, `bg-primary`, etc.), not the raw hex values — that keeps everything reading from one source of truth and makes dark mode a single variable swap.

| Usage | Name | Hex | Notes |
|---|---|---|---|
| Primary | `primary` | `#F97316` | Main buttons, active nav links |
| Secondary / Accent | `accent` | `#FB923C` | Secondary actions, highlights |
| Background | `background` | `#FFF7ED` | Page background |
| Surface / Card | `card` | `#FFFFFF` | Tables, cards, modals |
| Text — Primary | `foreground` | `#1F2937` | |
| Text — Muted | `muted-foreground` | `#9CA3AF` | Labels, secondary text |
| Border | `border` | `#FFEDD5` | Table and card borders |
| Success | `success` | `#16A34A` | Success toasts, "Delivered" status |
| Warning | `warning` | `#F59E0B` | "Pending" status |
| Danger | `danger` | `#DC2626` | Delete buttons, error states |
| Info | — | — | Not defined in the theme yet. Until it is, use `accent` (`#FB923C`) for "Processing" / "Shipped" status. |

> Dark mode is opt-in via `<html data-theme="dark">` and does not follow OS `prefers-color-scheme`. See `theme.css` for the dark token overrides — the semantic names stay the same, only the values swap.

---

## Routes

Every dashboard route lives under `/dashboard` and sits behind `ProtectedRoute`, which checks for a valid token and `role === 'admin'`. Anyone failing either check gets redirected to `/login`.

### `/login` — Public
Login form with validation. The only unprotected route in the app.

### `/dashboard` — Admin only
Home screen. Shows:
- Stats cards: Revenue, Orders Count, Customers
- Revenue Line Chart (last 7 days)
- Top Products table

### `/dashboard/products` — Admin only
- Products table with image, price, stock
- Search + filter by category and brand
- Pagination

### `/dashboard/products/new` — Admin only
Add-product form — multiple image uploads, sent as `multipart/form-data`.

### `/dashboard/products/:id/edit` — Admin only
Same form in edit mode — can remove existing images and add new ones.

### `/dashboard/orders` — Admin only
- Filter by status (pending, processing, shipped, delivered...)
- Filter by date range
- Color-coded status badge per row

### `/dashboard/orders/:id` — Admin only
Full order detail + status update (dropdown with confirmation).

### `/dashboard/users` — Admin only
- List all users with role and email
- Add a new admin
- Delete a user (confirmation required)
- View a user's orders and saved addresses

### `/dashboard/carts` — Admin only
Read-only view of active customer carts.

---

## Components

### `routes/`
- **ProtectedRoute** — wraps the entire `/dashboard` tree. Reads auth state from `AuthContext`, redirects to `/login` if there's no token or the role isn't admin.

### `components/layout/`
- **DashboardLayout** — the shell every dashboard page renders inside. Holds the Sidebar + Topbar and an `<Outlet />` for the active page.
- **Sidebar** — left nav, active link highlighting via `NavLink`, collapses to a mobile drawer, logout + user info pinned at the bottom.
- **Topbar** — page title + logged-in admin info.

### `components/common/`
Build these first — everything else depends on them.
- **Button**, **Input** — base form elements, consistent styling and disabled states.
- **Modal** — generic modal shell, used by `ConfirmDialog` and the order detail popup.
- **ConfirmDialog** — "are you sure?" prompt, required before every delete action, no exceptions.
- **Spinner** — loading indicator, used per-request, not globally.
- **EmptyState** — shown when a list has no data.
- **Pagination** — page controls, used on the products and orders tables.

### `components/products/`
- **ProductTable** — renders the products list with image, price, stock.
- **ProductForm** — shared by `AddProductPage` and `EditProductPage`. Handles validation and switches between create/update on submit.
- **ImageUploader** — multi-image picker, builds the `FormData` payload.

### `components/orders/`
- **OrdersTable** — order list with filters wired in.
- **OrderStatusBadge** — color-coded pill per status.
- **OrderDetailModal** — expandable order detail, opened inline from the table.

### `components/users/`
- **UsersTable** — list with role and email.
- **AddAdminForm** — form to create a new admin user.

### `components/charts/`
- **RevenueLineChart** — Recharts line chart, last 7 days of revenue.
- **TopProductsTable** — best sellers, shown on the dashboard home.

---

## State

Only auth lives in context (`AuthContext` — user, token, `login()`, `logout()`). Everything else — product lists, form values, loading/error flags — stays local to the page or component that owns it. Don't lift state up unless two unrelated components genuinely need to share it.

---

## Conventions

- Every page owns its own loading and error state — no global spinner.
- Deletes always go through `ConfirmDialog`.
- Uploads always go through `FormData`, never JSON — see `ImageUploader`.
- Every successful mutation fires a toast; errors are shown inline, not just toasted.
