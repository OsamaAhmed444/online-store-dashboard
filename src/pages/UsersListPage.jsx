import {
  Users,
  ShieldCheck,
  UserRound,
  UserCheck,
  Search,
  UserPlus,
} from "lucide-react";

import UsersTable from "../components/users/UsersTable";

export default function UsersListPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 dark:bg-slate-950 sm:p-6 lg:p-8">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-orange-500">
              User Management
            </p>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Manage Users
            </h1>

            <p className="mt-1 text-base text-slate-500 dark:text-slate-400">
              Manage users and their account information
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search users..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-base outline-none transition focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 text-base font-semibold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Total Users
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                4,120
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-500/10">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Admins
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                2
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-500 dark:bg-purple-500/10">
              <ShieldCheck size={22} />
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
                4,118
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-500/10">
              <UserRound size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-slate-500 dark:text-slate-400">
                Verified
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                3,842
              </h2>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-500 dark:bg-emerald-500/10">
              <UserCheck size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <UsersTable />
      </div>
    </div>
  );
}
