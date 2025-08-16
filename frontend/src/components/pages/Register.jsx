import { useState } from "react";
import { NavLink } from "react-router-dom";


const Register = () => {

  const [form, setForm] = useState({
    name : "",
    email : "",
    password : ""
  })


  const handleChange = (e) => {
    setForm({...form, [e.target.name] : e.target.value})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  }

  return (
    <div className="register-container h-screen">
      <div className="flex justify-between items-stretch h-full">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 flex flex-col gap-4 items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex flex-col justify-center items-center gap-2 mb-4">
              <h2 className="font-bold text-3xl text-gray-800">
                Hey! there 👋
              </h2>
              <p className="text-md text-gray-500">
                Enter your name, email and password to Register
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="Enter Your Name"
                name="name"
                value={form.name}  
                onChange={handleChange}              
              />

              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="Enter Your Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                placeholder="Enter Your Password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="cursor-pointer w-full py-[12px] bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
              >
                Register
              </button>
            </form>
            <div className="mt-5">
                <p>Already have an aaccount ? <NavLink className="text-blue-600 underline" to="/login">Login here</NavLink></p>
                
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
  );
};

export default Register;
