import {
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Search,
  Eye,
} from "lucide-react";

const carts = [
  {
    id: "#CART-001",
    user: "Mohany Etify",
    items: 4,
    total: "$1,680",
    status: "Active",
  },
  {
    id: "#CART-002",
    user: "Mohamed Amaar",
    items: 2,
    total: "$1,120",
    status: "Active",
  },
  {
    id: "#CART-003",
    user: "Omar Hassan",
    items: 5,
    total: "$780",
    status: "Completed",
  },
  {
    id: "#CART-004",
    user: "Youssef Ahmed",
    items: 3,
    total: "$1,360",
    status: "Active",
  },
  {
    id: "#CART-005",
    user: "Mohamed Adel",
    items: 1,
    total: "$320",
    status: "Completed",
  },
];

export default function CartsViewPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-orange-500">
              Cart Management
            </p>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Manage Carts
            </h1>

            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
              View and manage customer shopping carts
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search carts..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-base outline-none transition focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Total Carts
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                856
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-500/10">
              <ShoppingCart size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Active Carts
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                324
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-500/10">
              <Package size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Cart Value
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                $48,250
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-500 dark:bg-emerald-500/10">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                612
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-500 dark:bg-purple-500/10">
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[750px]">
            <div className="grid grid-cols-12 bg-slate-100 px-5 py-4 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <div className="col-span-2">Cart ID</div>

              <div className="col-span-3">Customer</div>

              <div className="col-span-2">Items</div>

              <div className="col-span-2">Total</div>

              <div className="col-span-2">Status</div>

              <div className="col-span-1 text-right">View</div>
            </div>

            {carts.map((cart) => (
              <div
                key={cart.id}
                className="grid grid-cols-12 items-center border-t border-slate-200 px-5 py-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
              >
                <div className="col-span-2 text-base font-semibold text-slate-900 dark:text-white">
                  {cart.id}
                </div>

                <div className="col-span-3 truncate pr-3 text-base text-slate-700 dark:text-slate-300">
                  {cart.user}
                </div>

                <div className="col-span-2 text-base text-slate-500 dark:text-slate-400">
                  {cart.items} items
                </div>

                <div className="col-span-2 text-base font-semibold text-slate-900 dark:text-white">
                  {cart.total}
                </div>

                <div className="col-span-2">
                  <span
                    className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${
                      cart.status === "Active"
                        ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                        : "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                    }`}
                  >
                    {cart.status}
                  </span>
                </div>

                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-orange-500 hover:text-orange-500 dark:border-slate-700"
                  >
                    <Eye size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
