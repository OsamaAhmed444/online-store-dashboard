import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { logout, getMe } from "../api/auth";
import {
  getUsers,
  getUserById,
} from "../api/users";
import {
  getProducts,
  searchProducts,
} from "../api/products";
import {
  getOrders,
  getCarts,
  getOrdersAdmin,
} from "../api/orders";
import {
  getWishlists,
  getWishlistsStats,
} from "../api/wishlist";

export default function LoginPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const test = async (name, request) => {
    setLoading(true);

    try {
      const response = await request();

      setResult(
        `${name} SUCCESS\n\n${JSON.stringify(
          response.data,
          null,
          2
        )}`
      );
    } catch (error) {
      setResult(
        `${name} FAILED\n\n${JSON.stringify(
          error.response?.data || error.message,
          null,
          2
        )}`
      );
    } finally {
      setLoading(false);
    }
  };

  const buttonClass =
    "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            API Test Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Test the backend APIs from the frontend
          </p>
        </div>

        {/* Auth */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Authentication
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={async () => {
                try {
                  const data = await login(
                    "admin@koda.com",
                    "admin1212"
                  );

                  console.log("LOGIN RESPONSE:", data);

                  setResult(JSON.stringify(data, null, 2));

                  navigate("/dashboard");
                } catch (error) {
                  console.error("LOGIN ERROR:", error);

                  setResult(
                    JSON.stringify(
                      error.response?.data || error.message,
                      null,
                      2
                    )
                  );
                }
              }}
            >
              Login
            </button>
            <button
              className={buttonClass}
              disabled={loading}
              onClick={() => test("Get Me", getMe)}
            >
              Get Me
            </button>

            <button
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
              onClick={() => test("Logout", logout)}
            >
              Logout
            </button>
          </div>
        </section>

        {/* Users */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Users
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              className={buttonClass}
              disabled={loading}
              onClick={() => test("Get Users", getUsers)}
            >
              Get All Users
            </button>

            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test("Get User", () =>
                  getUserById("6a92a1664616639b12325260")
                )
              }
            >
              Get User
            </button>
          </div>
        </section>

        {/* Products */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Products
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test("Get Products", getProducts)
              }
            >
              Get Products
            </button>

            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test("Search Products", () =>
                  searchProducts("phone")
                )
              }
            >
              Search Products
            </button>
          </div>
        </section>

        {/* Orders */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Orders
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test("Dashboard Stats", getOrders)
              }
            >
              Dashboard Stats
            </button>

            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test("Get Carts", getCarts)
              }
            >
              Get Carts
            </button>

            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test("Get Orders", getOrdersAdmin)
              }
            >
              Get Orders
            </button>
          </div>
        </section>

        {/* Wishlists */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Wishlists
          </h2>

          <div className="flex flex-wrap gap-3">
            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test("Get Wishlists", getWishlists)
              }
            >
              Get Wishlists
            </button>

            <button
              className={buttonClass}
              disabled={loading}
              onClick={() =>
                test(
                  "Wishlist Stats",
                  getWishlistsStats
                )
              }
            >
              Wishlist Stats
            </button>
          </div>
        </section>

        {/* Result */}
        <section className="rounded-xl bg-gray-900 p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              API Response
            </h2>

            {loading && (
              <span className="text-sm text-gray-400">
                Loading...
              </span>
            )}
          </div>

          <pre className="max-h-[500px] overflow-auto rounded-lg bg-gray-950 p-5 text-sm leading-6 text-green-400">
            {result || "Click an API button to see the response..."}
          </pre>
        </section>

      </div>
    </div>
  );
}