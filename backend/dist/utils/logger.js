"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const env_1 = require("../config/env");
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
class Logger {
    formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaStr}`;
    }
    error(message, error) {
        const errorMeta = error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error;
        console.error(this.formatMessage(LogLevel.ERROR, message, errorMeta));
    }
    warn(message, meta) {
        console.warn(this.formatMessage(LogLevel.WARN, message, meta));
    }
    info(message, meta) {
        console.log(this.formatMessage(LogLevel.INFO, message, meta));
    }
    debug(message, meta) {
        if (env_1.config.isDevelopment) {
            console.log(this.formatMessage(LogLevel.DEBUG, message, meta));
        }
    }
}
exports.logger = new Logger();
