"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dummy_controller_1 = __importDefault(require("../controllers/dummy.controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = express_1.default.Router();
router.get('/dumy', dummy_controller_1.default.dumy);
//auth
router.post("/auth/register", auth_controller_1.default.register);
router.post("/auth/login", auth_controller_1.default.login);
router.get("/auth/me", auth_middleware_1.default, auth_controller_1.default.me);
exports.default = router;
