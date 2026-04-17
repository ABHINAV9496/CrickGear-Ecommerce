import React from 'react'
import { assets } from '../assets/assets'
import { Link } from "react-router-dom"   

const Footer = () => {
  return (
    <div className='mt-24 pt-16 pb-8 border-t border-gray-800/60 hero-fade relative'>
     
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-linear-to-r from-transparent via-red-900/40 to-transparent"></div>

      <div className='flex flex-col md:grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 text-sm sm:text-base'>

       
        <div className="pr-0 md:pr-10">
          <img 
            src={assets.logo} 
            className='mb-6 w-36 hover:scale-105 transition-transform duration-300' 
            alt="CricGear Logo" 
          />
          <p className='text-gray-400 leading-relaxed'>
            <span className="text-gray-200 font-semibold tracking-wide">Premium cricket gear</span> crafted for champions. 
            Performance you can trust. Built for victory, tailored for you.
          </p>
        </div>

      
        <div>
          <p className='text-xs font-bold mb-5 text-gray-500 tracking-widest uppercase'>
            Company
          </p>
          <ul className='flex flex-col gap-3.5 text-gray-400'>
            <li><Link to="/" className='hover:text-white hover:translate-x-1 transition-all inline-block'>Home</Link></li>
            <li><Link to="/about" className='hover:text-white hover:translate-x-1 transition-all inline-block'>About Us</Link></li>
            <li><Link to="/collection" className='hover:text-white hover:translate-x-1 transition-all inline-block'>Our Gear</Link></li>
            <li><Link to="/contact" className='hover:text-white hover:translate-x-1 transition-all inline-block'>Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <p className='text-xs font-bold mb-5 text-gray-500 tracking-widest uppercase'>
            Get In Touch
          </p>
          <ul className='flex flex-col gap-4 text-gray-400'>
            <li className='flex items-center gap-3 hover:text-white transition group'>
              <div className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <span className="text-sm tracking-wide">+91-9994752480</span>
            </li>
            <li className='flex items-center gap-3 hover:text-white transition group'>
              <div className="w-8 h-8 rounded-full bg-[#161616] flex items-center justify-center group-hover:bg-red-600 transition-colors">
                <svg className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <span className="text-sm tracking-wide">contact@crickgear.com</span>
            </li>
          </ul>
        </div>

      </div>

     
      <div className='mt-16 pt-6 border-t border-gray-800/60 text-center'>
        <p className='text-sm text-gray-500 tracking-wide'>
          © 2025 <span className="text-gray-300 font-medium">CrickGear</span>. All Rights Reserved.
        </p>
      </div>

    </div>
  )
}

export default Footer
