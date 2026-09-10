import authRoutes from "./routes/authRoutes.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cropRoutes from "./routes/cropRoutes.js";
import cropImageRoutes from "./routes/cropImageRoutes.js";
import diseaseAnalysisRoutes from "./routes/diseaseAnalysisRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use(globalLimiter);

const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use("/auth", authRoutes);
app.use("/crops", cropRoutes);
app.use("/crops", cropImageRoutes);
app.use("/disease-analysis", diseaseAnalysisRoutes);
app.use("/weather", weatherRoutes);
app.use("/assistant", assistantRoutes);
app.use("/knowledge", knowledgeRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Farmer Assistant API is running 🌱",
  });
});

// Start server and connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();