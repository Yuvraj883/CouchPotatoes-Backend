import Users from "../models/users";
import { Request, Response } from "express";
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    try {
        // Check if all fields are provided
        if (!name || !email || !password) {
             res.status(400).json({ message: "All fields are required" });
        }

        // Check password length
        if (password?.length < 6) {
             res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
             res.status(400).json({ message: "User with this email already exists!" });
        }

        // Create and save the new user
        const newUser = new Users({
            name,
            email,
            password, // Password will be hashed in the pre-save hook
        });
        await newUser.save();
        const token = generateToken(newUser);
        res.cookie("authToken",token, {
            httpOnly:true,
            sameSite:"none",
            secure:true, 
            maxAge: 24*60*60*1000,
        })
        // Respond with success
         res.status(201).json({ message: "User created successfully!" });
    } catch (err:any) {
        console.error("Error while creating new user:", err);
         res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
};
