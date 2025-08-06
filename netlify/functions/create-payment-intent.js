/* eslint-disable no-undef */

import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Product data is defined on the server to prevent tampering from the client.
// Prices are in cents.
const products = {
  1: { price: 200, name: "Regular Lemonade" },
  2: { price: 200, name: "Raspberry Lemonade" },
  3: { price: 200, name: "Watermelon Lemonade" },
};

const calculateOrderAmount = (items) => {
  let total = 0;
  for (const item of items) {
    const product = products[item.id];
    if (product) {
      // Ensure quantity is a positive integer
      const quantity = Math.max(0, Math.floor(item.quantity || 0));
      total += product.price * quantity;
    }
  }
  return total;
};

export const handler = async (event) => {
  // Netlify functions must be triggered by a POST request for this setup
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { items } = JSON.parse(event.body);

    // Calculate the order amount on the server-side
    const amount = calculateOrderAmount(items);

    if (amount <= 0) {
      return {
        statusCode: 400,
        body: '{"error":{"message":"Invalid order amount."}}',
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "cad",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    };
  } catch (e) {
    // Note: 'e' is the standard variable name for caught errors
    console.error("Error creating payment intent:", e);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: {
          message: e.message,
        },
      }),
    };
  }
};
