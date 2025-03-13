"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
exports.default = (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = (0, jwt_1.getUserData)(token);
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};
