import React, { useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { CiMail } from "react-icons/ci";
import { MdLockOutline } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='bg-[#131316] min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md bg-[#131316] rounded-2xl shadow-xl p-8'>
        <a href="/" className='text-md text-gray-400 hover:text-white mb-5 block flex justify-center items-center gap-1 cursor-pointer'>
          <IoMdArrowBack className="text-md" />
          Back to home
        </a>
        <h2 className='text-2xl font-bold mb-2 flex justify-center items-center'>Sign in</h2>
        <p className='text-sm text-gray-400 mb-6 flex justify-center items-center'>Welcome back to GreenCare!</p>

        <div className='w-full max-w-md bg-[#252525] rounded-2xl shadow-xl p-8'>
          <div className='flex flex-col mb-6'>
            <button className='flex justify-center items-center gap-4 py-2 rounded-md bg-[#292929] text-white w-full'>
              <FcGoogle className='text-lg' />Continue with Google
            </button>
          </div>

          <div className='flex items-center my-6'>
            <hr className='flex-grow border-[#2A2A2A]' />
            <span className='text-xs mx-3 text-gray-400'>OR CONTINUE WITH EMAIL</span>
            <hr className='flex-grow border-[#2A2A2A]' />
          </div>

          <form className='flex flex-col gap-4'>
            <div>
              <label className='flex text-sm mb-1'>Email Address</label>
              <div className="relative">
                <CiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  className='w-full px-3 py-2 pl-10 placeholder-gray-400 bg-[#292929] rounded-md placeholder:text-sm'
                  placeholder='your.email@example.com'
                  type="email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className='flex text-sm mb-1'>Password</label>
              <div className="relative">
                <MdLockOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  className='w-full px-3 py-2 pl-10 placeholder-gray-400 bg-[#292929] rounded-md placeholder:text-sm'
                  placeholder='••••••••'
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <FaRegEyeSlash className="text-lg" /> : <FaRegEye className="text-lg" />}
                </button>
              </div>
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-xs text-[#4ccc2c] hover:underline font-medium mt-1">Forgot password?</a>
              </div>
            </div>
            <button className="bg-[#56e931] hover:bg-[#00ff08e6] hover:scale-105 hover:shadow-2xl transition duration-200 text-black rounded-md py-3 font-semibold w-full mt-2" type="submit">
              Sign in
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-[#4ccc2c] hover:underline font-medium">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;