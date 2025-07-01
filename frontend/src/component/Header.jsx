import React from 'react';
import { assets } from '../assets/assets'

function Header() {
  return (
    <div className='flex flex-col items-center mt-20, px-4 text-center text-gray-800'>
       <img src={assets.header_img}  className='w-36 h-36 rounded-full mb-6'/>
       <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-'>Hey Chirag <img src={assets.hand_wave}  className='w-8 aspect-square'/>
       </h1>
       <h2>Welcome to our app</h2>
       <p>Let's start with a quick product and we wil have you up and running in no time!</p>
       <button>Get Started</button>
    </div>
  )
}

export default Header;