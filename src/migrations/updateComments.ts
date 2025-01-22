import mongoose from 'mongoose';
import Comment from '../models/comments';
import { DB_NAME } from '../constants';

import dotenv from 'dotenv';
dotenv.config({path:'../../.env'});
const updateComments = async()=>{
    try{
         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

        await Comment.updateMany({parent_id:{$exists:false}}, {isParent:true}); 

        await Comment.updateMany({parent_id:{$exists:true}}, {isParent:false});
        mongoose.connection.close();
        

    }
    catch(err){
        console.log("Error while updating comments:", err);
        
    }
    finally{
    console.log(process.env.MONGO_URI);

    }
}

updateComments();