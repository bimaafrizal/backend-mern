"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = docs;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./swagger-output.json"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function docs(app) {
    console.log("Setting up swagger");
    try {
        //   fs.accessSync(path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"));
        const css = fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css"), "utf-8");
        app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, {
            customCss: css,
            customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
        }));
    }
    catch (error) {
        console.error("Swagger UI CSS not found:", error);
        return;
    }
}
