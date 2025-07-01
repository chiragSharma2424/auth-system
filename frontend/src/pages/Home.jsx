import React from 'react';
import Navbar from '../component/Navbar';
import Header from '../component/Header';

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.pg")] bg-cover bg-center'>
      <Navbar />
      <Header />
    </div>
  )
}

export default Home;