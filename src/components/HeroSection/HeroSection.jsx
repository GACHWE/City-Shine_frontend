import React from 'react'
import HeroImg from '../../assets/img/appliance.avif'

const HeroSection = () => {
  return (
    <div className='relative flex items-center bg-cover flex-start bg-center text-left h-svh w-full pt-20' style={{backgroundImage
    : `url(${HeroImg})`}}>
        <div className='absolute top-0 right-0 bottom-0 left-0 '></div>
            <main className='px-10 lg:px-24 z-50'>
                <div className='text-left'>
                    <h2 className='text-2xl text-white'></h2>
                </div>
                <p className='mt-3 text-gray-900 sm:mt-5 sm:max-w-xl text-6xl'>
                Summer 
                Value Pack
                </p>
                <p className='mt-3  sm:mt-5 sm:max-w-xl text-2xl'>
                Get the best deals on our summer collection. <span className='text-gray-'>Limited time offer!</span>
                </p>
                <button className='border rounded mt-6 border-black hover:bg-white hover:text-black hover:border-black text-white bg-black w-44 h-12'>
                    Shop Now
                </button>
            </main>
        
    </div>
  )
}

export default HeroSection