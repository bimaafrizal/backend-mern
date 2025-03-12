import { Request, Response, RequestHandler } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model.ts";
import { encrypt } from "../utils/encryption.ts";

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
    console.log(encryptedPassword);
    const result = await UserModel.findOne({
      $or: [
        { email: identifier },
        { username
          : identifier },
      ],
      $and: [{ password: encryptedPassword }],
    });


    if (!result) {
      res.status(403).json({
        message: "Invalid credentials",
        data: null,
      });
      return;
    }

    // Send success response
    res.status(200).json({
      message: "Success login",
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
}



export default { register, login };
