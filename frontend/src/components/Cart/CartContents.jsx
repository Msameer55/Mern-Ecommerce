import React from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteItemFromCart, updateCartItemQuantity } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
const CartContents = ({ user, cart, cartItems, loading, error, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddProductQty = (productId, delta, quantity, color, size) => {
    const newQuantity = delta + quantity;
    if (newQuantity >= 1) {
      dispatch(updateCartItemQuantity({
        productId,
        quantity: newQuantity,
        color,
        size,
        userId: user ? user._id : null,
        guestId
      }))
    }
  }

  const handleRemoveFromCart = async (productId, size, color) => {
    try {
      const data = await dispatch(deleteItemFromCart({ productId, size, color, userId: user ? user._id : null, guestId })).unwrap();
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      {cartItems && cartItems.length > 0 && cartItems.map((cart, index) => {
        return (
          <div className="flex justify-between items-start" key={index}>
            <div className="cart-items flex space-x-4 mb-6 items-start">
              <div className="cart-image">
                <img
                  src={cart.image}
                  // alt={cart.images[0].altText}
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
                  <HiOutlineMinus
                    onClick={() => handleAddProductQty(cart.productId, -1, cart.quantity, cart.color, cart.size)}
                    className="cursor-pointer" />
                  <p className="">{cart.quantity}</p>
                  <HiOutlinePlus
                    onClick={() => handleAddProductQty(cart.productId, 1, cart.quantity, cart.color, cart.size)}
                    className="cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="price-delete flex flex-col space-y-3 items-center">
              <p className="text-sm text-gray-500">${cart.price}</p>
              <div className="delete-icon text-right cursor-pointer">
                <MdDelete
                  onClick={() => handleRemoveFromCart(cart.productId, cart.size, cart.color)}
                  className="text-red-600 w-6 h-6" />
              </div>
            </div>
          </div>

        );
      })}
    </>
  );
};

export default CartContents;
