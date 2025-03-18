import mongoose from "mongoose";
import dotenv from "dotenv";
import { populateContestsLC } from "../services/leetcode.service";
dotenv.config();

const conn_url = process.env.MONGO_URL!;

export default async function connectDatabase(): Promise<void> {
    try {
        await mongoose.connect(conn_url);
        console.log("DATABASE CONNECTED");

        const collections = await mongoose.connection.db!.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        if (collectionNames.length==0) {
            console.log("No users collection found, assuming a fresh database.");
            await populateContestsLC("test00069");
            console.log("Database populated successfully.");
        }
    } catch (error) {
        console.log("Error connecting to MongoDB Atlas: ", error);
    }
}

export async function closeDatabaseConnection(): Promise<void> {
    try {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.log("Error disconnecting from MongoDB:", error);
    }
}
