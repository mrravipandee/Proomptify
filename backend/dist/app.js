"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const usage_routes_1 = __importDefault(require("./routes/usage.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const admin_prompt_routes_1 = __importDefault(require("./routes/admin.prompt.routes"));
const prompts_routes_1 = __importDefault(require("./routes/prompts.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            "http://localhost:3000",
            "http://localhost:5000",
            "https://proomptify.shop",
            "https://www.proomptify.shop",
            "https://proomptify.vercel.app",
            env_1.config.urls.frontend
        ];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true
}));
app.use("/api/payments", payment_routes_1.default);
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/usage", usage_routes_1.default);
app.use("/api/admin/prompts", admin_prompt_routes_1.default);
app.use("/api/prompts", prompts_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.get("/", (_, res) => {
    res.send("Hello, World!");
});
app.get("/health", (_, res) => {
    res.json({ status: "OK" });
});
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
