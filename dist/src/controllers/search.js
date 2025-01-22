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
exports.searchMovies = void 0;
const movies_1 = __importDefault(require("../models/movies"));
const searchMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        const result = yield movies_1.default.find({ $text: { $search: query } });
        if (!query) {
            res.status(404).send({ err: "Query is required" });
        }
        if (result.length > 0) {
            // console.log(result);
            res.status(200).send({ result });
        }
        else {
            res.status(404).send({ err: "Cant find the term you are searching for" });
        }
    }
    catch (err) {
        console.log("Error while searching", err);
        res.status(500).send({ err: "An error occured while searching the movie" });
    }
});
exports.searchMovies = searchMovies;
