import React from "react";
import { NavLink } from "react-router-dom";

const GenderCollection = ({ category }) => {
  const genderCollection = [
    {
      _id: 1,
      category: "mens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/mens-collection/mens-1.avif",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
    {
      _id: 2,
      category: "mens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/mens-collection/mens-2.avif",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
    {
      _id: 3,
      category: "mens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/mens-collection/mens-3.avif",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
    {
      _id: 4,
      category: "mens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/mens-collection/mens-4.webp",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },

    {
      _id: 5,
      category: "womens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/womens-collection/womens-1.avif",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
    {
      _id: 6,
      category: "womens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/womens-collection/womens-2.avif",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
    {
      _id: 7,
      category: "womens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/womens-collection/womens-3.avif",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
    {
      _id: 8,
      category: "womens",
      link: "/mens-topwear",
      images: [
        {
          url: "/assets/images/homepage/womens-collection/womens-4.avif",
          altText: "Classic Oxford Button-Down Shirt Front View",
        },
      ],
    },
  ];

  return (
    <>
      <div className="gender-collection-section my-15 mb-20">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {genderCollection
              .filter((item) => item.category === category)
              .map((item, index) => {
                return (
                  <div className="collection  mx-auto mb-5" key={index}>
                    <div className="image">
                      <img
                        className="w-full h-auto object-cover"
                        src={item.images[0].url}
                        alt={item.images[0].alt}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          {genderCollection.filter((item) => item.category === category) && (
            <div className="buttons-section my-20 flex justify-center w-full text-center">
              <button className="border max-w-[200px] h-[60px] uppercase font-bold px-3 hover:bg-black hover:text-white transition-colors duration-300">
                <NavLink className="w-full h-full flex items-center ">Shop {category}'s Brands</NavLink>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GenderCollection;
