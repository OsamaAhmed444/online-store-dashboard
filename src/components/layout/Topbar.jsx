import React from 'react'

export default function Topbar() {
  return (
    <div>Topbar</div>
  )
}
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/products": "Products",
    "/orders": "Orders",
    "/users": "Users",
    "/carts": "Carts",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-foreground">
        {pageTitle}
      </h2>

      {/* Admin Information */}
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">
          {user?.name || "Admin"}
        </p>

        <p className="text-xs text-muted-foreground">
          {user?.email || "admin@koda.com"}
        </p>
      </div>

    </header>
  );
}