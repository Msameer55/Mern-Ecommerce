import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosInstance from "../../config/axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_placeholder");

const StripeForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      console.error(error);
      onError(error);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className="cursor-pointer w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 mt-4"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

const StripeButton = ({ amount, onSuccess, onError }) => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axiosInstance.post("/api/payment/create-payment-intent", { amount });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret", error);
      }
    };

    if (amount > 0) {
      fetchClientSecret();
    }
  }, [amount]);

  if (!clientSecret) {
    return <div>Loading payment details...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeButton;
