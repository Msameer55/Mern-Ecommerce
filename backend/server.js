import express from "express"
import dotenv from "dotenv"
dotenv.config();
import cors from "cors"
import { connect } from "./config/connect.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();
app.use(express.json());

// Allow all origins — safe for a public e-commerce API.
// origin:true mirrors back whatever origin the request came from,
// which satisfies CORS without hardcoding any domain.
app.use(cors({
    origin: true,
    credentials: true,
}));

//  Connect to mongo db 
connect();

const PORT = process.env.PORT || 3000;
console.log("PORT", PORT)

app.use("/api/users", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);

// subscribe 
app.use("/api/subscriber", subscriberRoutes);

// Admin routes 
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.get("/", (req, res) => {
    res.send("Hello world")
})

app.listen(PORT, () => {
    console.log(`Server is running at the ${PORT}`)
})
