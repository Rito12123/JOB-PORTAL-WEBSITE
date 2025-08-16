import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});
console.log("process.env.PORT =", process.env.PORT);

const app = express();
const server = http.createServer(app);

// ✅ Allowed origins for CORS (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-azure-zeta.vercel.app" // ⬅ Replace with your actual Vercel URL
];

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// ✅ API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ✅ Simple health check route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ Start server only after DB connection
const PORT = process.env.PORT ;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });
