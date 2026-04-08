import React from 'react'

import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='w-full max-w-7xl mx-auto pt-8 pb-20 animate-fade-in-up text-white'>

      <div className='text-center pt-10 pb-14'>
        <h1 className='text-4xl sm:text-5xl font-extrabold tracking-tight hero-fade'>
          ABOUT <span className='text-red-600'>US</span>
        </h1>
        <p className="text-gray-400 mt-3 text-sm sm:text-base max-w-2xl mx-auto hero-fade animation-delay-100">
          Crafting champions through premium gear. Learn about who we are and what drives us.
        </p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-between'>

        {/* Image Card */}
        <div className='w-full md:w-1/2 group relative overflow-hidden flex items-center justify-center hero-fade'>
          <img
            src={assets.aboutimage}
            alt="CricGear"
            className='w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out'
          />
        </div>

        {/* Text Content */}
        <div className='w-full md:w-1/2 flex flex-col justify-center hero-fade animation-delay-100'>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 tracking-wide">Our Story</h2>
          
          <p className='text-gray-400 leading-8 sm:leading-[2] mb-6 text-base sm:text-lg'>
            Welcome to <span className='text-red-500 font-bold'>CricGear</span> — your trusted destination
            for <span className="text-gray-200 font-semibold">premium cricket equipment</span>. We believe every
            cricketer deserves world-class gear, whether you're playing
            professionally or enjoying the sport with friends on a Sunday morning.
          </p>

          <p className='text-gray-400 leading-8 sm:leading-[2] mb-6 text-base sm:text-lg'>
            Our collection features carefully selected
            <span className="text-gray-200 font-semibold"> bats, gloves, balls, shoes, jerseys, and kit bags </span>
            from top global brands — rigidly tested for absolute durability, comfort, and explosive performance.
          </p>

          <p className='text-gray-400 leading-8 sm:leading-[2] text-base sm:text-lg'>
            We are passionately committed to delivering
            <span className="text-red-500 font-semibold"> authentic products</span>,
            fast shipping, secure payments, and
            <span className="text-red-500 font-semibold"> exceptional customer support </span>
            — so all you have to focus on is the game.
          </p>
        </div>

      </div>

      {/* Values Grid */}
      <div className='mt-24 pt-10 border-t border-gray-800/60 grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 text-center'>

        <div className='group relative transition-all duration-500 overflow-hidden hero-fade'>
          <div className="w-16 h-16 mx-auto rounded-full bg-[#111] flex items-center justify-center mb-6 border border-gray-800 group-hover:border-red-600 transition-all duration-500 group-hover:-translate-y-2 relative z-10">
             <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 className='text-xl sm:text-2xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors duration-300 relative z-10'>
            Our Mission
          </h3>
          <p className='text-gray-400 text-sm sm:text-base leading-relaxed relative z-10'>
            To make premium, explosive cricket gear accessible to every passionate player across the globe.
          </p>
        </div>

        <div className='group relative transition-all duration-500 overflow-hidden hero-fade animation-delay-100'>
          <div className="w-16 h-16 mx-auto rounded-full bg-[#111] flex items-center justify-center mb-6 border border-gray-800 group-hover:border-red-600 transition-all duration-500 group-hover:-translate-y-2 relative z-10">
             <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </div>
          <h3 className='text-xl sm:text-2xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors duration-300 relative z-10'>
            Our Vision
          </h3>
          <p className='text-gray-400 text-sm sm:text-base leading-relaxed relative z-10'>
            To become the most trusted and dynamically innovative cricket equipment platform worldwide.
          </p>
        </div>

        <div className='group relative transition-all duration-500 overflow-hidden hero-fade animation-delay-200'>
          <div className="w-16 h-16 mx-auto rounded-full bg-[#111] flex items-center justify-center mb-6 border border-gray-800 group-hover:border-red-600 transition-all duration-500 group-hover:-translate-y-2 relative z-10">
             <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
          </div>
          <h3 className='text-xl sm:text-2xl font-bold mb-4 text-white group-hover:text-red-400 transition-colors duration-300 relative z-10'>
            Our Values
          </h3>
          <p className='text-gray-400 text-sm sm:text-base leading-relaxed relative z-10'>
            Unwavering quality, player-first honesty, and an absolute obsession for the game of cricket.
          </p>
        </div>

      </div>

    </div>
  )
}

export default About
