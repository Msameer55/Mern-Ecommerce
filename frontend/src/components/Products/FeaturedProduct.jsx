import React, { useState } from "react";
import { toast } from "react-toastify";
import Product from "./Product";

const FeaturedProduct = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [buttonDisabled, setIsButtonDisabled] = useState(false);

  const handleQtyChnage = (action) => {
    if (action === "plus") {
      setQty((prev) => prev + 1);
    }
    if (action === "minus" && qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color");
    } else {
      setIsButtonDisabled(true);
      toast.success("Product has been added to cart");

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 1000);
    }
  };

  const featuredProduct = [
    {
      _id: 1,
      name: "Mens T-Shirt Combo Style",
      compareAt: 120,
      price: 100.5,
      colors: ["red", "green", "blue", "pink", "yellow"],
      sizes: ["S", "M", "L", "XL"],
      gender: "mens",
      category: "Mens Top Wear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=111",
          altText: "Main Product Image",
        },
        {
          url: "https://picsum.photos/500/500?random=112",
          altText: "Thumbnail 1",
        },
        {
          url: "https://picsum.photos/500/500?random=113",
          altText: "Thumbnail 2",
        },
        {
          url: "https://picsum.photos/500/500?random=114",
          altText: "Thumbnail 3",
        },
      ],
    },
  ];

  const product = featuredProduct[0];

  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const imageChange = (img) => {
    setSelectedImage(img);
  };


   const similarProducts = [
    {
      id: 1,
      gender: "mens",
      name: "Black Shoes",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black", "Gray"],
      price: 180.99,
      comparePrice: 279.99,
      category: "Footwear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=111",
          altText: "Footwear",
        },
      ],
    },
    {
      id: 2,
      gender: "womens",
      name: "Silk Floral Dress",
      sizes: ["XS", "S", "M"],
      colors: ["Pink", "White", "yellow"],
      price: 79.99,
      comparePrice: 99.99,
      category: "Dresses",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=112",
          altText: "Silk Floral Dress",
        },
      ],
    },
    {
      id: 3,
      gender: "mens",
      name: "Graphic T-Shirt",
      sizes: ["M", "L", "XL"],
      colors: ["Black", "White", "Red"],
      price: 29.99,
      comparePrice: 39.99,
      category: "Top Wear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=113",
          altText: "Graphic T-Shirt",
        },
      ],
    },
    {
      id: 4,
      gender: "womens",
      name: "High Waist Leggings",
      sizes: ["S", "M", "L"],
      colors: ["Gray", "Black", "Purple"],
      price: 35.99,
      comparePrice: 49.99,
      category: "Bottom Wear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=114",
          altText: "Leggings",
        },
      ],
    },
    
  ];


  return (
    <div className="featured-product-section p-6 my-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center items-start gap-10 flex-col md:flex-row">
          {/* Image Section */}
          <div className="flex gap-4 space-y-4">
            <div className="order-2">
              <img
                src={selectedImage.url}
                alt={selectedImage.altText}
                className="rounded-xl w-full object-cover"
              />
            </div>

            <div className="flex gap-3 flex-col order-1">
              {product.images.map((img, index) => (
                <img
                  onClick={() => imageChange(img)}
                  key={index}
                  src={img.url}
                  alt={img.altText}
                  className={`w-20 h-20 rounded-md object-cover cursor-pointer
                    ${
                      selectedImage.url === img.url
                        ? "border-2"
                        : " border-none"
                    }
                    `}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-black">
                Rs. {product.price}
              </span>
              <span className="text-gray-400 line-through">
                Rs. {product.compareAt}
              </span>
            </div>
            <div>
              <h4 className="font-normal mt-4">Color:</h4>
              <div className="flex gap-2 mt-2">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer w-8 h-8 rounded-full ${
                      selectedColor === color ? "border-4" : "border"
                    } `}
                    style={{
                      backgroundColor: color.toLocaleLowerCase(),
                      filter: "brightness(0.5)",
                    }}
                    onClick={() => setSelectedColor(color)}
                  ></div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-normal mt-4">Size:</h4>
              <div className="flex gap-2 mt-2">
                {product.sizes.map((size, index) => (
                  <span
                    key={index}
                    className={`cursor-pointer px-4 py-2 border  text-sm ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "bg-transparent text-black"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div className="quantity">
              <h4 className="font-normal mt-4">Quantity:</h4>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1  cursor-pointer minus bg-gray-200"
                  onClick={() => handleQtyChnage("minus")}
                >
                  -
                </button>
                <span className=" px-3 py-2">{qty}</span>
                <button
                  className="px-3  py-1 cursor-pointer plus bg-gray-200"
                  onClick={() => handleQtyChnage("plus")}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={buttonDisabled}
              className={`cursor-pointer mt-6 w-full py-3 text-white hover:bg-gray-800 transition
              ${buttonDisabled ? "opacity-50 bg-gray-700" : "bg-black"}`}
            >
              {buttonDisabled ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="you-may-like-section mt-10">
        <h2 className="text-3xl my-6 font-bold">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
