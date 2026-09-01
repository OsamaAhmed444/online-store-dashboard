import React from "react";
import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title = "No Products Found",
  message = "There are no products to display.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-5">
        <PackageOpen
          size={40}
          className="text-orange-500"
        />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
        {title}
      </h2>

      {/* Message */}
      <p className="text-[var(--muted)] max-w-md">
        {message}
      </p>
    </div>
  );
}