import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <button
        className="bg-accent px-10 py-1 text-l text-bold text-white rounded-2xl cursor-pointer"
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
    </div>
  );
}