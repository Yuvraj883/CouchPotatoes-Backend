import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Or replace `any` with a more specific type if you have one
    }
  }
}
 