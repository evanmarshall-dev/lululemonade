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

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
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
