import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm/CheckoutForm";
import { useCart } from "../context/CartContext";
import "./CheckoutPage.css";

// IMPORTANT: Use your own publishable key from the Stripe dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCartTotal } = useCart();
  const cartTotal = getCartTotal();

  useEffect(() => {
    const API_ENDPOINT = import.meta.env.DEV
      ? "http://localhost:4242/create-payment-intent"
      : "/.netlify/functions/create-payment-intent";

    if (cartTotal > 0) {
      setIsLoading(true);
      setError(null);
      fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal * 100 }), // Amount in cents
      })
        .then(async (res) => {
          if (!res.ok) {
            const { error: errorDetails } = await res.json();
            throw new Error(
              errorDetails?.message || "Failed to create payment intent"
            );
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((err) => {
          console.error("Error fetching client secret:", err);
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [cartTotal]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-form-container">
        {isLoading && <p>Loading payment form...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {!isLoading && !error && clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
        {!isLoading && !clientSecret && !error && (
          <p>
            Your cart is empty or there was an issue loading the payment form.
            Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
