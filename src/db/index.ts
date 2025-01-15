import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const dbConnection = async()=>{
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`); 
       console.log(`\n MongoDB connected successfully!! \n Connection instance: ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("Error while connecting to db", error); 
        process.exit(1);
    }
}

export default dbConnection; 