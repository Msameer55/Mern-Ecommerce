import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { forgotPassAsync, resetPassAsync } from "../../redux/slice/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const { loading, error } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const search = useParams();
    const token = search.token;
    console.log(search.token, "from reset react location ")
    const [form, setForm] = useState({
        password: "",
        confirmPassword: ""
    })
    const handleChangePass = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { password, confirmPassword } = form;
            if (password != confirmPassword) {
                toast.error("Password must match to continue")
            }
            else {
                const data = await dispatch(resetPassAsync({ password, token })).unwrap();
                console.log(data.message, "from reset react")
                toast.success(data?.message)
                navigate("/login")
                setForm({
                    password: "",
                    confirmPassword: ""
                })
            }
        } catch (error) {
            toast.error(error || error?.message || error?.data?.message)
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-2">
                        <svg
                            className="w-handleSubmit 8 h-8 text-white"
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
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="my-4 flex flex-col gap-3" >
                        <div className="mb-1 font-bold text-xl text-center text-gray-800">Enter your Password</div>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            type="password"
                            placeholder="Enter your Password"
                            value={form.password}
                            name="password"
                            onChange={handleChangePass}
                        />
                    </div>
                    <div className="my-4 flex flex-col gap-3" >
                        <div className="mb-1 font-bold text-xl text-center text-gray-800">Enter your Confirm Password</div>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            type="password"
                            placeholder="Enter your Confirm Password"
                            value={form.confirmPassword}
                            name="confirmPassword"
                            onChange={handleChangePass}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition disabled:opacity-60"
                    >
                        Send
                    </button>
                </form>

                {/* Back link */}
                <div className="mt-4 text-center">
                    <button
                        className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 transition"
                        onClick={() => navigate("/login")}
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    )
}
export default ResetPassword;