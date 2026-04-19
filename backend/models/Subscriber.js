import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    subscribeAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }
)

const Subscriber = mongoose.model("Subscriber", subscriberSchema)
export default Subscriber;  