import React, { useState } from 'react';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { CiMail } from "react-icons/ci";
import { MdLockOutline } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignin = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try{
        const res = await axios.post(`${API_BASE_URL}/api/v1/auth/signin`,{
            email,
            password
        });
        localStorage.setItem('token',res.data.token);
        navigate('/dashboard');
    }catch(err){
        if (axios.isAxiosError(err)){
        setError(err.response?.data?.error || 'Signup failed');
      } else{
        setError('Signup failed');
      } 
    } finally {
        setLoading(false);
      }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md bg-[#252525]/80 rounded-2xl shadow-xl p-8 backdrop-blur-sm'>
        <a href="/" className='text-md text-gray-400 hover:text-white mb-5 block flex justify-center items-center gap-1 cursor-pointer'>
          <IoMdArrowBack className="text-md" />
          Back to home
        </a>
        <h2 className='text-2xl font-bold mb-2 flex justify-center items-center'>Sign in</h2>
        <p className='text-sm text-gray-400 mb-6 flex justify-center items-center'>Welcome back to Cultiva!</p>

        <div className='w-full max-w-md bg-[#252525]/80 rounded-2xl shadow-xl p-8 backdrop-blur-sm'>
          <div className='flex flex-col mb-6'>
            <button className='flex justify-center items-center gap-4 py-2 rounded-md bg-[#292929]/80 text-white w-full' onClick={handleGoogleLogin}>
              <FcGoogle className='text-lg' />Continue with Google
            </button>
          </div>

          <div className='flex items-center my-6'>
            <hr className='grow border-[#2A2A2A]' />
            <span className='text-xs mx-3 text-gray-400'>OR CONTINUE WITH EMAIL</span>
            <hr className='grow border-[#2A2A2A]' />
          </div>

          <form className='flex flex-col gap-4' onSubmit={handleSignin}>
            <div>
              <label className='flex text-sm mb-1'>Email Address</label>
              <div className="relative">
                <CiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  className='w-full px-3 py-2 pl-10 placeholder-gray-400 bg-[#292929] rounded-md placeholder:text-sm'
                  placeholder='your.email@example.com'
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
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
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button className="bg-[#56e931] hover:bg-[#00ff08e6] hover:scale-105 hover:shadow-2xl transition duration-200 text-black rounded-md py-3 font-semibold w-full mt-2" type="submit">
              {loading ? "Signing in... " : "Sign in"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Don&apos;t have an account?{" "}
            <Link to="/auth/signup" className="text-[#4ccc2c] hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;