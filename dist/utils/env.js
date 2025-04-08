"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROD_HOST = exports.LOCAL_HOST = exports.SECRET = exports.DB_NAME = exports.DATABASE_URL = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017';
exports.DB_NAME = process.env.DB_NAME || 'wpu-db';
exports.SECRET = process.env.SECRET || 'secret';
exports.LOCAL_HOST = process.env.LOCAL_HOST || 'http://localhost:3000';
exports.PROD_HOST = process.env.PROD_HOST || 'https://wpu-api.vercel.app';
