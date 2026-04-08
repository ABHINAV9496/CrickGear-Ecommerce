import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pt-8 pb-20 animate-fade-in-up text-white">
      
      <div className="text-center pt-10 pb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight hero-fade">
          CONTACT <span className="text-red-600">US</span>
        </h1>
        <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto hero-fade animation-delay-100">
          Have questions or need assistance? We're here to help you get the best out of your game.
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-between">

        {/* Image Card */}
        <div className="w-full md:w-1/2 group relative overflow-hidden flex items-center justify-center hero-fade">
          <img
            src={assets.contactusimage}
            alt="Contact CricGear"
            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out shadow-xl"
          />
        </div>

        {/* Contact Info Cards */}
        <div className="w-full md:w-1/2 flex flex-col gap-10 hero-fade animation-delay-100">
          
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 tracking-wide">
              Get In Touch
            </h3>

            <div className="flex flex-col gap-8">
              
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center shrink-0 border border-gray-800 group-hover:border-red-500 transition-all group-hover:-translate-y-1">
                  <svg className="w-5 h-5 text-red-500 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Phone</p>
                  <p className="text-gray-300 text-base sm:text-lg group-hover:text-white transition-colors">+91-9994752480</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center shrink-0 border border-gray-800 group-hover:border-red-500 transition-all group-hover:-translate-y-1">
                  <svg className="w-5 h-5 text-red-500 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Email</p>
                  <p className="text-gray-300 text-base sm:text-lg group-hover:text-white transition-colors">contact@crickgear.com</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full bg-[#111] flex items-center justify-center shrink-0 border border-gray-800 group-hover:border-red-500 transition-all group-hover:-translate-y-1">
                  <svg className="w-5 h-5 text-red-500 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1 group-hover:text-red-500 transition-colors">Address</p>
                  <p className="text-gray-300 text-base sm:text-lg leading-relaxed group-hover:text-white transition-colors">Kozhikode, Kerala, India</p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-4 border-t border-gray-800 pt-6">
            <h4 className="text-gray-500 font-bold mb-4 uppercase tracking-widest text-sm">Business Hours</h4>
            <div className="flex justify-between items-center text-gray-400 text-base mb-2">
              <span>Mon - Sat</span>
              <span className="font-semibold text-gray-200">9:00 AM - 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-base">
              <span>Sunday</span>
              <span className="font-semibold text-red-500">Closed</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;
