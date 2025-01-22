import express from "express";
import Movie from "../models/movies"; // Ensure the path is correct
import { fetchGenres, fetchMovieById, fetchMovies, fetchTopRated, likeUnlikeMovie } from "../controllers/moviesController";
import { searchMovies } from "../controllers/search";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware";
// import { likeUnlikeMovie } from "../controllers/moviesController";

const router = express.Router();

router.get("/", fetchMovies);
router.get('/search', searchMovies);
  
router.get('/genres', fetchGenres);
router.get('/top-rated', fetchTopRated);

router.get('/:id', fetchMovieById);

router.post('/like/:id', verifyToken, likeUnlikeMovie);

export default router;
