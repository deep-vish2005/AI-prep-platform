import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDatabase from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "DevPrep AI API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
});

app.use((error, request, response, next) => {
  console.error(error);

  if (error.code === 11000) {
    return response.status(409).json({
      success: false,
      message: "An account already exists with this email",
    });
  }

  return response.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`DevPrep AI API running on http://localhost:${port}`);
  });
}

startServer();
