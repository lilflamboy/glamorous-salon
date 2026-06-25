const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;

        console.log("Creating order with:", { amount, currency, key_id: process.env.RAZORPAY_KEY_ID });

        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt: receipt || `order_${Date.now()}`,
        };

        console.log("Razorpay options:", options);
        const order = await razorpay.orders.create(options);
        console.log("Order created:", order);
        res.json(order);
    } catch (error) {
        console.error("Razorpay order creation error:", error.error);
        res.status(500).json({ error: error.error?.description || "Failed to create order" });
    }
});

router.post("/verify", (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            res.json({ status: "success" });
        } else {
            res.status(400).json({ status: "failed", error: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ error: "Verification failed" });
    }
});

router.get("/keys", (req, res) => {
    res.json({ key_id: process.env.RAZORPAY_KEY_ID });
});

module.exports = router;
