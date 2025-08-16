import React from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { MdDelete } from "react-icons/md";

const CartContents = () => {
  const cartProducts = [
    {
      productId: 1,
      name: "Classic Oxford Button-Down Shirt",
      size: "M",
      color: "Red",
      price: 39.99,
      category: "Top Wear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=39",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
    {
      productId: 2,
      name: "Medium Trouser ",
      size: "S",
      color: "Black",
      price: 39.99,
      category: "BottomWear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=20",
          altText: "Bottom Wear Trouser",
        },
      ],
    },
    {
      productId: 3,
      name: "Medium Trouser ",
      size: "S",
      color: "Black",
      price: 39.99,
      category: "BottomWear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=22",
          altText: "Bottom Wear Trouser",
        },
      ],
    },
    {
      productId: 4,
      name: "Medium Trouser ",
      size: "S",
      color: "Black",
      price: 39.99,
      category: "BottomWear",
      quantity: 4,
      images: [
        {
          url: "https://picsum.photos/500/500?random=10",
          altText: "Bottom Wear Trouser",
        },
      ],
    },
  ];

  return (
    <>
      {cartProducts.map((cart, index) => {
        return (
            <div className="flex justify-between items-start" key={index}>
              <div className="cart-items flex space-x-4 mb-6 items-start">
                <div className="cart-image">
                  <img
                    src={cart.images[0].url}
                    alt={cart.images[0].altText}
                    className="w-20 h-24 object-cover rounded-md"
                  />
                </div>
                <div className="cart-content flex flex-col justify-between space-y-1">
                  <div className="">
                    <p className="text-sm text-gray-800 font-medium">
                      {cart.name}
                    </p>
                    <div className="my-1">
                      <p className="text-[12px] font-bold text-gray-800 ">
                        Size : {cart.size} | Color : {cart.color}
                      </p>
                    </div>
                  </div>

                  <div className="plus-minus flex space-x-2 items-center">
                    <HiOutlineMinus className="cursor-pointer" />
                    <p className="">{cart.quantity}</p>
                    <HiOutlinePlus className="cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="price-delete flex flex-col space-y-3 items-center">
                <p className="text-sm text-gray-500">${cart.price}</p>
                <div className="delete-icon text-right cursor-pointer">
                  <MdDelete className="text-red-600 w-6 h-6" />
                </div>
              </div>
            </div>
   
        );
      })}
    </>
  );
};

export default CartContents;
