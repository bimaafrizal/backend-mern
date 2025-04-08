"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const user_model_1 = __importDefault(require("../models/user.model"));
const encryption_1 = require("../utils/encryption");
const jwt_1 = require("../utils/jwt");
const registerValidationSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Full Name is required")
        .min(3, "Full Name must be at least 3 characters"),
    email: Yup.string()
        .email("Email is not valid")
        .required("Email is required")
        .email("Email is not valid"),
    username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password"), "Passwords must match"]),
});
const register = async (req, res) => {
    const { fullName, email, username, password, confirmPassword } = req.body;
    // Validate the request body against the schema
    try {
        await registerValidationSchema.validate({
            fullName,
            email,
            username,
            password,
            confirmPassword,
        }, { abortEarly: false });
        const result = await user_model_1.default.create({
            fullName,
            email,
            username,
            password,
        });
        // Send success response
        res.status(200).json({
            message: "Success register",
            data: result,
        });
    }
    catch (error) {
        // Handle validation error
        if (error instanceof Yup.ValidationError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
                data: null,
            });
        }
        else {
            // Handle other errors
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
};
const loginValidfationSchema = Yup.object().shape({
    identifier: Yup.string()
        .required("Identifier is required")
        .min(3, "Identifier must be at least 3 characters"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
});
const login = async (req, res) => {
    /**
     #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/LoginRequest",
      }
     }
     */
    const { identifier, password } = req.body;
    // Validate the request body against the schema
    try {
        await loginValidfationSchema.validate({
            identifier,
            password,
        }, { abortEarly: false });
        //encrypt password
        const encryptedPassword = (0, encryption_1.encrypt)(password);
        const result = await user_model_1.default.findOne({
            $or: [{ email: identifier }, { username: identifier }],
            $and: [{ password: encryptedPassword }],
        });
        if (!result) {
            res.status(403).json({
                message: "Invalid credentials",
                data: null,
            });
            return;
        }
        // Check if user is active
        // if (!result.isActive) {
        //   res.status(403).json({
        //     message: "User is not active",
        //     data: null,
        //   });
        //   return;
        // }
        const token = (0, jwt_1.generateToken)({
            id: result._id,
            role: result.role,
        });
        // Send success response
        res.status(200).json({
            message: "Success login",
            data: token,
        });
    }
    catch (error) {
        // Handle validation error
        if (error instanceof Yup.ValidationError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
                data: null,
            });
        }
        else {
            // Handle other errors
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
};
const me = async (req, res) => {
    /**
     #swagger.security = [{
     "bearerAuth": []
     }]
     */
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }
        const result = await user_model_1.default.findById(user?.id);
        if (!result) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        // Send success response
        res.status(200).json({
            message: "Success get user",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.default = { register, login, me };
