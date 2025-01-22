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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const auth_service_1 = require("../services/auth.service");
// Define the user schema
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    likedMovies: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Movie" }],
    salt: { type: String },
    profilePic: {
        type: String,
        default: "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg",
    },
}, { timestamps: true });
// Pre-save hook to hash password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        const salt = (0, crypto_1.randomBytes)(16).toString("hex");
        const hashedPassword = (0, crypto_1.createHmac)("sha256", salt)
            .update(this.password)
            .digest("hex");
        this.salt = salt;
        this.password = hashedPassword;
        next();
    });
});
// Static method to match password and generate token
userSchema.static("matchPasswordAndGenerateToken", function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        if (!user)
            throw new Error("User doesn't exist");
        const hashedPassword = (0, crypto_1.createHmac)("sha256", user.salt)
            .update(password)
            .digest("hex");
        if (user.password !== hashedPassword)
            throw new Error("Wrong password");
        return (0, auth_service_1.generateToken)(user);
    });
});
// Create and export the model
const Users = (0, mongoose_1.model)("User", userSchema);
exports.default = Users;
