"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connect = async () => {
    try {
        await mongoose_1.default.connect(env_1.DATABASE_URL, {
            dbName: env_1.DB_NAME,
        });
        return Promise.resolve("Database connected successfully");
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.default = connect;
