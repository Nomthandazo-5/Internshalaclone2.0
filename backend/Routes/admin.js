import bcrypt from "bcrypt";
import express from "express";
import Admin from "../Model/Admin.js";
import jwt from "jsonwebtoken";
import auth from "../Middleware/auth.js";

const router = express.Router();

function generatePassword(length = 10) {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const all = lower + upper;
    let password = "";

    password += lower[Math.floor(Math.random() * lower.length)];
    password += upper[Math.floor(Math.random() * upper.length)];

    for (let i = 2; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    return password
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
}

router.post("/createadmin", async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const existing = await Admin.findOne({
            $or: [{ username }, { email }, { phone }]
        });
        if (existing)
            return res.status(400).json("Admin already exists");
        const newAdmin = new Admin({
            username,
            email,
            phone,
            password
        });
        await newAdmin.save();
        res.json({
            message: "Admin created successfully",
            admin: {
                username: newAdmin.username,
                email: newAdmin.email,
                phone: newAdmin.phone,
                password: newAdmin.password
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});

router.get("/dashboard", auth, (req, res) => {
    res.json("Welcome Admin");
});

router.post("/forgotpassword", async (req, res) => {
    try {
        const { username } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin)
            return res.status(404).json("Admin not found");
        const now = Date.now();
        if (admin.lastPasswordResetRequest) {
            const difference = now - admin.lastPasswordResetRequest;
            const oneDay = 24 * 60 * 60 * 1000;
            if (difference < oneDay)
                return res.status(400).json("Please wait 24 hours before requesting another reset");
        }

        const token = Math.random().toString(36).substring(2);
        admin.resetToken = token;
        admin.resetTokenExpiry = Date.now() + 3600000;
        admin.lastPasswordResetRequest = now;
        await admin.save();
        res.json({
            message: "Reset token created",
            token: token
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});

router.post("/register", async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        const admin = new Admin({
            username,
            email,
            phone,
            password: hashedPassword
        });
        await admin.save();

        res.json({
            message: "Admin registered successfully",
            admin: {
                username: admin.username,
                email: admin.email,
                phone: admin.phone,
                password: admin.password
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/resetpassword", async (req, res) => {
    try {
        const { token, password } = req.body;
        const admin = await Admin.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });
        if (!admin)
            return res.status(400).json("Invalid token");
        const newPassword = generatePassword(10);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedPassword;
        admin.resetToken = undefined;
        admin.resetTokenExpiry = undefined;

        await admin.save();
        res.json({
            message: "Password reset successful",
            newPassword: newPassword
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});

router.post("/adminlogin", async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (password !== admin.password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            "secretkey",
            { expiresIn: "1d" }
        );
        res.status(200).json({
            message: "Login successful",
            token: token,
            admin: admin.username
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});

export default router;
