import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import usageRoutes from "./routes/usage.routes";
import paymentRoutes from "./routes/payment.routes";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import adminPromptRoutes from "./routes/admin.prompt.routes";
import promptsRoutes from "./routes/prompts.routes";
import categoryRoutes from "./routes/category.routes";
import { config } from "./config/env";

const app: Application = express();

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://proomptify.shop",
        "https://www.proomptify.shop",
        "https://proomptify.vercel.app",
        config.urls.frontend // Add environment-based frontend URL
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
  })
);

// ============================================
// WEBHOOK ROUTE (MUST BE BEFORE JSON PARSER)
// ============================================
// Payment router with webhook using raw middleware
// Must be mounted BEFORE express.json() so raw middleware works

// Webhook needs raw body
app.use(
  "/api/payments/webhook",
  express.raw({ type: "*/*" })
);

// Normal JSON parser for other routes
app.use(express.json());

// Now mount routes
app.use("/api/payments", paymentRoutes);

// ============================================
// ROUTES
// ============================================
app.use("/api/auth", authRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/admin/prompts", adminPromptRoutes);
app.use("/api/prompts", promptsRoutes);
app.use("/api/categories", categoryRoutes);

// ============================================
// HEALTH CHECKS
// ============================================
app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

// ============================================
// ERROR HANDLING (MUST BE LAST)
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
