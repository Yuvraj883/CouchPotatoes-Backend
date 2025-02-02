import Users from "../models/users";
import { Request, Response } from "express";
import { generateToken } from "../services/auth.service";

// Register User
export const register = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    try {
        // Check if all fields are provided
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return; // Exit function early if validation fails
        }

        // Check password length
        if (password?.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }

        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists!" });
            return;
        }

        // Create and save the new user
        const newUser = new Users({
            name,
            email,
            password, // Password will be hashed in the pre-save hook
        });
        await newUser.save();
        const token = generateToken(newUser);

        // Set cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "lax", // or "Strict" for more restrictive behavior
            secure: false, // Use `true` in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Respond with success
        res.status(201).json({ message: "User created successfully!" });
    } catch (err: any) {
        console.error("Error while creating new user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};

// Login User
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Check if all fields are provided
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Check if the user exists
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User with this email doesn't exist" });
            return;
        }

        // Check if the password is correct
        const token = await Users.matchPasswordAndGenerateToken(email, password);
        
        // Set cookie
        // res.cookie("authToken", token, {
        //     httpOnly: true,
        //     sameSite: "lax", // or "Strict"
        //     secure: false, // Set to true if you're using HTTPS
        //     maxAge: 24 * 60 * 60 * 1000, // 1 day
        // });

        // Respond with success
        res.status(200).cookie('token', token).json({ message: "Login successful!", token });
    } catch (err: any) {
        console.error("Error while logging in:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};
