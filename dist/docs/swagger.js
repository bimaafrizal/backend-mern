"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const env_1 = require("../utils/env");
const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/api.ts"];
const docs = {
    info: {
        version: "1.0.0",
        title: "Dokumentasi API",
        description: "Dokumentasi API"
    },
    servers: [
        {
            url: env_1.LOCAL_HOST,
            description: "Local Server"
        },
        {
            url: env_1.PROD_HOST,
            description: "Production Server"
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            LoginRequest: {
                identifier: "bima@gmail.com",
                password: "123456"
            }
        }
    }
};
(0, swagger_autogen_1.default)({ openapi: "3.0.0" })(outputFile, endpointsFiles, docs);
