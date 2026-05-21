import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Free", "Bronze", "Silver", "Gold"]
  },
  price: {
    type: Number,
    required: true
  },
  internshipLimit: {
    type: Number,
    required: true
  },
  durationInDays: {
    type: Number,
    default: 30
  }
}, { timestamps: true });

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);