import express from "express";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware";
import { userDetails } from "../controllers/user.controller";

const router = express.Router();

router.get('/details', verifyToken, userDetails);

export default router;