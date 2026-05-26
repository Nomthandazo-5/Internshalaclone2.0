import dotenv from "dotenv";
dotenv.config(); 

console.log("ENV CHECK:", process.env.RAZORPAY_KEY);

import express from "express";
import cors from "cors";
import paymentRoutes from "./Routes/payment.js";
import { connect } from "./db.js"; 

import adminRoutes from "./Routes/admin.js"; 
import feedRoutes from "./Routes/feed.js";

const app = express();
const port = 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'https://internshalaclone2-0.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use((req,res,next)=>{
   console.log("BODY RECEIVED:", req.body);
   next();
});

app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/feed', feedRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.get('/api/internship', (req, res) => {
  const internships = [
    {
      _id: "1",
      title: "Frontend Developer Intern",
      company: "TechCorp",
      startDate: "April 2025",
      Duration: "3 Months",
      stipend: "$500/month",
      category: "Web Development",
      location: "New York",
    },
    {
      _id: "2",
      title: "Data Science Intern",
      company: "DataTech",
      startDate: "May 2025",
      Duration: "6 Months",
      stipend: "$800/month",
      category: "Data Science",
      location: "San Francisco",
    },
    {
      _id: "3",
      title: "Marketing Intern",
      company: "MarketPro",
      startDate: "June 2025",
      Duration: "4 Months",
      stipend: "$400/month",
      category: "Marketing",
      location: "Los Angeles",
    },
    {
      _id: "4",
      title: "React Developer",
      company: "Web Solutions",
      startDate: "Immediately",
      Duration: "6 Months",
      stipend: "₹20,000/month",
      category: "Web Development",
      location: "Work from home",
    },
    {
      _id: "5",
      title: "Full Stack Developer Intern",
      company: "HCL technologies",
      startDate: "June 2025",
      Duration: "5 Months",
      stipend: "₹5000/month",
      category: "Web Development",
      location: "Chennai, India",
    },
    {
      _id: "6",
      title: "Frontend Developer Intern",
      company: "ElevanceSkills",
      startDate: "October 2025",
      Duration: "6 Months",
      stipend: "$500/month",
      category: "Web Development",
      location: "Remote",
    },
    {
      _id: "7",
      title: "Backend Developer Intern",
      company: "Meta",
      startDate: "September 2025",
      Duration: "2 Months",
      stipend: "Unpaid",
      category: "Web Development",
      location: "Menlo Park, CA",
    },
  ];
  res.status(200).json(internships);
});

app.get("/api/internship/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }
    res.json(internship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/job', (req, res) => {
  const jobs = [
    {
      _id: "101",
      title: "Frontend Developer",
      company: "Amazon",
      location: "Seattle",
      CTC: "$100K/year",
      category: "Engineering",
      startDate: "April 1, 2025",
      aboutCompany: "Amazon is a global leader in e-commerce and cloud computing.",
      aboutJob: "Seeking a skilled Frontend Developer proficient in React.js.",
      Whocanapply: "Developers with experience in JavaScript, React.js.",
      perks: "Remote work, stock options, health insurance.",
      AdditionalInfo: "Hybrid with occasional onsite meetings.",
      numberOfopning: "3",
    },
    {
      _id: "102",
      title: "Data Analyst",
      company: "Microsoft",
      location: "Remote",
      CTC: "$90K/year",
      category: "Data Science",
      startDate: "March 15, 2025",
      aboutCompany: "Microsoft specializes in software development, cloud computing.",
      aboutJob: "Looking for a Data Analyst with expertise in SQL, Python.",
      Whocanapply: "Candidates with experience in data analytics, SQL, Python.",
      perks: "Flexible hours, remote work, upskilling programs.",
      AdditionalInfo: "Fully remote role.",
      numberOfopning: "2",
    },
    {
      _id: "103",
      title: "UX Designer",
      company: "Apple",
      location: "California",
      CTC: "$110K/year",
      category: "Design",
      startDate: "March 30, 2025",
      aboutCompany: "Apple is a leader in consumer electronics and software.",
      aboutJob: "Seeking a UX Designer to craft intuitive user experiences.",
      Whocanapply: "Designers with experience in Figma, Adobe XD.",
      perks: "Creative environment, free lunches, fitness perks.",
      AdditionalInfo: "Office-based with occasional remote work.",
      numberOfopning: "1",
    },
    {
      _id: "104",
      title: "Backend Developer",
      company: "NextGen Solutions",
      location: "Austin, TX",
      CTC: "$90,000 - $110,000",
      category: "Engineering",
      startDate: "March 20, 2025",
      aboutCompany: "NextGen Solutions specializes in building scalable backend systems.",
      aboutJob: "Looking for a Backend Developer skilled in Node.js, Express.",
      Whocanapply: "Developers with experience in server-side programming, databases.",
      perks: "Stock options, remote work, gym membership.",
      AdditionalInfo: "Hybrid role with 2 days in-office.",
      numberOfopning: "3",
    },
    {
      _id: "105",
      title: "UI/UX Designer",
      company: "Design Pro",
      location: "San Francisco, CA",
      CTC: "$70,000 - $85,000",
      category: "Design",
      startDate: "March 25, 2025",
      aboutCompany: "Design Pro is an award-winning UI/UX design agency.",
      aboutJob: "We need a UI/UX Designer who can create user-friendly interfaces.",
      Whocanapply: "Designers with proficiency in Figma, Adobe XD.",
      perks: "Creative workspace, wellness programs.",
      AdditionalInfo: "Office-based with flexible hours.",
      numberOfopning: "1",
    },
  ];
  res.status(200).json(jobs);
});

connect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});