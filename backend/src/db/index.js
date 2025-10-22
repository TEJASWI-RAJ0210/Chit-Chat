import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async() => {
    try{
        const ConnectInstance=  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\nMongoDB connected!! DB HOST:${ConnectInstance.connection.host}`);
    }catch(err){
        console.log("MongoDB connection failed:",err);
        process.exit(1);
    }
}
export default connectDB;