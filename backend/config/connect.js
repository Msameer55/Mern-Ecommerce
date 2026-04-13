import mongoose from "mongoose";

export const connect = (async () => {
    try {
        const mongoData = await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo Db Connect Successfully")
    } catch (error) {
        console.log("mongo file error", error)
        process.exit(1);
    }
})