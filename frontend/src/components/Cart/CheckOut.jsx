import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCheckoutSlice, finalizeCheckoutSlice, updateCheckoutSlice } from "../../redux/slice/checkoutSlice";
import { clearCart } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import PaypalButton from "./PaypalButton";
import StripeButton from "./StripeButton";
import ReactSpinner from "../ReactSpinner";

const Checkout = () => {
  const [checkoutId, setCheckoutId] = useState(null);
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const { cart, loading } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    phone: "",
    country: "The Netherlands",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleProceedCheckout = async (e) => {
    e.preventDefault();
    try {
      if (cart?.products?.length > 0) {
        const response = await dispatch(
          createCheckoutSlice({
            checkoutItems: cart.products,
            shippingAddress: {
              firstName: form.firstName,
              lastName: form.lastName,
              email: form.email,
              phone: form.phone,
              address: form.address,
              city: form.city,
              postalCode: form.postcode,
              country: form.country,
            },
            paymentMethod: paymentProvider,
            totalPrice: cart.totalPrice,
          })
        ).unwrap();
        if (response && response.newCheckout?._id) {
          setCheckoutId(response.newCheckout._id);
        }
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error || error.message || "Something went wrong");
    }
  };

  const handlePaymentSucceed = async (details) => {
    try {
      const updatedDetails = { paymentStatus: "paid", paymentDetails: details, paymentMethod: paymentProvider };
      const data = await dispatch(
        updateCheckoutSlice({ id: checkoutId, details: updatedDetails })
      ).unwrap();
      if (data) {
        const finalize = await handleFinalizeCheckout(checkoutId);
        if (finalize) {
          toast.success(finalize.message || "Order placed successfully");
        }
      }
    } catch (error) {
      toast.error(error || error.message || "Something went wrong");
    }
  };

  const handleFinalizeCheckout = async (id) => {
    try {
      const data = await dispatch(finalizeCheckoutSlice(id)).unwrap();
      if (data) {
        dispatch(clearCart());
        toast.success(data.message || "Checkout Finalized");
        navigate("/order-confirmation");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error || error.message || "Something went wrong");
      return false;
    }
  };

  if (!cart || !cart.products) return null;

  const subtotal = cart.products.reduce((s, p) => s + p.price * p.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const inputCls =
    "w-full h-10 text-sm border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-black/10";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {loading ? (
        <ReactSpinner />
      ) : (
        <>
          {/* ✅ LEFT: SHIPPING FORM or PAYMENT — never nested */}
          <div>
            {/* STEP 1: Shipping form — shown until checkoutId is set */}
            {!checkoutId ? (
              <form onSubmit={handleProceedCheckout}>
                <div className="space-y-6">
                  {/* Contact */}
                  <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
                    <h2 className="text-base sm:text-lg font-semibold mb-4">Contact</h2>
                    <input
                      className={inputCls}
                      type="email"
                      name="email"
                      placeholder="E-mail"
                      value={form.email}
                      onChange={onChange}
                      required
                    />
                    <label className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <input type="checkbox" className="h-4 w-4" />
                      Send me an email with news and offers
                    </label>
                  </section>

                  {/* Delivery */}
                  <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 space-y-4">
                    <h2 className="text-base sm:text-lg font-semibold">Delivery</h2>
                    <select
                      name="country"
                      value={form.country}
                      onChange={onChange}
                      className={inputCls}
                      required
                    >
                      <option>The Netherlands</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Belgium</option>
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputCls}
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={onChange}
                        required
                      />
                      <input
                        className={inputCls}
                        type="text"
                        name="lastName"
                        placeholder="Surname"
                        value={form.lastName}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <input
                      className={inputCls}
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={form.address}
                      onChange={onChange}
                      required
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputCls}
                        type="text"
                        name="postcode"
                        placeholder="Postcode"
                        value={form.postcode}
                        onChange={onChange}
                        required
                      />
                      <input
                        className={inputCls}
                        type="text"
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <input
                      className={inputCls}
                      type="text"
                      name="phone"
                      placeholder="Telephone"
                      value={form.phone}
                      onChange={onChange}
                      required
                    />
                  </section>

                  {/* Shipping method */}
                  <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
                    <h2 className="text-base sm:text-lg font-semibold mb-3">
                      Shipping method
                    </h2>
                    <div className="text-sm text-gray-600 border border-gray-200 rounded-md p-3">
                      Enter your delivery address to see available shipping methods.
                    </div>
                  </section>

                  <button
                    type="submit"
                    className="cursor-pointer w-full h-11 text-sm font-semibold bg-black text-white rounded-md hover:bg-gray-800 transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            ) : (
              // ✅ STEP 2: Payment section — completely OUTSIDE any <form>
              <div className="space-y-6">
                <h3 className="text-[17px] font-semibold">Choose Payment Method</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentProvider"
                      value="stripe"
                      checked={paymentProvider === "stripe"}
                      onChange={(e) => setPaymentProvider(e.target.value)}
                    />
                    Credit Card (Stripe)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentProvider"
                      value="paypal"
                      checked={paymentProvider === "paypal"}
                      onChange={(e) => setPaymentProvider(e.target.value)}
                    />
                    PayPal
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentProvider"
                      value="cod"
                      checked={paymentProvider === "cod"}
                      onChange={(e) => setPaymentProvider(e.target.value)}
                    />
                    Cash on Delivery
                  </label>
                </div>

                {paymentProvider === "stripe" ? (
                  <StripeButton
                    amount={total}
                    onSuccess={handlePaymentSucceed}
                    onError={() => toast.error("Payment failed. Please try again.")}
                  />
                ) : paymentProvider === "paypal" ? (
                  <PaypalButton
                    amount={total}
                    onSuccess={handlePaymentSucceed}
                    onError={() => toast.error("Payment failed. Please try again.")}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handlePaymentSucceed({
                        id: "COD_" + Date.now(),
                        status: "succeeded",
                        method: "Cash on Delivery",
                      })
                    }
                    className="cursor-pointer w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    Place Order (Cash on Delivery)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="sticky top-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Order summary</h2>

              <ul className="space-y-3 mb-4">
                {cart.products.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 border-b border-gray-200 pb-3 last:border-b-0"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <span className="absolute -top-1 -right-1 text-[10px] h-5 w-5 grid place-items-center bg-black text-white rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.color} · {item.size}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      Rs {Number(item.price).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Discount */}
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Discount code or gift voucher"
                  className="flex-1 h-10 text-sm border border-gray-300 rounded-l-md px-3 focus:outline-none focus:ring-2 focus:ring-black/10"
                />
                <button className="h-10 px-4 text-sm bg-black text-white rounded-r-md hover:bg-gray-800">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "—" : `Rs ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-3 text-base font-semibold">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default Checkout;