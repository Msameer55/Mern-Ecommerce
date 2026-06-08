import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Shopping & Orders",
      items: [
        {
          q: "How do I place an order?",
          a: "Browse our collections, select items, add them to your cart, and proceed to checkout. You'll choose your shipping address and payment method. Orders are processed immediately upon successful payment.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Stripe. In this demo, payment integrations are simulated but fully functional in production.",
        },
        {
          q: "Can I track my order?",
          a: "Yes! Once your order is placed, you'll receive a confirmation email with a tracking number. You can view your order status anytime from your profile page.",
        },
      ],
    },
    {
      category: "Returns & Refunds",
      items: [
        {
          q: "What is your return policy?",
          a: "We offer returns within 30 days of purchase for unworn, unwashed items with original tags attached. Return shipping is free for all orders.",
        },
        {
          q: "How do I initiate a return?",
          a: "Visit your orders page, select the item, and click 'Return Item'. Follow the instructions to print a label and ship the item back to us. Refunds are processed within 5-7 business days.",
        },
        {
          q: "Can I exchange items instead of returning?",
          a: "Absolutely! You can request a size or color exchange directly through your order. We'll process the exchange at no additional cost.",
        },
      ],
    },
    {
      category: "Account & Shipping",
      items: [
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' in the top menu. Fill in your email and create a password. You'll receive a verification link via email to confirm your account.",
        },
        {
          q: "How long does shipping take?",
          a: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days. International orders may take 10-21 business days depending on customs.",
        },
        {
          q: "Do you ship internationally?",
          a: "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. Check shipping costs during checkout.",
        },
      ],
    },
    {
      category: "General Support",
      items: [
        {
          q: "How do I contact customer support?",
          a: "You can reach us through the contact form on our Contact Us page, email, or call us at (021) 123456789. We typically respond within 24 hours.",
        },
        {
          q: "Is there a warranty on products?",
          a: "All items come with quality assurance. If you receive a defective item, we'll replace it or provide a full refund at no cost.",
        },
        {
          q: "Do you have a loyalty program?",
          a: "Yes! Subscribe to our newsletter and earn 10% off your first order. Regular customers get exclusive access to sales and early product launches.",
        },
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let itemCount = 0;

  return (
    <div className="">
      {/* Hero Banner */}
      <div
        className="relative h-72 md:h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516534775068-bb57e5155dff?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Frequently Asked Questions
          </h1>
          <p className="max-w-2xl mx-auto text-[15px] md:text-lg">
            Find answers to common questions about our products, ordering,
            shipping, and more.
          </p>
        </div>
      </div>

      <div className="container mx-auto p-8 max-w-4xl">
        {/* Search Info */}
        <div className="bg-gray-100 p-4 rounded-md mb-8 text-center">
          <p className="text-[14px] text-gray-600">
            Can't find what you're looking for?{" "}
            <a href="/contact" className="text-[#2d2d2d] font-semibold">
              Contact us
            </a>
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Category Title */}
              <h2 className="text-2xl font-semibold text-[#2d2d2d] mb-4">
                {section.category}
              </h2>

              {/* Accordion Items */}
              <div className="space-y-2">
                {section.items.map((faq, itemIdx) => {
                  const globalIndex = itemCount++;
                  return (
                    <div
                      key={itemIdx}
                      className="border border-gray-300 rounded-md overflow-hidden"
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleAccordion(globalIndex)}
                        className="cursor-pointer w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-[15px] md:text-[16px] font-semibold text-left text-[#2d2d2d]">
                          {faq.q}
                        </h3>
                        <ChevronDown
                          className={`w-5 h-5 text-[#2d2d2d] transition-transform flex-shrink-0 ml-2 ${
                            openIndex === globalIndex ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Accordion Content */}
                      {openIndex === globalIndex && (
                        <div className="p-4 bg-gray-50 border-t border-gray-300">
                          <p className="text-[14px] md:text-[15px] leading-relaxed text-gray-700">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 p-6 bg-[#2d2d2d] text-white rounded-md text-center">
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-[14px] mb-4">
            Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-[#2d2d2d] px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
