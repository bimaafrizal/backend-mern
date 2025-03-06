import { Request, Response } from "express";

export default {
  dumy(req: Request, res: Response) {
    // ✅ Explicitly type parameters
    res.status(200).json({
      message: "Hello, dummy!",
      data: "ok",
    });
  },
};
