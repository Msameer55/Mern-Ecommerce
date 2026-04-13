// src/fakeData/ProductData.js

export const fakeData = [
  {
    id: 1,
    gender: "mens",
    name: "Casual Denim Jacket",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Gray"],
    price: 59.99,
    comparePrice: 79.99,
    category: "Outerwear",
    quantity: 1,
    images: [
      {
        url: "https://picsum.photos/500/500?random=111",
        altText: "Denim Jacket",
      },
    ],
  },
  {
    id: 2,
    gender: "womens",
    name: "Silk Floral Dress",
    sizes: ["XS", "S", "M"],
    colors: ["Pink", "White", "Yellow"],
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
  {
    id: 5,
    gender: "mens",
    name: "Athletic Hoodie",
    sizes: ["M", "L", "XL"],
    colors: ["Red", "Navy", "Charcoal"],
    price: 45.99,
    comparePrice: 59.99,
    category: "Activewear",
    quantity: 1,
    images: [
      {
        url: "https://picsum.photos/500/500?random=115",
        altText: "Athletic Hoodie",
      },
    ],
  },
  {
    id: 6,
    gender: "mens",
    name: "Mens T-Shirt Combo Style",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Green", "Blue", "Pink", "Yellow"],
    price: 100.5,
    compareAt: 120,
    category: "Mens Top Wear",
    quantity: 1,
    images: [
      { url: "https://picsum.photos/500/500?random=116", altText: "Main Product Image" },
      { url: "https://picsum.photos/500/500?random=117", altText: "Thumbnail 1" },
      { url: "https://picsum.photos/500/500?random=118", altText: "Thumbnail 2" },
      { url: "https://picsum.photos/500/500?random=119", altText: "Thumbnail 3" },
    ],
  },
  {
    id: 7,
    gender: "mens",
    name: "Black Shoes",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Gray"],
    price: 180.99,
    comparePrice: 279.99,
    category: "Footwear",
    quantity: 1,
    images: [
      { url: "https://picsum.photos/500/500?random=120", altText: "Footwear" },
    ],
  },
];

export const mockOrders = [
  {
    id: "ORD-1001",
    createdAt: new Date("2025-10-15T12:00:00"),
    shippingAddress: { city: "Karachi", country: "Pakistan", address: "House #123, Block 5" },
    paymentMethod: "Cash on Delivery",
    orderItems: [
      {
        name: "Casual Denim Jacket",
        image: "https://picsum.photos/500/500?random=111",
        qty: 1,
        price: 59.99,
      },
      {
        name: "Graphic T-Shirt",
        image: "https://picsum.photos/500/500?random=113",
        qty: 2,
        price: 29.99,
      },
    ],
    totalPrice: 119.97,
    isPaid: false,
  },
  {
    id: "ORD-1002",
    createdAt: new Date("2025-10-16T15:30:00"),
    shippingAddress: { city: "Lahore", country: "Pakistan", address: "Street 8, DHA Phase 5" },
    paymentMethod: "Credit Card",
    orderItems: [
      {
        name: "Silk Floral Dress",
        image: "https://picsum.photos/500/500?random=112",
        qty: 1,
        price: 79.99,
      },
      {
        name: "High Waist Leggings",
        image: "https://picsum.photos/500/500?random=114",
        qty: 2,
        price: 35.99,
      },
      {
        name: "Athletic Hoodie",
        image: "https://picsum.photos/500/500?random=115",
        qty: 1,
        price: 45.99,
      },
    ],
    totalPrice: 197.96,
    isPaid: true,
  },
];

