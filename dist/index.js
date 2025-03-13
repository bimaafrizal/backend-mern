"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./routes/api"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("./utils/database"));
async function connectToDatabase() {
    try {
        const connection = await (0, database_1.default)();
        console.log(connection);
    }
    catch (error) {
        console.error("Database connection error:", error);
    }
}
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const port = 3000;
api_1.default.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.use('/api', api_1.default);
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
connectToDatabase();
exports.default = app;
