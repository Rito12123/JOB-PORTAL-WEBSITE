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

// ✅ Allowed origins (local + Vercel + preview URLs)
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-website-lac.vercel.app",
  /\.vercel\.app$/ // allow any Vercel preview deployment
];

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔎 Incoming request from origin:", origin);
      if (!origin || allowedOrigins.some(o => (o instanceof RegExp ? o.test(origin) : o === origin))) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
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

// ✅ Global Error Handler (must be after routes)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack || err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ✅ Start server only after DB connection
const PORT = process.env.PORT;

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
