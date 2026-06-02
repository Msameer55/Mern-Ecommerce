import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtpUser, resendOtpUser } from "../../redux/slice/authSlice";
import { mergeCart } from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import ReactSpinner from "../ReactSpinner";

const RESEND_COOLDOWN = 60; // seconds

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Email and checkout redirect are passed via router state from Register.jsx
  const email = location.state?.email || "";
  const redirect = location.state?.redirect || "/";
  const isCheckout = redirect.includes("checkout");

  useEffect(() => {
    if(user && user.name && user.email){
      navigate("/");
    }
  }, [])

  const { loading, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // 6 individual digit inputs
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Resend cooldown
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  // Redirect if no email was passed (someone navigated directly)
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  const handleDigitChange = (e, index) => {
    const val = e.target.value.replace(/\D/, ""); // digits only
    if (!val) return;
    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);
    // Auto-focus next input
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...digits];
    pasted.split("").forEach((ch, i) => { newDigits[i] = ch; });
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    try {
      const result = await dispatch(verifyOtpUser({ email, otp })).unwrap();
      // Merge guest cart after successful verification
      if (cart?.products?.length > 0 && guestId) {
        await dispatch(mergeCart({ guestId, userId: result.user.id })).unwrap();
      }
      toast.success(result.message);
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(isCheckout ? "/checkout" : "/");
      }
    } catch (error) {
      toast.error(error || error?.message);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      const result = await dispatch(resendOtpUser({ email })).unwrap();
      toast.success(result.message);
      setCooldown(RESEND_COOLDOWN);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error || error?.message);
    }
  };

  if (loading) return <ReactSpinner />;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="font-bold text-2xl text-gray-800">Check your email</h2>
          <p className="text-sm text-gray-500 text-center">
            We sent a 6-digit OTP to{" "}
            <span className="font-semibold text-gray-700">{email}</span>.
            <br />Enter it below to verify your account.
          </p>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:border-black transition"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition disabled:opacity-60"
          >
            Verify Email
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              className={`font-semibold underline transition ${cooldown > 0 ? "text-gray-400 cursor-not-allowed no-underline" : "text-black cursor-pointer hover:text-gray-600"
                }`}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </button>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/register")}
            className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 transition"
          >
            ← Back to Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
