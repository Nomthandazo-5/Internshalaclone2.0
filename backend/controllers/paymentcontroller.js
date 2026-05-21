import { sendEmail } from "../utils/sendEmail.js";
import User from "../Model/User.js";
import getRazorpayInstance from "../utils/razorpay.js";
import SubscriptionPlan from "../Model/SubscriptionPlan.js";
import UserSubscription from "../Model/UserSubscription.js";
import crypto from "crypto";
import { isPaymentAllowed } from "../utils/paymenttimecheck.js";

export const createOrder = async (req, res) => {

  const razorpay = getRazorpayInstance();

  if (!isPaymentAllowed()) {
    return res.status(403).json({
      message: "Payments allowed only between 10–11 AM IST"
    });
  }

  const { planId } = req.body;
  const plan = await SubscriptionPlan.findById(planId);

  const existing = await UserSubscription.findOne({
    userId: req.user.id,
    endDate: { $gt: new Date() }
  });

  if (existing) {
    return res.status(400).json({ message: "You already have an active plan" });
  }

  if (plan.price === 0) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationInDays);

    await UserSubscription.create({
      userId: req.user.id,
      planId,
      internshipUsed: 0,
      startDate,
      endDate
    });

    return res.json({ message: "Free plan activated" });
  }

  const order = await razorpay.orders.create({
    amount: plan.price * 100,
    currency: "INR",
    receipt: "order_" + Date.now()
  });

  res.json(order);
};

export const verifyPayment = async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const plan = await SubscriptionPlan.findById(planId);

  const existing = await UserSubscription.findOne({
    userId: req.user.id,
    endDate: { $gt: new Date() }
  });

  if (existing) {
    return res.status(400).json({ message: "You already have an active plan" });
  }

  const startDate = new Date();

  const endDate = new Date(
    Date.now() + plan.durationInDays * 24 * 60 * 60 * 1000
  );

  await UserSubscription.create({
    userId: req.user.id,
    planId,
    internshipUsed: 0,
    paymentId: razorpay_payment_id,
    startDate,
    endDate
  });

  const user = await User.findById(req.user.id);

  await sendEmail(
    user.email,
    "Subscription Activated",
    `Hello ${user.name},

Your ${plan.name} plan has been activated successfully

Plan Details:
- Price: ₹${plan.price}
- Duration: ${plan.durationInDays} days
- Internship Limit: ${plan.internshipLimit === 9999
      ? "Unlimited"
      : plan.internshipLimit
    }

Start Date: ${startDate.toDateString()}
End Date: ${endDate.toDateString()}

Invoice ID: ${razorpay_payment_id}

Thank you for using our platform!`
  );

  res.json({ message: "Subscription activated" });
};