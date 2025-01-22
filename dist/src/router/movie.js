"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moviesController_1 = require("../controllers/moviesController");
const search_1 = require("../controllers/search");
const router = express_1.default.Router();
router.get("/", moviesController_1.fetchMovies);
router.get('/search', search_1.searchMovies);
router.get('/genres', moviesController_1.fetchGenres);
router.get('/top-rated', moviesController_1.fetchTopRated);
router.get('/:id', moviesController_1.fetchMovieById);
exports.default = router;
