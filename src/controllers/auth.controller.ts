import { Request, Response, RequestHandler } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IRequest } from "../middlewares/auth.middleware";

type TRegister = {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
}

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
  confirmPassword: Yup.string().required("Confirm Password is required").oneOf(
    [Yup.ref("password"), "Passwords must match"],),
});

const register: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullName, email, username, password, confirmPassword } =
    req.body as TRegister;

  // Validate the request body against the schema
  try {
    await registerValidationSchema.validate(
      {
        fullName,
        email,
        username,
        password,
        confirmPassword,
      },
      { abortEarly: false }
    );


    const result = await UserModel.create({
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
  } catch (error) {
    // Handle validation error
    if (error instanceof Yup.ValidationError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
        data: null,
      });
    } else {
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

const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  /**
   #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/LoginRequest",
    }
   }
   */
  const { identifier, password } = req.body as TLogin;

  // Validate the request body against the schema
  try {
    await loginValidfationSchema.validate(
      {
        identifier,
        password,
      },
      { abortEarly: false }
    );

    //encrypt password
    const encryptedPassword = encrypt(password);
    const result = await UserModel.findOne({
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

    const token = generateToken({
      id: result._id,
      role: result.role,
    });

    // Send success response
    res.status(200).json({
      message: "Success login",
      data: token,
    });
  } catch (error) {
    // Handle validation error
    if (error instanceof Yup.ValidationError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
        data: null,
      });
    } else {
      // Handle other errors
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

const me: RequestHandler = async (
  req: IRequest,
  res: Response
): Promise<void> => {
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
    const result = await UserModel.findById(user?.id);
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
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



export default { register, login, me };
