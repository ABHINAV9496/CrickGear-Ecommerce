import React from 'react'
import { assets } from '../assets/assets'
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className='relative flex flex-col sm:flex-row group animate-fade-in-up bg-black w-full'>
      
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-16 relative z-10'>
        <div className="px-6 md:px-10 relative">

          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 md:w-12 h-[2px] bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]'></div>
            <p className='font-bold tracking-widest text-xs md:text-sm text-gray-300'>
              WELCOME TO <span className="text-white drop-shadow-md cursor-default">CRICGEAR</span>
            </p>
          </div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-linear-to-br from-white via-gray-200 to-gray-400 bg-clip-text text-transparent hero-fade animation-delay-100 mb-4'>
            Gear Up <br />
            <span className="bg-linear-to-r from-red-500 to-red-600 bg-clip-text text-transparent cursor-default transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]">Like a Pro.</span>
          </h1>

          <p className='text-gray-300 max-w-sm leading-relaxed text-sm sm:text-base hero-fade animation-delay-100 cursor-default'>
            Your trusted home for <span className="text-white font-semibold tracking-wide">world-class cricket equipment</span> —
            engineered for performance and players who never compromise.
          </p>

          <Link to="/collection" className="inline-block mt-8">
            <div className='relative overflow-hidden inline-flex items-center gap-4 px-6 py-3 bg-red-600 rounded-full hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 group/btn transform hover:-translate-y-0.5'>
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full skew-x-12 group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <p className='font-bold text-sm text-white tracking-wider relative z-10'>
                SHOP NOW
              </p>
              <svg className="w-4 h-4 text-white transform group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
          </Link>

        </div>
      </div>

      <div className='w-full sm:w-1/2 relative overflow-hidden bg-black'>
        {/* Blending Gradients to seamlessly merge the image with the dark UI */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-transparent z-10 hidden sm:block pointer-events-none"></div>
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10 sm:hidden pointer-events-none"></div>

        <img
          className='w-full h-full object-cover sm:object-right group-hover:scale-105 transition-transform duration-1000 ease-out origin-center'
          src={assets.cricketmain}
          alt="CricGear Hero"
        />
      </div>

    </div>
  )
}

export default Hero
