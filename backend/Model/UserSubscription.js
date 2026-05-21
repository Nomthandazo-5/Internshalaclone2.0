import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan"
  },
  startDate: Date,
  endDate: Date,
  applicationsUsed: {
    type: Number,
    default: 0
  },
  internshipUsed: {
    type: Number,
    default: 0
  },
  paymentId: String
});

export default mongoose.model("UserSubscription", userSubscriptionSchema);