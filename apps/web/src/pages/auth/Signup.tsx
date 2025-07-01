import React from 'react'

const Signup = () => {
  return (
    <div className='bg-gray-300 min-h-screen flex items-center justify-center'>
      <form className='bg-violet-800 p-8 rounded shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6'>Welcome to Green Care</h2>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
          <input type='email' id='email' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your email' />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
          <input type='password' id='password' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your password' />
        </div>
        <button className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>Sign Up</button>
        </form>
    </div>
  )
}

export default Signup;