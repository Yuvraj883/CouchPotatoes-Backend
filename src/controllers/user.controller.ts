import Users from "../models/users";
import { Express, Request, Response } from "express";

export const userDetails = async (req: Request, res: Response) => {
    const user = req.user;
    try{
        if(user){
            const userDetails = await Users.findOne({email:user.email}); 
            res.status(200).json({user:userDetails});

        }
        else{
            res.status(401).json({message:"User not found"});
        }
    }
    catch(err:any){
        console.error("Error while fetching user details:", err);
        res.status(500).json({message:"Internal server error", error:err.message})
    }
}