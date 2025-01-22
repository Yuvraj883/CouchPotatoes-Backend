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
exports.userDetails = void 0;
const users_1 = __importDefault(require("../models/users"));
const userDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        if (user) {
            const userDetails = yield users_1.default.findOne({ email: user.email });
            res.status(200).json({ user: userDetails });
        }
        else {
            res.status(401).json({ message: "User not found" });
        }
    }
    catch (err) {
        console.error("Error while fetching user details:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});
exports.userDetails = userDetails;
