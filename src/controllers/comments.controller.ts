import { Request, Response } from "express";
import mongoose from "mongoose";
import comments from "../models/comments";

export const fetchComments = async (req: Request, res: Response) => {
  try {
    const { movie_id } = req.params;

    // Convert movie_id to ObjectId
    if (!mongoose.Types.ObjectId.isValid(movie_id)) {
       res.status(400).json({ success: false, message: "Invalid movie ID" });
       return;
    }
    const objectId = new mongoose.Types.ObjectId(movie_id);

    // Fetch comments
    // const commentsList = await comments.find({ movie_id: objectId });
    const commentsList = await comments.aggregate([
      {
        $match:{movie_id:objectId}
      }, 
      {
        $match:{isParent:true}
      },
      {
      $sort:{createdAt:-1}

      }
    ])
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
  const user = req.body.user; 
  const movie_id = req.body.movie_id;
  const text = req.body.text;
  const name = user.name;

  try{
    const newComment = new comments({
      name,
      email: user.email,
      text,
      movie_id,
    });

    await newComment.save();
    res.status(201).json({
      success: true,
      message: "Comment posted successfully",
      data: newComment,
    });
  }catch(err){
    console.log("Error while posting comment:", err);
    res.status(500).json({message:"Internal server error", error:err});
  }
  }



  export const postReply = async(req:Request, res:Response)=>{
    const user = req.body.user; 
    const movie_id = req.body.movie_id;
    const text = req.body.text;
    const name = user.name;
    const parent_id = req.body.comment_id ;
    

    try{
      const newComment = new comments({
        name,
        email: user.email,
        text,
        movie_id,
        parent_id,
        isParent:false
      });
      await comments.updateOne({_id:parent_id}, {$set:{isReplied:true}});
      await newComment.save();
      console.log(newComment._id)
      res.status(201).json({
        success: true,
        message: "Comment posted successfully",
        data: newComment,
      });
    }catch(err){
      console.log("Error while posting comment:", err);
      res.status(500).json({message:"Internal server error", error:err});
    }
    }


    export const fetchReplies = async(req:Request, res:Response)=>{ 
      const {parent_id} = req.params;
      // console.log(parent_id);
      try{
        const replies = await comments.aggregate([
          {
            $match:{parent_id:new mongoose.Types.ObjectId(parent_id)}
          },
          {
            $sort:{createdAt:-1}
          }
        ]);
        console.log(replies);
        res.status(200).json({
          success:true,
          message:"Replies fetched successfully",
          data:replies
        })
      }catch(err){
        console.log("Error while fetching replies:", err);
        res.status(500).json({message:"Internal server error", error:err});
      }
    }