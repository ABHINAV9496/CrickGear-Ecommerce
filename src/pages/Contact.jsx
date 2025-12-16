import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="bg-black text-white px-6 sm:px-20">

      
      <div className="text-center pt-32 pb-14">
        <h1 className="text-4xl sm:text-4xl font-extrabold tracking-wide">
          CONTACT <span className="text-red-600">US</span>
        </h1>
        <div className="w-28 h-[3px] bg-red-600 mx-auto mt-4"></div>
      </div>

      <div className="my-20 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

        
        <div className="flex justify-center">
          <img
            src={assets.contactusimage}
            alt="Contact"
            className="w-full md:w-[90%] rounded-xl shadow-xl "
          />
        </div>

        
        <div>
          <h3 className="text-3xl font-bold text-red-500 mb-8">
            Get In Touch
          </h3>

          <p className="text-gray-300 leading-8 mb-8 text-lg sm:text-xl">
            Have questions or need assistance? We're here to help.  
            Reach out to us anytime using the details below.
          </p>

          <p className="text-gray-300 mt-5 text-lg sm:text-xl">
            <span className="text-red-500 font-semibold">📞 Phone:</span>{" "}
            +91-9994752480
          </p>

          <p className="text-gray-300 mt-4 text-lg sm:text-xl">
            <span className="text-red-500 font-semibold">✉️ Email:</span>{" "}
            contact@crickgear.com
          </p>

          <p className="text-gray-300 mt-4 text-lg sm:text-xl">
            <span className="text-red-500 font-semibold">📍 Address:</span>{" "}
            Kozhikode, Kerala, India
          </p>

          <p className="text-gray-300 mt-8 text-lg sm:text-xl leading-8">
            <span className="text-red-500 font-semibold">🕘 Business Hours:</span><br />
            Mon - Sat: 9:00 AM - 7:00 PM <br />
            Sunday: Closed
          </p>
        </div>

      </div>

      <p className="text-center text-gray-400 pb-20 text-base sm:text-lg tracking-wide">
        We're here to support you — your game is our priority.
      </p>

    </div>
  );
};

export default Contact;
