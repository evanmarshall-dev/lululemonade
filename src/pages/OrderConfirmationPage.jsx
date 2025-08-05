import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderConfirmationStatus from "../components/OrderConfirmationStatus/OrderConfirmationStatus";

// IMPORTANT: Use your own publishable key from the Stripe dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const OrderConfirmationPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <OrderConfirmationStatus />
    </Elements>
  );
};

export default OrderConfirmationPage;
