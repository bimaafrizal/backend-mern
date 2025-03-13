"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    dumy(req, res) {
        // ✅ Explicitly type parameters
        res.status(200).json({
            message: "Hello, dummy!",
            data: "ok",
        });
    },
};
