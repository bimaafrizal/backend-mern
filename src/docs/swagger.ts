import swaggerAutogen from "swagger-autogen";
import { LOCAL_HOST, PROD_HOST } from "../utils/env";

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/api.ts"];
const docs = {
    info: {
        version: "1.0.0",
        title : "Dokumentasi API",
        description: "Dokumentasi API"
    }, 
    servers: [
        {
            url:LOCAL_HOST,
            description:"Local Server"
        },
        {
            url:PROD_HOST,
            description:"Production Server"
        }
    ],
    components: {
        securitySchemes : {
            bearerAuth : {
                type : "http",
                scheme : "bearer",
                bearerFormat : "JWT"
            }
        },
        schemas : {
            LoginRequest : {
                identifier: "bima@gmail.com",
                password: "123456"
            }
        }
    }
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, docs);