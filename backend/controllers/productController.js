import mongoose from "mongoose";
import Product from "../models/Product.js"

// Get a Product 
export const getProduct = async (req, res) => {
    const { id } = req.params;

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID"
        });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.json({ success: false, message: "Product Not Found with this ID" })
        }
        return res.json({ success: true, message: "Product found", product })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}


// BEST SELLER 
export const bestSeller = async (req, res) => {
    try {
        const bestSellers = await Product.find().sort({ rating: -1 }).limit(10);
        console.log(bestSellers , "best sellers")
        return res.status(200).json({ success: true, message: "Best sellers fetched successfully", bestSellers });
    }
    catch (error) {
        console.log("Error fetching best sellers:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
}

// NEW ARRIVALS
export const newArrival = async (req, res) => {
    try {
        const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
        console.log(newArrivals , "new arrivals")
        return res.status(200).json({ success: true, message: "New arrivals fetched successfully", newArrivals });
    }
    catch (error) {
        console.log("Error fetching new arrivals:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
}


// Create a product 
export const addProduct = async (req, res) => {
    const {
        name, description, price, discountedPrice, countInStock, sku, category, brand,
        sizes, colors, collections, material, gender, images, isFeatured, isPublished,
        rating, numReviews, tags, metaTitle, metaDescription, metaKeywords, dimensions, weight
    } = req.body;

    if (!name || !description || !price || !countInStock || !sku || !category || !sizes || !colors || !collections || !images) {
        return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    try {
        const existingProduct = await Product.findOne({ sku });
        if (existingProduct) {
            return res.status(403).json({ success: false, message: "Product SKU must be unique" });
        }

        const product = await Product.create({
            name, description, price, discountedPrice, countInStock, sku, category, brand,
            sizes, colors, collections, material, gender, images, isFeatured, isPublished,
            rating, numReviews, tags, metaTitle, metaDescription, metaKeywords, dimensions, weight,
            user: req.user._id
        });

        return res.status(201).json({ success: true, message: "Product created successfully", product });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


// update a product using id 
export const updateProduct = async (req, res) => {
    const {
        name, description, price, discountedPrice, countInStock, sku, category, brand,
        sizes, colors, collections, material, gender, images, isFeatured, isPublished,
        tags, metaTitle, metaDescription, metaKeywords, dimensions, weight
    } = req.body;

    const { id } = req.params;

    if (!name || !description || !price || !countInStock || !sku || !category || !sizes || !colors || !collections || !images) {
        return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    try {
        // find product by its id 
        const product = await Product.findById(id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountedPrice = discountedPrice || product.discountedPrice;
            product.countInStock = countInStock || product.countInStock;
            product.sku = sku || product.sku;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured != undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished != undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.metaTitle = metaTitle || product.metaTitle;
            product.metaDescription = metaDescription || product.metaDescription;
            product.metaKeywords = metaKeywords || product.metaKeywords;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;

            // save the product 
            const updatedProduct = await product.save();
            return res.status(201).json({ success: true, message: "Product has been updated successfully", product: updatedProduct })
        }
        else {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });

    }
}


// delete a product 
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (product) {
            await product.deleteOne();
            return res.status(201).json({ success: true, message: "Product has been deleted" })
        }
        else {
            return res.status(403).json({ success: false, message: "Product not found" })
        }
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });

    }
}


// get all products with query 
export const getAllProducts = async (req, res) => {

    try {
        const {
            collections,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit
        } = req.query;

        let query = {};

        // filter logic
        if (collections && collections.toLocaleLowerCase() != "all") {
            query.collections = collections;
        }

        if (category && category.toLocaleLowerCase() != "all") {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (size) {
            query.sizes = { $in: size.split(",") };
        }

        if (color) {
            query.colors = { $in: [color] };
        }

        if (gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        // Sorting Logic
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 };
                    break;
                default:
                    break;
            }
        }

        // fetch products and apply sorting and limit 
        let products = await Product.find(query)
            .sort(sort).limit(Number(limit) || 0);
        return res.status(201).json({ success: true, message: "Product fetched with query successfully", products })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });

    }
}

// similar products with id based on current gender and category 

export const similarProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(403).json({ success: false, message: "Product not found" });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category
        }).limit(4);

        return res.status(200).json({ success: true, message: "Similar Products has been found", similarProducts });

    } catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }

}

