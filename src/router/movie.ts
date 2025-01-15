import express from "express";
import Movie from "../models/movies"; // Ensure the path is correct
import { fetchGenres, fetchMovieById, fetchMovies, fetchTopRated } from "../controllers/moviesController";

const router = express.Router();

router.get("/", fetchMovies);
router.get('/genres', fetchGenres);
router.get('/top-rated', fetchTopRated);

router.get('/:id', fetchMovieById);

export default router;
