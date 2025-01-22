import express from "express";
import { login, register } from "../controllers/auth.controller";
import { searchMovies } from "../controllers/search";


const router = express.Router();


// router.get("/", () => {  })

// Registration route
console.log(register);
router.post("/register", register);
router.post("/login", login)

export default router;
