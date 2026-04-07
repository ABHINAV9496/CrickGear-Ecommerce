import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 py-20 px-4 max-w-7xl mx-auto'>

      {/* Policy Card 1 */}
      <div className='group relative bg-[#111]/40 backdrop-blur-md border border-gray-800 rounded-3xl p-10 text-center transition-all duration-500 hover:border-red-600/50 hover:bg-[#151515] hover-float cursor-default overflow-hidden'>
        <div className="absolute -inset-1 bg-linear-to-r from-red-600/0 via-red-600/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none spin-slow"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-500 group-hover:scale-110">
            <svg className="w-10 h-10 text-gray-300 group-hover:text-red-500 transition-colors duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <p className='text-xl md:text-2xl font-extrabold text-white mb-2 tracking-wide group-hover:text-red-400 transition-colors duration-300'>
            Easy Exchange
          </p>
          <p className='text-gray-400 text-sm md:text-base leading-relaxed'>
            We offer a completely hassle-free exchange policy. No questions asked.
          </p>
        </div>
      </div>

      {/* Policy Card 2 */}
      <div className='group relative bg-[#111]/40 backdrop-blur-md border border-gray-800 rounded-3xl p-10 text-center transition-all duration-500 hover:border-red-600/50 hover:bg-[#151515] hover-float cursor-default overflow-hidden' style={{ animationDelay: '100ms' }}>
        <div className="absolute -inset-1 bg-linear-to-r from-red-600/0 via-red-600/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none spin-slow"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-500 group-hover:scale-110">
            <svg className="w-10 h-10 text-gray-300 group-hover:text-red-500 transition-colors duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <p className='text-xl md:text-2xl font-extrabold text-white mb-2 tracking-wide group-hover:text-red-400 transition-colors duration-300'>
            7 Days Return
          </p>
          <p className='text-gray-400 text-sm md:text-base leading-relaxed'>
            Not satisfied? We provide a 7-day free return policy on all unworn gear.
          </p>
        </div>
      </div>

      {/* Policy Card 3 */}
      <div className='group relative bg-[#111]/40 backdrop-blur-md border border-gray-800 rounded-3xl p-10 text-center transition-all duration-500 hover:border-red-600/50 hover:bg-[#151515] hover-float cursor-default overflow-hidden' style={{ animationDelay: '200ms' }}>
        <div className="absolute -inset-1 bg-linear-to-r from-red-600/0 via-red-600/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none spin-slow"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6 shadow-inner group-hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-500 group-hover:scale-110">
            <svg className="w-10 h-10 text-gray-300 group-hover:text-red-500 transition-colors duration-300 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className='text-xl md:text-2xl font-extrabold text-white mb-2 tracking-wide group-hover:text-red-400 transition-colors duration-300'>
            24/7 Support
          </p>
          <p className='text-gray-400 text-sm md:text-base leading-relaxed'>
            Our dedicated team is ready to guide you to the perfect equipment, anytime.
          </p>
        </div>
      </div>

    </div>
  )
}

export default OurPolicy
