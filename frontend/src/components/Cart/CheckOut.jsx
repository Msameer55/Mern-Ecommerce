import React, { useState } from "react";

const cart = {
  products: [
    {
      name: "Stylish Jacket",
      size: "M",
      color: "Black",
      price: 120,
      image: "https://picsum.photos/120?random=1",
    },
    {
      name: "Casual Sneakers",
      size: "42",
      color: "White",
      price: 75,
      image: "https://picsum.photos/120?random=2",
    },
  ],
  currency: "EUR",
};

const Checkout = () => {
  const [checkoutId, setCheckoutId] = useState(null);

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

  const handleProceedCheckout = (e) => {
    e.preventDefault();
    setCheckoutId("123");
  };

  const currency = cart.currency || "EUR";
  const subtotal = cart.products.reduce((s, p) => s + Number(p.price || 0), 0);
  const shipping = 0; // plug real shipping later
  const total = subtotal + shipping;

  // Shared small input styles
  const inputCls =
    "w-full h-10 text-sm border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-black/10";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px- 6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: CONTACT + DELIVERY */}
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
              />
              <input
                className={inputCls}
                type="text"
                name="lastName"
                placeholder="Surname"
                value={form.lastName}
                onChange={onChange}
              />
            </div>

            <input
              className={inputCls}
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={onChange}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputCls}
                type="text"
                name="postcode"
                placeholder="Postcode"
                value={form.postcode}
                onChange={onChange}
              />
              <input
                className={inputCls}
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={onChange}
              />
            </div>

            <input
              className={inputCls}
              type="text"
              name="phone"
              placeholder="Telephone"
              value={form.phone}
              onChange={onChange}
            />
          </section>

          {/* Shipping method (placeholder) */}
          <section className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold mb-3">
              Shipping method
            </h2>
            <div className="text-sm text-gray-600 border border-gray-200 rounded-md p-3">
              Enter your delivery address to see available shipping methods.
            </div>
          </section>
          {!checkoutId ? (
            <button className="cursor-pointer w-full h-11 text-sm font-semibold bg-black text-white rounded-md hover:bg-gray-800 transition">
              Continue to Payment
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="credit-card">
                <input className="mr-2" type="radio" name="money" id="credit-card" />
                Pay With Credit Card
              </label>
              <label htmlFor="cod">
                <input className="mr-2" type="radio" name="money" id="cod" />
                Cash On Delivery
              </label>
            </div>
          )}
        </div>
      </form>

      {/* RIGHT: ORDER SUMMARY */}
      <aside className="sticky top-6 right-0">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold mb-4">
            Order summary
          </h2>

          {/* Items */}
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
                    1
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.color} · {item.size}
                  </p>
                </div>

                <span className="text-sm font-semibold">
                  €{Number(item.price).toFixed(2)}
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
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dispatch</span>
              <span>{shipping === 0 ? "—" : `€${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-200 pt-3 text-base font-semibold">
              <span>Total</span>
              <span>
                {currency} €{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
