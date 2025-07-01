import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [state, setState] = useState('sign up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-200 to-purple-400'>
      <img
        src={assets.logo}
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
        alt="Logo"
        onClick={() => {
            navigate('/');
        }}
      />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {state === 'sign up' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-sm text-gray-600">
          {state === 'sign up' ? 'Create Your Account' : 'Login to your account'}
        </p>

        <form className="space-y-5 mt-6">

          {state === 'sign up' && (
             <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition'>
            <img src={assets.person_icon} className="w-5 h-5 opacity-60" alt="user" />
            <input
              type="text"
              placeholder='Full Name'
              required
              className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </div>
          )}
         

          {/* Email */}
          <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition'>
            <img src={assets.mail_icon} className="w-5 h-5 opacity-60" alt="email" />
            <input
              type="email"
              placeholder='Email id'
              required
              className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          {/* Password */}
          <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition'>
            <img src={assets.lock_icon} className="w-5 h-5 opacity-60" alt="lock" />
            <input
              type="password"
              placeholder='Password'
              required
              className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
          </div>

          <p className='text-sm text-indigo-600 hover:underline text-left pr-2 cursor-pointer' onClick={() => {
            navigate('/reset-password');
          }}>
            Forgot Password?
          </p>

          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-md hover:from-indigo-600 hover:to-purple-600 transition'>
            {state}
          </button>
        </form>
        {state === 'sign up' ? (<p className='text-gray-400 text-center text-s mt-4'>Already have an account?{' '}
            <span className='cursor-pointer text-blue-400 underline' onClick={() => {
                setState('Login')
            }}>Login here</span>
        </p>) : ( <p className='text-gray-400 text-center text-s mt-4 '>Don't have an account?{' '}
            <span className='cursor-pointer text-blue-400 underline' onClick={() => {
                setState('sign up')
            }}>Sign up</span>
        </p>)}
       
      </div>
    </div>
  );
};

export default Login;
