import { Pencil, ShieldCheck, Trash2, Check, X } from "lucide-react";

const users = [
  {
    id: 1,
    name: "Mohamed Mohanyy",
    email: "Mohanyy018@gmail.com",
    role: "Admin",
    verified: true,
  },
  {
    id: 2,
    name: "Ramdan Ali",
    email: "Ramdan@gmail.com",
    role: "Customer",
    verified: false,
  },
  {
    id: 3,
    name: "Omar Ali",
    email: "omar@gmail.com",
    role: "Customer",
    verified: true,
  },
  {
    id: 4,
    name: "Osama Ahmed",
    email: "Osama@gmail.com",
    role: "Customer",
    verified: false,
  },
];

export default function UsersTable() {
  return (
    <div className="min-h-screen w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 lg:p-10 dark:border-slate-700 dark:bg-slate-900">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-12 bg-slate-100 px-4 py-4 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:px-5">
            <div className="col-span-5">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Verified</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 items-center border-t border-slate-200 px-4 py-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 sm:px-5"
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-base font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  {user.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-800 dark:text-white">
                    {user.name}
                  </p>

                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="col-span-2">
                <span
                  className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${
                    user.role === "Admin"
                      ? "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="col-span-2">
                {user.verified ? (
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-green-500">
                    <Check size={16} />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-red-500">
                    <X size={16} />
                    Not Verified
                  </span>
                )}
              </div>

              <div className="col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-600"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white transition hover:bg-emerald-600"
                >
                  <ShieldCheck size={16} />
                </button>

                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white transition hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
