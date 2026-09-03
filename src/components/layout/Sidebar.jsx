import React from 'react'

export default function Sidebar() {
  return (
    <div>Sidebar</div>
  )
}
import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Products",
      path: "/dashboard/products",
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
    },
    {
      name: "Users",
      path: "/dashboard/users",
    },
    {
      name: "Carts",
      path: "/dashboard/carts",
    },
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-card px-3 py-2 text-foreground shadow-sm lg:hidden"
        aria-label="Open navigation"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col
          border-r border-border bg-card
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h1 className="text-lg font-semibold text-foreground">
            Admin Dashboard
          </h1>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `
                rounded-lg px-4 py-3 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
                `
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}