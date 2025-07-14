import React, { useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { FaRegUser, FaRegEye, FaRegEyeSlash} from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { MdLockOutline } from "react-icons/md";
import { Link, useNavigate} from "react-router-dom";
import axios from 'axios';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const res = await axios.post("https://greencare.onrender.com/api/v1/auth/signup",{
        fullName,
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
    window.location.href = "https://greencare.onrender.com/api/v1/auth/google";
    navigate('/dashboard');
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md bg-[#252525]/80 rounded-2xl shadow-xl p-8 backdrop-blur'>
        <Link to="/" className="text-md text-gray-400 hover:text-white mb-5 flex justify-center items-center gap-1 cursor-pointer">
          <IoMdArrowBack className="text-md" />
          Back to home
        </Link>
        <h2 className='text-2xl font-bold mb-2 flex justify-center items-center'> Create Account</h2>
        <p className='text-sm text-gray-400 mb-6 flex justify-center items-center'>Join GreenCare and start your plant journey</p>

        <div className='w-full max-w-md bg-[#252525]/80 rounded-2xl shadow-xl p-8 backdrop-blur'>
          <div className='flex flex-col mb-6'>
             <button className='flex justify-center items-center gap-4 py-2 rounded-md backdrop-blur-sm bg-[#292929]/80 text-white w-full' onClick={handleGoogleLogin}>
              <FcGoogle className='text-lg'/>Continue with Google
             </button>
          </div>

          <div className='flex items-center my-6'>
             <hr className='flex-grow border-[#2A2A2A] '></hr>
             <div className='rounded-3xl max-w-md'>
                <span className='text-xs mx-3'>OR CONTINUE WITH EMAIL</span>
             </div>
             <hr className='flex-grow border-[#2A2A2A]'></hr>
          </div>

          <form className='flex flex-col gap-4' onSubmit={handleSignup}>
            <div>
              <label className='flex text-sm mb-1'>Full Name</label>
              <div className="relative">
                <FaRegUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-md" />
                <input
                  className='w-full px-3 py-2 pl-10 placeholder-gray-400 bg-[#292929] rounded-sm placeholder:text-sm'
                  placeholder='Enter your full name'
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>  

            <div>
              <label className='flex text-sm mb-1'>Email Address</label>
              <div className="relative">
                <CiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  className='w-full px-3 py-2 pl-10 placeholder-gray-400 bg-[#292929] rounded-md placeholder:text-sm'
                  placeholder='your.email@example.com'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  type='email'
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
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
              <span className="text-xs text-gray-400">Must be at least 8 characters long</span>
            </div>
            <button className="bg-[#56e931] hover:bg-[#00ff08e6]  hover:scale-105 hover:shadow-2xl transition duration-200 text-black rounded-md py-3 font-semibold w-full mt-2" type="submit">
            {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">
            Already have an account?{" "}
            <Link to="/auth/signin" className="text-[#4ccc2c] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div> 
    </div>
  )
}

export default Signup;