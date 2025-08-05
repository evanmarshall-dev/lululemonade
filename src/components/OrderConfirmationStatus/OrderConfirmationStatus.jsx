import { useEffect, useState, useRef } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./OrderConfirmationStatus.css";

const OrderConfirmationStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState(null);
  const { clearCart } = useCart();
  const hasClearedCart = useRef(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded! Thank you for your order.");
          if (!hasClearedCart.current) {
            clearCart();
            hasClearedCart.current = true;
          }
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, clearCart]);

  return (
    <div className="order-confirmation-page">
      <h1>Order Confirmation</h1>
      {message ? <p>{message}</p> : <p>Loading payment status...</p>}
      <Link to="/" className="home-link">
        Back to Home
      </Link>
    </div>
  );
};

export default OrderConfirmationStatus;
