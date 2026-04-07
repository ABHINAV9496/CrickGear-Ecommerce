import React from 'react'
import Hero from '../components/Hero'
import OurPolicy from '../components/OurPolicy'
import Newsletter from '../components/Newsletter'
import FeaturedProducts from '../components/FeaturedProducts'

const Home = () => {
  return (
    <div className="pt-4">
      <Hero/>
      <FeaturedProducts/>
      <OurPolicy/>
      <Newsletter/>
    </div>
  )
}

export default Home
