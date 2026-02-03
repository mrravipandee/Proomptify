import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

dotenv.config();

const ENV = {
  PORT: process.env.PORT || "5500",
  MONGO_URI: process.env.MONGO_URI || ""
};

const start = async () => {
  await connectDB();
  app.listen(Number(ENV.PORT), () => {
    console.log(`🚀 Server running on ${ENV.PORT}`);
  });
};

start();
