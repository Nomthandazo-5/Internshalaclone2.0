import express from "express";
const app = express();
const router = express.Router();
const routes = require("./Routes/index");
app.use(express.json());
app.use("/api", routes);
app.listen(5000, () => {
  console.log("Server is running on port 5000");
}
);

import { sendEmail } from "./utils/sendEmail.js";

app.get("/test-email", async (req, res) => {
  await sendEmail(
    "yourgmail@gmail.com",
    "Test Email",
    "If you see this, email works ✅"
  );

  res.send("Email sent");
});

const admin = require("./admin");
const intern = require("./internship");
const job = require("./job");
const application = require("./application")
const detailinternship = require("./detailinternship");
const adminRoutes = require("./Routes/admin");

router.use("/detailinternship", detailinternship);
router.use("/admin", admin);
router.use("/internship", intern);
router.use("/job", job);
router.use("/application", application);

module.exports = router;