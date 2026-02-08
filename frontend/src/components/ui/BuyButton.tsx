"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function BuyButton({ plan }: { plan: "yearly" | "lifetime" }) {
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleBuy = async () => {
    // Wait for auth to be ready BEFORE making any API calls
    if (authLoading) {
      alert("Please wait while we load your account...");
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      // Call payment API - JWT token automatically included
      const data = await api.createPaymentSession(plan);

      if (!data.paymentUrl) {
        throw new Error("No payment URL received from server");
      }

      // Redirect to Dodo payment checkout
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Payment error occurred";
      alert(errorMessage);
      setLoading(false);
    }
  };

  // Disable button while auth is loading or payment is processing
  const isDisabled = loading || authLoading;
  const buttonText = authLoading ? "Loading..." : loading ? "Redirecting..." : `Buy ${plan}`;

  return (
    <button
      onClick={handleBuy}
      disabled={isDisabled}
      className="block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {buttonText}
    </button>
  );
}
