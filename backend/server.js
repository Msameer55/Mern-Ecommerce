import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connect } from "./config/connect.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

//  Connect to mongo db 
connect();

const PORT = process.env.PORT || 3000 ;

app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(PORT, () => {
    console.log(`Server is running at the ${PORT}`)
})