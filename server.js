/* eslint-disable no-undef */

import express from "express";
import cors from "cors";
import Stripe from "stripe";
import "dotenv/config"; // Load environment variables from .env

const app = express();
// IMPORTANT: Use your own secret key from the Stripe dashboard
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend's origin
  })
);

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

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { items } = req.body;
    const amount = calculateOrderAmount(items);

    if (amount <= 0) {
      return res
        .status(400)
        .send({ error: { message: "Invalid order amount." } });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "cad",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
