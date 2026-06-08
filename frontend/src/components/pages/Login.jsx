import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/authSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReactSpinner from "../ReactSpinner";
import { mergeCart } from "../../redux/slice/cartSlice";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart)
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }
  // Get redirect parameters and check if its checkout or something 
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckout = redirect.includes("checkout")
  useEffect(() => {
    if (user) {
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, userId: user._id }));
      }

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(isCheckout ? "/checkout" : "/");
      }
    }
  }, [user, isCheckout, guestId])

  const { loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(form)).unwrap();
      toast.success(result.message);
      // Redirect based on role happens in useEffect above
    } catch (error) {
      // Backend signals unverified account → take user to OTP page
      const errData = error?.response?.data || {};
      if (errData.needsVerification) {
        toast.warning("Please verify your email first.");
        navigate("/verify-otp", { state: { email: errData.email || form.email, redirect } });
        return;
      }
      toast.error(typeof error === "string" ? error : error?.message || "Login failed");
    }
  };

  return (
    <>
      {
        loading ? (
          <ReactSpinner />
        ) : (
          <div className="login-container h-screen">
            <div className="flex justify-between items-stretch h-full">
              {/* Left Side - Form */}
              <div className="w-full md:w-1/2 flex flex-col gap-4 items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex flex-col justify-center items-center gap-2 mb-4">
                    <h2 className="font-bold text-3xl text-gray-800">
                      Hey! there 👋
                    </h2>
                    <p className="text-md text-gray-500">
                      Login to your account  from here
                    </p>
                  </div>
                  <form className="space-y-4" onSubmit={handleSubmit}>

                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="Enter Your Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <div className="relative">
                      <input
                        type={`${showPassword ? "text" : "password"}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                        placeholder="Enter Your Password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                      />
                      <span className=" cursor-pointer absolute top-0 right-[12px] bottom-0 flex justify-center items-center">
                        {
                          showPassword ? (
                            <IoMdEye onClick={handleShowPassword} />
                          ) : (
                            <IoMdEyeOff onClick={handleShowPassword} />
                          )
                        }
                      </span>
                    </div>
                    <div className="forgot-pass-btn">
                      <span className="text-gray-500 text-md">Forgot the password </span>
                      <span className="text-gray-500 italic underline text-sm cursor-pointer" onClick={() => navigate("/forgot-password")}>Click here</span>
                    </div>
                    <button
                      type="submit"
                      className="cursor-pointer w-full py-[12px] bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
                    >
                      Submit
                    </button>
                  </form>
                  <div className="mt-5">
                    <p>Dont have an aaccount ? <NavLink className="text-blue-600 underline" to={isCheckout ? `/register?redirect=${redirect}` : `/register`}>Register here</NavLink></p>
                  </div>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="image-section hidden md:block md:w-1/2 h-full">
                <img
                  src="/assets/womens-collection.webp"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )
      }

    </>

  );
};

export default Login;
