"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const users_1 = __importDefault(require("../models/users"));
const auth_service_1 = require("../services/auth.service");
// Register User
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    try {
        // Check if all fields are provided
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return; // Exit function early if validation fails
        }
        // Check password length
        if ((password === null || password === void 0 ? void 0 : password.length) < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
            return;
        }
        // Check if the user already exists
        const existingUser = yield users_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User with this email already exists!" });
            return;
        }
        // Create and save the new user
        const newUser = new users_1.default({
            name,
            email,
            password, // Password will be hashed in the pre-save hook
        });
        yield newUser.save();
        const token = (0, auth_service_1.generateToken)(newUser);
        // Set cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "lax", // or "Strict" for more restrictive behavior
            secure: false, // Use `true` in production with HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        // Respond with success
        res.status(201).json({ message: "User created successfully!" });
    }
    catch (err) {
        console.error("Error while creating new user:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.register = register;
// Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if all fields are provided
        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        // Check if the user exists
        const user = yield users_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User with this email doesn't exist" });
            return;
        }
        // Check if the password is correct
        const token = yield users_1.default.matchPasswordAndGenerateToken(email, password);
        // Set cookie
        // res.cookie("authToken", token, {
        //     httpOnly: true,
        //     sameSite: "lax", // or "Strict"
        //     secure: false, // Set to true if you're using HTTPS
        //     maxAge: 24 * 60 * 60 * 1000, // 1 day
        // });
        // Respond with success
        res.status(200).cookie('token', token).json({ message: "Login successful!", token });
    }
    catch (err) {
        console.error("Error while logging in:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message,
        });
    }
});
exports.login = login;
