import { Schema, model } from "mongoose";

const movieSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    plot: { type: String, required: true },
    genres: [{ type: String }],
    runtime: { type: Number },
    cast: [{ type: String }],
    num_mflix_comments: { type: Number },
    poster: { type: String },
    title: { type: String, required: true },
    fullplot: { type: String },
    languages: [{ type: String }],
    released: { type: Date },
    directors: [{ type: String }],
    writers: [{ type: String }],
    awards: {
      wins: { type: Number },
      nominations: { type: Number },
      text: { type: String },
    },
    lastupdated: { type: String },
    year: { type: Number },
    imdb: {
      rating: { type: Number },
      votes: { type: Number },
      id: { type: Number },
    },
    countries: [{ type: String }],
    type: { type: String },
    tomatoes: {
      viewer: {
        rating: { type: Number },
        numReviews: { type: Number },
        meter: { type: Number },
      },
      lastUpdated: { type: Date },
    },
  },
  {
    collection: "movies", // Explicitly specify the collection name
  }
);

export default model("Movie", movieSchema);
