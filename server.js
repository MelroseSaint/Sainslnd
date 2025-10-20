import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Use env var or fallback placeholder — replace before deploying
const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_YOUR_SECRET_KEY";
const stripe = new Stripe(stripeSecret);

app.get("/health", (req, res) => res.json({ ok: true }));

// Create checkout session endpoint
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan } = req.body || {};

    // Server-side price enforcement
    const PLAN_TO_PRICE = {
      Basic: { amount: 4000, name: "Basic" },
      Pro: { amount: 7500, name: "Pro" },
      Premium: { amount: 20000, name: "Premium" },
    };
    const selected = PLAN_TO_PRICE[plan];
    if (!selected) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${selected.name} Plan` },
            unit_amount: selected.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success.html",
      cancel_url: "http://localhost:5173/cancel.html",
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Stripe backend running on port ${port}`));


