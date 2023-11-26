import mongoose from "mongoose";

export default async function connectDB() {
    try {
        const db = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`Database Connected to ${db.connection.host}`);
    } catch (error) {
        console.log(`Error Connecting to Database`)
    }
}