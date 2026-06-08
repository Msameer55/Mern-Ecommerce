import React, { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent (frontend only)");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="">
      {/* Hero banner */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Get in Touch</h1>
          <p className="max-w-2xl mx-auto text-[15px] md:text-lg">
            Questions, feedback or partnership inquiries — we would love to
            hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80"
              alt="Contact"
              className="w-full rounded-md object-cover h-80"
            />
          </div>

          <div>
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border p-2 rounded h-32"
                    placeholder="Write your message here"
                    required
                  />
                </div>

                <div>
                  <button className="bg-[#2d2d2d] text-white px-4 py-2 rounded">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
