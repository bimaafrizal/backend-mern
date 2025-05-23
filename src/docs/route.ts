import {Express} from 'express'

import swaggerUi from "swagger-ui-express"
import swaggerOutput from "./swagger-output.json";
import fs from "fs";
import path from "path";

export default function docs(app: Express) {
    console.log("Setting up swagger");
    try {
    //   fs.accessSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"));
      const css = fs.readFileSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"), "utf-8");
  
      app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerOutput, {
          customCss: css,
          customCssUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
        })
      );
    } catch (error) {
      console.error("Swagger UI CSS not found:", error);
      return;
    }
}