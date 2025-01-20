import { Request, Response } from "express";
import mongoose from "mongoose";
import comments from "../models/comments";

export const fetchComments = async (req: Request, res: Response) => {
  try {
    const { movie_id } = req.params;

    // Convert movie_id to ObjectId
    if (!mongoose.Types.ObjectId.isValid(movie_id)) {
       res.status(400).json({ success: false, message: "Invalid movie ID" });
    }
    const objectId = new mongoose.Types.ObjectId(movie_id);

    // Fetch comments
    const commentsList = await comments.find({ movie_id: objectId });
    // console.log("Comments",commentsList);

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: {
        movie_id,
        comments: commentsList,
      },
    });
  } catch (err: any) {
    console.error("Error while fetching comments:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const postComment = async(req:Request, res:Response)=>{
  
  }
