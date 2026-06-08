import Product from "../models/Product.js";
import model from "../services/geminiService.js";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : process.env.LOCAL_FRONTEND_URL;

export const getAiResponse = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const products = await Product.find({}).select(
      "name description price discountedPrice category brand sizes colors countInStock tags gender collections",
    );

    console.log(`[AI] Products fetched: ${products.length}`);

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        response:
          "Our store is currently being updated. Please check back soon!",
      });
    }

    const productContext = JSON.stringify(
      products.map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description,
        price: `Rs. ${p.price}`,
        discountedPrice: p.discountedPrice ? `Rs. ${p.discountedPrice}` : null, 
        category: p.category,
        brand: p.brand || null,
        sizes: p.sizes,
        colors: p.colors,
        gender: p.gender || null,
        collections: p.collections,
        tags: p.tags,
        inStock: p.countInStock > 0,
        link: `${baseUrl}/product/${p._id}`,
      })),
    );

    // ✅ Clean history — only real user/model exchanges, NOT the injected prompt
    // Frontend sends { role: "user"|"model", content: string }
    // Gemini needs { role: "user"|"model", parts: [{ text: string }] }
    const cleanHistory = history
      .filter((m) => m.role === "user" || m.role === "model")
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.content }], // ✅ correct Gemini format
      }));

    // ✅ Build the current prompt separately — product context only in current message
    const currentPrompt = `STORE PRODUCTS (${products.length} total):
${productContext}

Customer question: ${message}`;

    const chat = model.startChat({
      history: cleanHistory, // ✅ clean history without product JSON bloat
    });

    const result = await chat.sendMessage(currentPrompt);
    const response = result.response.text();

    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("AI Error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return res.status(429).json({
        success: false,
        message:
          "Our assistant is taking a short break. Please try again in a few minutes.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
