import React from 'react'

import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='bg-black text-white px-6 sm:px-20'>

     
      <div className='text-center pt-32 pb-14'>
        <h1 className='text-5xl sm:text-4xl font-extrabold tracking-wide'>
          ABOUT <span className='text-red-600'>US</span>
        </h1>
        <div className='w-28 h-[3px] bg-red-600 mx-auto mt-4'></div>
      </div>

     
      <div className='my-20 flex flex-col md:flex-row items-center gap-16'>

        
        <img
          src={assets.aboutimage}
          alt="CricGear"
          className='w-full md:w-1/2 rounded-xl '
        />

        
        <div className='md:w-1/2'>
          <p className='text-gray-300 leading-8 mb-8 text-lg sm:text-xl'>
            Welcome to <span className='text-red-500 font-bold'>CricGear</span> — your trusted destination
            for <span className="text-white font-semibold">premium cricket equipment</span>. We believe every
            cricketer deserves world-class gear, whether you're playing
            professionally or enjoying the sport with friends.
          </p>

          <p className='text-gray-300 leading-8 mb-8 text-lg sm:text-xl'>
            Our collection features carefully selected
            <span className="text-white font-semibold"> bats, gloves, balls,
            shoes, jerseys, and kit bags </span>
            from top brands — all tested for durability, comfort, and
            performance.
          </p>

          <p className='text-gray-300 leading-8 mb-8 text-lg sm:text-xl'>
            We are committed to delivering
            <span className="text-red-500 font-semibold"> authentic products</span>,
            fast shipping, secure payments, and
            <span className="text-red-500 font-semibold"> exceptional customer support </span>
            — so you can focus on what matters most: the game.
          </p>
        </div>
      </div>

      <div className='my-24 grid md:grid-cols-3 gap-12 text-center'>

        <div className='p-10 border border-gray-700 rounded-xl hover:border-red-600 hover:scale-105 transition'>
          <h3 className='text-2xl font-bold mb-4 text-red-500'>
            Our Mission
          </h3>
          <p className='text-gray-300 text-base leading-7'>
            To make premium cricket gear accessible to every passionate player.
          </p>
        </div>

        <div className='p-10 border border-gray-700 rounded-xl hover:border-red-600 hover:scale-105 transition'>
          <h3 className='text-2xl font-bold mb-4 text-red-500'>
            Our Vision
          </h3>
          <p className='text-gray-300 text-base leading-7'>
            To become India's most trusted cricket equipment store.
          </p>
        </div>

        <div className='p-10 border border-gray-700 rounded-xl hover:border-red-600 hover:scale-105 transition'>
          <h3 className='text-2xl font-bold mb-4 text-red-500'>
            Our Values
          </h3>
          <p className='text-gray-300 text-base leading-7'>
            Quality, trust, honesty, customer-first service & love for cricket.
          </p>
        </div>

      </div>

    </div>
  )
}

export default About
