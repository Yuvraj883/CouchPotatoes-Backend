import Movie from "../models/movies";
import { Request, Response } from "express";
import Users from "../models/users";
import { ObjectId } from "mongodb";
import movies from "../models/movies";

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
            $addFields:{
                popularity:{
                    $avg:['$awards.wins', '$awards.nominations', '$imdb.rating', '$imdb.votes', '$tomatoes.viewer.rating', '$tomatoes.viewer.numReviews' ]
                }
            }
        },
        {
            $sort:{popularity:-1}
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
            $addFields:{
                popularity:{
                    $avg:['$awards.wins', '$awards.nominations', '$imdb.rating', '$imdb.votes', '$tomatoes.viewer.rating', '$tomatoes.viewer.numReviews' ]
                }
            }
        },
        {
            $sort:{popularity:-1}
        },
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
    const {page=1, size=12} = req.query; 
    const pageNumber = parseInt(page as string); 
    const pageSize = parseInt(size as string); 
    const totalMovies = 500; 


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
            $limit:totalMovies
          },
        {
            $skip:(pageNumber-1)*pageSize
        },
        {
          $limit: pageSize, // Optionally limit the number of top-rated movies to a specific count (e.g., 10)
        },
      ]);
      const totalPages = Math.ceil(totalMovies/pageSize);
      res.status(200).send({
        movies, pageNumber, totalMovies, totalPages
      }); // Return the top-rated movies
    } catch (err) {
      console.log("Error fetching top-rated movies:", err);
      res.status(500).send({ error: "An error occurred while fetching top-rated movies" });
    }
  };




  export const likeUnlikeMovie = async (req: Request, res: Response) => {
    const { id } = req.params; // movie ID
    const { user } = req.body; // user info from the authenticated request
    
    try {
      console.log("Like function called", user.email); 
      // Fetch the movie and the user
      const movie = await Movie.findById(id);
      const likedByUser = await Users.findOne({ email: user.email }) as any;
  
      // Check if both movie and user exist
      if (!movie || !likedByUser) {
    res.status(404).send({ error: "Movie or User not found" });
    return;
      }
  
      // Check if the user already liked this movie
      const alreadyLiked = movie.likedBy.includes(likedByUser._id);
      
      if (alreadyLiked) {
        // User is unliking the movie
        movie.likes -= 1;
        // Remove user from the likedBy array
        movie.likedBy = movie.likedBy.filter(
          (userId: ObjectId) => userId.toString() !== likedByUser._id.toString()
        );
        // Update the user's likedMovies list
        likedByUser.likedMovies = likedByUser.likedMovies.filter(
          (movieId: ObjectId) => movieId.toString() !== movie._id?.toString()
        );
      } else {
        // User is liking the movie
        movie.likes += 1;
        // Add user to the likedBy array
        movie.likedBy.push(likedByUser._id);
        // Update the user's likedMovies list
        likedByUser.likedMovies.push(movie._id);
      }
  
      // Save the changes to the movie and user
      await movie.save();
      await likedByUser.save();
  
       res.status(200).send({
        message: `Movie ${alreadyLiked ? "unliked" : "liked"} successfully`,
        likes: movie.likes,
      });
      
    } catch (err) {
      console.log("Like function called", user.email); 

      console.error("Error while liking the movie:", err);
      res.status(500).send({ error: "An error occurred while liking the movie" });
    }
  };
  