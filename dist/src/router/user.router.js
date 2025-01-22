"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get('/details', authMiddleware_1.verifyToken, user_controller_1.userDetails);
exports.default = router;
