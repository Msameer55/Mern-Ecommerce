import { connect } from "./config/connect.js";
import { products } from "./data/product.js";
import Product from "./models/Product.js"
import User from "./models/User.js"
import Cart from "./models/Cart.js"
import dotenv from "dotenv"
import bcrypt from "bcryptjs";

dotenv.config();
connect();

export const seedData = async () => {
    try {
        // delete existing data 
        await Product.deleteMany();
        console.log("products has been deleting");
        await User.deleteMany();
        console.log("User has been deleting");
        await Cart.deleteMany();
        console.log("Cart has been deleting");

        const hashedPass = await bcrypt.hash("123456", 10);
        // Create Default Admin User 
        const createUser = await User.create({
            name: "Admin",
            email: "admin@example.com",
            password: hashedPass,
            role: "admin"
        });

        const userId = createUser._id;
        const sampleProducts = products.map((product) => {
            return { ...product, user: userId };
        })
        await Product.insertMany(sampleProducts);
        console.log("Product data has been seed successfully");
        process.exit();

    } catch (error) {
        console.log("Error in seeding the product:", error.message);
        process.exit();
    }
}

seedData();