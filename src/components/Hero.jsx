import React from 'react'
import { assets } from '../assets/assets'
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row bg-black text-white'>

      
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0'>
        <div className="px-4">

          
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 md:w-14 h-[3px] bg-red-600'></div>
            <p className='font-bold tracking-widest text-base md:text-lg text-gray-300'>
              WELCOME TO <span className="text-white">CRICGEAR</span>
            </p>
          </div>

          <h1 className='text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight bg-linear-to-r from-red-500 to-red-700 bg-clip-text text-transparent'>
            Gear Up <br /> Like a Champion.
          </h1>

          
          <p className='text-gray-300 max-w-md leading-relaxed mt-5 text-base sm:text-lg'>
            Your trusted home for <span className="text-white font-semibold">world-class cricket equipment</span> —
            engineered for <span className="text-red-500 font-semibold">performance</span>,
            <span className="text-red-500 font-semibold"> power</span>, and players who never compromise.
          </p>

          
          <Link to="/collection">
            <div className='inline-flex items-center gap-5 mt-9 px-7 py-3 border border-red-600 rounded-full hover:bg-red-600 transition-all duration-300 group cursor-pointer'>
              <p className='font-bold text-base md:text-lg group-hover:text-white tracking-wide'>
                SHOP NOW
              </p>
              <div className='w-9 md:w-12 h-0.5 bg-red-600 group-hover:bg-white transition'></div>
            </div>
          </Link>

        </div>
      </div>

     
      <img 
        className='w-full sm:w-1/2 object-cover' 
        src={assets.cricketmain} 
        alt="CricGear Hero"
      />

    </div>
  )
}

export default Hero
