import { Request, Response, RequestHandler } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model.ts";

type TRegister = {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

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

export default { register };
