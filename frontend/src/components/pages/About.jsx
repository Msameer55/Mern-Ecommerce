import React from "react";

const About = () => {
  return (
    <div className="">
      {/* Hero banner */}
      <div
        className="relative h-72 md:h-96 bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">About Our Store</h1>
          <p className="max-w-2xl mx-auto text-[15px] md:text-lg">
            We craft thoughtful ecommerce experiences — quality, style and fast
            delivery are at the core of everything we do.
          </p>
        </div>
      </div>

      <div className="container mx-auto p-8 space-y-12">
        {/* Section 1: image left, text right */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
              alt="Our story"
              className="w-full rounded-md object-cover max-h-[500px]"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
            <p className="text-[15px] leading-relaxed">
              Founded by passionate shoppers, we built this store to make
              discovering great products simple. We carefully select items and
              work with trusted partners to ensure great quality.
            </p>
          </div>
        </div>

        {/* Section 2: image right, text left */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-2xl font-semibold mb-3">What We Believe</h2>
            <p className="text-[15px] leading-relaxed">
              Customer experience matters. From product curation to support,
              every step is designed to make shopping delightful and reliable.
            </p>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80"
              alt="Values"
              className="w-full rounded-md object-cover max-h-[500px]"
            />
          </div>
        </div>

        {/* Section 3: image left, text right */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
              alt="Service"
              className="w-full rounded-md object-cover max-h-[500px]"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-3">Our Service</h2>
            <p className="text-[15px] leading-relaxed">
              Fast shipping, easy returns and friendly support. We stand behind
              every order and try to exceed expectations on each purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
