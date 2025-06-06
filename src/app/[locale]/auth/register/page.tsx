"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("registerPage");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("FREE");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, subscriptionType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        setSuccess("User created successfully! You can now log in.");
        setEmail("");
        setPassword("");
        router.push(`/${pathname.split("/")[1]}/auth/login`);
      }
    } catch {
      setError("Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex-1 bg-gray-50 flex items-center justify-center px-4 py-12 -mt-35">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {t("title")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("email")}
            </label>
            <input
              type="email"
              className="mt-1 w-full border-0 border-b border-gray-400 focus:border-gray-800 focus:outline-none focus:ring-0 rounded-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("password")}
            </label>
            <input
              type="password"
              className="mt-1 w-full border-0 border-b border-gray-400 focus:border-gray-800 focus:outline-none focus:ring-0 rounded-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("subscriptionType")}
            </label>
            <select
              className="mt-1 w-full border-0 border-b border-gray-400 focus:border-gray-800 focus:outline-none focus:ring-0 rounded-none transition-colors duration-200 bg-transparent"
              value={subscriptionType}
              onChange={(e) => setSubscriptionType(e.target.value)}
            >
              <option value="FREE"> {t("plans.free")}</option>
              <option value="BASIC"> {t("plans.basic")}</option>
              <option value="PREMIUM"> {t("plans.premium")}</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              t("button")
            )}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          {t("redirect")}{" "}
          <a
            href={`/${pathname.split("/")[1]}/auth/login`}
            className="text-indigo-600 hover:underline"
          >
            {t("redirectLink")}
          </a>
        </p>
      </div>
    </main>
  );
}
