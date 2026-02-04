"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const ENV = {
    PORT: process.env.PORT || "5500",
    MONGO_URI: process.env.MONGO_URI || ""
};
const start = async () => {
    await (0, db_1.connectDB)();
    app_1.default.listen(Number(ENV.PORT), () => {
        console.log(`🚀 Server running on ${ENV.PORT}`);
    });
};
start();
