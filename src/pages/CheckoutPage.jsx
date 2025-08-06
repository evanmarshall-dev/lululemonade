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
  // Assuming useCart() provides the items in the cart
  const { cartItems, getCartTotal } = useCart();

  useEffect(() => {
    const API_ENDPOINT = import.meta.env.DEV
      ? "http://localhost:4242/create-payment-intent"
      : "/.netlify/functions/create-payment-intent";

    // Create PaymentIntent as soon as the page loads with cart items
    if (cartItems && cartItems.length > 0) {
      setIsLoading(true);
      setError(null);
      fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send cart items to the server for secure price calculation
        body: JSON.stringify({ items: cartItems }),
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
  }, [cartItems]);

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
        <h2>Total: ${getCartTotal().toFixed(2)}</h2>
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
