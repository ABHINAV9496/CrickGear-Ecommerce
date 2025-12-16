import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-14 text-center py-24 text-gray-300 px-4'>

     
      <div className='group transition hover:scale-105'>
        <img
          src={assets.exchange_icon}
          className='w-16 m-auto mb-6 group-hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.7)] transition'
          alt=""
        />
        <p className='text-lg md:text-xl font-bold mb-1'>
          Easy Exchange Policy
        </p>
        <p className='text-gray-400 text-sm md:text-base'>
          We offer hassle-free exchange policy
        </p>
      </div>

      <div className='group transition hover:scale-105'>
        <img
          src={assets.quality_icon}
          className='w-16 m-auto mb-6 group-hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.7)] transition'
          alt=""
        />
        <p className='text-lg md:text-xl font-bold mb-1'>
          7 Days Return Policy
        </p>
        <p className='text-gray-400 text-sm md:text-base'>
          We provide 7 days free return policy
        </p>
      </div>

      
      <div className='group transition hover:scale-105'>
        <img
          src={assets.support_img}
          className='w-16 m-auto mb-6 group-hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.7)] transition'
          alt=""
        />
        <p className='text-lg md:text-xl font-bold mb-1'>
          Best Customer Support
        </p>
        <p className='text-gray-400 text-sm md:text-base'>
          We provide 24/7 customer support
        </p>
      </div>

    </div>
  )
}

export default OurPolicy
