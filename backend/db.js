import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const database = process.env.DATABASE_URL;

export const connect = () => {
  mongoose.connect(database)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Database connection error:", err);
    });
};