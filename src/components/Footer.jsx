import React from 'react'
import { assets } from '../assets/assets'
import { Link } from "react-router-dom"   

const Footer = () => {
  return (
    <div className='mt-24 bg-black text-white pt-20 hero-fade'>

      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-16 text-base px-6 sm:px-20'>

       
        <div>
          <img 
            src={assets.logo} 
            className='mb-6 w-40 hover:scale-105 transition' 
            alt="" 
          />

          <p className='text-gray-400 w-full md:w-2/3 leading-relaxed text-lg'>
            <span className="text-white font-semibold">Premium cricket gear</span> crafted for champions.  
            Performance you can trust. Built for victory.
          </p>
        </div>

        
        <div>
          <p className='text-2xl font-semibold mb-6 text-red-600 tracking-wide'>
            COMPANY
          </p>

          <ul className='flex flex-col gap-3 text-gray-300 text-lg'>
            <li>
              <Link to="/" className='hover:text-red-500 transition'>
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className='hover:text-red-500 transition'>
                About Us
              </Link>
            </li>

            <li>
              <Link to="/contact" className='hover:text-red-500 transition'>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        
        <div>
          <p className='text-2xl font-semibold mb-6 text-red-600 tracking-wide'>
            GET IN TOUCH
          </p>

          <ul className='flex flex-col gap-3 text-gray-300 text-lg'>
            <li className='hover:text-white transition cursor-pointer'>
              📞 +91-9994752480
            </li>
            <li className='hover:text-white transition cursor-pointer'>
              ✉️ contact@crickgear.com
            </li>
          </ul>
        </div>

      </div>

      
      <div className='mt-14'>
        <hr className='border-gray-700' />
        <p className='py-6 text-base text-center text-gray-500 tracking-wide'>
          © 2025 <span className="text-gray-300">crickgear.com</span> — All Rights Reserved.
        </p>
      </div>

    </div>
  )
}

export default Footer
