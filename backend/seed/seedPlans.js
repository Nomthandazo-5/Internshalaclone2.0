import mongoose from "mongoose";
import dotenv from "dotenv";
import SubscriptionPlan from "../Model/SubscriptionPlan.js";

dotenv.config();

await mongoose.connect(process.env.DATABASE_URL);

const plans = [
  {
    name: "Free",
    price: 0,
    internshipLimit: 1,
    durationInDays: 30
  },
  {
    name: "Bronze",
    price: 100,
    internshipLimit: 3,
    durationInDays: 30
  },
  {
    name: "Silver",
    price: 300,
    internshipLimit: 5,
    durationInDays: 30
  },
  {
    name: "Gold",
    price: 1000,
    internshipLimit: 9999
  }
];

const seedPlans = async () => {
  try {
    await SubscriptionPlan.deleteMany();
    await SubscriptionPlan.insertMany(plans);

    console.log("Plans added successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedPlans();