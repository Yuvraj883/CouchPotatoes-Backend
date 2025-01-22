import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";




export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.headers.authorization?.split(" ")[1];
    try{
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)as {email:string, name:string};
    req.body = {...req.body ,user: {...decoded}};

    next();
} catch (err: any) {

    console.log("Error while verifying token:", err);
    res.status(404).json({error:err.message})
}


}
