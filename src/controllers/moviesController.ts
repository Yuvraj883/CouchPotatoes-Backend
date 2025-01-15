import Movie from "../models/movies";
import { Request, Response } from "express";

export const fetchMovies = async (req: any, res: any) => {
  const {page=1, pageSize=9} = req.query;
  const pageNumber = parseInt(page as string, 10);
  const pageSizeNumber = parseInt(pageSize as string, 10);
  const { genres } = req.query;
  let genresFilter = [];
  
  
  if (genres) {
    genresFilter = genres.split(','); 
  }
  const matchedQueries = genresFilter.length>0?{genres:{$in:genresFilter}} :{};
  try {
    let movies;
    
    
    if (genresFilter.length > 0) {
      movies = await Movie.aggregate([
        {
          $match: matchedQueries
        },
        {
            $skip: (pageNumber-1)*pageSizeNumber
        },
        {
          $limit: pageSizeNumber, 
        },
      ]);
      console.log(movies);
    } else {
      
      movies = await Movie.aggregate([
        {
            $skip:(pageNumber-1)*pageSizeNumber
        },{
            $limit: pageSizeNumber
        }

      ]); 
    }
    const totalMovies =await  Movie.countDocuments(matchedQueries);
    const totalPages = Math.ceil(totalMovies/pageSizeNumber);
    res.send({movies,
        totalMovies,
        totalPages, 
        currentPage:pageNumber
    });
  } catch (err: any) {
    res.status(500).send({ error: err.message }); 
  }
};

export const fetchMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movieDetails = await Movie.findById(id);
    
    if (!movieDetails) {
      res.status(404).send({ error: "Movie not found" });
    }
    res.send(movieDetails);
  } catch (error: any) {
    res.status(500).send({ error: "Couldn't find the movie" });
    console.log(error);
  }
};

export const fetchGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Movie.aggregate([
      { $unwind: "$genres" }, // Ensure genres is an array
      {
        $group: {
          _id: null, // No need for _id grouping
          genres: { $addToSet: "$genres" }, // Get unique genres
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          genres: 1, // Include genres array in the result
        },
      },
    ]);

    if (genres && genres.length > 0) {
      res.status(200).send(genres[0].genres); // Send genres array directly
    } else {
      res.status(200).send([]); // Return an empty array if no genres are found
    }
  } catch (err) {
    console.log("Error fetching genres", err); // Log the error
    res.status(500).send({ error: "An error occurred while fetching genres" }); // Send error response
  }
};

export const fetchTopRated = async (req: Request, res: Response) => {
    try {
      const movies = await Movie.aggregate([
        {
            $match: {
              "imdb.rating": { $ne: "" } // Filter out movies with an empty rating
            }
          },
        {
          $sort: { "imdb.rating": -1 }, // Correctly reference the rating field
        },
        {
          $limit: 10, // Optionally limit the number of top-rated movies to a specific count (e.g., 10)
        },
      ]);
      res.status(200).send(movies); // Return the top-rated movies
    } catch (err) {
      console.log("Error fetching top-rated movies:", err);
      res.status(500).send({ error: "An error occurred while fetching top-rated movies" });
    }
  };
