import React from "react";

const FeaturedImages = () => {
  const images = [
    {
      id: 1,
      src: "/assets/images/homepage/featured-image-1.avif",
      alt: "featured-image",
    },
    {
      id: 2,
      src: "/assets/images/homepage/featured-image-2.avif",
      alt: "featured-image",
    },
    {
      id: 3,
      src: "/assets/images/homepage/featured-image-3.avif",
      alt: "featured-image",
    },
    {
      id: 4,
      src: "/assets/images/homepage/featured-image-4.png",
      alt: "featured-image",
    },
  ];

  return (
    <div className="featured-images-section my-7">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => {
            return (
              <div className="image-section" key={index}>
                <img src={image.src} alt={image.alt} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedImages;
