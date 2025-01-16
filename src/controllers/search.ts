import { Request, Response } from "express";
import movies from "../models/movies"
export const searchMovies = async (req:Request, res:Response)=>{
    try{
    const query = req.query.q as string;
    const result = await movies.find({$text:{$search:query}});
    if(!query){
        res.status(404).send({err:"Query is required"});
    }

    if(result.length>0){
        // console.log(result);
        res.status(200).send({result});
    }
    else{
        res.status(404).send({err:"Cant find the term you are searching for"});
    }
}
catch(err){
    console.log("Error while searching", err);
    res.status(500).send({err:"An error occured while searching the movie"});
}
}