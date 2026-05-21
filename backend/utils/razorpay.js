import Razorpay from "razorpay";

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });
};

console.log("KEY:", process.env.RAZORPAY_KEY)

export default getRazorpayInstance;