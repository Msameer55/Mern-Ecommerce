import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/mern-ecommerce';

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    gender: String,
    price: Number,
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB successfully");
        
        const count = await Product.countDocuments();
        console.log(`Total products: ${count}`);
        
        const distinctGenders = await Product.distinct("gender");
        console.log("Distinct genders in DB:", distinctGenders);
        
        const distinctCategories = await Product.distinct("category");
        console.log("Distinct categories in DB:", distinctCategories);
        
        console.log("\nSome products in DB:");
        const samples = await Product.find({}, { name: 1, category: 1, gender: 1, price: 1 }).limit(10);
        console.log(JSON.stringify(samples, null, 2));

        // Count per gender
        for (const g of distinctGenders) {
            const countG = await Product.countDocuments({ gender: g });
            console.log(`Gender '${g}' count: ${countG}`);
        }
        
        // Count per category
        for (const c of distinctCategories) {
            const countC = await Product.countDocuments({ category: c });
            console.log(`Category '${c}' count: ${countC}`);
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

main();
