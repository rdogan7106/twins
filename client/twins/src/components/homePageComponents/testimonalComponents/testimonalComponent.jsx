"use client";
import React from "react";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./testimonalComponents_css.css";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sara Wilson",
      role: "Designer",
      image: "/image.png",
      rating: 5,
      text: "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum.",
    },
    {
      name: "Jena Karlis",
      role: "Store Owner",
      image: "/image.png",
      rating: 5,
      text: "Enim nisi quem export duis labore cillum quae magna enim sint.",
    },
    {
      name: "Matt Brandon",
      role: "Freelancer",
      image: "/image.png",
      rating: 5,
      text: "Fugiat enim eram quae cillum dolor dolor amet nulla culpa.",
    },
    {
      name: "John Doe",
      role: "Entrepreneur",
      image: "/image.png",
      rating: 4,
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    },
    {
      name: "Anna Smith",
      role: "Marketing Manager",
      image: "/image.png",
      rating: 4,
      text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
    },
    {
      name: "James Lee",
      role: "Software Engineer",
      image: "/image.png",
      rating: 5,
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
    },
  ];

  const settings = {
    dots: true, 
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1, 
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="testimonials-container  p-5">
      <h2 className="text-center m-4 ">What Our Clients Say</h2>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card m-3">
            <img
              src={testimonial.image}
              className="rounded-circle testimonial-img"
              alt={testimonial.name}
            />
            <h5>{testimonial.name}</h5>
            <p className="text-muted">{testimonial.role}</p>
            <div className="stars">
              {"★".repeat(testimonial.rating)}
              {"☆".repeat(5 - testimonial.rating)}
            </div>
            <blockquote>{testimonial.text}</blockquote>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonials;
