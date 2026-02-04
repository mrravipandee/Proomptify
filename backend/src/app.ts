import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import usageRoutes from "./routes/usage.routes";
import paymentRoutes from "./routes/payment.routes";

const app: Application = express();

// cors middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://proomptify.shop",
        "https://proomptify.vercel.app"
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

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (_, res) => {
  res.send("Hello, World!");
});

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

export default app;
